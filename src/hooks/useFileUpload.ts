import { useState, useCallback } from 'react';
import type { BookUploadState } from '@/types';
import { detectFileType } from '@/lib/fileExtractor';

export function useFileUpload(onFileSelect: (file: File) => void) {
  const [state, setState] = useState<BookUploadState>({
    file: null,
    isDragging: false,
    isProcessing: false,
    error: null
  });

  const validateFile = (file: File): string | null => {
    const fileType = detectFileType(file);
    
    if (fileType === 'unknown') {
      return 'Please upload a PDF, EPUB, or TXT file';
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return 'File size must be less than 50MB';
    }

    return null;
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setState(prev => ({ ...prev, isDragging: false }));

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const error = validateFile(file);
      
      if (error) {
        setState(prev => ({ ...prev, error }));
        return;
      }

      setState(prev => ({ ...prev, file, error: null }));
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const error = validateFile(file);
      
      if (error) {
        setState(prev => ({ ...prev, error }));
        return;
      }

      setState(prev => ({ ...prev, file, error: null }));
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      file: null,
      isDragging: false,
      isProcessing: false,
      error: null
    });
  }, []);

  return {
    ...state,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,
    clearError,
    reset
  };
}
