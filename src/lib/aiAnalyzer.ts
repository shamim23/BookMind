import type { Chapter, Concept } from '@/types';

// Simulated AI analysis - in production, this would call an actual AI API
export async function analyzeBookContent(text: string): Promise<{ chapters: Chapter[] }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const chapters = detectChapters(text);
  
  return { chapters };
}

function detectChapters(text: string): Chapter[] {
  const chapters: Chapter[] = [];
  
  // Common chapter patterns
  const chapterPatterns = [
    /Chapter\s+(\d+|[IVX]+)[\s:.-]*([^\n]*)/gi,
    /CHAPTER\s+(\d+|[IVX]+)[\s:.-]*([^\n]*)/gi,
    /^(\d+)\.\s+([^\n]{3,100})$/gim,
    /^Part\s+(\d+|[IVX]+)[\s:.-]*([^\n]*)/gi,
  ];
  
  const chapterPositions: { index: number; number: number; title: string }[] = [];
  
  // Find all chapter positions
  for (const pattern of chapterPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const number = parseInt(match[1]) || romanToInt(match[1]) || chapterPositions.length + 1;
      const title = match[2]?.trim() || `Chapter ${number}`;
      chapterPositions.push({
        index: match.index,
        number,
        title
      });
    }
  }
  
  // Sort by position
  chapterPositions.sort((a, b) => a.index - b.index);
  
  // Remove duplicates
  const uniqueChapters = chapterPositions.filter((ch, i, arr) => 
    i === 0 || ch.index > arr[i - 1].index + 100
  );
  
  if (uniqueChapters.length === 0) {
    // If no chapters detected, split into logical sections
    return createSections(text);
  }
  
  // Create chapter objects
  for (let i = 0; i < uniqueChapters.length; i++) {
    const current = uniqueChapters[i];
    const next = uniqueChapters[i + 1];
    const startIndex = current.index;
    const endIndex = next ? next.index : text.length;
    const content = text.slice(startIndex, endIndex).trim();
    
    chapters.push({
      id: `chapter-${i + 1}`,
      number: current.number,
      title: current.title,
      content,
      keyPoints: extractKeyPoints(content),
      startIndex,
      endIndex,
      concepts: []
    });
  }
  
  return chapters;
}

function createSections(text: string): Chapter[] {
  // Split text into roughly equal sections if no chapters detected
  const sectionSize = 10000; // ~10k characters per section
  const sections: Chapter[] = [];
  
  for (let i = 0; i < text.length; i += sectionSize) {
    const content = text.slice(i, i + sectionSize).trim();
    const sectionNumber = Math.floor(i / sectionSize) + 1;
    
    // Try to find a title in the first few lines
    const lines = content.split('\n').slice(0, 5);
    const potentialTitle = lines.find(line => 
      line.length > 3 && line.length < 100 && !line.match(/^\d+$/)
    );
    
    sections.push({
      id: `section-${sectionNumber}`,
      number: sectionNumber,
      title: potentialTitle || `Section ${sectionNumber}`,
      content,
      keyPoints: extractKeyPoints(content),
      startIndex: i,
      endIndex: Math.min(i + sectionSize, text.length),
      concepts: []
    });
  }
  
  return sections;
}

function extractKeyPoints(content: string): string[] {
  const keyPoints: string[] = [];
  
  // Look for key sentences (containing important indicators)
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  
  const importantIndicators = [
    'important', 'key', 'main', 'primary', 'essential', 'crucial',
    'significant', 'fundamental', 'core', 'central', 'vital'
  ];
  
  for (const sentence of sentences.slice(0, 50)) {
    const lowerSentence = sentence.toLowerCase();
    if (importantIndicators.some(indicator => lowerSentence.includes(indicator))) {
      keyPoints.push(sentence.trim());
    }
    if (keyPoints.length >= 5) break;
  }
  
  // If no key points found, take first few sentences
  if (keyPoints.length === 0) {
    for (let i = 0; i < Math.min(3, sentences.length); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length > 20 && sentence.length < 200) {
        keyPoints.push(sentence);
      }
    }
  }
  
  return keyPoints.slice(0, 5);
}

export async function generateChapterSummary(content: string): Promise<string> {
  // Simulate AI summary generation
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Extract first paragraph as summary
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  
  if (paragraphs.length === 0) {
    return 'No summary available for this chapter.';
  }
  
  // Create a summary from the first meaningful paragraph
  const firstParagraph = paragraphs[0].trim();
  const sentences = firstParagraph.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length > 3) {
    return sentences.slice(0, 3).join(' ').trim();
  }
  
  return firstParagraph.slice(0, 300) + (firstParagraph.length > 300 ? '...' : '');
}

export async function extractConcepts(text: string, _chapters: Chapter[]): Promise<Concept[]> {
  // Simulate concept extraction
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const concepts: Concept[] = [];
  const conceptMap = new Map<string, { count: number; chapters: Set<string> }>();
  
  // Extract potential concepts (capitalized phrases)
  const conceptPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
  const matches = text.match(conceptPattern) || [];
  
  // Filter out common words
  const commonWords = new Set([
    'The', 'A', 'An', 'This', 'That', 'These', 'Those',
    'I', 'You', 'He', 'She', 'It', 'We', 'They',
    'Is', 'Are', 'Was', 'Were', 'Be', 'Been', 'Being',
    'Have', 'Has', 'Had', 'Do', 'Does', 'Did',
    'Will', 'Would', 'Could', 'Should', 'May', 'Might'
  ]);
  
  for (const match of matches) {
    if (match.length < 3 || commonWords.has(match)) continue;
    
    const existing = conceptMap.get(match) || { count: 0, chapters: new Set<string>() };
    existing.count++;
    conceptMap.set(match, existing);
  }
  
  // Convert to array and sort by frequency
  const sortedConcepts = Array.from(conceptMap.entries())
    .filter(([_, data]) => data.count >= 3) // At least 3 occurrences
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20); // Top 20 concepts
  
  for (let i = 0; i < sortedConcepts.length; i++) {
    const [name, data] = sortedConcepts[i];
    
    concepts.push({
      id: `concept-${i + 1}`,
      name,
      description: `A key concept mentioned ${data.count} times throughout the book.`,
      occurrences: data.count,
      relatedConcepts: [],
      chapterIds: Array.from(data.chapters)
    });
  }
  
  return concepts;
}

function romanToInt(roman: string): number {
  if (!roman) return 0;
  
  const romanMap: { [key: string]: number } = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50,
    'C': 100, 'D': 500, 'M': 1000
  };
  
  let result = 0;
  const upperRoman = roman.toUpperCase();
  
  for (let i = 0; i < upperRoman.length; i++) {
    const current = romanMap[upperRoman[i]];
    const next = romanMap[upperRoman[i + 1]];
    
    if (next && current < next) {
      result -= current;
    } else {
      result += current;
    }
  }
  
  return result;
}
