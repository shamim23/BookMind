import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Brain, 
  Newspaper, 
  ChevronLeft,
  ChevronRight,
  Target,
  Zap,
  Calendar,
  Loader2,
  ExternalLink,
  MessageCircle,
  Send,
  List,
  X,
  Menu,
  ScrollText,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ArrowRightLeft,
  Database,
  RefreshCw
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sampleBooks, convertToFullBook } from '@/data/sampleBooks';
import { 
  generateInsights, 
  generateFirstPrinciples, 
  generateAIResponse,
  generateDialecticalAnalysis,
  findRelevantNews,
  getChapterInsights,
  syncSampleBook,
  getBook as getBookFromDB,
  getBookChapters
} from '@/services/api';
import CrossDomainMapping from '@/components/CrossDomainMapping';
import EvidenceMapping from '@/components/EvidenceMapping';
import type { Book, Chapter, Insight } from '@/types';
import { Link, useSearchParams } from 'react-router-dom';

interface NewsArticle {
  title: string;
  description: string;
  date: string;
  connection: string;
  url: string;
  source: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface DBSyncStatus {
  isSynced: boolean;
  dbBookId?: string;
  isLoading: boolean;
}

export default function AnalyzeBookPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const bookId = searchParams.get('book');
  const chapterNum = parseInt(searchParams.get('chapter') || '1');
  
  const [book, setBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Database sync status
  const [dbSync, setDbSync] = useState<DBSyncStatus>({ isSynced: false, isLoading: false });
  
  // AI-generated content
  const [insights, setInsights] = useState<Insight[]>([]);
  const [firstPrinciples, setFirstPrinciples] = useState<any>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [dialecticAnalysis, setDialecticAnalysis] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingPrinciples, setIsLoadingPrinciples] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [isLoadingDialectic, setIsLoadingDialectic] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Active AI tab
  const [activeTab, setActiveTab] = useState<'insights' | 'principles' | 'news' | 'chat' | 'dialectic'>('insights');

  // Sync sample book to database and load chapters
  useEffect(() => {
    const loadBookFromDB = async () => {
      if (!bookId) return;
      
      // Check if it's a sample book
      const sampleBook = sampleBooks.find(b => b.id === bookId);
      if (!sampleBook) {
        // For uploaded books, try to load from DB directly
        try {
          const dbBook: Book = await getBookFromDB(bookId);
          setBook(dbBook);
          const chapter = dbBook.chapters.find((c: Chapter) => c.number === chapterNum) || dbBook.chapters[0];
          setSelectedChapter(chapter);
          setDbSync({ isSynced: true, dbBookId: bookId, isLoading: false });
        } catch (error) {
          console.error('Failed to load book:', error);
        }
        return;
      }
      
      // For sample books, sync to DB first
      setDbSync({ isSynced: false, isLoading: true });
      
      try {
        // Sync sample book to database
        const syncResult: { message: string; book_id: string; chapters_count: number } = await syncSampleBook(bookId);
        
        // Load the book with chapters from DB
        const dbChapters: any[] = await getBookChapters(syncResult.book_id);
        
        // Convert to Book format
        const fullBook: Book = {
          id: syncResult.book_id,
          title: sampleBook.title,
          author: sampleBook.author,
          content: sampleBook.content,
          chapters: dbChapters.map((c: any) => ({
            id: c.id,
            number: c.number,
            title: c.title,
            content: '', // Will be loaded when needed
            summary: c.summary,
            keyPoints: c.key_points || [],
            startIndex: 0,
            endIndex: 0,
            concepts: []
          })),
          concepts: [],
          uploadedAt: new Date(),
          category: sampleBook.category
        };
        
        // Load full chapter content and summary from sample book
        const sampleFullBook = convertToFullBook(sampleBook);
        fullBook.chapters = fullBook.chapters.map((ch: Chapter) => {
          const sampleChapter = sampleFullBook.chapters.find(sc => sc.number === ch.number);
          return {
            ...ch,
            content: sampleChapter?.content || '',
            summary: sampleChapter?.summary || ch.summary,
            keyPoints: sampleChapter?.keyPoints || ch.keyPoints
          };
        });
        
        setBook(fullBook);
        setDbSync({ isSynced: true, dbBookId: syncResult.book_id, isLoading: false });
        
        // Select chapter
        const chapter = fullBook.chapters.find((c: Chapter) => c.number === chapterNum) || fullBook.chapters[0];
        setSelectedChapter(chapter);
        
      } catch (error) {
        console.error('Failed to sync book:', error);
        // Fallback to sample book without DB
        const fullBook = convertToFullBook(sampleBook);
        setBook(fullBook);
        const chapter = fullBook.chapters.find(c => c.number === chapterNum) || fullBook.chapters[0];
        setSelectedChapter(chapter);
        setDbSync({ isSynced: false, isLoading: false });
      }
    };
    
    loadBookFromDB();
  }, [bookId, chapterNum]);

