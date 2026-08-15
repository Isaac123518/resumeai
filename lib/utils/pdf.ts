// lib/utils/pdf.ts

// We use unpdf instead of pdf-parse because pdf-parse's dependency on
// pdfjs-dist doesn't resolve cleanly under Turbopack in this project —
// it either throws "DOMMatrix is not defined" or resolves to the wrong
// internal module entirely. unpdf is built for Node/Edge server runtimes
// and avoids both issues.
import { extractText, getDocumentProxy } from "unpdf";

/**
 * Extracts plain text from a PDF file.
 * @param file - The uploaded PDF as a File object
 * @returns The extracted text content as a string
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  // Convert the File object to a Uint8Array that unpdf can read
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Load the PDF document, then extract text from all pages merged together
  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractText(pdf, { mergePages: true });

  // Trim whitespace and normalize multiple blank lines into one
  const extracted = text
    .trim()
    .replace(/\n{3,}/g, "\n\n"); // collapse 3+ newlines into 2

  // Guard against empty or unreadable PDFs
  if (!extracted || extracted.length < 50) {
    throw new Error(
      "Could not extract readable text from this PDF. Make sure it is not a scanned image."
    );
  }

  return extracted;
}