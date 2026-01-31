import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, AlertCircle, Loader2, BookOpen, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useBookProcessor } from '@/hooks/useBookProcessor';
import { BookViewer } from '@/components/BookViewer';
import { Library as LibraryComponent } from '@/components/Library';
import type { Book } from '@/types';

export function BookUpload() {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
  const [libraryOpen, setLibraryOpen] = useState(false);
  
  const { book, progress, isProcessing, error: processError, processBook, setBookDirectly, resetBook } = useBookProcessor();
  
  const handleFileSelect = useCallback((file: File) => {
    processBook(file);
  }, [processBook]);

  const handleLibraryBookSelect = useCallback((selectedBook: Book) => {
    // Set the book directly since library books are already processed
    setBookDirectly(selectedBook);
  }, [setBookDirectly]);

  const {
    isDragging,
    error: uploadError,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,
    clearError,
    reset
  } = useFileUpload(handleFileSelect);

  const error = uploadError || processError;

  const handleReset = () => {
    resetBook();
    reset();
  };

  // If we have a processed book, show the viewer
  if (book) {
    return <BookViewer book={book} onReset={handleReset} />;
  }

  return (
    <section id="upload" className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#d0ff59]/5 blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[#d0ff59]/10 text-[#d0ff59] text-sm font-medium mb-4">
            Start Learning
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Path
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Upload your own book or explore our curated library across different categories.
          </p>
        </motion.div>

        {/* Tab Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-white/5 rounded-full p-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all
                ${activeTab === 'upload'
                  ? 'bg-[#d0ff59] text-black'
                  : 'text-white/60 hover:text-white'
                }
              `}
            >
              <Upload className="w-4 h-4" />
              Upload Your Book
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all
                ${activeTab === 'library'
                  ? 'bg-[#d0ff59] text-black'
                  : 'text-white/60 hover:text-white'
                }
              `}
            >
              <Library className="w-4 h-4" />
              Browse Library
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {!isProcessing ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300
                      ${isDragging 
                        ? 'border-[#d0ff59] bg-[#d0ff59]/10' 
                        : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/[0.07]'
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept=".pdf,.epub,.txt"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-input"
                    />
                    
                    <motion.div
                      animate={{ 
                        y: isDragging ? -10 : 0,
                        scale: isDragging ? 1.05 : 1
                      }}
                      transition={{ duration: 0.2 }}
                      className="mb-6"
                    >
                      <div className={`
                        w-20 h-20 rounded-2xl mx-auto flex items-center justify-center transition-colors
                        ${isDragging ? 'bg-[#d0ff59]' : 'bg-white/10'}
                      `}>
                        <Upload className={`w-10 h-10 ${isDragging ? 'text-black' : 'text-white'}`} />
                      </div>
                    </motion.div>

                    <h3 className="text-xl font-semibold text-white mb-2">
                      {isDragging ? 'Drop your book here' : 'Drag & drop your book'}
                    </h3>
                    <p className="text-white/50 mb-6">
                      or{' '}
                      <label 
                        htmlFor="file-input" 
                        className="text-[#d0ff59] hover:underline cursor-pointer"
                      >
                        browse files
                      </label>
                    </p>

                    <div className="flex items-center justify-center gap-4 text-sm text-white/40">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        PDF
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        EPUB
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        TXT
                      </span>
                    </div>

                    <p className="text-white/30 text-xs mt-4">
                      Maximum file size: 50MB
                    </p>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                        <button 
                          onClick={clearError}
                          className="ml-auto text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center"
                >
                  {/* Processing Animation */}
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-[#d0ff59]/20"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#d0ff59]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-[#d0ff59] animate-spin" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {progress.message}
                  </h3>
                  <p className="text-white/50 mb-8">
                    Our AI is analyzing your book. This may take a moment...
                  </p>

                  {/* Progress Bar */}
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-white/40 mb-2">
                      <span>Progress</span>
                      <span>{progress.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#d0ff59] to-[#b8e04d]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Stage Indicators */}
                  <div className="flex justify-center gap-2 mt-8">
                    {['extracting', 'analyzing', 'summarizing', 'complete'].map((stage, index) => {
                      const isActive = progress.stage === stage || 
                        (progress.stage === 'complete' && stage === 'complete');
                      const isPast = ['extracting', 'analyzing', 'summarizing', 'complete'].indexOf(progress.stage) > index;
                      
                      return (
                        <motion.div
                          key={stage}
                          className={`
                            w-3 h-3 rounded-full transition-colors
                            ${isActive ? 'bg-[#d0ff59]' : isPast ? 'bg-[#d0ff59]/50' : 'bg-white/20'}
                          `}
                          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="mb-6"
              >
                <div className="w-20 h-20 rounded-2xl mx-auto bg-[#d0ff59]/10 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-[#d0ff59]" />
                </div>
              </motion.div>

              <h3 className="text-xl font-semibold text-white mb-2">
                Curated Library
              </h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Explore our collection of books across 7 categories including Physics, Philosophy, Economics, Psychology, Technology, History, and Biology.
              </p>

              {/* Category Preview */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {['⚛️ Physics', '🤔 Philosophy', '📈 Economics', '🧠 Psychology', '💻 Technology', '🏛️ History', '🧬 Biology'].map((cat) => (
                  <span 
                    key={cat}
                    className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <Button
                onClick={() => setLibraryOpen(true)}
                className="bg-[#d0ff59] text-black hover:bg-[#b8e04d] font-semibold px-8"
              >
                <Library className="w-4 h-4 mr-2" />
                Browse Library
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Library Modal */}
      <AnimatePresence>
        {libraryOpen && (
          <LibraryComponent 
            onSelectBook={handleLibraryBookSelect}
            onClose={() => setLibraryOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
