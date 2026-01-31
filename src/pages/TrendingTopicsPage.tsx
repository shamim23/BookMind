import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Activity,
  Brain,
  DollarSign,
  Globe,
  Heart,
  Zap,
  BookOpen,
  Target,
  Sparkles,
  Lightbulb,
  ChevronRight,
  Clock,
  Bookmark,
  Search,
  Flame
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

// Trending topic categories
const categories = [
  { id: 'all', label: 'All Topics', icon: Globe },
  { id: 'ai', label: 'Artificial Intelligence', icon: Brain },
  { id: 'healthcare', label: 'Healthcare & Medicine', icon: Heart },
  { id: 'economy', label: 'Economy & Finance', icon: DollarSign },
  { id: 'climate', label: 'Climate & Energy', icon: Zap },
  { id: 'geopolitics', label: 'Geopolitics', icon: Globe },
];

// Trending topics with book connections
interface TrendingTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  whyItMatters: string;
  keyDevelopments: { date: string; event: string }[];
  bookConnections: BookConnection[];
  relatedConcepts: string[];
  newsSources: string[];
  trendingScore: number;
  lastUpdated: string;
}

interface BookConnection {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  concept: string;
  relevance: string;
  chapterId?: string;
  chapterTitle?: string;
}

const trendingTopics: TrendingTopic[] = [
  {
    id: 'ai-consciousness',
    title: 'AI Consciousness & The Nature of Mind',
    category: 'ai',
    summary: 'As large language models become more sophisticated, researchers and philosophers are debating whether AI systems can truly "think," understand, or be conscious. This challenges fundamental assumptions about what minds are and how they work.',
    whyItMatters: 'If AI can think, we face ethical obligations to treat it with moral consideration. If not, we risk over-relying on systems that merely simulate understanding.',
    keyDevelopments: [
      { date: 'Jan 2025', event: 'DeepSeek releases reasoning model showing chain-of-thought' },
      { date: 'Dec 2024', event: 'Google\'s Gemini achieves human-level performance on reasoning benchmarks' },
      { date: 'Nov 2024', event: 'Philosophers publish "Consciousness in Artificial Agents" framework' },
    ],
    bookConnections: [
      {
        bookId: 'philosophy-1',
        bookTitle: 'Meditations on First Philosophy',
        bookAuthor: 'René Descartes',
        concept: 'Cogito Ergo Sum',
        relevance: 'Descartes\' method of doubt and certainty about one\'s own existence provides a framework for asking what it means for an AI to "know" or be certain.',
        chapterId: 'ch-2',
        chapterTitle: 'The Nature of the Human Mind'
      },
      {
        bookId: 'psychology-1',
        bookTitle: 'Thinking, Fast and Slow',
        bookAuthor: 'Daniel Kahneman',
        concept: 'System 1 vs System 2',
        relevance: 'Kahneman\'s distinction between fast, intuitive thinking and slow, deliberate reasoning maps onto debates about AI capabilities and limitations.',
        chapterId: 'ch-1',
        chapterTitle: 'The Characters of the Story'
      },
      {
        bookId: 'biology-1',
        bookTitle: 'The Selfish Gene',
        bookAuthor: 'Richard Dawkins',
        concept: 'Consciousness as an Emergent Property',
        relevance: 'Dawkins\' view of consciousness as an emergent property of complex information processing parallels questions about whether AI consciousness could emerge.',
        chapterId: 'ch-11',
        chapterTitle: 'Memes: The New Replicators'
      }
    ],
    relatedConcepts: ['Emergence', 'Intelligence', 'Understanding', 'Simulation vs Reality', 'Moral Status'],
    newsSources: ['Nature', 'MIT Technology Review', 'Philosophy of Mind Journal'],
    trendingScore: 95,
    lastUpdated: '2025-01-30'
  },
  {
    id: 'healthcare-ai',
    title: 'AI in Healthcare: Diagnosis, Treatment & Ethics',
    category: 'healthcare',
    summary: 'AI systems are increasingly diagnosing diseases, recommending treatments, and even predicting patient outcomes. This raises questions about medical authority, patient autonomy, and the role of human judgment.',
    whyItMatters: 'AI could democratize healthcare access but also concentrate power in algorithmic systems patients don\'t understand. The stakes are literally life and death.',
    keyDevelopments: [
      { date: 'Jan 2025', event: 'FDA approves first fully autonomous AI diagnostic system' },
      { date: 'Dec 2024', event: 'Study shows AI outperforms doctors in early cancer detection' },
      { date: 'Nov 2024', event: 'WHO releases AI ethics guidelines for healthcare' },
    ],
    bookConnections: [
      {
        bookId: 'psychology-1',
        bookTitle: 'Thinking, Fast and Slow',
        bookAuthor: 'Daniel Kahneman',
        concept: 'Algorithmic vs Human Judgment',
        relevance: 'Kahneman\'s research on when algorithms outperform human experts directly applies to medical AI deployment decisions.',
        chapterId: 'ch-21',
        chapterTitle: 'Intuitions vs Formulas'
      },
      {
        bookId: 'philosophy-1',
        bookTitle: 'Meditations on First Philosophy',
        bookAuthor: 'René Descartes',
        concept: 'Methodological Doubt',
        relevance: 'The medical principle of "first, do no harm" parallels Descartes\' systematic doubt—questioning before accepting.',
        chapterId: 'ch-1',
        chapterTitle: 'What Can Be Called Into Doubt'
      },
      {
        bookId: 'economics-1',
        bookTitle: 'The Wealth of Nations',
        bookAuthor: 'Adam Smith',
        concept: 'Division of Labor',
        relevance: 'Healthcare AI represents extreme specialization—dividing diagnosis into tasks that AI can perform more efficiently than generalist doctors.',
        chapterId: 'ch-1',
        chapterTitle: 'Of the Division of Labor'
      }
    ],
    relatedConcepts: ['Medical Authority', 'Patient Autonomy', 'Algorithmic Bias', 'Explainability', 'Trust'],
    newsSources: ['The Lancet', 'NEJM', 'Nature Medicine'],
    trendingScore: 92,
    lastUpdated: '2025-01-28'
  },
  {
    id: 'deglobalization',
    title: 'The End of Globalization? Reshoring & Trade Wars',
    category: 'economy',
    summary: 'After decades of increasing global integration, nations are pulling back. Supply chain disruptions, geopolitical tensions, and national security concerns are driving a shift toward regionalization and self-sufficiency.',
    whyItMatters: 'The economic order that shaped the 21st century is fragmenting. This affects prices, jobs, innovation, and potentially peace itself.',
    keyDevelopments: [
      { date: 'Jan 2025', event: 'New US tariffs on Chinese EVs and solar panels take effect' },
      { date: 'Dec 2024', event: 'EU announces €300B strategic autonomy investment plan' },
      { date: 'Nov 2024', event: 'Apple accelerates India manufacturing shift' },
    ],
    bookConnections: [
      {
        bookId: 'economics-1',
        bookTitle: 'The Wealth of Nations',
        bookAuthor: 'Adam Smith',
        concept: 'Comparative Advantage',
        relevance: 'The theory that nations should specialize and trade is being challenged by strategic concerns that override pure economic efficiency.',
        chapterId: 'ch-2',
        chapterTitle: 'Of the Principle of the Commercial System'
      },
      {
        bookId: 'economics-1',
        bookTitle: 'The Wealth of Nations',
        bookAuthor: 'Adam Smith',
        concept: 'Invisible Hand',
        relevance: 'The assumption that markets self-organize for mutual benefit assumes peaceful cooperation—assumption now being questioned.',
        chapterId: 'ch-2',
        chapterTitle: 'Of the Principle of the Commercial System'
      },
      {
        bookId: 'history-1',
        bookTitle: 'Sapiens',
        bookAuthor: 'Yuval Noah Harari',
        concept: 'Inter-subjective Reality',
        relevance: 'The global economy is built on shared fictions (money, trade rules, international law) that require collective belief to function.',
        chapterId: 'ch-2',
        chapterTitle: 'The Tree of Knowledge'
      }
    ],
    relatedConcepts: ['Comparative Advantage', 'Strategic Trade', 'Supply Chains', 'Economic Interdependence', 'National Security'],
    newsSources: ['Financial Times', 'The Economist', 'WTO Reports'],
    trendingScore: 88,
    lastUpdated: '2025-01-29'
  },
  {
    id: 'climate-transition',
    title: 'The Green Transition: Energy, Economics & Justice',
    category: 'climate',
    summary: 'The shift from fossil fuels to renewable energy is reshaping economies, geopolitics, and daily life. This transition involves complex trade-offs between speed, cost, reliability, and equity.',
    whyItMatters: 'Climate change is an existential threat, but the transition itself could cause economic disruption, social unrest, and geopolitical conflict.',
    keyDevelopments: [
      { date: 'Jan 2025', event: 'Global renewable capacity surpasses coal for first time' },
      { date: 'Dec 2024', event: 'COP29 establishes climate damage compensation fund' },
      { date: 'Nov 2024', event: 'Major oil companies accelerate renewable investments' },
    ],
    bookConnections: [
      {
        bookId: 'economics-1',
        bookTitle: 'The Wealth of Nations',
        bookAuthor: 'Adam Smith',
        concept: 'Externalities',
        relevance: 'Climate change is the ultimate externality—costs imposed on future generations and other nations not reflected in market prices.',
        chapterId: 'ch-5',
        chapterTitle: 'Of the Real and Nominal Price of Commodities'
      },
      {
        bookId: 'biology-1',
        bookTitle: 'The Selfish Gene',
        bookAuthor: 'Richard Dawkins',
        concept: 'Tragedy of the Commons',
        relevance: 'The atmosphere is a shared resource that individuals and nations have incentive to exploit despite collective harm.',
        chapterId: 'ch-10',
        chapterTitle: 'You Scratch My Back'
      },
      {
        bookId: 'psychology-1',
        bookTitle: 'Thinking, Fast and Slow',
        bookAuthor: 'Daniel Kahneman',
        concept: 'Present Bias',
        relevance: 'Humans systematically undervalue future consequences, making climate action politically difficult despite rational urgency.',
        chapterId: 'ch-13',
        chapterTitle: 'Availability, Emotion, and Risk'
      }
    ],
    relatedConcepts: ['Externalities', 'Tragedy of the Commons', 'Intergenerational Justice', 'Energy Transition', 'Carbon Pricing'],
    newsSources: ['IEA', 'IPCC', 'BloombergNEF'],
    trendingScore: 85,
    lastUpdated: '2025-01-27'
  },
  {
    id: 'quantum-revolution',
    title: 'The Quantum Computing Revolution',
    category: 'ai',
    summary: 'Quantum computers are approaching practical utility, promising to solve problems intractable for classical computers. This could revolutionize drug discovery, cryptography, materials science, and AI itself.',
    whyItMatters: 'Quantum computing could break current encryption, discover new materials, and accelerate AI training—with profound security and economic implications.',
    keyDevelopments: [
      { date: 'Jan 2025', event: 'IBM unveils 1000+ qubit processor with error correction' },
      { date: 'Dec 2024', event: 'First quantum computer achieves quantum advantage in chemistry simulation' },
      { date: 'Nov 2024', event: 'NIST finalizes post-quantum cryptography standards' },
    ],
    bookConnections: [
      {
        bookId: 'physics-1',
        bookTitle: 'The Feynman Lectures on Physics',
        bookAuthor: 'Richard Feynman',
        concept: 'Quantum Mechanics',
        relevance: 'Feynman\'s foundational explanations of quantum superposition and entanglement are the physics behind quantum computing.',
        chapterId: 'ch-1',
        chapterTitle: 'Atoms in Motion'
      },
      {
        bookId: 'physics-1',
        bookTitle: 'The Feynman Lectures on Physics',
        bookAuthor: 'Richard Feynman',
        concept: 'The Nature of Physical Law',
        relevance: 'Quantum computing exploits the fundamental nature of physical reality to perform computation impossible classically.',
        chapterId: 'ch-2',
        chapterTitle: 'Basic Physics'
      },
      {
        bookId: 'technology-1',
        bookTitle: 'The Innovators',
        bookAuthor: 'Walter Isaacson',
        concept: 'Disruptive Technology Cycles',
        relevance: 'Quantum computing follows historical patterns of breakthrough technologies that reshape entire industries.',
        chapterId: 'ch-1',
        chapterTitle: 'Ada, Countess of Lovelace'
      }
    ],
    relatedConcepts: ['Superposition', 'Entanglement', 'Quantum Advantage', 'Cryptography', 'Simulation'],
    newsSources: ['Nature', 'Science', 'IBM Research'],
    trendingScore: 82,
    lastUpdated: '2025-01-26'
  },
  {
    id: 'longevity-science',
    title: 'The Science of Longevity: Living to 100+',
    category: 'healthcare',
    summary: 'Advances in biotechnology are extending healthspan and potentially lifespan. From senolytics to gene therapy, science is tackling aging as a treatable condition rather than inevitable decline.',
    whyItMatters: 'If successful, longevity science could add decades of healthy life—but also raises questions about inequality, pension systems, and what it means to be human.',
    keyDevelopments: [
      { date: 'Jan 2025', event: 'First human trials of senolytic drugs show promising results' },
      { date: 'Dec 2024', event: 'AI-designed protein shows efficacy in reversing cellular aging markers' },
      { date: 'Nov 2024', event: 'Major biotech firms announce longevity-focused investment funds' },
    ],
    bookConnections: [
      {
        bookId: 'biology-1',
        bookTitle: 'The Selfish Gene',
        bookAuthor: 'Richard Dawkins',
        concept: 'Evolutionary Trade-offs',
        relevance: 'Aging may be an evolutionary trade-off—genes that help reproduction early in life may have harmful effects later.',
        chapterId: 'ch-1',
        chapterTitle: 'Why Are People?'
      },
      {
        bookId: 'philosophy-1',
        bookTitle: 'Meditations on First Philosophy',
        bookAuthor: 'René Descartes',
        concept: 'The Body-Mind Problem',
        relevance: 'If we can extend the body indefinitely, what does that mean for our understanding of self and consciousness?',
        chapterId: 'ch-2',
        chapterTitle: 'The Nature of the Human Mind'
      },
      {
        bookId: 'economics-1',
        bookTitle: 'The Wealth of Nations',
        bookAuthor: 'Adam Smith',
        concept: 'Population and Resources',
        relevance: 'Extended lifespans would dramatically change population dynamics and resource consumption patterns.',
        chapterId: 'ch-8',
        chapterTitle: 'Of the Wages of Labour'
      }
    ],
    relatedConcepts: ['Senescence', 'Healthspan', 'Biotechnology', 'Ethics of Enhancement', 'Resource Allocation'],
    newsSources: ['Nature Aging', 'Cell', 'Lifespan.io'],
    trendingScore: 78,
    lastUpdated: '2025-01-25'
  },
  {
    id: 'crypto-regulation',
    title: 'Cryptocurrency & the Future of Money',
    category: 'economy',
    summary: 'Cryptocurrencies and central bank digital currencies (CBDCs) are challenging traditional monetary systems. The debate spans technology, economics, and sovereignty.',
    whyItMatters: 'Money is a fundamental social technology. How it evolves affects everything from personal privacy to government power to global financial stability.',
    keyDevelopments: [
      { date: 'Jan 2025', event: 'Major economies announce coordinated crypto regulatory framework' },
      { date: 'Dec 2024', event: 'First nation adopts Bitcoin as legal tender in Africa' },
      { date: 'Nov 2024', event: 'Federal Reserve releases CBDC technical specifications' },
    ],
    bookConnections: [
      {
        bookId: 'economics-1',
        bookTitle: 'The Wealth of Nations',
        bookAuthor: 'Adam Smith',
        concept: 'The Functions of Money',
        relevance: 'Smith\'s analysis of money as medium of exchange, store of value, and unit of account applies to evaluating cryptocurrencies.',
        chapterId: 'ch-4',
        chapterTitle: 'Of the Origin and Use of Money'
      },
      {
        bookId: 'history-1',
        bookTitle: 'Sapiens',
        bookAuthor: 'Yuval Noah Harari',
        concept: 'The Fiction of Money',
        relevance: 'Harari argues money is a shared fiction. Cryptocurrencies test what happens when that fiction becomes decentralized.',
        chapterId: 'ch-10',
        chapterTitle: 'The Scent of Money'
      },
      {
        bookId: 'technology-1',
        bookTitle: 'The Innovators',
        bookAuthor: 'Walter Isaacson',
        concept: 'Distributed Systems',
        relevance: 'Blockchain technology represents a new paradigm for organizing trust without central authorities.',
        chapterId: 'ch-8',
        chapterTitle: 'The Internet'
      }
    ],
    relatedConcepts: ['Trust', 'Decentralization', 'Monetary Policy', 'Privacy', 'Sovereignty'],
    newsSources: ['CoinDesk', 'Federal Reserve', 'BIS'],
    trendingScore: 75,
    lastUpdated: '2025-01-24'
  }
];

