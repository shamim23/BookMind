import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  X, 
  Minus, 
  Plus, 
  Settings2,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Sparkles,
  Brain,
  Newspaper
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sampleBooks, convertToFullBook } from '@/data/sampleBooks';
import { generateInsights, generateFirstPrinciples } from '@/services/openai';
import { findRelevantNews } from '@/services/newsApi';

// Optimal recognition point (ORP) calculation
const calculateORP = (word: string): number => {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return Math.floor(length * 0.35);
  if (length <= 9) return Math.floor(length * 0.3);
  return Math.floor(length * 0.25);
};

// Parse text into words
const parseWords = (text: string): string[] => {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
};

// Calculate display time for each word
const calculateWordDelay = (word: string, baseWPM: number): number => {
  const baseDelay = (60 / baseWPM) * 1000;
  let multiplier = 1;
  const length = word.length;
  
  if (length <= 2) multiplier = 0.8;
  else if (length <= 4) multiplier = 1;
  else if (length <= 6) multiplier = 1.1;
  else if (length <= 8) multiplier = 1.2;
  else if (length <= 10) multiplier = 1.3;
  else multiplier = 1.4;
  
  if (/[.!?]$/.test(word)) multiplier *= 2.5;
  else if (/[,;:]$/.test(word)) multiplier *= 1.5;
  else if (/[—-]$/.test(word)) multiplier *= 1.3;
  
  return baseDelay * multiplier;
};

