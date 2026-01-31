// API Client for BookMind AI Backend
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

export async function getSampleBooks() {
  return fetchApi('/books/sample');
}

export async function getSampleBook(bookId: string) {
  return fetchApi(`/books/sample/${bookId}`);
}

export async function getCategories() {
  return fetchApi('/books/categories');
}

export async function uploadBook(file: File) {
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

export async function generateInsights(
  chapterTitle: string,
  chapterContent: string,
  chapterSummary: string = ''
) {
  return fetchApi('/analysis/insights', {
    method: 'POST',
    body: JSON.stringify({
      chapter_title: chapterTitle,
      chapter_content: chapterContent,
      chapter_summary: chapterSummary,
    }),
  });
}

export async function generateFirstPrinciples(
  chapterTitle: string,
  chapterContent: string,
  concept: string
) {
  return fetchApi('/analysis/first-principles', {
    method: 'POST',
    body: JSON.stringify({
      chapter_title: chapterTitle,
      chapter_content: chapterContent,
      concept,
    }),
  });
}

export async function generateDialecticalAnalysis(
  chapterTitle: string,
  chapterContent: string,
  bookTitle: string,
  author: string = 'Unknown'
) {
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
) {
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

export async function findConceptMappings(
  concept: string,
  sourceBookId: string,
  sourceDomain: string,
  context: string,
  userBookIds: string[] = []
) {
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

export async function getConceptsForBook(bookId: string) {
  return fetchApi(`/mappings/concepts/book/${bookId}`);
}

export async function getEvidenceMapping(
  concept: string,
  bookTitle: string = '',
  context: string = ''
) {
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

export async function findRelevantNews(chapterTitle: string, chapterContent: string) {
  return fetchApi('/news/find', {
    method: 'POST',
    body: JSON.stringify({
      chapter_title: chapterTitle,
      chapter_content: chapterContent,
    }),
  });
}

// ==================== Health Check ====================

export async function checkHealth() {
  return fetchApi('/health');
}
