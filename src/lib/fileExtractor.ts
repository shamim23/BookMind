import type { FileType } from '@/types';

export function detectFileType(file: File): FileType {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'epub':
      return 'epub';
    case 'txt':
    case 'text':
      return 'txt';
    default:
      return 'unknown';
  }
}

export async function extractTextFromFile(file: File, fileType: FileType): Promise<string> {
  switch (fileType) {
    case 'pdf':
      return extractFromPDF(file);
    case 'epub':
      return extractFromEPUB(file);
    case 'txt':
      return extractFromTXT(file);
    default:
      throw new Error('Unsupported file type');
  }
}

async function extractFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Use PDF.js for client-side PDF parsing
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source using CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return cleanExtractedText(fullText);
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Please ensure it\'s a valid PDF file.');
  }
}

async function extractFromEPUB(file: File): Promise<string> {
  try {
    // For EPUB, we'll use a basic extraction approach
    // In a production app, you'd use a proper EPUB library
    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);
    
    // Basic HTML tag removal for EPUB content
    return cleanExtractedText(text);
  } catch (error) {
    console.error('EPUB extraction error:', error);
    throw new Error('Failed to extract text from EPUB. Please ensure it\'s a valid EPUB file.');
  }
}

async function extractFromTXT(file: File): Promise<string> {
  try {
    const text = await file.text();
    return cleanExtractedText(text);
  } catch (error) {
    console.error('TXT extraction error:', error);
    throw new Error('Failed to read text file.');
  }
}

function cleanExtractedText(text: string): string {
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove special characters but keep basic punctuation
    .replace(/[^\w\s.,!?;:'"()-]/g, ' ')
    // Fix multiple periods
    .replace(/\.{3,}/g, '...')
    // Trim
    .trim();
}
