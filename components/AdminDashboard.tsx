
import React, { useState, useMemo } from 'react';
import { Product, CategoryItem } from '../types';
import { db } from '../lib/firebase';
// Fix: Using @firebase/firestore to ensure modular exports are found correctly by the bundler
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from '@firebase/firestore';
import { convertDriveLink } from '../utils/drive';

interface AdminDashboardProps {
  products: Product[];
  categories: CategoryItem[];
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, categories, onLogout }) => {
  const [adminSearch, setAdminSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    stock: '10'
  });

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
      p.category.toLowerCase().includes(adminSearch.toLowerCase())
    );
  }, [products, adminSearch]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.includes('drive.google.com')) {
        if (!confirm('The image link does not look like a Google Drive link. Proceed anyway?')) return;
    }
    
    setLoading(true);

    const payload: any = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      category: formData.category || (categories[0]?.name || 'Uncategorized'),
      description: formData.description,
      image: formData.image,
      stock: parseInt(formData.stock) || 0,
      updatedAt: serverTimestamp()
    };

    try {
      if (editingId) {
        const productRef = doc(db, 'products', editingId);
        await updateDoc(productRef, payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), payload);
      }
      resetForm();
    } catch (err: any) {
      console.error("Firebase Error:", err);
      alert(`Error: ${err.message || 'Failed to save product.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await addDoc(collection(db, 'categories'), { name: newCategoryName.trim() });
      setNewCategoryName('');
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Delete this category? Products using it will need to be updated.')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (err) {
        console.error("Failed to delete category", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: '', description: '', image: '', stock: '10' });
    setEditingId(null);
    setIsFormOpen(false);
    setLoading(false);
  };

  const editProduct = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: p.price.toString(),
      category: p.category,
      description: p.description,
      image: p.image,
      stock: p.stock.toString()
    });
    setIsFormOpen(true);
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err: any) {
        alert(`Failed to delete: ${err.message}`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black font-montserrat text-gray-900 tracking-tight">Inventory Control</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 font-medium text-sm">Managing <span className="text-blue-600 font-bold">{products.length}</span> live products</p>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setIsCategoryManagerOpen(true)}
            className="px-6 py-4 rounded-2xl border border-gray-200 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2 bg-white"
          >
            <i className="fas fa-tags"></i> Categories
          </button>
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text"
              placeholder="Search products..."
              className="pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold text-sm w-48 lg:w-64"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl"
          >
            <i className="fas fa-plus"></i> New Product
          </button>
        </div>
      </div>

      {/* Category Manager Modal */}
      {isCategoryManagerOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
            <button onClick={() => setIsCategoryManagerOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <i className="fas fa-times text-xl"></i>
            </button>
            <h2 className="text-2xl font-black font-montserrat mb-6">Manage Categories</h2>
            
            <div className="flex gap-2 mb-8">
              <input 
                className="flex-grow px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                value={newCategoryName}
                placeholder="Category name..."
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button 
                onClick={handleAddCategory}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-700 uppercase tracking-widest text-xs">{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black font-montserrat tracking-tight">{editingId ? 'Modify Product' : 'Register New Product'}</h2>
              <button type="button" onClick={resetForm} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="flex-grow overflow-y-auto p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Product Title</label>
                    <input required className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                      value={formData.name} placeholder="e.g. Ultra Slim LED Monitor" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Retail Price (₹)</label>
                      <input required type="number" className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-black text-xl text-blue-600"
                        value={formData.price} placeholder="0" onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Collection / Category</label>
                      <select required className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm uppercase tracking-widest"
                        value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 flex justify-between items-center">
                      <span>Google Drive Image Link</span>
                      <span className="text-blue-500 lowercase tracking-normal font-medium">Use sharing link</span>
                    </label>
                    <input className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm overflow-hidden"
                      value={formData.image} placeholder="https://drive.google.com/file/d/..." onChange={(e) => setFormData({...formData, image: e.target.value})} />
                    <div className="mt-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3 items-start">
                        <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                        <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                            <strong>Setup Required:</strong> Click "Share" on Google Drive and set Access to <strong>"Anyone with the link"</strong>. The app will automatically convert it to a high-speed direct image.
                        </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Item Description</label>
                    <textarea required rows={5} className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed"
                      value={formData.description} placeholder="Describe the premium features..." onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="sticky top-0 bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-xl shadow-gray-100 h-fit">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">Live Preview</label>
                    <div className="aspect-square bg-gray-50 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center relative">
                        {formData.image ? (
                        <img 
                            src={convertDriveLink(formData.image)} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-[2rem] animate-pulse-once" 
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800';
                            }}
                        />
                        ) : (
                        <div className="text-center p-8">
                            <i className="fas fa-cloud-upload-alt text-5xl text-gray-200 mb-4"></i>
                            <p className="text-sm font-bold text-gray-300">Image will appear here</p>
                        </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm">
                            {formData.category || 'Category'}
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <h3 className="font-black font-montserrat text-xl truncate">{formData.name || 'Product Title'}</h3>
                        <p className="text-2xl font-black text-blue-600">₹{parseFloat(formData.price).toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 mt-16 pb-10">
                <button type="button" onClick={resetForm} className="flex-1 py-6 bg-gray-100 text-gray-600 font-black text-xs uppercase tracking-widest rounded-[1.5rem] hover:bg-gray-200 transition-all">Discard Changes</button>
                <button type="submit" disabled={loading} className="flex-[2] py-6 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-[1.5rem] hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3">
                  {loading ? (
                      <><i className="fas fa-circle-notch fa-spin"></i> Processing...</>
                  ) : (
                      editingId ? <><i className="fas fa-save"></i> Save Updates</> : <><i className="fas fa-rocket"></i> Publish Product</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Class</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Value</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-blue-50/10 transition-colors group">
                  <td className="px-10 py-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                        <img src={convertDriveLink(p.image)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="font-black text-gray-900 font-montserrat tracking-tight text-lg">{p.name}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500">{p.category}</span>
                  </td>
                  <td className="px-10 py-8 font-black text-gray-900 text-lg">₹{p.price.toLocaleString()}</td>
                  <td className="px-10 py-8 text-right space-x-2">
                    <button onClick={() => editProduct(p)} className="p-4 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all"><i className="fas fa-edit"></i></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-4 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 shadow-sm transition-all"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                  <tr>
                      <td colSpan={4} className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-sm">No products found in database</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
