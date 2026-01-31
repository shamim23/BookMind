import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightLeft, 
  BookOpen, 
  Sparkles, 
  Lightbulb,
  Target,
  Brain,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { findConceptMappings, generateConceptMapping, type ConceptAnalogy } from '@/services/conceptMapping';
import { Link } from 'react-router-dom';

interface CrossDomainMappingProps {
  concept: string;
  sourceBookId: string;
  sourceDomain: string;
  context: string;
  userBookIds: string[];
}

const domainIcons: Record<string, typeof BookOpen> = {
  'Economics': Target,
  'Biology': Brain,
  'Physics': Sparkles,
  'Psychology': Lightbulb,
  'Technology': Sparkles,
  'Computer Science': Sparkles,
  'Philosophy': Brain,
  'History': BookOpen,
  'Urban Planning': Target,
  'Current Events': BookOpen,
  'Business': Target,
  'Mathematics': Brain,
  'default': BookOpen
};

const domainColors: Record<string, string> = {
  'Economics': 'from-green-500 to-emerald-500',
  'Biology': 'from-emerald-500 to-teal-500',
  'Physics': 'from-blue-500 to-cyan-500',
  'Psychology': 'from-purple-500 to-pink-500',
  'Technology': 'from-cyan-500 to-blue-500',
  'Computer Science': 'from-slate-500 to-gray-500',
  'Philosophy': 'from-amber-500 to-orange-500',
  'History': 'from-red-500 to-rose-500',
  'Urban Planning': 'from-orange-500 to-amber-500',
  'Current Events': 'from-blue-400 to-indigo-500',
  'Business': 'from-green-400 to-emerald-500',
  'Mathematics': 'from-indigo-500 to-purple-500',
  'default': 'from-[#d0ff59] to-lime-400'
};

export default function CrossDomainMapping({ 
  concept, 
  sourceBookId,
  sourceDomain,
  context,
  userBookIds 
}: CrossDomainMappingProps) {
  const [analogies, setAnalogies] = useState<ConceptAnalogy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAnalogy, setExpandedAnalogy] = useState<string | null>(null);

  const loadMappings = useCallback(async () => {
    setIsLoading(true);
    try {
      // First try pre-defined mappings
      let mappings = findConceptMappings(concept, userBookIds);
      
      // If few mappings, try AI generation
      if (mappings.length < 2) {
        const targetBooks = [
          { id: 'biology-1', title: 'The Selfish Gene', domain: 'Biology' },
          { id: 'physics-1', title: 'The Feynman Lectures', domain: 'Physics' },
          { id: 'psychology-1', title: 'Thinking, Fast and Slow', domain: 'Psychology' },
          { id: 'economics-1', title: 'The Wealth of Nations', domain: 'Economics' },
          { id: 'technology-1', title: 'The Innovators', domain: 'Technology' },
          { id: 'philosophy-1', title: 'Meditations', domain: 'Philosophy' },
          { id: 'history-1', title: 'Sapiens', domain: 'History' },
        ].filter(b => b.id !== sourceBookId && userBookIds.includes(b.id));
        
        const aiMappings = await generateConceptMapping(concept, sourceDomain, context, targetBooks);
        mappings = [...mappings, ...aiMappings];
      }
      
      // Remove duplicates and sort
      const unique = mappings.filter((m, i, arr) => 
        arr.findIndex(t => t.targetConcept === m.targetConcept) === i
      );
      
      setAnalogies(unique.slice(0, 3));
    } catch (error) {
      console.error('Failed to load concept mappings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [concept, sourceDomain, context, sourceBookId, userBookIds]);

  useEffect(() => {
    loadMappings();
  }, [loadMappings]);

  const toggleExpand = (id: string) => {
    setExpandedAnalogy(expandedAnalogy === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-br from-[#d0ff59]/5 to-transparent border border-[#d0ff59]/20">
        <div className="flex items-center gap-3 mb-4">
          <ArrowRightLeft className="w-5 h-5 text-[#d0ff59]" />
          <h4 className="text-white font-semibold">See This Concept In...</h4>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#d0ff59] animate-spin" />
          <span className="text-white/50 text-sm ml-3">Finding cross-domain connections...</span>
        </div>
      </div>
    );
  }

  if (analogies.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <ArrowRightLeft className="w-5 h-5 text-white/40" />
          <h4 className="text-white/60 font-semibold">Cross-Domain Connections</h4>
        </div>
        <p className="text-white/40 text-sm text-center py-4">
          No connections found yet. As you read more books, we'll find patterns across domains.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="w-5 h-5 text-[#d0ff59]" />
          <h4 className="text-white font-semibold">See This Concept In...</h4>
        </div>
        <button
          onClick={loadMappings}
          disabled={isLoading}
          className="text-white/40 hover:text-white text-xs flex items-center gap-1 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {analogies.map((analogy, index) => {
          const Icon = domainIcons[analogy.targetDomain] || domainIcons.default;
          const colorClass = domainColors[analogy.targetDomain] || domainColors.default;
          const isExpanded = expandedAnalogy === analogy.id;
          
          return (
            <motion.div
              key={analogy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-white/20 transition-colors"
            >
              {/* Header */}
              <div 
                onClick={() => toggleExpand(analogy.id)}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Domain Icon */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-white/10 text-white/70 text-xs border-0">
                        {analogy.targetDomain}
                      </Badge>
                      <Badge className="bg-[#d0ff59]/20 text-[#d0ff59] text-xs border-0">
                        {analogy.relevanceScore}% match
                      </Badge>
                    </div>
                    <h5 className="text-white font-medium">{analogy.targetConcept}</h5>
                    <p className="text-white/50 text-sm">{analogy.targetBookTitle}</p>
                  </div>

                  {/* Expand Icon */}
                  <div className="text-white/40">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
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
                    <div className="p-4 space-y-4">
                      {/* Structural Similarity */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-[#d0ff59]" />
                          <span className="text-[#d0ff59] text-xs uppercase tracking-wider">Why They're Similar</span>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">{analogy.structuralSimilarity}</p>
                      </div>

                      {/* Key Differences */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-400 text-xs uppercase tracking-wider">Key Differences</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">{analogy.keyDifferences}</p>
                      </div>

                      {/* Action */}
                      {analogy.targetBookId !== 'news' && (
                        <Link
                          to={`/analyze?book=${analogy.targetBookId}&chapter=${analogy.targetChapterId?.split('-')[1] || '1'}`}
                          className="inline-flex items-center gap-2 text-[#d0ff59] text-sm hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Explore in {analogy.targetBookTitle}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <p className="text-white/40 text-xs text-center">
        Based on structural similarities, not just keywords
      </p>
    </div>
  );
}
