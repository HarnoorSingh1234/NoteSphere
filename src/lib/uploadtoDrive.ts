/**
 * Uploads a file to Google Drive using a resumable upload URL
 * @param file The file to upload
 * @param uploadUrl The resumable upload URL from Google Drive
 * @returns Promise resolving to success status
 */
export async function uploadFileToDrive(
  file: File,
  uploadUrl: string
): Promise<boolean> {
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'Content-Length': String(file.size)
      },
      body: file
    });

    if (response.ok) {
      return true;
    }
    
    throw new Error(`Upload failed with status: ${response.status}`);
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}