export default function PowerReaderPage() {
  // Book selection
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  
  // Get selected book data
  const selectedBook = selectedBookId ? sampleBooks.find(b => b.id === selectedBookId) : null;
  const fullBook = selectedBook ? convertToFullBook(selectedBook) : null;
  const currentChapter = fullBook?.chapters[selectedChapterIndex];
  
  // Reader state
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);
  const [showSettings, setShowSettings] = useState(false);
  const [wordsPerDisplay, setWordsPerDisplay] = useState(1);
  const [fontSize, setFontSize] = useState(48);
  const [progress, setProgress] = useState(0);
  
  // AI-generated content
  const [insights, setInsights] = useState<any[]>([]);
  const [firstPrinciples, setFirstPrinciples] = useState<any>(null);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [activePanel, setActivePanel] = useState<'none' | 'insights' | 'principles' | 'news'>('none');
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parse chapter content when chapter changes
  useEffect(() => {
    if (currentChapter) {
      const parsedWords = parseWords(currentChapter.content);
      setWords(parsedWords);
      setCurrentIndex(0);
      setProgress(0);
      setIsPlaying(false);
      
      // Load AI content
      loadAIContent();
    }
  }, [currentChapter]);

  // Load AI-generated content
  const loadAIContent = async () => {
    if (!currentChapter) return;
    
    setIsGeneratingInsights(true);
    
    try {
      // Generate insights
      const insightsData = await generateInsights(
        currentChapter.title,
        currentChapter.content,
        currentChapter.summary || ''
      );
      setInsights(insightsData);
      
      // Find relevant news
      const newsData = await findRelevantNews(currentChapter.title, currentChapter.content);
      setNewsArticles(newsData);
    } catch (error) {
      console.error('Failed to load AI content:', error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Generate first principles on demand
  const handleGenerateFirstPrinciples = async () => {
    if (!currentChapter) return;
    
    setIsGeneratingInsights(true);
    try {
      const principles = await generateFirstPrinciples(
        currentChapter.title,
        currentChapter.content,
        currentChapter.title
      );
      setFirstPrinciples(principles);
      setActivePanel('principles');
    } catch (error) {
      console.error('Failed to generate first principles:', error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && currentIndex < words.length) {
      const currentWord = words[currentIndex];
      const delay = calculateWordDelay(currentWord, wpm);
      
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => {
          const next = prev + wordsPerDisplay;
          if (next >= words.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, delay);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentIndex, words, wpm, wordsPerDisplay]);

  // Update progress
  useEffect(() => {
    if (words.length > 0) {
      setProgress((currentIndex / words.length) * 100);
    }
  }, [currentIndex, words.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentChapter) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          goBack();
          break;
        case 'ArrowRight':
          goForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          increaseSpeed();
          break;
        case 'ArrowDown':
          e.preventDefault();
          decreaseSpeed();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentIndex, wpm, currentChapter]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const goBack = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.max(0, prev - wordsPerDisplay * 5));
  }, [wordsPerDisplay]);

  const goForward = useCallback(() => {
    setCurrentIndex(prev => Math.min(words.length - 1, prev + wordsPerDisplay * 5));
  }, [words.length, wordsPerDisplay]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const increaseSpeed = useCallback(() => {
    setWpm(prev => Math.min(1000, prev + 50));
  }, []);

  const decreaseSpeed = useCallback(() => {
    setWpm(prev => Math.max(100, prev - 50));
  }, []);

  const getCurrentDisplay = () => {
    const displayWords = [];
    for (let i = 0; i < wordsPerDisplay && currentIndex + i < words.length; i++) {
      displayWords.push(words[currentIndex + i]);
    }
    return displayWords.join(' ');
  };

  const currentDisplay = getCurrentDisplay();
  const orpIndex = calculateORP(currentDisplay);

  // Book selection view
  if (!selectedBookId) {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#d0ff59] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">BookMind AI</span>
            </a>
            <a href="/" className="text-white/60 hover:text-white text-sm">
              Back to Home
            </a>
          </div>
        </header>

        {/* Book Selection */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Power Reader
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Select a book to start speed reading with AI-powered insights and analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBookId(book.id)}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${book.coverColor} rounded-2xl p-6 h-full transition-transform hover:scale-[1.02]`}>
                  <span className="inline-block px-3 py-1 rounded-full bg-black/30 text-white text-xs mb-4">
                    {book.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
                  <p className="text-white/80 text-sm mb-4">by {book.author}</p>
                  <p className="text-white/60 text-sm line-clamp-2">{book.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-white/50 text-xs">
                    <span>{book.estimatedReadTime}</span>
                    <span>{book.difficulty}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Chapter selection view
  if (selectedBookId && !currentChapter) {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button 
              onClick={() => setSelectedBookId(null)}
              className="flex items-center gap-2 text-white/60 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Books
            </button>
            <span className="text-white font-medium">{selectedBook?.title}</span>
          </div>
        </header>

        {/* Chapter Selection */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-4">
              Select a Chapter
            </h1>
            <p className="text-white/60">
              Choose which chapter to read with the Power Reader
            </p>
          </div>

          <div className="space-y-4">
            {fullBook?.chapters.map((chapter, index) => (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedChapterIndex(index)}
                className="w-full text-left bg-white/5 hover:bg-white/10 rounded-xl p-5 border border-white/10 hover:border-[#d0ff59]/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-lg bg-[#d0ff59]/20 flex items-center justify-center text-[#d0ff59] font-bold">
                    {chapter.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{chapter.title}</h3>
                    <p className="text-white/50 text-sm mt-1">{chapter.keyPoints.length} key points</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </div>
              </motion.button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Power Reader View
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedChapterIndex(0)}
            className="text-white/60 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <h2 className="text-white font-medium text-sm">{selectedBook?.title}</h2>
            <p className="text-white/40 text-xs">
              Ch. {currentChapter?.number}: {currentChapter?.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Tools */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setActivePanel(activePanel === 'insights' ? 'none' : 'insights')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activePanel === 'insights' ? 'bg-[#d0ff59] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Insights
            </button>
            <button
              onClick={handleGenerateFirstPrinciples}
              disabled={isGeneratingInsights}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 text-sm transition-colors disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              First Principles
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'news' ? 'none' : 'news')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activePanel === 'news' ? 'bg-[#d0ff59] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              News
            </button>
          </div>

          <div className="h-6 w-px bg-white/20 hidden sm:block" />

          {/* WPM Control */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <button
              onClick={decreaseSpeed}
              className="h-6 w-6 text-white/60 hover:text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-white font-mono text-sm w-14 text-center">{wpm} WPM</span>
            <button
              onClick={increaseSpeed}
              className="h-6 w-6 text-white/60 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg ${showSettings ? 'bg-white/10' : ''} text-white/60 hover:text-white`}
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Reading Area */}
        <main 
          className="flex-1 flex items-center justify-center relative cursor-pointer"
          onClick={togglePlay}
        >
          {/* Focus Guides */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-px h-32 bg-[#d0ff59]/20" />
            <div className="absolute w-3 h-3 rounded-full bg-[#d0ff59]/30 -translate-x-1/2" 
              style={{ 
                marginLeft: `${(orpIndex / Math.max(1, currentDisplay.length)) * 20 - 10}ch`,
                marginTop: '3rem'
              }} 
            />
          </div>

          {/* Word Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.08 }}
              className="text-center px-8"
              style={{ fontSize: `${fontSize}px` }}
            >
              <span className="text-white font-medium tracking-wide">
                {currentDisplay.split('').map((char, i) => (
                  <span
                    key={i}
                    className={i === orpIndex ? 'text-[#d0ff59]' : ''}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Play/Pause Hint */}
          {!isPlaying && currentIndex < words.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-32 text-white/30 text-sm"
            >
              Click anywhere or press Space to {currentIndex === 0 ? 'start' : 'resume'}
            </motion.div>
          )}
        </main>

        {/* AI Panel Sidebar */}
        <AnimatePresence>
          {activePanel !== 'none' && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 bg-black/95 border-l border-white/10 flex flex-col"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  {activePanel === 'insights' && <><Sparkles className="w-4 h-4 text-[#d0ff59]" /> Insights</>}
                  {activePanel === 'principles' && <><Brain className="w-4 h-4 text-[#d0ff59]" /> First Principles</>}
                  {activePanel === 'news' && <><Newspaper className="w-4 h-4 text-[#d0ff59]" /> Related News</>}
                </h3>
                <button
                  onClick={() => setActivePanel('none')}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel Content */}
              <ScrollArea className="flex-1 p-4">
                {isGeneratingInsights ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-[#d0ff59]/30 border-t-[#d0ff59] rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Insights Panel */}
                    {activePanel === 'insights' && (
                      <div className="space-y-4">
                        {insights.length > 0 ? (
                          insights.map((insight, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-4">
                              <h4 className="font-semibold text-white mb-2">{insight.title}</h4>
                              <p className="text-white/70 text-sm mb-2">{insight.summary}</p>
                              <div className="border-t border-white/10 pt-2 mt-2">
                                <p className="text-white/50 text-xs mb-1">
                                  <span className="text-[#d0ff59]">Evidence:</span> {insight.evidence}
                                </p>
                                <p className="text-white/50 text-xs">
                                  <span className="text-[#d0ff59]">Implication:</span> {insight.implication}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-white/50 text-center py-8">No insights available</p>
                        )}
                      </div>
                    )}

                    {/* First Principles Panel */}
                    {activePanel === 'principles' && firstPrinciples && (
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4">
                          <h4 className="font-semibold text-white mb-2">{firstPrinciples.principle}</h4>
                          <p className="text-white/70 text-sm mb-4">{firstPrinciples.explanation}</p>
                          <h5 className="text-sm font-medium text-white/80 mb-2">Breakdown:</h5>
                          <ol className="space-y-2">
                            {firstPrinciples.breakdown.map((step: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                                <span className="text-[#d0ff59] font-medium">{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}

                    {/* News Panel */}
                    {activePanel === 'news' && (
                      <div className="space-y-4">
                        {newsArticles.length > 0 ? (
                          newsArticles.map((article, i) => (
                            <a
                              key={i}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-[#d0ff59]">{article.date}</span>
                                <span className="text-xs text-white/40">• {article.source}</span>
                              </div>
                              <h4 className="font-medium text-white mb-2">{article.title}</h4>
                              <p className="text-white/60 text-sm mb-2">{article.description}</p>
                              <p className="text-white/40 text-xs">{article.connection}</p>
                            </a>
                          ))
                        ) : (
                          <p className="text-white/50 text-center py-8">No news articles found</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10">
        <motion.div
          className="h-full bg-[#d0ff59]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <footer className="px-6 py-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={goBack}
            className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[#d0ff59] hover:bg-[#b8e04d] text-black flex items-center justify-center"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <button
            onClick={goForward}
            className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="w-px h-8 bg-white/20 mx-2" />

          <span className="text-white/40 text-sm font-mono">{Math.round(progress)}%</span>
        </div>

        {/* Keyboard shortcuts */}
        <div className="flex items-center justify-center gap-6 mt-4 text-white/30 text-xs">
          <span>Space: Play/Pause</span>
          <span>← →: Navigate</span>
          <span>↑ ↓: Speed</span>
        </div>
      </footer>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 right-6 w-80 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-50"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Reader Settings
            </h3>

            <div className="mb-6">
              <label className="text-white/60 text-sm mb-2 block flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Words per flash
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWordsPerDisplay(Math.max(1, wordsPerDisplay - 1))}
                  className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-mono w-8 text-center">{wordsPerDisplay}</span>
                <button
                  onClick={() => setWordsPerDisplay(Math.min(5, wordsPerDisplay + 1))}
                  className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-white/60 text-sm mb-2 block">Font size</label>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={24}
                max={96}
                step={4}
                className="w-full"
              />
              <div className="flex justify-between text-white/40 text-xs mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              {[200, 300, 400, 500].map(speed => (
                <button
                  key={speed}
                  onClick={() => setWpm(speed)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    wpm === speed 
                      ? 'bg-[#d0ff59] text-black' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
