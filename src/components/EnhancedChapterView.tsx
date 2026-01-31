import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  MessageCircle, 
  Brain, 
  Globe, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Send,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Chapter } from '@/types';

interface EnhancedChapterViewProps {
  chapter: Chapter;
  onOpenPowerReader: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  category: 'key' | 'counterintuitive' | 'foundational';
}

interface FirstPrinciple {
  id: string;
  principle: string;
  explanation: string;
  breakdown: string[];
}

interface RealExample {
  id: string;
  title: string;
  description: string;
  relevance: string;
}

interface RecentEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  connection: string;
}

// Simulated AI analysis data
const generateInsights = (chapter: Chapter): Insight[] => {
  const content = chapter.content.toLowerCase();
  const insights: Insight[] = [];
  
  if (content.includes('atom') || content.includes('physics')) {
    insights.push(
      { id: '1', title: 'Everything is Made of Atoms', description: 'All matter, from stars to living organisms, is composed of atoms - the fundamental building blocks of the universe.', category: 'foundational' },
      { id: '2', title: 'Energy Cannot Be Created or Destroyed', description: 'The First Law of Thermodynamics reveals that energy only transforms from one form to another.', category: 'key' },
      { id: '3', title: 'Quantum Behavior Defies Classical Intuition', description: 'Particles exist in superposition and behave as both waves and particles - challenging our everyday understanding of reality.', category: 'counterintuitive' }
    );
  }
  
  if (content.includes('think') || content.includes('system')) {
    insights.push(
      { id: '4', title: 'Two Systems of Thinking', description: 'System 1 (fast, automatic) and System 2 (slow, deliberate) work together but often conflict.', category: 'foundational' },
      { id: '5', title: 'Cognitive Ease Affects Truth Perception', description: 'We judge statements as more true when they feel familiar and easy to process.', category: 'counterintuitive' }
    );
  }
  
  if (content.includes('market') || content.includes('econom')) {
    insights.push(
      { id: '6', title: 'Self-Interest Drives Prosperity', description: 'Individual self-interest, channeled through markets, creates collective wealth better than centralized planning.', category: 'foundational' },
      { id: '7', title: 'Division of Labor Multiplies Productivity', description: 'Specialization allows workers to become more efficient, creating exponential gains in output.', category: 'key' }
    );
  }
  
  return insights.length > 0 ? insights : [
    { id: '1', title: 'Core Concept', description: 'The fundamental principle discussed in this chapter.', category: 'key' },
    { id: '2', title: 'Underlying Pattern', description: 'A recurring theme that connects to broader understanding.', category: 'foundational' }
  ];
};

const generateFirstPrinciples = (): FirstPrinciple[] => {
  return [
    {
      id: '1',
      principle: 'Break down to fundamental truths',
      explanation: 'Every complex concept can be decomposed into basic, irreducible truths that cannot be deduced from any other assumptions.',
      breakdown: [
        'Identify the core components of the concept',
        'Question each assumption until you reach undeniable truths',
        'Rebuild understanding from these foundations',
        'Verify each step logically'
      ]
    },
    {
      id: '2',
      principle: 'Cause and effect relationships',
      explanation: 'Understanding the causal chain helps predict outcomes and design interventions.',
      breakdown: [
        'Identify the primary cause',
        'Trace the mechanism of effect',
        'Look for feedback loops',
        'Consider temporal delays'
      ]
    }
  ];
};

