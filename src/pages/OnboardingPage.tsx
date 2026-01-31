import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Lightbulb,
  Globe,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

interface OnboardingData {
  readingPattern: string;
  memoryStyle: string;
  goals: string[];
  topics: string[];
  experience: string;
}

const readingPatterns = [
  { 
    id: 'deep', 
    label: 'Deep Diver', 
    description: 'I prefer to read one book at a time and fully absorb it before moving on',
    icon: BookOpen 
  },
  { 
    id: 'broad', 
    label: 'Broad Explorer', 
    description: 'I read multiple books simultaneously across different topics',
    icon: Globe 
  },
  { 
    id: 'selective', 
    label: 'Selective Reader', 
    description: 'I skim and focus only on chapters or sections that interest me',
    icon: Target 
  },
  { 
    id: 'sporadic', 
    label: 'Sporadic Learner', 
    description: 'I read in bursts when I have time or when a topic catches my attention',
    icon: Zap 
  },
];

const memoryStyles = [
  { 
    id: 'visual', 
    label: 'Visual Learner', 
    description: 'I remember best through diagrams, mind maps, and visual connections',
    icon: Lightbulb 
  },
  { 
    id: 'analytical', 
    label: 'Analytical Thinker', 
    description: 'I understand by breaking concepts down and finding patterns',
    icon: Brain 
  },
  { 
    id: 'story', 
    label: 'Story Collector', 
    description: 'I remember through narratives, examples, and real-world connections',
    icon: BookOpen 
  },
  { 
    id: 'discussion', 
    label: 'Discussion Learner', 
    description: 'I learn best by discussing, questioning, and teaching others',
    icon: Target 
  },
];

const goals = [
  { id: 'world', label: 'Understand the World Better', description: 'Connect ideas across disciplines to see the bigger picture' },
  { id: 'critical', label: 'Improve Critical Thinking', description: 'Analyze arguments, spot fallacies, and think more clearly' },
  { id: 'first-principles', label: 'Master First Principles', description: 'Break down complex problems to their fundamental truths' },
  { id: 'decision', label: 'Make Better Decisions', description: 'Apply mental models and frameworks to real-life choices' },
  { id: 'communication', label: 'Communicate Ideas Clearly', description: 'Articulate complex concepts in simple, persuasive ways' },
  { id: 'creativity', label: 'Boost Creativity', description: 'Combine ideas from different fields to generate novel insights' },
  { id: 'memory', label: 'Retain Knowledge Longer', description: 'Build lasting understanding instead of temporary memorization' },
  { id: 'teaching', label: 'Become a Better Teacher', description: 'Learn how to explain anything to anyone effectively' },
];

const topics = [
  { id: 'science', label: 'Science & Physics', color: 'from-blue-500 to-cyan-500' },
  { id: 'philosophy', label: 'Philosophy & Ethics', color: 'from-amber-500 to-orange-500' },
  { id: 'psychology', label: 'Psychology & Mind', color: 'from-purple-500 to-pink-500' },
  { id: 'economics', label: 'Economics & Business', color: 'from-green-500 to-emerald-500' },
  { id: 'history', label: 'History & Society', color: 'from-red-500 to-rose-500' },
  { id: 'technology', label: 'Technology & AI', color: 'from-cyan-500 to-blue-500' },
  { id: 'biology', label: 'Biology & Nature', color: 'from-emerald-500 to-teal-500' },
  { id: 'arts', label: 'Arts & Literature', color: 'from-pink-500 to-rose-500' },
];

