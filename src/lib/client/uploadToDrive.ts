'use client';

/**
 * Client-side wrapper for uploading files to Google Drive
 * This file is responsible for direct uploads to Google Drive after getting authorization
 * from our API routes. It doesn't use googleapis directly.
 */

/**
 * Uploads a file to Google Drive directly using Google Drive API v3 upload protocol
 * @param file The file to upload
 * @param uploadUrl The resumable upload URL from Google Drive
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
      throw new Error('No access token returned');
    }
    
    // Upload the file content directly to Google Drive using the upload URL
    console.log(`Starting direct upload to Google Drive...`);
    let uploadResponse;
    
    try {
      uploadResponse = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': file.type,
        },
        body: fileBuffer,
      });
      
      console.log(`Upload response status: ${uploadResponse.status}`);
    } catch (error: any) {
      console.error('Network error during upload:', error);
      throw new Error(`Network error during upload: ${error.message}`);
    }
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text().catch(() => 'No error details available');
      console.error(`Upload error (${uploadResponse.status}):`, errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
    }
    
    // Successful upload
    console.log(`File uploaded successfully to Google Drive`);
    
    // Generate direct download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    return {
      success: true,
      fileId: fileId,
      downloadUrl: downloadUrl,
    };
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
}