  // Define load functions before useEffect that depends on them
  const loadInsights = useCallback(async (chapter: Chapter) => {
    if (!chapter.id) return;
    
    setIsLoadingInsights(true);
    try {
      // 1. First, try to get saved insights from database
      const savedInsights: { insights: Insight[]; total: number; chapter_id: string } = await getChapterInsights(chapter.id);
      
      if (savedInsights.insights.length > 0) {
        console.log(`Loaded ${savedInsights.insights.length} saved insights for chapter ${chapter.number}`);
        setInsights(savedInsights.insights);
        setIsLoadingInsights(false);
        return;
      }
      
      // 2. No saved insights - generate new ones
      console.log('No saved insights found, generating new...');
      
      const insightsData: Insight[] = await generateInsights({
        chapterTitle: chapter.title,
        chapterContent: chapter.content,
        chapterSummary: chapter.summary || '',
        bookTitle: book?.title || '',
        bookAuthor: book?.author || '',
        bookId: book?.id,
        chapterId: chapter.id,
        saveToDb: true
      });
      
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  }, [book]);

  const loadFirstPrinciples = useCallback(async () => {
    if (!selectedChapter) return;
    setIsLoadingPrinciples(true);
    try {
      const principles = await generateFirstPrinciples(
        selectedChapter.title,
        selectedChapter.content,
        selectedChapter.title
      );
      setFirstPrinciples(principles);
    } catch (error) {
      console.error('Failed to load first principles:', error);
    } finally {
      setIsLoadingPrinciples(false);
    }
  }, [selectedChapter]);

  const loadNews = useCallback(async (chapter: Chapter) => {
    setIsLoadingNews(true);
    try {
      const news: NewsArticle[] = await findRelevantNews(chapter.title, chapter.content);
      setNewsArticles(news);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  const loadDialectic = useCallback(async (chapter: Chapter) => {
    if (!book) return;
    setIsLoadingDialectic(true);
    try {
      const analysis = await generateDialecticalAnalysis(
        chapter.title,
        chapter.content,
        book.title,
        book.author || 'Unknown'
      );
      setDialecticAnalysis(analysis);
    } catch (error) {
      console.error('Failed to load dialectic analysis:', error);
    } finally {
      setIsLoadingDialectic(false);
    }
  }, [book]);

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || !selectedChapter) return;
    
    const userMessage: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);
    
    try {
      const response: string = await generateAIResponse(
        chatInput,
        selectedChapter.title,
        selectedChapter.content,
        chatMessages.map(m => ({ role: m.role, content: m.content }))
      );
      setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, selectedChapter, chatMessages]);

  // Reset and load AI content when chapter changes
  useEffect(() => {
    if (selectedChapter && dbSync.isSynced) {
      setInsights([]);
      setFirstPrinciples(null);
      setNewsArticles([]);
      setDialecticAnalysis(null);
      setChatMessages([]);
      loadInsights(selectedChapter);
      loadNews(selectedChapter);
      loadDialectic(selectedChapter);
    }
  }, [selectedChapter, dbSync.isSynced, loadInsights, loadNews, loadDialectic]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    const contentEl = contentRef.current;
    if (contentEl) {
      contentEl.addEventListener('scroll', handleScroll);
      return () => contentEl.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleSelectChapter = (chapter: Chapter) => {
    setSearchParams({ book: bookId || '', chapter: chapter.number.toString() });
    setSelectedChapter(chapter);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const goToPrevChapter = () => {
    if (book && selectedChapter && selectedChapter.number > 1) {
      const prevChapter = book.chapters.find(c => c.number === selectedChapter.number - 1);
      if (prevChapter) handleSelectChapter(prevChapter);
    }
  };

  const goToNextChapter = () => {
    if (book && selectedChapter) {
      const nextChapter = book.chapters.find(c => c.number === selectedChapter.number + 1);
      if (nextChapter) handleSelectChapter(nextChapter);
    }
  };

  if (!book || !selectedChapter || dbSync.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#d0ff59] animate-spin mx-auto mb-4" />
          <p className="text-white/50">
            {dbSync.isLoading ? 'Syncing book to database...' : 'Loading book...'}
          </p>
          {dbSync.isLoading && (
            <p className="text-white/30 text-sm mt-2">This only happens once per book</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Link to="/library" className="flex items-center gap-2 text-white/60 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Library</span>
            </Link>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#d0ff59]" />
              <span className="text-white font-medium truncate max-w-[150px] sm:max-w-xs">{book.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-white/60 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link 
              to={`/reader?book=${book.id}&chapter=${selectedChapter.number}`}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d0ff59] text-black font-medium hover:bg-[#b8e04d] transition-colors"
            >
              <Zap className="w-4 h-4" />
              Power Reader
            </Link>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div className="h-0.5 bg-white/10">
          <motion.div 
            className="h-full bg-[#d0ff59]" 
            style={{ width: `${readingProgress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${readingProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chapter Navigation */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-black border-r border-white/10 flex flex-col"
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <List className="w-4 h-4 text-[#d0ff59]" />
                    Chapters
                  </h2>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-1 rounded text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white/40 text-sm mt-1">{book.chapters.length} chapters</p>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {book.chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleSelectChapter(chapter)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        selectedChapter.id === chapter.id
                          ? 'bg-[#d0ff59]/10 border border-[#d0ff59]/30'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          selectedChapter.id === chapter.id
                            ? 'bg-[#d0ff59] text-black'
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {chapter.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            selectedChapter.id === chapter.id ? 'text-[#d0ff59]' : 'text-white'
                          }`}>
                            {chapter.title}
                          </p>
                          <p className="text-white/40 text-xs mt-0.5">
                            {chapter.content.length.toLocaleString()} words
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>

              {/* Chapter Navigation */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={goToPrevChapter}
                    disabled={selectedChapter.number === 1}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm">Prev</span>
                  </button>
                  <span className="text-white/40 text-sm">
                    {selectedChapter.number} / {book.chapters.length}
                  </span>
                  <button
                    onClick={goToNextChapter}
                    disabled={selectedChapter.number === book.chapters.length}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-sm">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Chapter Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chapter Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-[#d0ff59]/10 text-[#d0ff59] border-0">
                  Chapter {selectedChapter.number}
                </Badge>
                <span className="text-white/40 text-sm">
                  {Math.round(readingProgress)}% read
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {selectedChapter.title}
              </h1>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1" ref={contentRef}>
              <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Chapter Summary Card */}
                {selectedChapter.summary && (
                  <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#d0ff59]/10 to-transparent border border-[#d0ff59]/20">
                    <div className="flex items-center gap-2 mb-3">
                      <ScrollText className="w-5 h-5 text-[#d0ff59]" />
                      <h3 className="text-white font-semibold">Chapter Summary</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">{selectedChapter.summary}</p>
                  </div>
                )}

                {/* Key Points */}
                {selectedChapter.keyPoints.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#d0ff59]" />
                      Key Points
                    </h3>
                    <ul className="space-y-3">
                      {selectedChapter.keyPoints.map((point, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-4 rounded-xl bg-white/5"
                        >
                          <span className="w-6 h-6 rounded-lg bg-[#d0ff59]/20 flex items-center justify-center text-[#d0ff59] text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-white/70">{point}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Full Chapter Content */}
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#d0ff59]" />
                    Full Content
                  </h3>
                  <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                    {selectedChapter.content}
                  </div>
                </div>

                {/* Chapter Navigation Footer */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={goToPrevChapter}
                      disabled={selectedChapter.number === 1}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <div className="text-left">
                        <p className="text-xs text-white/40">Previous</p>
                        <p className="text-sm font-medium">
                          {selectedChapter.number > 1 ? `Chapter ${selectedChapter.number - 1}` : 'None'}
                        </p>
                      </div>
                    </button>

                    <Link
                      to={`/reader?book=${book.id}&chapter=${selectedChapter.number}`}
                      className="sm:hidden flex items-center gap-2 px-4 py-3 rounded-xl bg-[#d0ff59] text-black font-medium"
                    >
                      <Zap className="w-4 h-4" />
                      Power Reader
                    </Link>

                    <button
                      onClick={goToNextChapter}
                      disabled={selectedChapter.number === book.chapters.length}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <div className="text-right">
                        <p className="text-xs text-white/40">Next</p>
                        <p className="text-sm font-medium">
                          {selectedChapter.number < book.chapters.length ? `Chapter ${selectedChapter.number + 1}` : 'None'}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* AI Tools Sidebar */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 bg-black flex flex-col max-h-[50vh] lg:max-h-none">
            {/* AI Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-white/10 overflow-x-auto">
              <button
                onClick={() => setActiveTab('insights')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === 'insights' 
                    ? 'bg-[#d0ff59] text-black' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Insights
                {isLoadingInsights && <Loader2 className="w-3 h-3 animate-spin" />}
              </button>
              <button
                onClick={() => {
                  setActiveTab('principles');
                  if (!firstPrinciples) loadFirstPrinciples();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === 'principles' 
                    ? 'bg-[#d0ff59] text-black' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Brain className="w-4 h-4" />
                Principles
                {isLoadingPrinciples && <Loader2 className="w-3 h-3 animate-spin" />}
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === 'news' 
                    ? 'bg-[#d0ff59] text-black' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                News
                {isLoadingNews && <Loader2 className="w-3 h-3 animate-spin" />}
              </button>
              <button
                onClick={() => {
                  setActiveTab('dialectic');
                  if (!dialecticAnalysis && selectedChapter) loadDialectic(selectedChapter);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === 'dialectic' 
                    ? 'bg-[#d0ff59] text-black' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Scale className="w-4 h-4" />
                Dialectic
                {isLoadingDialectic && <Loader2 className="w-3 h-3 animate-spin" />}
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === 'chat' 
                    ? 'bg-[#d0ff59] text-black' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Ask AI
              </button>
            </div>

            {/* AI Tab Content */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {/* INSIGHTS TAB */}
                  {activeTab === 'insights' && (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#d0ff59]" />
                          AI Insights
                          {dbSync.isSynced && insights.length > 0 && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 text-xs border-0 ml-2">
                              <Database className="w-3 h-3 mr-1" />
                              Saved
                            </Badge>
                          )}
                        </h3>
                        <button
                          onClick={() => loadInsights(selectedChapter)}
                          disabled={isLoadingInsights}
                          className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          {isLoadingInsights ? 'Loading...' : 'Regenerate'}
                        </button>
                      </div>

                      {isLoadingInsights ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 text-[#d0ff59] animate-spin mb-3" />
                          <p className="text-white/50 text-sm">Analyzing chapter...</p>
                        </div>
                      ) : insights.length > 0 ? (
                        <div className="space-y-4">
                          {insights.map((insight, index) => (
                            <motion.div
                              key={insight.id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#d0ff59]/30 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-white font-medium">{insight.title}</h4>
                                {insight.insight_type && (
                                  <Badge className="bg-white/10 text-white/60 text-xs border-0 capitalize flex-shrink-0">
                                    {insight.insight_type.replace('_', ' ')}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-white/60 text-sm mb-3">{insight.summary}</p>
                              <div className="space-y-2">
                                <div className="p-2 rounded-lg bg-black/30">
                                  <p className="text-[#d0ff59] text-xs font-medium mb-1">Evidence</p>
                                  <p className="text-white/50 text-xs">{insight.evidence}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-black/30">
                                  <p className="text-blue-400 text-xs font-medium mb-1">Implication</p>
                                  <p className="text-white/50 text-xs">{insight.implication}</p>
                                </div>
                              </div>
                              
                              {/* Cross-Domain Mapping for this insight */}
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <CrossDomainMapping
                                  concept={insight.title}
                                  sourceBookId={book?.id || ''}
                                  sourceDomain={book?.category || 'General'}
                                  context={insight.summary}
                                  userBookIds={['physics-1', 'biology-1', 'psychology-1', 'economics-1', 'technology-1', 'philosophy-1', 'history-1']}
                                />
                              </div>
                              
                              {/* Evidence Mapping for this insight */}
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <EvidenceMapping
                                  concept={insight.title}
                                  context={insight.summary}
                                  bookTitle={book?.title || ''}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-3" />
                          <p className="text-white/40 text-sm">Click "Regenerate" to analyze</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* FIRST PRINCIPLES TAB */}
                  {activeTab === 'principles' && (
                    <motion.div
                      key="principles"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          <Brain className="w-4 h-4 text-[#d0ff59]" />
                          First Principles
                        </h3>
                        <button
                          onClick={loadFirstPrinciples}
                          disabled={isLoadingPrinciples}
                          className="text-xs text-white/40 hover:text-white transition-colors"
                        >
                          {isLoadingPrinciples ? 'Loading...' : firstPrinciples ? 'Regenerate' : 'Generate'}
                        </button>
                      </div>

                      {isLoadingPrinciples ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 text-[#d0ff59] animate-spin mb-3" />
                          <p className="text-white/50 text-sm">Breaking down principles...</p>
                        </div>
                      ) : firstPrinciples ? (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-gradient-to-br from-[#d0ff59]/10 to-transparent border border-[#d0ff59]/20">
                            <h4 className="text-white font-medium mb-2">{firstPrinciples.principle}</h4>
                            <p className="text-white/60 text-sm">{firstPrinciples.explanation}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Breakdown</p>
                            <div className="space-y-2">
                              {firstPrinciples.breakdown.map((step: string, index: number) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                                  <span className="w-6 h-6 rounded-lg bg-[#d0ff59]/20 flex items-center justify-center text-[#d0ff59] text-xs font-bold flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <p className="text-white/60 text-sm">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Brain className="w-12 h-12 text-white/10 mx-auto mb-3" />
                          <p className="text-white/40 text-sm mb-4">Generate first principles analysis</p>
                          <button
                            onClick={loadFirstPrinciples}
                            className="px-4 py-2 rounded-lg bg-[#d0ff59] text-black text-sm font-medium hover:bg-[#b8e04d] transition-colors"
                          >
                            Generate
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* NEWS TAB */}
                  {activeTab === 'news' && (
                    <motion.div
                      key="news"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-[#d0ff59]" />
                          Related News
                        </h3>
                        <button
                          onClick={() => loadNews(selectedChapter)}
                          disabled={isLoadingNews}
                          className="text-xs text-white/40 hover:text-white transition-colors"
                        >
                          {isLoadingNews ? 'Loading...' : 'Refresh'}
                        </button>
                      </div>

                      {isLoadingNews ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 text-[#d0ff59] animate-spin mb-3" />
                          <p className="text-white/50 text-sm">Finding news...</p>
                        </div>
                      ) : newsArticles.length > 0 ? (
                        <div className="space-y-4">
                          {newsArticles.map((article, index) => (
                            <motion.a
                              key={index}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#d0ff59]/30 transition-all group"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-3 h-3 text-[#d0ff59]" />
                                <span className="text-white/40 text-xs">{article.date}</span>
                                <span className="text-white/30 text-xs">• {article.source}</span>
                              </div>
                              <h4 className="text-white text-sm font-medium mb-2 group-hover:text-[#d0ff59] transition-colors flex items-center gap-2">
                                {article.title}
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </h4>
                              <p className="text-white/50 text-xs mb-2 line-clamp-2">{article.description}</p>
                              <p className="text-[#d0ff59]/70 text-xs">{article.connection}</p>
                            </motion.a>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Newspaper className="w-12 h-12 text-white/10 mx-auto mb-3" />
                          <p className="text-white/40 text-sm">Click "Refresh" to find news</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* CHAT TAB */}
                  {activeTab === 'chat' && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full flex flex-col"
                    >
                      <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                        <MessageCircle className="w-4 h-4 text-[#d0ff59]" />
                        Ask AI
                      </h3>

                      <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto mb-4 space-y-3">
                        {chatMessages.length === 0 ? (
                          <div className="text-center py-8">
                            <MessageCircle className="w-10 h-10 text-white/10 mx-auto mb-3" />
                            <p className="text-white/40 text-sm mb-4">Ask anything about this chapter</p>
                            <div className="flex flex-wrap justify-center gap-2">
                              {['Explain the main concept', 'Give me an example', 'Break this down simply'].map((q, i) => (
                                <button
                                  key={i}
                                  onClick={() => setChatInput(q)}
                                  className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 hover:text-white transition-colors"
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          chatMessages.map((msg, i) => (
                            <div
                              key={i}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                                  msg.role === 'user'
                                    ? 'bg-[#d0ff59] text-black'
                                    : 'bg-white/10 text-white'
                                }`}
                              >
                                {msg.content}
                              </div>
                            </div>
                          ))
                        )}
                        {isChatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                              <Loader2 className="w-3 h-3 text-white/60 animate-spin" />
                              <span className="text-white/60 text-xs">Thinking...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask a question..."
                          className="flex-1 bg-white/5 border-white/10 text-white text-sm placeholder:text-white/40"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim() || isChatLoading}
                          className="bg-[#d0ff59] text-black hover:bg-[#b8e04d] disabled:opacity-50 px-3"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* DIALECTIC TAB */}
                  {activeTab === 'dialectic' && (
                    <motion.div
                      key="dialectic"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          <Scale className="w-4 h-4 text-[#d0ff59]" />
                          Dialectical Analysis
                        </h3>
                        <button
                          onClick={() => selectedChapter && loadDialectic(selectedChapter)}
                          disabled={isLoadingDialectic}
                          className="text-xs text-white/40 hover:text-white transition-colors"
                        >
                          {isLoadingDialectic ? 'Analyzing...' : dialecticAnalysis ? 'Regenerate' : 'Analyze'}
                        </button>
                      </div>

                      {isLoadingDialectic ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 text-[#d0ff59] animate-spin mb-3" />
                          <p className="text-white/50 text-sm">Engaging with competing ideas...</p>
                        </div>
                      ) : dialecticAnalysis ? (
                        <div className="space-y-4">
                          {/* THESIS */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              <h4 className="text-emerald-400 font-semibold">The Thesis</h4>
                            </div>
                            <p className="text-white/80 text-sm mb-3">{dialecticAnalysis.thesis.statement}</p>
                            <div className="space-y-2">
                              <p className="text-white/50 text-xs uppercase tracking-wider">Key Arguments</p>
                              {dialecticAnalysis.thesis.keyArguments.map((arg: string, i: number) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                                  <p className="text-white/60 text-sm">{arg}</p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 p-3 rounded-lg bg-black/30">
                              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Evidence from Text</p>
                              <p className="text-white/50 text-sm italic">"{dialecticAnalysis.thesis.evidenceFromText}"</p>
                            </div>
                          </div>

                          {/* ANTITHESIS */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/30">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-5 h-5 text-rose-400" />
                              <h4 className="text-rose-400 font-semibold">The Antithesis: Competing Views</h4>
                            </div>
                            
                            {dialecticAnalysis.antithesis.historicalCritics.length > 0 && (
                              <div className="mb-4">
                                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Historical Critics</p>
                                {dialecticAnalysis.antithesis.historicalCritics.map((critic: any, i: number) => (
                                  <div key={i} className="mb-3 p-3 rounded-lg bg-black/30">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-rose-300 text-sm font-medium">{critic.thinker}</span>
                                      <span className="text-white/40 text-xs">({critic.era})</span>
                                    </div>
                                    <p className="text-white/60 text-sm">{critic.critique}</p>
                                    {critic.keyWork && (
                                      <p className="text-white/40 text-xs mt-1 italic">— {critic.keyWork}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {dialecticAnalysis.antithesis.modernCritics.length > 0 && (
                              <div className="mb-4">
                                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Modern Critics</p>
                                {dialecticAnalysis.antithesis.modernCritics.map((critic: any, i: number) => (
                                  <div key={i} className="mb-3 p-3 rounded-lg bg-black/30">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-rose-300 text-sm font-medium">{critic.thinker}</span>
                                      <span className="text-white/40 text-xs">({critic.era})</span>
                                    </div>
                                    <p className="text-white/60 text-sm">{critic.critique}</p>
                                    {critic.keyWork && (
                                      <p className="text-white/40 text-xs mt-1 italic">— {critic.keyWork}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {dialecticAnalysis.antithesis.contemporaryDebates.length > 0 && (
                              <div>
                                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Contemporary Debates</p>
                                {dialecticAnalysis.antithesis.contemporaryDebates.map((debate: any, i: number) => (
                                  <div key={i} className="mb-2 p-3 rounded-lg bg-black/30">
                                    <p className="text-rose-300 text-sm font-medium mb-1">{debate.topic}</p>
                                    <p className="text-white/60 text-sm">{debate.modernContext}</p>
                                    <p className="text-white/40 text-xs mt-1">{debate.currentRelevance}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* SYNTHESIS */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/30">
                            <div className="flex items-center gap-2 mb-3">
                              <ArrowRightLeft className="w-5 h-5 text-violet-400" />
                              <h4 className="text-violet-400 font-semibold">The Synthesis: Nuanced Truth</h4>
                            </div>
                            <p className="text-white/80 text-sm mb-4">{dialecticAnalysis.synthesis.nuancedPosition}</p>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2">When Thesis Holds</p>
                                <ul className="space-y-1">
                                  {dialecticAnalysis.synthesis.conditionsWhereThesisHolds.map((cond: string, i: number) => (
                                    <li key={i} className="text-white/60 text-xs flex items-start gap-1.5">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                      {cond}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                <p className="text-rose-400 text-xs uppercase tracking-wider mb-2">When Critics Are Right</p>
                                <ul className="space-y-1">
                                  {dialecticAnalysis.synthesis.conditionsWhereCriticsAreRight.map((cond: string, i: number) => (
                                    <li key={i} className="text-white/60 text-xs flex items-start gap-1.5">
                                      <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" />
                                      {cond}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                              <p className="text-violet-400 text-xs uppercase tracking-wider mb-1">Modern Perspective</p>
                              <p className="text-white/70 text-sm">{dialecticAnalysis.synthesis.modernPerspective}</p>
                            </div>
                          </div>

                          {/* IMPLICATIONS */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30">
                            <div className="flex items-center gap-2 mb-3">
                              <Lightbulb className="w-5 h-5 text-amber-400" />
                              <h4 className="text-amber-400 font-semibold">Implications</h4>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2">If Thesis is True</p>
                                <div className="space-y-2">
                                  {dialecticAnalysis.implications.ifThesisTrue.map((imp: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/30">
                                      <div>
                                        <p className="text-white/70 text-sm">{imp.domain}</p>
                                        <p className="text-white/50 text-xs">{imp.consequence}</p>
                                      </div>
                                      <Badge className={`text-xs border-0 ${
                                        imp.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                        imp.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-blue-500/20 text-blue-400'
                                      }`}>
                                        {imp.severity}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="text-rose-400 text-xs uppercase tracking-wider mb-2">If Critics Are Right</p>
                                <div className="space-y-2">
                                  {dialecticAnalysis.implications.ifCriticsRight.map((imp: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/30">
                                      <div>
                                        <p className="text-white/70 text-sm">{imp.domain}</p>
                                        <p className="text-white/50 text-xs">{imp.consequence}</p>
                                      </div>
                                      <Badge className={`text-xs border-0 ${
                                        imp.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                        imp.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-blue-500/20 text-blue-400'
                                      }`}>
                                        {imp.severity}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="text-amber-400 text-xs uppercase tracking-wider mb-2">Real-World Examples</p>
                                <div className="space-y-2">
                                  {dialecticAnalysis.implications.realWorldExamples.map((ex: any, i: number) => (
                                    <div key={i} className="p-3 rounded-lg bg-black/30">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                          ex.supports === 'thesis' ? 'bg-emerald-500/20 text-emerald-400' :
                                          ex.supports === 'critics' ? 'bg-rose-500/20 text-rose-400' :
                                          'bg-violet-500/20 text-violet-400'
                                        }`}>
                                          {ex.supports === 'thesis' ? 'Supports Thesis' :
                                           ex.supports === 'critics' ? 'Supports Critics' : 'Nuanced'}
                                        </span>
                                        {ex.year && <span className="text-white/40 text-xs">{ex.year}</span>}
                                      </div>
                                      <p className="text-white/70 text-sm font-medium">{ex.example}</p>
                                      <p className="text-white/50 text-xs mt-1">{ex.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Scale className="w-12 h-12 text-white/10 mx-auto mb-3" />
                          <p className="text-white/40 text-sm mb-4">Generate dialectical analysis</p>
                          <button
                            onClick={() => selectedChapter && loadDialectic(selectedChapter)}
                            className="px-4 py-2 rounded-lg bg-[#d0ff59] text-black text-sm font-medium hover:bg-[#b8e04d] transition-colors"
                          >
                            Analyze
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
