import { useState, useCallback } from 'react';
import type { Book, Chapter, AnalysisProgress } from '@/types';
import { extractTextFromFile, detectFileType } from '@/lib/fileExtractor';
import { analyzeBookContent, generateChapterSummary, extractConcepts } from '@/lib/aiAnalyzer';

export function useBookProcessor() {
  const [book, setBook] = useState<Book | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    stage: 'uploading',
    progress: 0,
    message: 'Ready to upload'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processBook = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Stage 1: Extracting text
      setProgress({
        stage: 'extracting',
        progress: 10,
        message: 'Extracting text from your book...'
      });

      const fileType = detectFileType(file);
      const extractedText = await extractTextFromFile(file, fileType);
      
      if (!extractedText || extractedText.length < 100) {
        throw new Error('Could not extract sufficient text from the file. Please try a different file.');
      }

      // Stage 2: Analyzing structure
      setProgress({
        stage: 'analyzing',
        progress: 40,
        message: 'Analyzing book structure and identifying chapters...'
      });

      const analysisResult = await analyzeBookContent(extractedText);
      
      // Stage 3: Generating summaries
      setProgress({
        stage: 'summarizing',
        progress: 70,
        message: 'Generating chapter summaries and extracting key concepts...'
      });

      // Generate summaries for each chapter
      const chaptersWithSummaries: Chapter[] = [];
      for (let i = 0; i < analysisResult.chapters.length; i++) {
        const chapter = analysisResult.chapters[i];
        const summary = await generateChapterSummary(chapter.content);
        
        chaptersWithSummaries.push({
          ...chapter,
          summary
        });

        // Update progress
        const summaryProgress = 70 + ((i + 1) / analysisResult.chapters.length) * 20;
        setProgress({
          stage: 'summarizing',
          progress: Math.round(summaryProgress),
          message: `Summarizing chapter ${i + 1} of ${analysisResult.chapters.length}...`
        });
      }

      // Stage 4: Extract concepts
      setProgress({
        stage: 'complete',
        progress: 95,
        message: 'Finalizing concept extraction...'
      });

      const concepts = await extractConcepts(extractedText, chaptersWithSummaries);

      // Create the book object
      const newBook: Book = {
        id: `book-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        content: extractedText,
        chapters: chaptersWithSummaries,
        concepts,
        uploadedAt: new Date(),
        totalPages: Math.ceil(extractedText.length / 3000)
      };

      setBook(newBook);
      setProgress({
        stage: 'complete',
        progress: 100,
        message: 'Analysis complete!'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setProgress({
        stage: 'uploading',
        progress: 0,
        message: 'Ready to upload'
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const setBookDirectly = useCallback((newBook: Book) => {
    setBook(newBook);
    setProgress({
      stage: 'complete',
      progress: 100,
      message: 'Analysis complete!'
    });
    setIsProcessing(false);
    setError(null);
  }, []);

  const resetBook = useCallback(() => {
    setBook(null);
    setProgress({
      stage: 'uploading',
      progress: 0,
      message: 'Ready to upload'
    });
    setError(null);
  }, []);

  return {
    book,
    progress,
    isProcessing,
    error,
    processBook,
    setBookDirectly,
    resetBook
  };
}
