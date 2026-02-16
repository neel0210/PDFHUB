
import React from 'react';

export type ToolCategory = 'PDF';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: ToolCategory;
}

export interface FileState {
  id: string;
  file: File;
  previewUrl?: string;
  progress: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
}

export enum ProcessingStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  COMPLETED = 'completed'
}
