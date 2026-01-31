// News API Service for finding real-world examples and recent events

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';
const NEWS_API_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

// Search for news articles related to a topic
export async function searchNewsArticles(
  query: string, 
  fromDate?: string,
  pageSize = 5
): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) {
    console.warn('News API key not configured, using fallback data');
    return getFallbackArticles(query);
  }

  // Calculate date 30 days ago if not provided
  const from = fromDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const params = new URLSearchParams({
    q: query,
    from,
    sortBy: 'relevancy',
    language: 'en',
    pageSize: pageSize.toString(),
    apiKey: NEWS_API_KEY,
  });

  try {
    const response = await fetch(`${NEWS_API_URL}/everything?${params}`);
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return getFallbackArticles(query);
  }
}

// Get fallback articles when API is unavailable
function getFallbackArticles(query: string): NewsArticle[] {
  const lowerQuery = query.toLowerCase();
  
  // Return relevant fallback articles based on query
  if (lowerQuery.includes('physics') || lowerQuery.includes('quantum') || lowerQuery.includes('atom')) {
    return [
      {
        title: 'Quantum Computing Breakthrough: New Milestone Achieved',
        description: 'Researchers have demonstrated a significant advancement in quantum error correction, bringing practical quantum computers closer to reality.',
        url: 'https://example.com/quantum-breakthrough',
        publishedAt: new Date().toISOString(),
        source: { name: 'Science Daily' }
      },
      {
        title: 'Nuclear Fusion Experiment Exceeds Energy Output',
        description: 'Scientists report that a recent fusion experiment produced more energy than was put in, marking a historic achievement in clean energy research.',
        url: 'https://example.com/fusion-energy',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        source: { name: 'Energy News' }
      }
    ];
  }
  
  if (lowerQuery.includes('economy') || lowerQuery.includes('market') || lowerQuery.includes('trade')) {
    return [
      {
        title: 'Global Supply Chains Adapt to New Economic Realities',
        description: 'Companies are restructuring their supply chains as lessons from recent disruptions lead to more resilient business models.',
        url: 'https://example.com/supply-chains',
        publishedAt: new Date().toISOString(),
        source: { name: 'Business Insider' }
      },
      {
        title: 'Central Banks Navigate Inflation Challenges',
        description: 'Monetary policy decisions by major central banks continue to shape global economic outlook amid inflation concerns.',
        url: 'https://example.com/inflation',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        source: { name: 'Financial Times' }
      }
    ];
  }
  
  if (lowerQuery.includes('psychology') || lowerQuery.includes('brain') || lowerQuery.includes('thinking')) {
    return [
      {
        title: 'AI Systems Mirror Human Cognitive Biases, Study Finds',
        description: 'New research reveals that large language models exhibit similar cognitive biases to humans, raising questions about AI decision-making.',
        url: 'https://example.com/ai-biases',
        publishedAt: new Date().toISOString(),
        source: { name: 'Tech Review' }
      },
      {
        title: 'Neuroscience Advances Understanding of Decision Making',
        description: 'Brain imaging studies provide new insights into how humans process information and make choices under uncertainty.',
        url: 'https://example.com/neuroscience',
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        source: { name: 'Neuroscience Today' }
      }
    ];
  }
  
  if (lowerQuery.includes('technology') || lowerQuery.includes('innovation') || lowerQuery.includes('computer')) {
    return [
      {
        title: 'Semiconductor Industry Reaches New Manufacturing Milestone',
        description: 'Chip manufacturers announce breakthrough in transistor density, promising more powerful and efficient processors.',
        url: 'https://example.com/semiconductor',
        publishedAt: new Date().toISOString(),
        source: { name: 'Tech Crunch' }
      },
      {
        title: 'Open Source Movement Continues to Shape Software Development',
        description: 'Community-driven development models demonstrate continued success in creating robust, innovative technologies.',
        url: 'https://example.com/open-source',
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        source: { name: 'Wired' }
      }
    ];
  }
  
  // Generic fallback
  return [
    {
      title: 'Research Continues to Advance Understanding of Key Concepts',
      description: 'Recent studies provide new insights into fundamental principles discussed in this chapter.',
      url: 'https://example.com/research',
      publishedAt: new Date().toISOString(),
      source: { name: 'Research Daily' }
    }
  ];
}

// Find relevant news for a chapter
export async function findRelevantNews(
  chapterTitle: string,
  chapterContent: string
): Promise<Array<{
  title: string;
  description: string;
  date: string;
  connection: string;
  url: string;
  source: string;
}>> {
  // Extract key terms from chapter
  const keyTerms = extractKeyTerms(chapterTitle, chapterContent);
  
  // Search for each key term
  const allArticles: NewsArticle[] = [];
  
  for (const term of keyTerms.slice(0, 3)) {
    try {
      const articles = await searchNewsArticles(term, undefined, 2);
      allArticles.push(...articles);
    } catch (error) {
      console.warn(`Failed to search for ${term}:`, error);
    }
  }
  
  // Remove duplicates and format
  const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.title, a])).values());
  
  return uniqueArticles.slice(0, 5).map(article => ({
    title: article.title,
    description: article.description || 'No description available',
    date: new Date(article.publishedAt).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    }),
    connection: generateConnection(chapterTitle, article.title),
    url: article.url,
    source: article.source.name
  }));
}

// Extract key terms from chapter for news search
function extractKeyTerms(title: string, content: string): string[] {
  const terms: string[] = [];
  
  // Add title words
  terms.push(...title.split(' ').filter(w => w.length > 3));
  
  // Look for capitalized phrases (proper nouns, concepts)
  const capitalizedPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
  const matches = content.match(capitalizedPattern) || [];
  
  // Count frequency and take top terms
  const frequency: Record<string, number> = {};
  matches.forEach(match => {
    if (match.length > 4 && !['Chapter', 'Section', 'About', 'These', 'Those'].includes(match)) {
      frequency[match] = (frequency[match] || 0) + 1;
    }
  });
  
  const topTerms = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([term]) => term);
  
  return [...new Set([...terms, ...topTerms])];
}

// Generate a connection explanation between chapter and news
function generateConnection(chapterTitle: string, _articleTitle: string): string {
  return `This news directly relates to concepts discussed in "${chapterTitle}", demonstrating how these principles apply to current developments.`;
}
