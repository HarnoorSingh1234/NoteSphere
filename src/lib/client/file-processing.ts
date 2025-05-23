'use client';

import { compressPDF } from './pdf-compression';

/**
 * Preprocesses a file before upload
 * Compresses PDFs if they are of type PDF
 * @param file The file to preprocess
 * @returns The processed file (compressed if PDF)
 */
export async function preprocessFileForUpload(file: File): Promise<File> {
  try {
    // If it's a PDF, compress it
    if (file.type === 'application/pdf') {
      console.log(`Preprocessing PDF file: ${file.name} (${file.size} bytes)`);
      
      // Only compress if the file is larger than 1MB
      if (file.size > 1024 * 1024) {
        const compressionResult = await compressPDF(file);
        console.log(`Compression complete. Original: ${compressionResult.originalSize} bytes, Compressed: ${compressionResult.compressedSize} bytes`);
        
        // If compression actually reduced the file size, use the compressed version
        if (compressionResult.compressedSize < compressionResult.originalSize) {
          return compressionResult.file;
        } else {
          console.log('Compression did not reduce file size, using original file');
          return file;
        }
      } else {
        console.log('File size is under 1MB, skipping compression');
        return file;
      }
    }
    
    // For other file types, return as is
    return file;
  } catch (error) {
    console.error('Error preprocessing file:', error);
    // If compression fails, return the original file
    console.log('Preprocessing failed, using original file');
    return file;
  }
}
