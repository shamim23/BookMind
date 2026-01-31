import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Sparkles, 
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  Target,
  Lightbulb,
  MessageSquare,
  Newspaper,
  Search,
  BarChart3,
  Award,
  Flame,
  Bookmark,
  ArrowUpRight,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Link2,
  Loader2,
  Share2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

// Types
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  relevanceScore: number;
}

interface TopicInteraction {
  id: string;
  topic: string;
  bookId: string;
  bookTitle: string;
  chapterId: string;
  chapterTitle: string;
  type: 'insight' | 'first_principle' | 'news' | 'chat' | 'read';
  content: string;
  timestamp: Date;
  metadata?: {
    insightTitle?: string;
    question?: string;
    newsTitle?: string;
    principle?: string;
  };
  relatedNews?: NewsArticle[];
  isLoadingNews?: boolean;
}

interface UserStats {
  totalBooksRead: number;
  totalChaptersRead: number;
  totalReadingTime: number;
  totalInsightsGenerated: number;
  totalTopicsExplored: number;
  streakDays: number;
  favoriteCategory: string;
}

// Mock news data generator
const generateMockNews = (topic: string): NewsArticle[] => {
  const newsTemplates: Record<string, NewsArticle[]> = {
    'Atomic Theory': [
      {
        id: 'n1',
        title: 'Quantum Computing Breakthrough: 1000-Qubit Processor Unveiled',
        description: 'IBM announces a major milestone in quantum computing with their new 1000-qubit processor, bringing practical quantum computers closer to reality.',
        source: 'TechCrunch',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        url: 'https://example.com/quantum',
        relevanceScore: 95
      },
      {
        id: 'n2',
        title: 'Scientists Capture First-Ever Image of an Atom\'s Electron Cloud',
        description: 'Using advanced electron microscopy, researchers have visualized the quantum mechanical structure of electrons around an atom.',
        source: 'Nature',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        url: 'https://example.com/atom-image',
        relevanceScore: 90
      }
    ],
    'Cogito Ergo Sum': [
      {
        id: 'n3',
        title: 'AI Consciousness: Can Machines Truly Think?',
        description: 'Philosophers and AI researchers debate whether large language models demonstrate genuine understanding or sophisticated pattern matching.',
        source: 'MIT Technology Review',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        url: 'https://example.com/ai-consciousness',
        relevanceScore: 88
      },
      {
        id: 'n4',
        title: 'Neuroscience Finds New Evidence for Self-Awareness Mechanisms',
        description: 'Brain imaging studies reveal neural correlates of self-referential thought, shedding light on the biological basis of consciousness.',
        source: 'Scientific American',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        url: 'https://example.com/consciousness',
        relevanceScore: 85
      }
    ],
    'Division of Labor': [
      {
        id: 'n5',
        title: 'Global Supply Chains Reshape After Pandemic Lessons',
        description: 'Companies are restructuring their division of labor across borders, leading to more resilient but complex global production networks.',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        url: 'https://example.com/supply-chain',
        relevanceScore: 92
      },
      {
        id: 'n6',
        title: 'AI Agents Take Over Specialized Tasks in Workplaces',
        description: 'The division of labor between humans and AI is evolving rapidly, with AI handling increasingly complex specialized tasks.',
        source: 'Wired',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        url: 'https://example.com/ai-work',
        relevanceScore: 87
      }
    ],
    'System 1 & System 2': [
      {
        id: 'n7',
        title: 'Study: Social Media Algorithms Exploit Cognitive Biases',
        description: 'Research shows how platform designs leverage System 1 thinking patterns to maximize engagement and time spent.',
        source: 'The Guardian',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        url: 'https://example.com/social-media',
        relevanceScore: 94
      },
      {
        id: 'n8',
        title: 'Fast vs Slow Thinking: New Research on Decision Making',
        description: 'Neuroscientists map the brain regions involved in intuitive versus deliberative thinking processes.',
        source: 'Psychology Today',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        url: 'https://example.com/thinking',
        relevanceScore: 89
      }
    ],
    'default': [
      {
        id: 'nd',
        title: 'Latest Research Sheds Light on Key Concepts',
        description: 'Recent developments in this field continue to advance our understanding of fundamental principles.',
        source: 'Science Daily',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        url: 'https://example.com/research',
        relevanceScore: 75
      }
    ]
  };

  return newsTemplates[topic] || newsTemplates['default'];
};

