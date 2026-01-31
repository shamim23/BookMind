import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronLeft, 
  Lightbulb, 
  List, 
  Download,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Book, Chapter, Concept } from '@/types';
import { PowerReader } from './PowerReader';
import { EnhancedChapterView } from './EnhancedChapterView';

interface BookViewerProps {
  book: Book;
  onReset: () => void;
}

export function BookViewer({ book, onReset }: BookViewerProps) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(book.chapters[0] || null);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [powerReaderOpen, setPowerReaderOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-white/60 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#d0ff59]" />
              <span className="text-white font-medium truncate max-w-[200px] sm:max-w-md">
                {book.title}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-white/60 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute lg:relative z-30 w-80 h-full bg-black border-r border-white/10"
            >
              <Tabs defaultValue="chapters" className="h-full flex flex-col">
                <TabsList className="w-full bg-white/5 p-1 mx-4 mt-4 mb-2">
                  <TabsTrigger value="chapters" className="flex-1 data-[state=active]:bg-[#d0ff59] data-[state=active]:text-black">
                    <List className="w-4 h-4 mr-2" />
                    Chapters
                  </TabsTrigger>
                  <TabsTrigger value="concepts" className="flex-1 data-[state=active]:bg-[#d0ff59] data-[state=active]:text-black">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Concepts
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chapters" className="flex-1 m-0 overflow-hidden">
                  <ScrollArea className="h-full px-4">
                    <div className="space-y-2 pb-4">
                      {book.chapters.map((chapter, index) => (
                        <motion.button
                          key={chapter.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setSelectedChapter(chapter);
                            setSelectedConcept(null);
                          }}
                          className={`
                            w-full text-left p-3 rounded-xl transition-all
                            ${selectedChapter?.id === chapter.id
                              ? 'bg-[#d0ff59]/20 border border-[#d0ff59]/50'
                              : 'bg-white/5 border border-transparent hover:bg-white/10'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`
                              text-xs font-medium px-2 py-1 rounded
                              ${selectedChapter?.id === chapter.id
                                ? 'bg-[#d0ff59] text-black'
                                : 'bg-white/10 text-white/60'
                              }
                            `}>
                              {chapter.number}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className={`
                                text-sm font-medium truncate
                                ${selectedChapter?.id === chapter.id ? 'text-white' : 'text-white/80'}
                              `}>
                                {chapter.title}
                              </h4>
                              <p className="text-xs text-white/40 mt-1">
                                {chapter.keyPoints.length} key points
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="concepts" className="flex-1 m-0 overflow-hidden">
                  <ScrollArea className="h-full px-4">
                    <div className="space-y-2 pb-4">
                      {book.concepts.map((concept, index) => (
                        <motion.button
                          key={concept.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedConcept(concept)}
                          className={`
                            w-full text-left p-3 rounded-xl transition-all
                            ${selectedConcept?.id === concept.id
                              ? 'bg-[#d0ff59]/20 border border-[#d0ff59]/50'
                              : 'bg-white/5 border border-transparent hover:bg-white/10'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className={`
                              text-sm font-medium
                              ${selectedConcept?.id === concept.id ? 'text-white' : 'text-white/80'}
                            `}>
                              {concept.name}
                            </h4>
                            <span className="text-xs text-white/40">
                              {concept.occurrences}x
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto p-6 sm:p-8">
              {selectedConcept ? (
                <ConceptView 
                  concept={selectedConcept} 
                  onBack={() => setSelectedConcept(null)}
                  chapters={book.chapters}
                />
              ) : selectedChapter ? (
                <EnhancedChapterView 
                  chapter={selectedChapter} 
                  onOpenPowerReader={() => setPowerReaderOpen(true)}
                />
              ) : (
                <div className="text-center py-20">
                  <Sparkles className="w-12 h-12 text-[#d0ff59] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Select a Chapter
                  </h3>
                  <p className="text-white/60">
                    Choose a chapter from the sidebar to view its summary and key points.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* Power Reader Modal */}
      <AnimatePresence>
        {powerReaderOpen && selectedChapter && (
          <PowerReader 
            chapter={selectedChapter} 
            onClose={() => setPowerReaderOpen(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ConceptView({ 
  concept, 
  onBack,
  chapters 
}: { 
  concept: Concept; 
  onBack: () => void;
  chapters: Chapter[];
}) {
  const relatedChapters = chapters.filter(ch => concept.chapterIds.includes(ch.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6 text-white/60 hover:text-white"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Chapters
      </Button>

      {/* Concept Header */}
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-[#d0ff59]/10 text-[#d0ff59] text-sm font-medium mb-4">
          Concept
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {concept.name}
        </h1>
        <div className="flex items-center gap-4 text-sm text-white/50">
          <span>Mentioned {concept.occurrences} times</span>
          <span>•</span>
          <span>Appears in {relatedChapters.length} chapters</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white/5 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
        <p className="text-white/70 leading-relaxed">
          {concept.description}
        </p>
      </div>

      {/* Related Chapters */}
      {relatedChapters.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Appears In</h2>
          <div className="space-y-3">
            {relatedChapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-white/10 text-white/60">
                    Ch. {chapter.number}
                  </span>
                  <span className="text-white/80">{chapter.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
