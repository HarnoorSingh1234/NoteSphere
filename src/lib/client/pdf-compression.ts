'use client';

/**
 * Client-side utilities for PDF compression
 * This provides a wrapper around the PDF compression API
 */

/**
 * Options for PDF compression
 */
export interface PDFCompressionOptions {
  quality?: number; // Quality level (0-1), default is 0.7
}

/**
 * Result of PDF compression
 */
export interface PDFCompressionResult {
  success: boolean;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
  file: File;
  fileName: string;
}

/**
 * Compresses a PDF file through the compression API
 * @param file The PDF file to compress
 * @param options Compression options
 * @returns A compressed PDF file and metadata
 */
export async function compressPDF(
  file: File,
  options: PDFCompressionOptions = {}
): Promise<PDFCompressionResult> {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files can be compressed');
    }
    
    console.log(`Compressing PDF: ${file.name} (${file.size} bytes)`);
    
    // Create form data to send to our compression API endpoint
    const formData = new FormData();
    formData.append('file', file);
    
    // Add quality option if specified
    if (options.quality !== undefined) {
      formData.append('quality', options.quality.toString());
    }
    
    // Call the compression API
    const response = await fetch('/api/compression/pdf', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Failed to compress PDF');
    }
    
    // Parse the response
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'PDF compression failed');
    }
    
    // Create a new File object from the base64 data
    const binaryString = atob(result.fileData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const compressedFile = new File([bytes], file.name, { type: 'application/pdf' });
    
    console.log(`PDF compressed successfully: ${file.name}`);
    console.log(`Original size: ${result.originalSize} bytes, Compressed size: ${result.compressedSize} bytes`);
    console.log(`Compression ratio: ${result.compressionRatio}`);
    
    return {
      success: true,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      compressionRatio: result.compressionRatio,
      file: compressedFile,
      fileName: result.fileName
    };
    
  } catch (error) {
    console.error('Error compressing PDF:', error);
    throw error;
  }
}
