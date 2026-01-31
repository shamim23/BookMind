import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/sections/Navigation';
import { Hero } from '@/sections/Hero';
import { BookUpload } from '@/sections/BookUpload';
import { HowItWorks } from '@/sections/HowItWorks';
import { Features } from '@/sections/Features';
import { Pricing } from '@/sections/Pricing';
import { Testimonials } from '@/sections/Testimonials';
import { FAQ } from '@/sections/FAQ';
import { CTA } from '@/sections/CTA';
import { Footer } from '@/sections/Footer';
import { FloatingDock } from '@/sections/FloatingDock';
import LibraryPage from '@/pages/LibraryPage';
import AnalyzeBookPage from '@/pages/AnalyzeBookPage';
import PowerReaderPage from '@/pages/PowerReaderPage';
import DashboardPage from '@/pages/DashboardPage';
import KnowledgeGraphPage from '@/pages/KnowledgeGraphPage';
import OnboardingPage from '@/pages/OnboardingPage';
import TrendingTopicsPage from '@/pages/TrendingTopicsPage';

function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main>
        <Hero />
        <BookUpload />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <FloatingDock />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/analyze" element={<AnalyzeBookPage />} />
        <Route path="/reader" element={<PowerReaderPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/trending" element={<TrendingTopicsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