const generateRealExamples = (chapter: Chapter): RealExample[] => {
  const content = chapter.content.toLowerCase();
  const examples: RealExample[] = [];
  
  if (content.includes('atom') || content.includes('physics')) {
    examples.push(
      { id: '1', title: 'Nuclear Power Plants', description: 'Harness the energy released when atoms split (fission) to generate electricity.', relevance: 'Direct application of E=mc² and nuclear physics principles.' },
      { id: '2', title: 'Semiconductor Technology', description: 'Transistors rely on quantum mechanical properties of electrons in silicon crystals.', relevance: 'Quantum mechanics enables all modern computing.' },
      { id: '3', title: 'GPS Satellites', description: 'Must account for both special and general relativity to provide accurate positioning.', relevance: 'Einstein\'s theories are essential for everyday technology.' }
    );
  }
  
  if (content.includes('think') || content.includes('system')) {
    examples.push(
      { id: '4', title: 'Marketing Strategies', description: 'Companies use cognitive ease by repeating slogans to make products feel familiar and trustworthy.', relevance: 'Exploits System 1\'s preference for fluency.' },
      { id: '5', title: 'Airplane Cockpit Design', description: 'Checklists force System 2 engagement to prevent System 1 errors during emergencies.', relevance: 'Engineering that accounts for cognitive limitations.' }
    );
  }
  
  if (content.includes('market') || content.includes('econom')) {
    examples.push(
      { id: '6', title: 'Amazon\'s Fulfillment Centers', description: 'Extreme division of labor with workers specializing in single tasks.', relevance: 'Modern implementation of Smith\'s pin factory example.' },
      { id: '7', title: 'Cryptocurrency Markets', description: 'Decentralized trading driven by self-interest without central authority.', relevance: 'Digital embodiment of free market principles.' }
    );
  }
  
  return examples.length > 0 ? examples : [
    { id: '1', title: 'Everyday Application', description: 'How this concept appears in daily life.', relevance: 'Makes abstract ideas concrete.' }
  ];
};

const generateRecentEvents = (chapter: Chapter): RecentEvent[] => {
  const content = chapter.content.toLowerCase();
  const events: RecentEvent[] = [];
  
  if (content.includes('atom') || content.includes('physics')) {
    events.push(
      { id: '1', title: 'Nuclear Fusion Breakthrough', date: 'December 2022', description: 'LLNL achieved net energy gain in fusion reaction for first time.', connection: 'Demonstrates practical application of nuclear physics principles.' },
      { id: '2', title: 'Quantum Computing Milestone', date: '2023', description: 'IBM unveiled 1000+ qubit quantum processor.', connection: 'Advances quantum mechanics from theory to practical computing.' }
    );
  }
  
  if (content.includes('think') || content.includes('system')) {
    events.push(
      { id: '3', title: 'AI ChatGPT Launch', date: 'November 2022', description: 'Large language model demonstrating System 1-like intuitive responses.', connection: 'Raises questions about human vs. machine thinking.' },
      { id: '4', title: 'Social Media Algorithms', date: 'Ongoing', description: 'Platforms optimize for engagement by exploiting cognitive biases.', connection: 'Real-world impact of understanding System 1/System 2.' }
    );
  }
  
  if (content.includes('market') || content.includes('econom')) {
    events.push(
      { id: '5', title: 'Global Supply Chain Crisis', date: '2021-2023', description: 'Disruptions revealed vulnerabilities in highly specialized global trade.', connection: 'Tests limits of division of labor across borders.' },
      { id: '6', title: 'Cryptocurrency Volatility', date: '2022-2023', description: 'Bitcoin and crypto markets experienced major crashes.', connection: 'Demonstrates self-interest without regulation leads to instability.' }
    );
  }
  
  return events.length > 0 ? events : [
    { id: '1', title: 'Ongoing Research', date: '2024', description: 'Scientists continue exploring applications of these principles.', connection: 'Shows the enduring relevance of these concepts.' }
  ];
};

// Simulated AI response generator
const generateAIResponse = (question: string, chapter: Chapter): string => {
  const q = question.toLowerCase();
  
  if (q.includes('first principle') || q.includes('break down')) {
    return `To understand this at the first principles level, let's strip away assumptions:\n\n1. **What are we actually observing?** ${chapter.title} describes fundamental mechanisms.\n\n2. **What must be true?** The underlying patterns are irreducible truths about how systems behave.\n\n3. **Why does this matter?** Because understanding at this level allows us to predict and design, not just memorize.\n\nWould you like me to break down any specific concept from this chapter into its first principles?`;
  }
  
  if (q.includes('example') || q.includes('real world')) {
    return `Here are some real-world applications:\n\n• **Technology**: Modern devices use these principles daily\n• **Business**: Companies apply these concepts for competitive advantage\n• **Science**: Researchers build on these foundations\n\nThe key insight is that ${chapter.title} isn't just theory—it's a practical framework used across industries. Would you like me to find a specific example in a particular domain?`;
  }
  
  if (q.includes('recent') || q.includes('news') || q.includes('current')) {
    return `Recent developments related to this chapter:\n\n• **2024**: New research continues to validate and extend these ideas\n• **Technology**: Applications are becoming more widespread\n• **Policy**: Governments and organizations are implementing these principles\n\nThe concepts in "${chapter.title}" are more relevant today than ever. Would you like me to explore a specific recent event?`;
  }
  
  if (q.includes('explain') || q.includes('what is') || q.includes('how does')) {
    return `Great question! Let me explain this concept clearly:\n\n**Core Idea**: ${chapter.summary}\n\n**Why It Matters**: This principle helps us understand patterns that would otherwise seem random or mysterious.\n\n**How to Apply It**: Look for this pattern in your own experiences—you'll start seeing it everywhere.\n\nDoes this help clarify things? Feel free to ask follow-up questions!`;
  }
  
  return `That's a thoughtful question about "${chapter.title}"!\n\nBased on the chapter content, I can tell you that this concept builds on several key ideas:\n\n1. The fundamental mechanism described in the text\n2. The broader implications for understanding similar systems\n3. Practical applications in various fields\n\nWould you like me to:\n• Break this down into first principles?\n• Provide a real-world example?\n• Connect this to recent events?\n• Explain it in simpler terms?`;
};

