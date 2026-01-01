
import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
// Fix: Using @firebase/firestore to ensure modular exports are found correctly by the bundler/compiler
import { doc, getDoc } from '@firebase/firestore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      
      if (adminDoc.exists()) {
        onLoginSuccess();
      } else {
        await auth.signOut();
        setError('Unauthorized: You do not have admin access.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
           <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <i className="fas fa-user-shield text-white text-3xl"></i>
           </div>
           <h2 className="text-2xl font-black font-montserrat">Admin Portal</h2>
           <p className="text-gray-500">Access the Trident Nova management tools.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
           {error && (
             <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-3">
               <i className="fas fa-exclamation-circle"></i> {error}
             </div>
           )}

           <div>
             <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
             <input 
               type="email" required
               className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="admin@tridentnova.com"
             />
           </div>

           <div>
             <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
             <input 
               type="password" required
               className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="••••••••"
             />
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
           >
             {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Authenticate Access'}
           </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
           <p>Restricted area for authorized personnel only.</p>
           <p className="mt-2">Support: +91 78719 47562</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;