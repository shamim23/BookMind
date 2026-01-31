import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  History,
  Target,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  BarChart3,
  BookOpen,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getEvidenceMapping, generateEvidenceMapping, type EvidenceMapping } from '@/services/evidenceMapping';

interface EvidenceMappingProps {
  concept: string;
  context: string;
  bookTitle: string;
}

const outcomeIcons = {
  validates: CheckCircle2,
  supports: CheckCircle2,
  contradicts: XCircle,
  nuanced: AlertCircle,
  evolving: TrendingUp
};

const outcomeColors = {
  validates: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  supports: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  contradicts: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  nuanced: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  evolving: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
};

const strengthColors = {
  strong: 'text-emerald-400',
  moderate: 'text-amber-400',
  weak: 'text-rose-400'
};

export default function EvidenceMapping({ concept, context, bookTitle }: EvidenceMappingProps) {
  const [evidence, setEvidence] = useState<EvidenceMapping | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('historical');

  const loadEvidence = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try pre-defined first
      let mapping = getEvidenceMapping(concept);
      
      // If not found, try AI generation
      if (!mapping) {
        mapping = await generateEvidenceMapping(concept, context, bookTitle);
      }
      
      setEvidence(mapping);
    } catch (error) {
      console.error('Failed to load evidence:', error);
    } finally {
      setIsLoading(false);
    }
  }, [concept, context, bookTitle]);

  useEffect(() => {
    loadEvidence();
  }, [loadEvidence]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h4 className="text-white font-semibold">Real-World Evidence</h4>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="text-white/50 text-sm ml-3">Gathering evidence across time periods...</span>
        </div>
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-white/40" />
          <h4 className="text-white/60 font-semibold">Evidence Mapping</h4>
        </div>
        <p className="text-white/40 text-sm text-center py-4">
          Evidence mapping not yet available for this concept.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Overall Assessment */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h4 className="text-white font-semibold">Real-World Evidence</h4>
          </div>
          <button
            onClick={loadEvidence}
            disabled={isLoading}
            className="text-white/40 hover:text-white text-xs flex items-center gap-1 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {/* Validation Score */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/60 text-xs">Validation Score</span>
              <span className={`text-sm font-bold ${
                evidence.overallAssessment.validationScore >= 70 ? 'text-emerald-400' :
                evidence.overallAssessment.validationScore >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {evidence.overallAssessment.validationScore}/100
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  evidence.overallAssessment.validationScore >= 70 ? 'bg-emerald-400' :
                  evidence.overallAssessment.validationScore >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${evidence.overallAssessment.validationScore}%` }}
              />
            </div>
          </div>
          <Badge className={`${
            evidence.overallAssessment.confidenceLevel === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
            evidence.overallAssessment.confidenceLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' :
            'bg-rose-500/20 text-rose-400'
          } border-0`}>
            {evidence.overallAssessment.confidenceLevel} confidence
          </Badge>
        </div>
        
        <p className="text-white/70 text-sm leading-relaxed">
          {evidence.overallAssessment.keyInsight}
        </p>
      </div>

      {/* Historical Evidence */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <button
          onClick={() => toggleSection('historical')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-amber-400" />
            <span className="text-white font-medium">Historical Evidence</span>
            <Badge className="bg-white/10 text-white/60 text-xs border-0">
              {evidence.historicalEvidence.length} cases
            </Badge>
          </div>
          {expandedSection === 'historical' ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
        </button>
        
        <AnimatePresence>
          {expandedSection === 'historical' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-4 space-y-3">
                {evidence.historicalEvidence.map((item) => {
                  const Icon = outcomeIcons[item.outcome];
                  return (
                    <div key={item.id} className={`p-3 rounded-lg border ${outcomeColors[item.outcome]}`}>
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/60 text-xs">{item.period}</span>
                            <span className={`text-xs ${strengthColors[item.evidenceStrength]}`}>
                              {item.evidenceStrength} evidence
                            </span>
                          </div>
                          <h5 className="text-white font-medium text-sm mb-1">{item.event}</h5>
                          <p className="text-white/60 text-xs mb-2">{item.description}</p>
                          <p className="text-white/50 text-xs leading-relaxed">{item.details}</p>
                          {item.sources.length > 0 && (
                            <div className="mt-2 flex items-center gap-1 text-white/40 text-xs">
                              <BookOpen className="w-3 h-3" />
                              <span>{item.sources.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contemporary Evidence */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <button
          onClick={() => toggleSection('contemporary')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Contemporary Evidence (2024-2026)</span>
            <Badge className="bg-white/10 text-white/60 text-xs border-0">
              {evidence.contemporaryEvidence.length} cases
            </Badge>
          </div>
          {expandedSection === 'contemporary' ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
        </button>
        
        <AnimatePresence>
          {expandedSection === 'contemporary' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-4 space-y-3">
                {evidence.contemporaryEvidence.map((item) => {
                  const Icon = outcomeIcons[item.outcome];
                  return (
                    <div key={item.id} className={`p-3 rounded-lg border ${outcomeColors[item.outcome]}`}>
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/60 text-xs">{item.year}</span>
                          </div>
                          <h5 className="text-white font-medium text-sm mb-1">{item.event}</h5>
                          <p className="text-white/60 text-xs mb-2">{item.description}</p>
                          {item.supportingData && (
                            <div className="p-2 rounded bg-black/30 mb-2">
                              <p className="text-blue-400 text-xs font-medium">Data</p>
                              <p className="text-white/50 text-xs">{item.supportingData}</p>
                            </div>
                          )}
                          {item.sources.length > 0 && (
                            <div className="flex items-center gap-1 text-white/40 text-xs">
                              <BookOpen className="w-3 h-3" />
                              <span>{item.sources.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edge Cases */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <button
          onClick={() => toggleSection('edge')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-rose-400" />
            <span className="text-white font-medium">Edge Cases</span>
            <Badge className="bg-white/10 text-white/60 text-xs border-0">
              {evidence.edgeCases.length} scenarios
            </Badge>
          </div>
          {expandedSection === 'edge' ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
        </button>
        
        <AnimatePresence>
          {expandedSection === 'edge' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-4 space-y-3">
                {evidence.edgeCases.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                    <h5 className="text-rose-300 font-medium text-sm mb-2">{item.scenario}</h5>
                    <p className="text-white/60 text-xs mb-2">{item.description}</p>
                    <div className="p-2 rounded bg-black/30 mb-2">
                      <p className="text-rose-400 text-xs font-medium mb-1">Why It Breaks</p>
                      <p className="text-white/50 text-xs">{item.whyItBreaks}</p>
                    </div>
                    <div className="p-2 rounded bg-black/30">
                      <p className="text-amber-400 text-xs font-medium mb-1">Modern Relevance</p>
                      <p className="text-white/50 text-xs">{item.modernRelevance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Emerging Patterns */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <button
          onClick={() => toggleSection('emerging')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Emerging Patterns</span>
            <Badge className="bg-white/10 text-white/60 text-xs border-0">
              {evidence.emergingPatterns.length} trends
            </Badge>
          </div>
          {expandedSection === 'emerging' ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
        </button>
        
        <AnimatePresence>
          {expandedSection === 'emerging' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-4 space-y-3">
                {evidence.emergingPatterns.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-purple-300 font-medium text-sm">{item.trend}</h5>
                      <Badge className={`text-xs border-0 ${
                        item.timeframe === 'now' ? 'bg-emerald-500/20 text-emerald-400' :
                        item.timeframe === '5-years' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.timeframe === 'now' ? 'Now' : item.timeframe === '5-years' ? '5 years' : '10 years'}
                      </Badge>
                    </div>
                    <p className="text-white/60 text-xs mb-2">{item.description}</p>
                    <div className="p-2 rounded bg-black/30">
                      <p className="text-purple-400 text-xs font-medium mb-1">Impact on Principle</p>
                      <p className="text-white/50 text-xs">{item.impactOnPrinciple}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Sources */}
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-white/40" />
          <span className="text-white/50 text-xs uppercase tracking-wider">Data Sources</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {evidence.dataSources.map((source, i) => (
            <span key={i} className="text-white/40 text-xs">
              {source.name}{i < evidence.dataSources.length - 1 ? ' • ' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
