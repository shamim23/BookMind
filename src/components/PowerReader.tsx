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
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { Chapter } from '@/types';

interface PowerReaderProps {
  chapter: Chapter;
  onClose: () => void;
}

// Optimal recognition point (ORP) - where the eye focuses
// For most words, it's around 30-35% from the start
const calculateORP = (word: string): number => {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return Math.floor(length * 0.35);
  if (length <= 9) return Math.floor(length * 0.3);
  return Math.floor(length * 0.25);
};

// Parse text into words with timing
const parseWords = (text: string): string[] => {
  // Clean the text and split into words
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
};

// Calculate display time for each word (in ms)
// Longer words and punctuation get more time
const calculateWordDelay = (word: string, baseWPM: number): number => {
  const baseDelay = (60 / baseWPM) * 1000; // ms per word at given WPM
  
  // Adjust for word length
  let multiplier = 1;
  const length = word.length;
  
  if (length <= 2) multiplier = 0.8;
  else if (length <= 4) multiplier = 1;
  else if (length <= 6) multiplier = 1.1;
  else if (length <= 8) multiplier = 1.2;
  else if (length <= 10) multiplier = 1.3;
  else multiplier = 1.4;
  
  // Punctuation pauses
  if (/[.!?]$/.test(word)) multiplier *= 2.5; // End of sentence
  else if (/[,;:]$/.test(word)) multiplier *= 1.5; // Mid-sentence pause
  else if (/[—-]$/.test(word)) multiplier *= 1.3; // Dash/em-dash
  
  // Paragraph breaks (detected as empty or very short tokens)
  if (word === '\n\n' || word === '¶') multiplier *= 3;
  
  return baseDelay * multiplier;
};

export function PowerReader({ chapter, onClose }: PowerReaderProps) {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);
  const [showSettings, setShowSettings] = useState(false);
  const [wordsPerDisplay, setWordsPerDisplay] = useState(1);
  const [fontSize, setFontSize] = useState(48);
  const [progress, setProgress] = useState(0);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse chapter content into words
  useEffect(() => {
    const parsedWords = parseWords(chapter.content);
    setWords(parsedWords);
    setCurrentIndex(0);
    setProgress(0);
  }, [chapter]);

  // Calculate progress
  useEffect(() => {
    if (words.length > 0) {
      setProgress((currentIndex / words.length) * 100);
    }
  }, [currentIndex, words.length]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        case 'Escape':
          onClose();
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
  }, [isPlaying, currentIndex, wpm]);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <X className="w-5 h-5 mr-2" />
            Exit Reader
          </Button>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <h2 className="text-white font-medium text-sm">{chapter.title}</h2>
            <p className="text-white/40 text-xs">
              Word {currentIndex + 1} of {words.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* WPM Display */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={decreaseSpeed}
              className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/10"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-white font-mono text-sm w-16 text-center">
              {wpm} WPM
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={increaseSpeed}
              className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className={`text-white/60 hover:text-white ${showSettings ? 'bg-white/10' : ''}`}
          >
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Reading Area */}
      <main 
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative"
        onClick={togglePlay}
      >
        {/* Focus Guides */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Center line */}
          <div className="absolute w-px h-32 bg-[#d0ff59]/20" />
          {/* ORP marker */}
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

        {/* Click to play hint */}
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

      {/* Progress Bar */}
      <div className="h-1 bg-white/10">
        <motion.div
          className="h-full bg-[#d0ff59]"
          style={{ width: `${progress}%` }}
          layoutId="progress"
        />
      </div>

      {/* Controls */}
      <footer className="px-6 py-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[#d0ff59] hover:bg-[#b8e04d] text-black flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goForward}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <div className="w-px h-8 bg-white/20 mx-2" />

          <div className="text-white/40 text-sm font-mono">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="flex items-center justify-center gap-6 mt-4 text-white/30 text-xs">
          <span>Space: Play/Pause</span>
          <span>← →: Navigate</span>
          <span>↑ ↓: Speed</span>
          <span>Esc: Exit</span>
        </div>
      </footer>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 right-6 w-80 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Reader Settings
            </h3>

            {/* Words per display */}
            <div className="mb-6">
              <label className="text-white/60 text-sm mb-2 block flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Words per flash
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setWordsPerDisplay(Math.max(1, wordsPerDisplay - 1))}
                  className="text-white/60 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-white font-mono w-8 text-center">{wordsPerDisplay}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setWordsPerDisplay(Math.min(5, wordsPerDisplay + 1))}
                  className="text-white/60 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Font size */}
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

            {/* Speed preset buttons */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[200, 300, 400, 500].map(speed => (
                <Button
                  key={speed}
                  variant={wpm === speed ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setWpm(speed)}
                  className={wpm === speed 
                    ? 'bg-[#d0ff59] text-black hover:bg-[#b8e04d]' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                >
                  {speed}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
