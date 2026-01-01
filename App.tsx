
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import InfoModal from './components/InfoModal';
import { Product, CartItem, CategoryItem } from './types';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
// Fix: Using @firebase/firestore to ensure modular exports are found correctly by the bundler
import { collection, query, orderBy, onSnapshot, doc, getDoc } from '@firebase/firestore';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'products' | 'admin'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('trident_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('trident_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; type: string }>({ isOpen: false, type: '' });
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [globalCategory, setGlobalCategory] = useState<string>('all');
  const [globalSort, setGlobalSort] = useState<string>('newest');

  useEffect(() => {
    localStorage.setItem('trident_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('trident_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          setIsAdmin(adminDoc.exists());
        } catch (e) {
          console.error("Admin check failed:", e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch Products
    const qProducts = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(snapDoc => ({ id: snapDoc.id, ...snapDoc.data() } as Product)));
    });

    // Fetch Categories
    const qCats = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubCats = onSnapshot(qCats, (snapshot) => {
      setCategories(snapshot.docs.map(snapDoc => ({ id: snapDoc.id, ...snapDoc.data() } as CategoryItem)));
    });

    return () => {
      unsubProducts();
      unsubCats();
    };
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const navigateWithFilter = (section: 'home' | 'products' | 'admin', cat: string = 'all', sort: string = 'newest') => {
    setGlobalCategory(cat);
    setGlobalSort(sort);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveSection('home');
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="fas fa-gem fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-900 font-bold tracking-widest uppercase text-xs">Trident Nova</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fcfcfc]">
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={(s) => navigateWithFilter(s)}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={() => isAdmin ? setActiveSection('admin') : setIsLoginModalOpen(true)}
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {activeSection === 'home' && (
          <>
            <Hero onShopNow={() => navigateWithFilter('products')} />
            
            <div className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                <div className="group p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-blue-600 group-hover:scale-110 transition-transform">
                    <i className="fas fa-shipping-fast text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-black mb-4 font-montserrat tracking-tight">Priority Shipping</h3>
                  <p className="text-gray-500 font-light leading-relaxed">Expedited white-glove delivery for all premium orders across India.</p>
                </div>
                <div className="group p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-blue-600 group-hover:scale-110 transition-transform">
                    <i className="fas fa-shield-alt text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-black mb-4 font-montserrat tracking-tight">Secure Checkout</h3>
                  <p className="text-gray-500 font-light leading-relaxed">Direct WhatsApp interaction ensures a personal and high-security buying experience.</p>
                </div>
                <div className="group p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-blue-600 group-hover:scale-110 transition-transform">
                    <i className="fas fa-award text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-black mb-4 font-montserrat tracking-tight">Authenticity</h3>
                  <p className="text-gray-500 font-light leading-relaxed">Every item in our collection is hand-vetted for absolute quality and provenance.</p>
                </div>
              </div>
            </div>

            <div id="featured" className="py-24 px-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-black font-montserrat tracking-tight">Featured</h2>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Selection 2024</p>
                </div>
                <button 
                  onClick={() => navigateWithFilter('products')}
                  className="px-8 py-3 rounded-full border border-gray-200 text-sm font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                >
                  View All
                </button>
              </div>
              <ProductGrid 
                products={products.slice(0, 8)} 
                categories={categories}
                onAddToCart={addToCart} 
                wishlist={wishlist}
                onWishlistToggle={toggleWishlist}
              />
            </div>
          </>
        )}

        {activeSection === 'products' && (
          <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
             <div className="text-center mb-20">
               <h2 className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">The Catalog</h2>
               <h1 className="text-5xl font-black font-montserrat mb-6 text-gray-900 tracking-tighter">OUR COLLECTION</h1>
               <div className="w-12 h-1 bg-blue-600 mx-auto mb-4"></div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing {products.length} Items</p>
             </div>
             <ProductGrid 
               products={products} 
               categories={categories}
               onAddToCart={addToCart} 
               showFilters 
               initialCategory={globalCategory}
               initialSort={globalSort}
               wishlist={wishlist}
               onWishlistToggle={toggleWishlist}
             />
          </div>
        )}

        {activeSection === 'admin' && isAdmin && (
          <div className="pt-32">
            <AdminDashboard products={products} categories={categories} onLogout={handleLogout} />
          </div>
        )}
      </main>

      <Footer 
        onNavigate={navigateWithFilter} 
        onShowInfo={(type) => setInfoModal({ isOpen: true, type })}
        categories={categories}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
      />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          setActiveSection('admin');
        }}
      />

      <InfoModal 
        isOpen={infoModal.isOpen} 
        type={infoModal.type} 
        onClose={() => setInfoModal({ isOpen: false, type: '' })} 
      />
    </div>
  );
};

export default App;
