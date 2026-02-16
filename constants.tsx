
import React from 'react';
import { 
  FileText, Merge, Scissors, FileUp, FileDown, 
  Lock, Unlock, Image, Layers
} from 'lucide-react';
import { Tool } from './types';

export const PDF_TOOLS: Tool[] = [
  { id: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one document.', icon: <Merge size={20} />, category: 'PDF' },
  { id: 'organize', name: 'Organize PDF', description: 'Reorder, delete, and manage pages within your PDF.', icon: <Layers size={20} />, category: 'PDF' },
  { id: 'split', name: 'Split PDF', description: 'Extract specific pages or split into files.', icon: <Scissors size={20} />, category: 'PDF' },
  { id: 'compress', name: 'Compress PDF', description: 'Reduce PDF file size efficiently.', icon: <FileDown size={20} />, category: 'PDF' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to editable DOCX format.', icon: <FileText size={20} />, category: 'PDF' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Extract high-quality images from PDF.', icon: <Image size={20} />, category: 'PDF' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert images into a single PDF.', icon: <FileUp size={20} />, category: 'PDF' },
  { id: 'protect', name: 'Protect PDF', description: 'Add password and strong encryption.', icon: <Lock size={20} />, category: 'PDF' },
  { id: 'unlock', name: 'Unlock PDF', description: 'Remove PDF password protection.', icon: <Unlock size={20} />, category: 'PDF' },
];
