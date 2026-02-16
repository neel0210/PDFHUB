
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Navigation links are removed as per user request
  const navLinks: { name: string; path: string }[] = [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50">
      <div className="liquid-glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            <FileText size={18} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight">PDF HUB</span>
            <span className="bg-red-500/10 text-red-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-red-500/20 uppercase tracking-widest ml-1">
              Beta
            </span>
          </div>
        </Link>

        {/* Desktop Nav - Only renders if links are present */}
        {navLinks.length > 0 && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-white relative ${
                  isActive(link.path) ? 'text-white' : 'text-gray-400'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile Toggle - Only renders if links are present */}
        {navLinks.length > 0 && (
          <button className="md:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Placeholder if no links to maintain visual balance if needed, or simply empty */}
        {navLinks.length === 0 && <div className="hidden md:block w-8 h-8" />}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && navLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-20 left-0 right-0 md:hidden liquid-glass rounded-2xl p-6 flex flex-col gap-4 shadow-2xl border border-white/10"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-bold transition-colors ${
                  isActive(link.path) ? 'text-red-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
