
import React from 'react';

const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Liquid Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 liquid-blur animate-orbit" />
      <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 liquid-blur animate-orbit" style={{ animationDelay: '-5s' }} />
      <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-indigo-600/5 liquid-blur animate-orbit" style={{ animationDelay: '-10s' }} />
      
      {/* Grain / Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
      
      {/* Gradient Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  );
};

export default BackgroundEffects;