const experienceLevels = [
  { id: 'beginner', label: 'Just Starting', description: 'I\'m new to deep reading and structured learning' },
  { id: 'casual', label: 'Casual Reader', description: 'I read occasionally but want to be more intentional' },
  { id: 'enthusiast', label: 'Learning Enthusiast', description: 'I read regularly and love discovering new ideas' },
  { id: 'expert', label: 'Knowledge Seeker', description: 'I\'m always reading and looking to deepen my understanding' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    readingPattern: '',
    memoryStyle: '',
    goals: [],
    topics: [],
    experience: '',
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate('/library');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const toggleTopic = (topicId: string) => {
    setData(prev => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter(t => t !== topicId)
        : [...prev.topics, topicId]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Welcome screen
      case 1: return data.readingPattern !== '';
      case 2: return data.memoryStyle !== '';
      case 3: return data.goals.length > 0;
      case 4: return data.topics.length > 0;
      case 5: return data.experience !== '';
      default: return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#d0ff59] flex items-center justify-center mx-auto mb-8">
              <Brain className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Expand Your Mind
            </h1>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              BookMind AI helps you think more clearly, connect ideas across disciplines, 
              and build lasting understanding from the world's best books.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {['Critical Thinking', 'First Principles', 'Better Decisions', 'Deeper Understanding'].map((item, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              How do you like to read?
            </h2>
            <p className="text-white/60 text-center mb-8">
              We'll personalize your experience based on your reading style
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {readingPatterns.map((pattern) => {
                const Icon = pattern.icon;
                const isSelected = data.readingPattern === pattern.id;
                return (
                  <button
                    key={pattern.id}
                    onClick={() => setData(prev => ({ ...prev, readingPattern: pattern.id }))}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#d0ff59]/10 border-[#d0ff59]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#d0ff59]' : 'bg-white/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-black' : 'text-white/60'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 ${isSelected ? 'text-[#d0ff59]' : 'text-white'}`}>
                          {pattern.label}
                        </h3>
                        <p className="text-white/50 text-sm">{pattern.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              How do you learn best?
            </h2>
            <p className="text-white/60 text-center mb-8">
              We'll tailor our AI tools to match your learning style
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {memoryStyles.map((style) => {
                const Icon = style.icon;
                const isSelected = data.memoryStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setData(prev => ({ ...prev, memoryStyle: style.id }))}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#d0ff59]/10 border-[#d0ff59]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#d0ff59]' : 'bg-white/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-black' : 'text-white/60'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 ${isSelected ? 'text-[#d0ff59]' : 'text-white'}`}>
                          {style.label}
                        </h3>
                        <p className="text-white/50 text-sm">{style.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              What do you want to achieve?
            </h2>
            <p className="text-white/60 text-center mb-8">
              Select all that apply - we'll curate content to help you reach these goals
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {goals.map((goal) => {
                const isSelected = data.goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-[#d0ff59]/10 border-[#d0ff59]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#d0ff59] flex items-center justify-center">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}
                    <h3 className={`font-semibold mb-1 ${isSelected ? 'text-[#d0ff59]' : 'text-white'}`}>
                      {goal.label}
                    </h3>
                    <p className="text-white/50 text-sm">{goal.description}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-white/40 text-sm mt-6">
              {data.goals.length} goal{data.goals.length !== 1 ? 's' : ''} selected
            </p>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              What topics interest you?
            </h2>
            <p className="text-white/60 text-center mb-8">
              We'll recommend books and build your knowledge graph around these areas
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {topics.map((topic) => {
                const isSelected = data.topics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-4 rounded-xl border text-center transition-all relative ${
                      isSelected
                        ? 'border-white/30'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${topic.color} opacity-0 transition-opacity ${isSelected ? 'opacity-20' : ''}`} />
                    <div className="relative">
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#d0ff59] flex items-center justify-center">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      )}
                      <h3 className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-white/70'}`}>
                        {topic.label}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-white/40 text-sm mt-6">
              {data.topics.length} topic{data.topics.length !== 1 ? 's' : ''} selected
            </p>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              What's your experience level?
            </h2>
            <p className="text-white/60 text-center mb-8">
              This helps us calibrate the depth of our analysis
            </p>
            <div className="space-y-3">
              {experienceLevels.map((level) => {
                const isSelected = data.experience === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setData(prev => ({ ...prev, experience: level.id }))}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#d0ff59]/10 border-[#d0ff59]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-semibold mb-1 ${isSelected ? 'text-[#d0ff59]' : 'text-white'}`}>
                          {level.label}
                        </h3>
                        <p className="text-white/50 text-sm">{level.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-8 h-8 rounded-full bg-[#d0ff59] flex items-center justify-center">
                          <Check className="w-5 h-5 text-black" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#d0ff59] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">BookMind AI</span>
        </Link>
      </header>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">Step {step + 1} of {totalSteps}</span>
            <span className="text-white/50 text-sm">{Math.round(((step + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#d0ff59]"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="px-6 py-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              step === 0
                ? 'text-white/20 cursor-not-allowed'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-[#d0ff59] text-black hover:bg-[#b8e04d] disabled:opacity-50 px-8"
          >
            {step === totalSteps - 1 ? (
              <>
                Start Learning
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
