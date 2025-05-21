'use client';

/**
 * Client-side wrapper for Google Drive operations
 * This file only contains fetch calls to API routes, no direct googleapis usage
 */

/**
 * Types for Google Drive operations
 */
export interface DriveFileMetadata {
  name: string;
  mimeType: string;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  webViewLink?: string;
  webContentLink?: string;
  mimeType: string;
}

export interface UploadSessionResult {
  uploadUrl: string;
  fileId: string;
  webViewLink?: string;
  webContentLink?: string;
}

/**
 * Create a Google Drive resumable upload session through API route
 */
export async function createUploadSession(
  metadata: DriveFileMetadata
): Promise<UploadSessionResult> {
  const response = await fetch('/api/drive/upload-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to create upload session');
  }
  
  return response.json();
}

/**
 * Get Google Drive file metadata through API route
 */
export async function getFile(fileId: string): Promise<DriveFileInfo> {
  const response = await fetch(`/api/drive/file?fileId=${encodeURIComponent(fileId)}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to get file: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Delete a file from Google Drive through API route
 */
export async function deleteFile(fileId: string): Promise<{ success: boolean }> {
  const response = await fetch('/api/drive/file', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to delete file: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Process expired rejected notes through API route
 */
export async function processRejectedNotes(): Promise<{ processedCount: number }> {
  const response = await fetch('/api/notes/process-rejected', {
    method: 'POST'
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to process rejected notes');
  }
  
  return response.json();
}

/**
 * Generate a direct download URL for a Google Drive file
 * This can stay client-side as it doesn't depend on Node.js modules
 */
export async function generateDownloadUrl(fileId: string): Promise<string> {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}
