
import React from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full pt-16 pb-8 px-6 border-t border-white/5 z-10 relative mt-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 mb-12">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4 group">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
              <FileText size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight uppercase">PDF HUB</span>
          </Link>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            Professional document manipulation ecosystem. Secure and strictly zero-retention.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center border-t border-white/5 pt-8">
        <p className="text-gray-600 text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-center leading-loose">
          © 2026 PDF HUB INC. MADE IN 2026 LEVERAGING AI BY NEEL0210
        </p>
      </div>
    </footer>
  );
};

export default Footer;