export default function TrendingTopicsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [savedTopics, setSavedTopics] = useState<Set<string>>(new Set());

  const filteredTopics = useMemo(() => {
    return trendingTopics.filter(topic => {
      const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.relatedConcepts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => b.trendingScore - a.trendingScore);
  }, [selectedCategory, searchQuery]);

  const toggleSave = (topicId: string) => {
    const newSaved = new Set(savedTopics);
    if (newSaved.has(topicId)) {
      newSaved.delete(topicId);
    } else {
      newSaved.add(topicId);
    }
    setSavedTopics(newSaved);
  };

  const toggleExpand = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
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
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#d0ff59]" />
                <span className="text-white/80">Trending Topics</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 hover:text-white text-sm transition-colors"
              >
                Dashboard
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d0ff59]/10 border border-[#d0ff59]/30 mb-6">
            <Flame className="w-4 h-4 text-[#d0ff59]" />
            <span className="text-sm text-[#d0ff59]">Expand Your Mind with Current Events</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Trending Topics
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Connect today's biggest issues with timeless ideas from the books you're reading.
            Understand the present through the lens of the past.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search topics, concepts, books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#d0ff59] text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid gap-6">
          {filteredTopics.map((topic, index) => {
            const isExpanded = expandedTopic === topic.id;
            const isSaved = savedTopics.has(topic.id);

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors"
              >
                {/* Header */}
                <div
                  onClick={() => toggleExpand(topic.id)}
                  className="p-6 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-[#d0ff59]/20 text-[#d0ff59] border-0 text-xs">
                          {categories.find(c => c.id === topic.category)?.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-white/40 text-xs">
                          <Flame className="w-3 h-3" />
                          <span>{topic.trendingScore}% trending</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/40 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>Updated {topic.lastUpdated}</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">{topic.title}</h2>
                      <p className="text-white/60 text-sm line-clamp-2">{topic.summary}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(topic.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isSaved ? 'bg-[#d0ff59]/20 text-[#d0ff59]' : 'bg-white/5 text-white/40 hover:text-white'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
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
                      <div className="p-6 space-y-6">
                        {/* Why It Matters */}
                        <div className="p-4 rounded-xl bg-[#d0ff59]/5 border border-[#d0ff59]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-[#d0ff59]" />
                            <span className="text-[#d0ff59] text-sm font-medium">Why This Matters</span>
                          </div>
                          <p className="text-white/70 text-sm">{topic.whyItMatters}</p>
                        </div>

                        {/* Key Developments */}
                        <div>
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-400" />
                            Recent Developments
                          </h3>
                          <div className="space-y-2">
                            {topic.keyDevelopments.map((dev, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                                <span className="text-blue-400 text-xs font-medium whitespace-nowrap">{dev.date}</span>
                                <p className="text-white/70 text-sm">{dev.event}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Book Connections */}
                        <div>
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#d0ff59]" />
                            Connect to Your Reading
                          </h3>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {topic.bookConnections.map((conn, i) => (
                              <Link
                                key={i}
                                to={`/analyze?book=${conn.bookId}&chapter=${conn.chapterId?.split('-')[1] || '1'}`}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#d0ff59]/30 hover:bg-white/[0.07] transition-all group"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles className="w-4 h-4 text-[#d0ff59]" />
                                  <span className="text-[#d0ff59] text-xs font-medium">{conn.concept}</span>
                                </div>
                                <p className="text-white font-medium text-sm mb-1">{conn.bookTitle}</p>
                                <p className="text-white/50 text-xs mb-2">{conn.bookAuthor}</p>
                                <p className="text-white/60 text-xs leading-relaxed">{conn.relevance}</p>
                                <div className="mt-3 flex items-center gap-1 text-[#d0ff59] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span>Explore in book</span>
                                  <ChevronRight className="w-3 h-3" />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Related Concepts */}
                        <div>
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                            Related Concepts
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {topic.relatedConcepts.map((concept, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 rounded-full bg-white/5 text-white/70 text-sm hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                              >
                                {concept}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Sources */}
                        <div className="flex items-center gap-2 text-white/40 text-xs">
                          <span>Sources:</span>
                          {topic.newsSources.map((source, i) => (
                            <span key={i}>
                              {source}{i < topic.newsSources.length - 1 ? ' • ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand Indicator */}
                <div
                  onClick={() => toggleExpand(topic.id)}
                  className="px-6 py-3 border-t border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="text-white/40 text-sm">
                    {isExpanded ? 'Show less' : 'Explore connections'}
                  </span>
                  {isExpanded ? <ChevronRight className="w-4 h-4 text-white/40 rotate-90 ml-2" /> : <ChevronRight className="w-4 h-4 text-white/40 ml-2" />}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No topics found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
