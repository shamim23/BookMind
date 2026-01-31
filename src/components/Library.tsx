import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Clock, 
  BarChart3, 
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categories, sampleBooks, convertToFullBook } from '@/data/sampleBooks';
import type { Book } from '@/types';

interface LibraryProps {
  onSelectBook: (book: Book) => void;
  onClose: () => void;
}

export function Library({ onSelectBook, onClose }: LibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const filteredBooks = sampleBooks.filter(book => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectBook = (bookId: string) => {
    const sampleBook = sampleBooks.find(b => b.id === bookId);
    if (sampleBook) {
      const fullBook = convertToFullBook(sampleBook);
      onSelectBook(fullBook);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              <X className="w-5 h-5 mr-2" />
              Close
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#d0ff59]" />
              <span className="text-white font-medium">Library</span>
            </div>
          </div>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 max-w-md flex-1 mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search books, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="text-white/40 text-sm">
            {filteredBooks.length} books
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <ScrollArea className="w-full border-t border-white/10">
          <div className="flex gap-2 px-4 py-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${selectedCategory === category.id
                    ? 'bg-[#d0ff59] text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-140px)] overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Section Title */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {selectedCategory === 'all' ? 'All Books' : 
                  categories.find(c => c.id === selectedCategory)?.name}
              </h1>
              <p className="text-white/60">
                Select a book to analyze with AI-powered chapter breakdowns and concept extraction.
              </p>
            </div>

            {/* Books Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div 
                      onClick={() => setSelectedBook(selectedBook === book.id ? null : book.id)}
                      className={`
                        relative bg-gradient-to-br ${book.coverColor} rounded-2xl p-6 cursor-pointer
                        transition-all duration-300 h-full flex flex-col
                        ${selectedBook === book.id 
                          ? 'ring-2 ring-[#d0ff59] scale-[1.02]' 
                          : 'hover:scale-[1.02] hover:shadow-2xl'
                        }
                      `}
                    >
                      {/* Book Cover Content */}
                      <div className="flex-1">
                        {/* Category Badge */}
                        <Badge 
                          variant="secondary" 
                          className="mb-4 bg-black/30 text-white border-0"
                        >
                          {categories.find(c => c.id === book.category)?.icon} {' '}
                          {categories.find(c => c.id === book.category)?.name}
                        </Badge>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                          {book.title}
                        </h3>

                        {/* Author */}
                        <p className="text-white/80 text-sm mb-4">
                          by {book.author}
                        </p>

                        {/* Description */}
                        <p className="text-white/70 text-sm line-clamp-3 mb-4">
                          {book.description}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-white/60 text-xs mt-auto">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {book.estimatedReadTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {book.difficulty}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className={`
                        absolute inset-0 bg-black/80 rounded-2xl flex items-center justify-center
                        transition-opacity duration-300
                        ${selectedBook === book.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                      `}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectBook(book.id);
                          }}
                          className="bg-[#d0ff59] text-black hover:bg-[#b8e04d] font-semibold"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analyze Book
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No books found
                </h3>
                <p className="text-white/60">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </motion.div>
  );
}
