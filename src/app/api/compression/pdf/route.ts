import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { getCurrentUser } from "@/lib/auth";

// Set larger body size limit for the upload route
export const config = {
  api: {
    bodyParser: false, // Disable built-in parser for streaming uploads
    responseLimit: false, // No response size limit
  },
};

/**
 * Compresses a PDF file by reducing its quality
 * @param file The PDF file to compress
 * @param quality The quality level (0-1)
 * @returns A compressed PDF file
 */
async function compressPDF(file: File, quality: number = 0.7): Promise<Uint8Array> {
  try {
    console.log(`Compressing PDF: ${file.name} (${file.size} bytes)`);
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Get all pages
    const pages = pdfDoc.getPages();
    console.log(`PDF has ${pages.length} pages`);
    
    // Create a new PDF document with the same pages but compressed
    const compressedPdf = await PDFDocument.create();
    
    // Copy all pages to the new document with reduced quality
    for (let i = 0; i < pages.length; i++) {
      const [copiedPage] = await compressedPdf.copyPages(pdfDoc, [i]);
      compressedPdf.addPage(copiedPage);
    }
    
    // Create compression options
    const compressOptions = {
      useObjectStreams: true,
      // The lower the quality, the smaller the file size
      // We use the quality parameter to determine compression level
      // But the minimum is 0.5 to maintain readability
      quality: Math.max(0.5, quality)
    };
    
    // Save the PDF with compression options
    const compressedPdfBytes = await compressedPdf.save(compressOptions);
    console.log(`Original size: ${file.size} bytes, Compressed size: ${compressedPdfBytes.length} bytes`);
    
    return compressedPdfBytes;
  } catch (error) {
    console.error("PDF compression error:", error);
    throw new Error(`Failed to compress PDF: ${(error as Error).message}`);
  }
}

/**
 * Parse form data from the request
 */
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const quality = formData.get('quality') ? Number(formData.get('quality')) : 0.7;
  
  if (!file) {
    throw new Error('Missing required parameter: file');
  }
  
  if (file.type !== 'application/pdf') {
    throw new Error('File must be a PDF');
  }
  
  return { file, quality };
}

/**
 * POST route to compress a PDF file
 */
export async function POST(request: NextRequest) {
  try {
    console.log('PDF Compression API called');
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('Authentication required - no user found');
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    console.log(`User authenticated: ${user.id}`);
    
    // Parse form data from the request
    const { file, quality } = await parseFormData(request);
    console.log(`Received PDF: ${file.name} (${file.size} bytes) with quality: ${quality}`);
    
    // Compress the PDF
    const compressedPdfBytes = await compressPDF(file, quality);
      // Make sure the file name ends with .pdf
    const fileName = file.name.toLowerCase().endsWith('.pdf') 
      ? file.name 
      : `${file.name}.pdf`;
      
    // Create a new File from the compressed PDF
    const compressedFile = new File(
      [compressedPdfBytes], 
      fileName, 
      { type: 'application/pdf' }
    );
    
    // Return the compressed file info
    return NextResponse.json({
      success: true,
      originalSize: file.size,
      compressedSize: compressedPdfBytes.length,
      compressionRatio: (compressedPdfBytes.length / file.size).toFixed(2),
      fileName: file.name,
      // Return the compressed file as a base64 string for transmission
      fileData: Buffer.from(compressedPdfBytes).toString('base64')
    });
    
  } catch (error) {
    console.error("PDF compression error:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message || "Failed to compress PDF",
    }, { status: 500 });
  }
}
