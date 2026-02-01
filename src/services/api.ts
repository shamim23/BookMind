// API Client for BookMind AI Backend
import type { Book, Insight } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== Books API ====================

export async function getSampleBooks(): Promise<any[]> {
  return fetchApi('/books/sample');
}

export async function getSampleBook(bookId: string): Promise<any> {
  return fetchApi(`/books/sample/${bookId}`);
}

export async function getBook(bookId: string): Promise<Book> {
  return fetchApi(`/books/${bookId}`);
}

export async function getBookChapters(bookId: string): Promise<any[]> {
  return fetchApi(`/books/${bookId}/chapters`);
}

export interface SyncSampleBookResponse {
  message: string;
  book_id: string;
  chapters_count: number;
}

export async function syncSampleBook(sampleId: string): Promise<SyncSampleBookResponse> {
  return fetchApi(`/books/sample/sync/${sampleId}`, {
    method: 'POST',
  });
}

export async function getCategories(): Promise<string[]> {
  return fetchApi('/books/categories');
}

export async function uploadBook(file: File): Promise<Book> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/books/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(error.detail);
  }

  return response.json();
}

// ==================== Analysis API ====================

export interface GenerateInsightsOptions {
  chapterTitle: string;
  chapterContent: string;
  chapterSummary?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookId?: string;
  chapterId?: string;
  saveToDb?: boolean;
}

export async function generateInsights(options: GenerateInsightsOptions): Promise<Insight[]> {
  return fetchApi('/analysis/insights', {
    method: 'POST',
    body: JSON.stringify({
      chapter_title: options.chapterTitle,
      chapter_content: options.chapterContent,
      chapter_summary: options.chapterSummary || '',
      book_title: options.bookTitle || '',
      book_author: options.bookAuthor || '',
      book_id: options.bookId,
      chapter_id: options.chapterId,
      save_to_db: options.saveToDb !== false, // Default true
    }),
  });
}

export interface ChapterInsightsResponse {
  insights: Insight[];
  total: number;
  chapter_id: string;
}

export async function getChapterInsights(chapterId: string): Promise<ChapterInsightsResponse> {
  return fetchApi(`/analysis/insights/chapter/${chapterId}`);
}

export async function getBookInsights(bookId: string, limit?: number): Promise<Insight[]> {
  const query = limit ? `?limit=${limit}` : '';
  return fetchApi(`/analysis/insights/book/${bookId}${query}`);
}

export async function updateInsight(
  insightId: string,
  updates: {
    title?: string;
    summary?: string;
    evidence?: string;
    implication?: string;
    insight_type?: string;
  }
): Promise<Insight> {
  return fetchApi(`/analysis/insights/${insightId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteInsight(insightId: string): Promise<{ success: boolean; message: string; deleted_id?: string }> {
  return fetchApi(`/analysis/insights/${insightId}`, {
    method: 'DELETE',
  });
}

export interface FirstPrinciplesResponse {
  principle: string;
  explanation: string;
  breakdown: string[];
}

export async function generateFirstPrinciples(
  chapterTitle: string,
  chapterContent: string,
  concept: string
): Promise<FirstPrinciplesResponse> {
  return fetchApi('/analysis/first-principles', {
    method: 'POST',
    body: JSON.stringify({
      chapter_title: chapterTitle,
      chapter_content: chapterContent,
      concept,
    }),
  });
}

export interface DialecticalAnalysisResponse {
  thesis: {
    statement: string;
    keyArguments: string[];
    evidenceFromText: string;
  };
  antithesis: {
    historicalCritics: any[];
    modernCritics: any[];
    contemporaryDebates: any[];
  };
  synthesis: {
    nuancedPosition: string;
    conditionsWhereThesisHolds: string[];
    conditionsWhereCriticsAreRight: string[];
    modernPerspective: string;
  };
  implications: {
    ifThesisTrue: any[];
    ifCriticsRight: any[];
    realWorldExamples: any[];
  };
}

export async function generateDialecticalAnalysis(
  chapterTitle: string,
  chapterContent: string,
  bookTitle: string,
  author: string = 'Unknown'
): Promise<DialecticalAnalysisResponse> {
  return fetchApi('/analysis/dialectic', {
    method: 'POST',
    body: JSON.stringify({
      chapter_title: chapterTitle,
      chapter_content: chapterContent,
      book_title: bookTitle,
      author,
    }),
  });
}

export async function generateAIResponse(
  question: string,
  chapterTitle: string,
  chapterContent: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  return fetchApi('/analysis/chat', {
    method: 'POST',
    body: JSON.stringify({
      question,
      chapter_title: chapterTitle,
      chapter_content: chapterContent,
      conversation_history: conversationHistory,
    }),
  });
}

// ==================== Mappings API ====================

export interface ConceptAnalogy {
  id: string;
  targetConcept: string;
  targetDomain: string;
  targetBookId: string;
  targetBookTitle: string;
  targetChapterId?: string;
  targetChapterTitle?: string;
  structuralSimilarity: string;
  keyDifferences: string;
  relevanceScore: number;
}

export async function findConceptMappings(
  concept: string,
  sourceBookId: string,
  sourceDomain: string,
  context: string,
  userBookIds: string[] = []
): Promise<ConceptAnalogy[]> {
  return fetchApi('/mappings/concepts/find', {
    method: 'POST',
    body: JSON.stringify({
      concept,
      source_book_id: sourceBookId,
      source_domain: sourceDomain,
      context,
      user_book_ids: userBookIds,
    }),
  });
}

export async function getConceptsForBook(bookId: string): Promise<string[]> {
  return fetchApi(`/mappings/concepts/book/${bookId}`);
}

export interface EvidenceMapping {
  concept: string;
  sourceBookId: string;
  sourceBookTitle: string;
  chapterId: string;
  historicalEvidence: any[];
  contemporaryEvidence: any[];
  edgeCases: any[];
  emergingPatterns: any[];
  dataSources: any[];
  overallAssessment: {
    validationScore: number;
    confidenceLevel: string;
    keyInsight: string;
  };
}

export async function getEvidenceMapping(
  concept: string,
  bookTitle: string = '',
  context: string = ''
): Promise<EvidenceMapping> {
  return fetchApi('/mappings/evidence', {
    method: 'POST',
    body: JSON.stringify({
      concept,
      book_title: bookTitle,
      context,
    }),
  });
}

// ==================== News API ====================

export interface NewsArticle {
  title: string;
  description: string;
  date: string;
  connection: string;
  url: string;
  source: string;
}

export async function findRelevantNews(chapterTitle: string, chapterContent: string): Promise<NewsArticle[]> {
  return fetchApi('/news/find', {
    method: 'POST',
    body: JSON.stringify({
      chapter_title: chapterTitle,
      chapter_content: chapterContent,
    }),
  });
}

// ==================== Health Check ====================

export async function checkHealth(): Promise<{ status: string }> {
  return fetchApi('/health');
}
