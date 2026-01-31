import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ChevronRight,
  Clock,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { sampleBooks, convertToFullBook, categories } from '@/data/sampleBooks';
import type { Book } from '@/types';
import { Link, useNavigate } from 'react-router-dom';

export default function LibraryPage() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBooks = sampleBooks.filter(book => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectBook = (bookId: string) => {
    const sampleBook = sampleBooks.find(b => b.id === bookId);
    if (sampleBook) {
      const fullBook = convertToFullBook(sampleBook);
      setSelectedBook(fullBook);
    }
  };

  const handleReadChapter = (chapterNumber: number) => {
    if (selectedBook) {
      navigate(`/analyze?book=${selectedBook.id}&chapter=${chapterNumber}`);
    }
  };

  const handleAnalyzeBook = (bookId: string) => {
    navigate(`/analyze?book=${bookId}&chapter=1`);
  };

  // Book Detail View
  if (selectedBook) {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button 
                onClick={() => setSelectedBook(null)}
                className="flex items-center gap-2 text-white/60 hover:text-white"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Back to Library
              </button>
              <span className="text-white font-medium hidden sm:block">{selectedBook.title}</span>
              <Link to="/" className="text-white/60 hover:text-white text-sm">
                Home
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Book Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Book Cover */}
              <div className={`w-full md:w-48 h-64 rounded-2xl bg-gradient-to-br from-[#d0ff59]/20 to-[#d0ff59]/5 border border-[#d0ff59]/20 flex items-center justify-center flex-shrink-0`}>
                <BookOpen className="w-16 h-16 text-[#d0ff59]/40" />
              </div>

              {/* Book Info */}
              <div className="flex-1">
                <Badge className="mb-4 bg-[#d0ff59]/10 text-[#d0ff59] border-0">
                  {categories.find(c => c.id === sampleBooks.find(b => b.id === selectedBook.id)?.category)?.icon} {sampleBooks.find(b => b.id === selectedBook.id)?.category}
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{selectedBook.title}</h1>
                <p className="text-white/60 text-lg mb-4">by {selectedBook.author || 'Unknown'}</p>
                <p className="text-white/50 mb-6">{sampleBooks.find(b => b.id === selectedBook.id)?.description}</p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Clock className="w-4 h-4" />
                    {sampleBooks.find(b => b.id === selectedBook.id)?.estimatedReadTime}
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <BarChart3 className="w-4 h-4" />
                    {sampleBooks.find(b => b.id === selectedBook.id)?.difficulty}
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <BookOpen className="w-4 h-4" />
                    {selectedBook.chapters.length} chapters
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleAnalyzeBook(selectedBook.id)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d0ff59] text-black font-semibold hover:bg-[#b8e04d] transition-colors"
                  >
                    <Sparkles className="w-5 h-5" />
                    Analyze Book
                  </button>
                  <Link
                    to={`/reader?book=${selectedBook.id}&chapter=1`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                  >
                    <Clock className="w-5 h-5" />
                    Power Reader
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chapters List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Chapters</h2>
            <div className="space-y-3">
              {selectedBook.chapters.map((chapter, index) => (
                <motion.button
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleReadChapter(chapter.number)}
                  className="w-full text-left bg-white/5 hover:bg-white/10 rounded-xl p-5 border border-white/10 hover:border-[#d0ff59]/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-lg bg-[#d0ff59]/20 flex items-center justify-center text-[#d0ff59] font-bold text-lg">
                      {chapter.number}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-[#d0ff59] transition-colors">{chapter.title}</h3>
                      <p className="text-white/50 text-sm mt-1">{chapter.content.length.toLocaleString()} words</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-sm hidden sm:inline">Analyze with AI</span>
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#d0ff59] transition-colors" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Library Browse View
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#d0ff59] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">BookMind AI</span>
            </Link>
            <Link to="/" className="text-white/60 hover:text-white text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d0ff59]/10 text-[#d0ff59] text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning Library
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Explore Our Library
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Select a book to dive deep with AI-generated insights, first principles analysis, and real-world connections.
          </motion.p>
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md mx-auto w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder="Search books, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>
          
          {/* Category Pills */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                    ${selectedCategory === cat.id
                      ? 'bg-[#d0ff59] text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => handleSelectBook(book.id)}
              className="group cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${book.coverColor} rounded-2xl p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
                <Badge className="mb-4 bg-black/30 text-white border-0">
                  {categories.find(c => c.id === book.category)?.icon} {book.category}
                </Badge>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{book.title}</h3>
                <p className="text-white/80 text-sm mb-4">by {book.author}</p>
                <p className="text-white/60 text-sm line-clamp-3 mb-4">{book.description}</p>
                <div className="flex items-center gap-4 text-white/50 text-xs mt-auto">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{book.estimatedReadTime}</span>
                  <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{book.difficulty}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
