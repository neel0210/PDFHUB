import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center max-w-7xl w-full py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
        >
          High-Performance Document Ecosystem
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[1.05] text-balance"
        >
          Professional <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-rose-500">
            PDF Utilities.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mb-12 leading-relaxed px-4 mx-auto"
        >
          Streamline your workflow with precision tools. Merge, split, compress, and organize with zero-retention security.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0"
        >
          <Link
            to="/pdf"
            className="group px-10 py-5 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95 uppercase tracking-widest text-xs"
          >
            Launch Toolbox
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-7xl px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
           {[
             { 
               icon: <ShieldCheck size={24} className="text-red-400" />, 
               title: "Private Processing", 
               desc: "Every binary manipulation happens within your browser session. We never see your data." 
             },
             { 
               icon: <Zap size={24} className="text-orange-400" />, 
               title: "Zero Retention", 
               desc: "Volatile memory is automatically cleared after each operation. Your privacy is paramount." 
             },
             { 
               icon: <Lock size={24} className="text-rose-400" />, 
               title: "AES Encryption", 
               desc: "Enterprise-grade algorithms ensure your exported documents are secured with industry standards." 
             }
           ].map((feature, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="p-8 liquid-glass rounded-[2rem] border border-white/5 flex flex-col items-start text-left"
             >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;