
import React, { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (s: 'home' | 'products' | 'admin') => void;
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  user: User | null;
  isAdmin: boolean;
  onLogout: () => void;
}

const Logo = () => (
  <div className="flex flex-col items-center group">
    <div className="relative">
      {/* Stars/Sparkles from the image */}
      <svg className="absolute -top-3 -right-5 w-8 h-8 text-white opacity-90 group-hover:scale-125 transition-transform duration-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
        <path d="M19 14L19.7 17.3L23 18L19.7 18.7L19 22L18.3 18.7L15 18L18.3 17.3L19 14Z" transform="scale(0.6) translate(10, -5)" />
        <path d="M19 14L19.7 17.3L23 18L19.7 18.7L19 22L18.3 18.7L15 18L18.3 17.3L19 14Z" transform="scale(0.4) translate(15, 20)" />
      </svg>
      
      {/* "tn" Stylized Text */}
      <div className="flex items-baseline select-none">
        <span className="text-5xl font-black text-white italic font-serif leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
          τ
        </span>
        <span className="w-2"></span> {/* Controlled space between t and n */}
        <span className="text-5xl font-black text-white italic font-serif leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
          η
        </span>
      </div>
    </div>
    
    {/* TRIDENT NOVA Subtext */}
    <div className="mt-1 text-[10px] font-black tracking-[0.3em] text-white/90 font-montserrat whitespace-nowrap">
      TRIDENT NOVA
    </div>
  </div>
);

const Navbar: React.FC<NavbarProps> = ({ 
  activeSection, 
  setActiveSection, 
  cartCount, 
  onCartClick, 
  onAdminClick,
  user,
  isAdmin,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled 
      ? 'bg-black/95 backdrop-blur-2xl shadow-2xl py-2' 
      : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <div 
          className="cursor-pointer group py-2" 
          onClick={() => setActiveSection('home')}
        >
          <Logo />
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-14 absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => setActiveSection('home')}
            className="relative py-2 group"
          >
            <span className={`text-xs font-black uppercase tracking-[0.25em] transition-colors ${
              activeSection === 'home' ? 'text-blue-500' : 'text-gray-300 group-hover:text-white'
            }`}>
              HOME
            </span>
            {activeSection === 'home' && (
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => setActiveSection('products')}
            className="relative py-2 group"
          >
            <span className={`text-xs font-black uppercase tracking-[0.25em] transition-colors ${
              activeSection === 'products' ? 'text-blue-500' : 'text-gray-300 group-hover:text-white'
            }`}>
              PRODUCTS
            </span>
            {activeSection === 'products' && (
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 rounded-full"></div>
            )}
          </button>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={onCartClick}
            className="relative p-2 text-white transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <i className="fas fa-shopping-bag text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-black shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={onAdminClick}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300 shadow-2xl ${
                isAdmin 
                ? 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-500' 
                : 'bg-white text-gray-900 hover:bg-gray-100 active:scale-95'
              }`}
            >
              <i className={`fas ${isAdmin ? 'fa-user-cog' : 'fa-user-shield'} text-sm`}></i>
              <span className="hidden sm:inline">
                {isAdmin ? 'Dashboard' : 'Admin Login'}
              </span>
            </button>
            
            {isAdmin && (
              <button 
                onClick={onLogout}
                className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all duration-300 border border-red-500/20 shadow-lg shadow-red-500/10"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
