/**
 * Uploads a file to Google Drive directly using Google Drive API v3 upload protocol
 * @param file The file to upload
 * @param uploadUrl The resumable upload URL from Google Drive (not used in direct upload)
 * @param fileId The ID of the file in Google Drive to update with content
 * @returns Promise resolving to success status and file metadata
 */
export async function uploadFileToDrive(
  file: File,
  uploadUrl: string,
  fileId: string
): Promise<{
  success: boolean;
  fileId: string;
  downloadUrl: string;
}> {
  try {
    console.log(`Uploading file to Drive: ${file.name} (${file.size} bytes, ${file.type})`);
    
    // Convert file to an ArrayBuffer for sending binary data
    const fileBuffer = await file.arrayBuffer();
    
    console.log(`File buffer created, size: ${fileBuffer.byteLength} bytes`);
    console.log(`Fetching service account token from API...`);
    
    // Get the auth token for our service account
    let tokenResponse;
    try {
      tokenResponse = await fetch('/api/google-auth/token');
      console.log(`Token response status: ${tokenResponse.status}`);
    } catch (error: any) {
      console.error('Network error when fetching token:', error);
      throw new Error(`Network error when fetching auth token: ${error.message}`);
    }
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text().catch(() => 'No error details available');
      console.error(`Token API error (${tokenResponse.status}):`, errorText);
      throw new Error(`Failed to get service account token: ${tokenResponse.status} ${errorText}`);
    }
    
    let tokenData;
    try {
      tokenData = await tokenResponse.json();
      console.log('Token data received');
    } catch (error) {
      console.error('Error parsing token response:', error);
      throw new Error('Invalid token response format');
    }
    
    const { accessToken } = tokenData;
    
    if (!accessToken) {
      console.error('No access token in response:', tokenData);
      throw new Error('No access token available for Google Drive upload');
    }
    
    console.log(`Access token received (starts with: ${accessToken.substring(0, 5)}...)`);
    
    
    // Construct a proper Google Drive API upload URL for media upload
    // Using the /upload endpoint with the media content
    const directUploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    
    console.log(`Using direct upload URL: ${directUploadUrl}`);
      // Try direct upload first
    try {
      console.log('Attempting direct upload to Google Drive...');      const response = await fetch(directUploadUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': file.type,
          'Content-Length': String(file.size),
          // Add cache control headers to prevent caching issues
          'Cache-Control': 'no-cache, no-store'
        },
        body: fileBuffer // Send the file buffer directly
      });
      
      console.log(`Direct upload response status: ${response.status}`);
      
      if (response.ok) {
        // Direct upload succeeded
        const result = await response.json();
        console.log('Direct upload successful');
        return {
          success: true,
          fileId: fileId,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`
        };
      }
        // Get detailed error information for debugging
      let errorText = '';
      try {
        errorText = await response.text();
        console.error('Direct upload error details:', errorText);
        
        // Try to parse JSON error if possible
        try {
          const errorJson = JSON.parse(errorText);
          console.error('Parsed error response:', errorJson);
          
          if (errorJson.error && errorJson.error.message) {
            console.error('Error message from Google Drive API:', errorJson.error.message);
          }
        } catch (parseError) {
          // Not a JSON response, just use the text
        }
      } catch (textError) {
        console.error('Could not read error response text');
      }
      
      console.log(`Direct upload failed with status ${response.status}. Falling back to server-side upload...`);
    } catch (directError) {
      console.error('Error during direct upload attempt:', directError);
      console.log('Falling back to server-side upload...');
    }
    
    // Fall back to server-side upload
    console.log('Using server-side upload as fallback...');
    const fileContent = new Blob([fileBuffer], { type: file.type });
    
    // Create form data to send to our server API endpoint
    const formData = new FormData();
    formData.append('file', fileContent, file.name);
    formData.append('fileId', fileId);
    formData.append('mimeType', file.type);
    formData.append('fileName', file.name);
    
    // Use our server-side upload endpoint
    const response = await fetch('/api/upload/direct', {
      method: 'POST',
      body: formData,
    });
    
    console.log(`Server-side upload response status: ${response.status}`);
    
    if (!response.ok) {
      // Get detailed error information
      const errorText = await response.text();
      console.error('Server-side upload error details:', errorText);
      throw new Error(`Server-side upload failed with status: ${response.status}`);
    }
    
    // Parse the response from the Google Drive API
    const result = await response.json();
    
    // Generate the download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    console.log(`File uploaded successfully. Download URL: ${downloadUrl}`);
    
    return {
      success: true,
      fileId: fileId,
      downloadUrl: downloadUrl
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}