// Generate relationship explanation
const generateRelationshipExplanation = (topic: string, _newsTitle: string): string => {
  const relationships: Record<string, string> = {
    'Atomic Theory': 'This news directly relates to atomic theory as it demonstrates practical applications of quantum mechanical principles at the atomic scale. The research builds upon our understanding of how atoms behave and interact.',
    'Cogito Ergo Sum': 'This development connects to Descartes\' foundational insight about consciousness and self-awareness, exploring how modern AI and neuroscience approach the question of what it means to "think".',
    'Division of Labor': 'This article illustrates how the economic principle of division of labor continues to evolve in modern contexts, from global supply chains to human-AI collaboration.',
    'System 1 & System 2': 'This news demonstrates real-world applications of Kahneman\'s dual-process theory, showing how understanding fast and slow thinking helps explain modern phenomena like social media engagement.',
  };
  
  return relationships[topic] || `This news article relates to "${topic}" by demonstrating how concepts from this domain apply to current events and real-world developments.`;
};

// Mock interactions data
const mockInteractions: TopicInteraction[] = [
  {
    id: '1',
    topic: 'Atomic Theory',
    bookId: 'physics-1',
    bookTitle: 'The Feynman Lectures',
    chapterId: 'ch-1',
    chapterTitle: 'Atoms in Motion',
    type: 'insight',
    content: 'Everything is made of atoms—little particles that move around in perpetual motion.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    metadata: { insightTitle: 'The Atomic Nature of Matter' }
  },
  {
    id: '2',
    topic: 'Atomic Theory',
    bookId: 'physics-1',
    bookTitle: 'The Feynman Lectures',
    chapterId: 'ch-1',
    chapterTitle: 'Atoms in Motion',
    type: 'first_principle',
    content: 'Atoms are the fundamental building blocks that cannot be broken down further.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    metadata: { principle: 'Atoms as Fundamental Units' }
  },
  {
    id: '3',
    topic: 'Cogito Ergo Sum',
    bookId: 'philosophy-1',
    bookTitle: 'Meditations on First Philosophy',
    chapterId: 'ch-2',
    chapterTitle: 'The Nature of the Human Mind',
    type: 'insight',
    content: 'I think, therefore I am - the foundational certainty of existence.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    metadata: { insightTitle: 'The Indubitability of Self' }
  },
  {
    id: '4',
    topic: 'Division of Labor',
    bookId: 'economics-1',
    bookTitle: 'The Wealth of Nations',
    chapterId: 'ch-1',
    chapterTitle: 'Of the Division of Labor',
    type: 'chat',
    content: 'How does division of labor increase productivity?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26),
    metadata: { question: 'Explain division of labor benefits' }
  },
  {
    id: '5',
    topic: 'System 1 & System 2',
    bookId: 'psychology-1',
    bookTitle: 'Thinking, Fast and Slow',
    chapterId: 'ch-1',
    chapterTitle: 'The Characters of the Story',
    type: 'read',
    content: 'Read about the two systems of thinking.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: '6',
    topic: 'System 1 & System 2',
    bookId: 'psychology-1',
    bookTitle: 'Thinking, Fast and Slow',
    chapterId: 'ch-1',
    chapterTitle: 'The Characters of the Story',
    type: 'first_principle',
    content: 'System 1 operates automatically and quickly, while System 2 allocates attention to effortful mental activities.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50),
    metadata: { principle: 'Dual-Process Theory' }
  },
];

const mockStats: UserStats = {
  totalBooksRead: 5,
  totalChaptersRead: 18,
  totalReadingTime: 1240,
  totalInsightsGenerated: 47,
  totalTopicsExplored: 23,
  streakDays: 12,
  favoriteCategory: 'Physics'
};

const topicColors: Record<string, string> = {
  'Atomic Theory': 'from-blue-500 to-cyan-500',
  'Cogito Ergo Sum': 'from-amber-500 to-orange-500',
  'Division of Labor': 'from-green-500 to-emerald-500',
  'System 1 & System 2': 'from-purple-500 to-pink-500',
  'Default': 'from-[#d0ff59] to-lime-400'
};

const typeIcons: Record<string, typeof Sparkles> = {
  insight: Sparkles,
  first_principle: Brain,
  news: Newspaper,
  chat: MessageSquare,
  read: BookOpen
};

