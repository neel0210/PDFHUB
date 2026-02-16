
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import ToolSection from './pages/ToolSection';
import ToolProcessor from './pages/ToolProcessor';
import Navbar from './components/Navbar';
import BackgroundEffects from './components/BackgroundEffects';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0A0A0A] text-white selection:bg-blue-500/30">
        <BackgroundEffects />
        <Navbar />
        
        <main className="flex-grow relative z-10 pt-24 md:pt-32">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pdf" element={<ToolSection category="PDF" />} />
              <Route path="/tool/:toolId" element={<ToolProcessor />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