export function EnhancedChapterView({ chapter, onOpenPowerReader }: EnhancedChapterViewProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const insights = generateInsights(chapter);
  const firstPrinciples = generateFirstPrinciples();
  const realExamples = generateRealExamples(chapter);
  const recentEvents = generateRecentEvents(chapter);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(userMessage.content, chapter),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    'Break this down to first principles',
    'Give me a real-world example',
    'What are recent events about this?',
    'Explain this like I\'m 12',
    'How does this connect to other chapters?',
    'What are the counterarguments?'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col"
    >
      {/* Chapter Header */}
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-[#d0ff59]/10 text-[#d0ff59] text-sm font-medium mb-3">
          Chapter {chapter.number}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {chapter.title}
        </h1>
        {chapter.summary && (
          <p className="text-white/60">{chapter.summary}</p>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={onOpenPowerReader}
          className="bg-[#d0ff59] text-black hover:bg-[#b8e04d]"
        >
          <Zap className="w-4 h-4 mr-2" />
          Power Reader
        </Button>
        <Button
          variant="outline"
          onClick={() => setActiveTab('ask')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask AI
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full bg-white/5 p-1 mb-4 flex-wrap h-auto">
          <TabsTrigger value="content" className="flex-1 data-[state=active]:bg-[#d0ff59] data-[state=active]:text-black">
            <BookOpen className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1 data-[state=active]:bg-[#d0ff59] data-[state=active]:text-black">
            <Lightbulb className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="principles" className="flex-1 data-[state=active]:bg-[#d0ff59] data-[state=active]:text-black">
            <Brain className="w-4 h-4 mr-2" />
            First Principles
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex-1 data-[state=active]:bg-[#d0ff59] data-[state=active]:text-black">
            <Globe className="w-4 h-4 mr-2" />
            Real Examples
          </TabsTrigger>
          <TabsTrigger value="events" className="flex-1 data-[state=active]:bg-[#d0ff59] data-[state=active]:text-black">
            <Calendar className="w-4 h-4 mr-2" />
            Recent Events
          </TabsTrigger>
          <TabsTrigger value="ask" className="flex-1 data-[state=active]:bg-[#d0ff59] data-[state=active]:text-black">
            <Sparkles className="w-4 h-4 mr-2" />
            Ask AI
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {/* Content Tab */}
          <TabsContent value="content" className="h-full m-0">
            <ScrollArea className="h-full pr-4">
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#d0ff59]" />
                  Chapter Content
                </h3>
                <div className="prose prose-invert max-w-none">
                  {chapter.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-white/70 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Key Points */}
              {chapter.keyPoints.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#d0ff59]" />
                    Key Points
                  </h3>
                  <ul className="space-y-3">
                    {chapter.keyPoints.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d0ff59]/20 flex items-center justify-center text-xs text-[#d0ff59] font-medium mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-white/70 leading-relaxed">{point}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="h-full m-0">
            <ScrollArea className="h-full pr-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#d0ff59]" />
                  AI-Generated Insights
                </h3>
                <p className="text-white/50 text-sm">
                  Key ideas and patterns extracted from this chapter
                </p>
              </div>

              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#d0ff59]/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${insight.category === 'key' ? 'bg-blue-500/20 text-blue-400' : ''}
                        ${insight.category === 'counterintuitive' ? 'bg-purple-500/20 text-purple-400' : ''}
                        ${insight.category === 'foundational' ? 'bg-amber-500/20 text-amber-400' : ''}
                      `}>
                        {insight.category === 'key' && <Target className="w-5 h-5" />}
                        {insight.category === 'counterintuitive' && <Zap className="w-5 h-5" />}
                        {insight.category === 'foundational' && <BookOpen className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{insight.title}</h4>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {insight.category}
                          </Badge>
                        </div>
                        <p className="text-white/60 text-sm">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* First Principles Tab */}
          <TabsContent value="principles" className="h-full m-0">
            <ScrollArea className="h-full pr-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#d0ff59]" />
                  First Principles Analysis
                </h3>
                <p className="text-white/50 text-sm">
                  Break down concepts to their fundamental truths
                </p>
              </div>

              <div className="space-y-4">
                {firstPrinciples.map((principle, index) => (
                  <motion.div
                    key={principle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
                  >
                    <button
                      onClick={() => setExpandedPrinciple(expandedPrinciple === principle.id ? null : principle.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#d0ff59]/20 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-[#d0ff59]" />
                        </div>
                        <h4 className="font-semibold text-white">{principle.principle}</h4>
                      </div>
                      {expandedPrinciple === principle.id ? (
                        <ChevronUp className="w-5 h-5 text-white/40" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/40" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedPrinciple === principle.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10"
                        >
                          <div className="p-4">
                            <p className="text-white/70 mb-4">{principle.explanation}</p>
                            <h5 className="text-sm font-medium text-white/80 mb-2">Breakdown:</h5>
                            <ol className="space-y-2">
                              {principle.breakdown.map((step, i) => (
                                <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                                  <span className="text-[#d0ff59] font-medium">{i + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Real Examples Tab */}
          <TabsContent value="examples" className="h-full m-0">
            <ScrollArea className="h-full pr-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#d0ff59]" />
                  Real-World Examples
                </h3>
                <p className="text-white/50 text-sm">
                  How these concepts appear in the real world
                </p>
              </div>

              <div className="grid gap-4">
                {realExamples.map((example, index) => (
                  <motion.div
                    key={example.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-5 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#d0ff59]/10 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-6 h-6 text-[#d0ff59]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{example.title}</h4>
                        <p className="text-white/60 text-sm mb-2">{example.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[#d0ff59]">Relevance:</span>
                          <span className="text-white/50">{example.relevance}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Recent Events Tab */}
          <TabsContent value="events" className="h-full m-0">
            <ScrollArea className="h-full pr-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#d0ff59]" />
                  Recent Events & Connections
                </h3>
                <p className="text-white/50 text-sm">
                  Current events that relate to this chapter's concepts
                </p>
              </div>

              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-6 border-l-2 border-[#d0ff59]/30"
                  >
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-[#d0ff59]" />
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs bg-[#d0ff59]/10 text-[#d0ff59]">
                          {event.date}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                      <p className="text-white/60 text-sm mb-2">{event.description}</p>
                      <div className="flex items-start gap-2 text-xs">
                        <ArrowRight className="w-3 h-3 text-[#d0ff59] mt-0.5 flex-shrink-0" />
                        <span className="text-white/50">{event.connection}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Ask AI Tab */}
          <TabsContent value="ask" className="h-full m-0 flex flex-col">
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 pr-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#d0ff59]/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-[#d0ff59]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Ask AI About This Chapter
                    </h3>
                    <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
                      Get deeper insights, first principles breakdowns, real-world examples, and answers to your questions.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickQuestions.map((question, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setInputMessage(question);
                          }}
                          className="px-3 py-2 rounded-full bg-white/5 text-white/60 text-sm hover:bg-white/10 hover:text-white transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`
                          max-w-[80%] rounded-2xl px-4 py-3
                          ${message.role === 'user' 
                            ? 'bg-[#d0ff59] text-black' 
                            : 'bg-white/10 text-white'
                          }
                        `}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                          <span className="text-white/60 text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask anything about this chapter..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-[#d0ff59] text-black hover:bg-[#b8e04d] disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
