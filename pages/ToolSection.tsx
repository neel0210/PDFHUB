import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PDF_TOOLS } from '../constants';
import { ToolCategory } from '../types';
import { ChevronLeft, ArrowRight } from 'lucide-react';

interface Props {
  category: ToolCategory;
}

const ToolSection: React.FC<Props> = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-20"
    >
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 group text-xs font-black uppercase tracking-widest">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">PDF Toolbox</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Professional-grade utilities for high-fidelity document management. 
            All tools operate with zero-retention security.
          </p>
        </div>
        <div className="hidden md:flex">
           <div className="px-6 py-3 liquid-glass rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-gray-300 tracking-[0.1em] uppercase">Processing Node Ready</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PDF_TOOLS.map((tool, idx) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link
              to={`/tool/${tool.id}`}
              className="group p-8 liquid-glass rounded-[2rem] h-full flex flex-col items-start hover:bg-white/[0.05] transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/5 relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center mb-8 group-hover:rotate-6 transition-all duration-500 shadow-xl border border-white/5">
                <span className="text-red-400 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{tool.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-10">
                {tool.description}
              </p>
              
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80 group-hover:text-red-400 transition-colors">
                Open Utility <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ToolSection;