const typeLabels: Record<string, string> = {
  insight: 'AI Insight',
  first_principle: 'First Principle',
  news: 'Related News',
  chat: 'AI Chat',
  read: 'Chapter Read'
};

// Simulate news API fetch
const fetchRelatedNews = async (topic: string): Promise<NewsArticle[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return generateMockNews(topic);
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'topics' | 'stats'>('timeline');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedNews, setExpandedNews] = useState<Set<string>>(new Set());
  const [interactions, setInteractions] = useState<TopicInteraction[]>(mockInteractions);
  const [loadingNewsFor, setLoadingNewsFor] = useState<Set<string>>(new Set());

  // Auto-fetch news for insights and first principles
  useEffect(() => {
    const loadNewsForInteractions = async () => {
      const newsRequiringTypes = ['insight', 'first_principle'];
      
      for (const interaction of interactions) {
        if (newsRequiringTypes.includes(interaction.type) && !interaction.relatedNews) {
          setLoadingNewsFor(prev => new Set(prev).add(interaction.id));
          
          try {
            const news = await fetchRelatedNews(interaction.topic);
            setInteractions(prev => 
              prev.map(i => 
                i.id === interaction.id 
                  ? { ...i, relatedNews: news, isLoadingNews: false }
                  : i
              )
            );
          } catch (error) {
            console.error('Failed to fetch news:', error);
          } finally {
            setLoadingNewsFor(prev => {
              const newSet = new Set(prev);
              newSet.delete(interaction.id);
              return newSet;
            });
          }
        }
      }
    };

    loadNewsForInteractions();
  }, []);

  // Manual refresh news for a specific interaction
  const refreshNews = useCallback(async (interactionId: string, topic: string) => {
    setLoadingNewsFor(prev => new Set(prev).add(interactionId));
    
    try {
      const news = await fetchRelatedNews(topic);
      setInteractions(prev => 
        prev.map(i => 
          i.id === interactionId 
            ? { ...i, relatedNews: news, isLoadingNews: false }
            : i
        )
      );
    } catch (error) {
      console.error('Failed to refresh news:', error);
    } finally {
      setLoadingNewsFor(prev => {
        const newSet = new Set(prev);
        newSet.delete(interactionId);
        return newSet;
      });
    }
  }, []);

  const filteredInteractions = useMemo(() => {
    return interactions.filter(interaction => {
      const matchesSearch = interaction.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interaction.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interaction.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interaction.relatedNews?.some(n => 
          n.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesTopic = !selectedTopic || interaction.topic === selectedTopic;
      const matchesType = !filterType || interaction.type === filterType;
      return matchesSearch && matchesTopic && matchesType;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [interactions, searchQuery, selectedTopic, filterType]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, TopicInteraction[]> = {};
    filteredInteractions.forEach(interaction => {
      const dateKey = interaction.timestamp.toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(interaction);
    });
    return groups;
  }, [filteredInteractions]);

  const topicStats = useMemo(() => {
    const stats: Record<string, { count: number; lastAccessed: Date; types: Set<string>; newsCount: number }> = {};
    interactions.forEach(interaction => {
      if (!stats[interaction.topic]) {
        stats[interaction.topic] = { count: 0, lastAccessed: interaction.timestamp, types: new Set(), newsCount: 0 };
      }
      stats[interaction.topic].count++;
      stats[interaction.topic].types.add(interaction.type);
      stats[interaction.topic].newsCount += interaction.relatedNews?.length || 0;
      if (interaction.timestamp > stats[interaction.topic].lastAccessed) {
        stats[interaction.topic].lastAccessed = interaction.timestamp;
      }
    });
    return stats;
  }, [interactions]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const toggleNewsExpand = (newsId: string) => {
    const newExpanded = new Set(expandedNews);
    if (newExpanded.has(newsId)) {
      newExpanded.delete(newsId);
    } else {
      newExpanded.add(newsId);
    }
    setExpandedNews(newExpanded);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatNewsDate = (isoString: string) => {
    const date = new Date(isoString);
    return formatTimeAgo(date);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d0ff59] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-black" />
                </div>
                <span className="text-lg font-bold text-white">BookMind AI</span>
              </Link>
              <div className="w-px h-6 bg-white/20" />
              <span className="text-white/60">Dashboard</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d0ff59]/10 border border-[#d0ff59]/30">
                <Flame className="w-4 h-4 text-[#d0ff59]" />
                <span className="text-sm text-[#d0ff59] font-medium">{mockStats.streakDays} day streak</span>
              </div>
              <Link 
                to="/knowledge-graph"
                className="px-4 py-2 rounded-lg bg-[#d0ff59]/10 text-[#d0ff59] hover:bg-[#d0ff59]/20 text-sm transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Knowledge Graph
              </Link>
              <Link 
                to="/library"
                className="px-4 py-2 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 hover:text-white text-sm transition-colors"
              >
                Library
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Books Read', value: mockStats.totalBooksRead, icon: BookOpen },
            { label: 'Chapters', value: mockStats.totalChaptersRead, icon: Bookmark },
            { label: 'Reading Time', value: formatDuration(mockStats.totalReadingTime), icon: Clock },
            { label: 'Insights', value: mockStats.totalInsightsGenerated, icon: Lightbulb },
            { label: 'Topics', value: mockStats.totalTopicsExplored, icon: Target },
            { label: 'Streak', value: `${mockStats.streakDays} days`, icon: Flame },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#d0ff59]/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-[#d0ff59]" />
                <span className="text-white/50 text-xs">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10">
          {[
            { id: 'timeline', label: 'Timeline', icon: Calendar },
            { id: 'topics', label: 'Topics', icon: Target },
            { id: 'stats', label: 'Statistics', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-[#d0ff59] border-[#d0ff59]'
                  : 'text-white/50 border-transparent hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search topics, books, insights, news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white text-sm placeholder:text-white/40"
            />
          </div>

          <div className="flex items-center gap-1">
            {Object.entries(typeLabels).map(([type, label]) => {
              const Icon = typeIcons[type];
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(filterType === type ? null : type)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    filterType === type
                      ? 'bg-[#d0ff59] text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>

          {selectedTopic && (
            <button
              onClick={() => setSelectedTopic(null)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#d0ff59]/10 text-[#d0ff59] text-xs font-medium"
            >
              {selectedTopic}
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* TIMELINE VIEW */}
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {Object.entries(groupedByDate).map(([date, dayInteractions]) => (
                <div key={date} className="relative">
                  {/* Date Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#d0ff59]" />
                    <h3 className="text-white font-medium">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/40 text-sm">{dayInteractions.length} activities</span>
                  </div>

                  {/* Timeline Items */}
                  <div className="space-y-4 ml-4 pl-6 border-l border-white/10">
                    {dayInteractions.map((interaction) => {
                      const Icon = typeIcons[interaction.type];
                      const isExpanded = expandedItems.has(interaction.id);
                      const isLoadingNews = loadingNewsFor.has(interaction.id);
                      const hasNews = interaction.relatedNews && interaction.relatedNews.length > 0;
                      const shouldShowNews = ['insight', 'first_principle'].includes(interaction.type);
                      
                      return (
                        <motion.div
                          key={interaction.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative"
                        >
                          <div className="absolute -left-[29px] top-4 w-3 h-3 rounded-full bg-white/20 border-2 border-black" />
                          
                          <div 
                            className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all ${
                              isExpanded ? 'border-[#d0ff59]/50' : 'hover:border-white/20'
                            }`}
                          >
                            {/* Main Content */}
                            <div 
                              onClick={() => toggleExpand(interaction.id)}
                              className="p-4 cursor-pointer"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#d0ff59]/10 flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-5 h-5 text-[#d0ff59]" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-white/10 text-white/70 text-xs border-0">
                                      {typeLabels[interaction.type]}
                                    </Badge>
                                    <span className="text-white/40 text-xs">{formatTimeAgo(interaction.timestamp)}</span>
                                    {hasNews && (
                                      <Badge className="bg-blue-500/20 text-blue-400 text-xs border-0 flex items-center gap-1">
                                        <Newspaper className="w-3 h-3" />
                                        {interaction.relatedNews?.length} news
                                      </Badge>
                                    )}
                                  </div>

                                  <h4 className="text-white font-medium mb-1">{interaction.topic}</h4>
                                  <p className="text-white/60 text-sm line-clamp-2">{interaction.content}</p>

                                  <div className="flex items-center gap-2 mt-2 text-white/40 text-xs">
                                    <BookOpen className="w-3 h-3" />
                                    <span>{interaction.bookTitle}</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span>{interaction.chapterTitle}</span>
                                  </div>
                                </div>

                                <div className="text-white/30">
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </div>
                              </div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-white/10"
                                >
                                  <div className="p-4">
                                    {/* Metadata */}
                                    {interaction.metadata && (
                                      <div className="mb-4 space-y-2">
                                        {interaction.metadata.insightTitle && (
                                          <div>
                                            <span className="text-[#d0ff59] text-xs">Insight: </span>
                                            <span className="text-white/70 text-sm">{interaction.metadata.insightTitle}</span>
                                          </div>
                                        )}
                                        {interaction.metadata.principle && (
                                          <div>
                                            <span className="text-[#d0ff59] text-xs">Principle: </span>
                                            <span className="text-white/70 text-sm">{interaction.metadata.principle}</span>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Related News Section */}
                                    {shouldShowNews && (
                                      <div className="mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                          <h5 className="text-white/80 text-sm font-medium flex items-center gap-2">
                                            <Newspaper className="w-4 h-4 text-blue-400" />
                                            Related News & Events
                                          </h5>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              refreshNews(interaction.id, interaction.topic);
                                            }}
                                            disabled={isLoadingNews}
                                            className="flex items-center gap-1 text-white/40 hover:text-white text-xs transition-colors disabled:opacity-50"
                                          >
                                            {isLoadingNews ? (
                                              <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                              <RefreshCw className="w-3 h-3" />
                                            )}
                                            Refresh
                                          </button>
                                        </div>

                                        {isLoadingNews ? (
                                          <div className="flex items-center justify-center py-8 bg-white/5 rounded-lg">
                                            <Loader2 className="w-5 h-5 text-[#d0ff59] animate-spin" />
                                            <span className="text-white/50 text-sm ml-2">Finding related news...</span>
                                          </div>
                                        ) : hasNews ? (
                                          <div className="space-y-3">
                                            {interaction.relatedNews?.map((news) => {
                                              const isNewsExpanded = expandedNews.has(news.id);
                                              return (
                                                <div 
                                                  key={news.id}
                                                  className="bg-white/5 rounded-lg overflow-hidden"
                                                >
                                                  <div 
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleNewsExpand(news.id);
                                                    }}
                                                    className="p-3 cursor-pointer hover:bg-white/[0.07] transition-colors"
                                                  >
                                                    <div className="flex items-start gap-3">
                                                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                        <Newspaper className="w-4 h-4 text-blue-400" />
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <h6 className="text-white text-sm font-medium line-clamp-1">{news.title}</h6>
                                                        <div className="flex items-center gap-2 mt-1 text-white/40 text-xs">
                                                          <span>{news.source}</span>
                                                          <span>•</span>
                                                          <span>{formatNewsDate(news.publishedAt)}</span>
                                                          <Badge className="bg-blue-500/20 text-blue-400 text-[10px] border-0">
                                                            {news.relevanceScore}% match
                                                          </Badge>
                                                        </div>
                                                      </div>
                                                      <div className="text-white/30">
                                                        {isNewsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <AnimatePresence>
                                                    {isNewsExpanded && (
                                                      <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="border-t border-white/10"
                                                      >
                                                        <div className="p-3 space-y-3">
                                                          <p className="text-white/70 text-sm">{news.description}</p>
                                                          
                                                          {/* Relationship Explanation */}
                                                          <div className="bg-[#d0ff59]/5 border border-[#d0ff59]/20 rounded-lg p-3">
                                                            <div className="flex items-center gap-2 mb-1">
                                                              <Link2 className="w-3.5 h-3.5 text-[#d0ff59]" />
                                                              <span className="text-[#d0ff59] text-xs font-medium">Why This Is Related</span>
                                                            </div>
                                                            <p className="text-white/60 text-xs leading-relaxed">
                                                              {generateRelationshipExplanation(interaction.topic, news.title)}
                                                            </p>
                                                          </div>

                                                          <a
                                                            href={news.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                                                          >
                                                            Read Full Article
                                                            <ExternalLink className="w-3 h-3" />
                                                          </a>
                                                        </div>
                                                      </motion.div>
                                                    )}
                                                  </AnimatePresence>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        ) : (
                                          <div className="text-center py-6 bg-white/5 rounded-lg">
                                            <Newspaper className="w-8 h-8 text-white/20 mx-auto mb-2" />
                                            <p className="text-white/40 text-sm">No related news found</p>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    <Link
                                      to={`/analyze?book=${interaction.bookId}&chapter=${interaction.chapterId.split('-')[1]}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1 text-[#d0ff59] text-sm hover:underline"
                                    >
                                      Continue Reading
                                      <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TOPICS VIEW */}
          {activeTab === 'topics' && (
            <motion.div
              key="topics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {Object.entries(topicStats)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([topic, stats], index) => {
                  const colorClass = topicColors[topic] || topicColors.Default;
                  const relatedInteractions = interactions.filter(i => i.topic === topic);
                  const totalNews = relatedInteractions.reduce((sum, i) => sum + (i.relatedNews?.length || 0), 0);
                  
                  return (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedTopic(topic)}
                      className={`group relative bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer hover:border-[#d0ff59]/30 transition-all overflow-hidden ${
                        selectedTopic === topic ? 'border-[#d0ff59] ring-1 ring-[#d0ff59]/50' : ''
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex items-center gap-1 text-white/40 text-xs">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(stats.lastAccessed)}
                          </div>
                        </div>

                        <h3 className="text-white font-semibold text-lg mb-2">{topic}</h3>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-white/60 text-sm">
                            <span className="text-white font-medium">{stats.count}</span> interactions
                          </div>
                          {totalNews > 0 && (
                            <div className="text-blue-400 text-sm flex items-center gap-1">
                              <Newspaper className="w-3 h-3" />
                              <span className="font-medium">{totalNews}</span> news
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {Array.from(stats.types).map(type => {
                            const Icon = typeIcons[type];
                            return (
                              <span key={type} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-white/50 text-xs">
                                <Icon className="w-3 h-3" />
                                {typeLabels[type]}
                              </span>
                            );
                          })}
                        </div>

                        <div className="pt-3 border-t border-white/10">
                          <p className="text-white/40 text-xs mb-2">From:</p>
                          <div className="flex flex-wrap gap-1">
                            {[...new Set(relatedInteractions.map(i => i.bookTitle))].map(book => (
                              <span key={book} className="text-white/60 text-xs truncate max-w-[150px]">
                                {book}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </motion.div>
          )}

          {/* STATS VIEW */}
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Weekly Activity */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#d0ff59]" />
                  Weekly Activity
                </h3>
                <div className="flex items-end justify-between gap-2 h-40">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const height = [60, 85, 45, 90, 70, 55, 80][i];
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative h-32 bg-white/5 rounded-lg overflow-hidden">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#d0ff59]/50 to-[#d0ff59] rounded-lg"
                          />
                        </div>
                        <span className="text-white/40 text-xs">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#d0ff59]" />
                    Activity Breakdown
                  </h3>
                  <div className="space-y-3">
                    {[
                      { type: 'insight', count: 18, color: 'bg-[#d0ff59]' },
                      { type: 'read', count: 12, color: 'bg-blue-500' },
                      { type: 'chat', count: 8, color: 'bg-purple-500' },
                      { type: 'first_principle', count: 5, color: 'bg-orange-500' },
                      { type: 'news', count: 4, color: 'bg-cyan-500' },
                    ].map(({ type, count, color }) => {
                      const Icon = typeIcons[type];
                      const percentage = (count / 47) * 100;
                      return (
                        <div key={type} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-white/60" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white/70 text-sm">{typeLabels[type]}</span>
                              <span className="text-white text-sm font-medium">{count}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#d0ff59]" />
                    Top Topics
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(topicStats)
                      .sort((a, b) => b[1].count - a[1].count)
                      .slice(0, 5)
                      .map(([topic, stats], i) => (
                        <div key={topic} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-medium">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm">{topic}</span>
                              <span className="text-white/50 text-sm">{stats.count} interactions</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#d0ff59]/10 to-transparent border border-[#d0ff59]/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#d0ff59] flex items-center justify-center">
                      <Flame className="w-7 h-7 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{mockStats.streakDays} Day Streak!</h3>
                      <p className="text-white/60 text-sm">Keep reading to maintain your streak</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                          i < 5 ? 'bg-[#d0ff59] text-black' : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
