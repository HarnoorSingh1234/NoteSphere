export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export function extractFileIdFromDriveLink(driveLink: string): string | null {
  // Extract file ID from Google Drive link patterns
  const patterns = [
    /\/file\/d\/([^\/]+)/, // https://drive.google.com/file/d/FILE_ID/view
    /id=([^&]+)/,         // https://drive.google.com/open?id=FILE_ID
    /\/d\/([^\/]+)/       // https://docs.google.com/document/d/FILE_ID/edit
  ];

  for (const pattern of patterns) {
    const match = driveLink.match(pattern);
    if (match && match[1]) return match[1];
  }
  
  return null;
}