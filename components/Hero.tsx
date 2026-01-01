
import React from 'react';

interface HeroProps {
  onShopNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050608]">
      {/* Cinematic Background Image */}
      <div 
        className="absolute inset-0 opacity-40 bg-center bg-cover scale-105 animate-slow-zoom"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070)' }}
      ></div>
      
      {/* Deep Atmosphere Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/90 via-transparent to-[#050608]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#050608] via-transparent to-[#050608]/30"></div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <h1 className="text-6xl md:text-9xl font-black font-montserrat text-white mb-10 leading-[0.85] tracking-tighter animate-fade-in-down">
          ELEVATE YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600">LIFESTYLE</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed font-light">
          Experience our curated collection of 150+ premium tech, fashion, and luxury essentials with world-class white-glove service.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button 
            onClick={onShopNow}
            className="group w-full sm:w-auto px-14 py-6 bg-blue-600 text-white font-black rounded-full hover:bg-blue-500 hover:scale-105 transition-all shadow-[0_0_50px_rgba(37,99,235,0.4)] flex items-center justify-center gap-4"
          >
            Explore Collection 
            <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </button>
          
          <button 
            className="w-full sm:w-auto px-14 py-6 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 backdrop-blur-xl border border-white/10 transition-all flex items-center justify-center gap-3"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Decorative Discover Element */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-blue-600 to-transparent"></div>
      </div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 25s infinite alternate ease-in-out;
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 1.2s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
