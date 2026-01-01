
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CategoryItem } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: CategoryItem[];
  onAddToCart: (p: Product) => void;
  wishlist: string[];
  onWishlistToggle: (id: string) => void;
  showFilters?: boolean;
  initialCategory?: string;
  initialSort?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  categories,
  onAddToCart, 
  wishlist,
  onWishlistToggle,
  showFilters = false,
  initialCategory = 'all',
  initialSort = 'newest'
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    setCategory(initialCategory);
    setSort(initialSort);
  }, [initialCategory, initialSort]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || p.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') result.sort((a, b) => {
       const dateA = a.createdAt?.seconds || 0;
       const dateB = b.createdAt?.seconds || 0;
       return dateB - dateA;
    });

    return result;
  }, [products, search, category, sort]);

  return (
    <div>
      {showFilters && (
        <div className="mb-16 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:max-w-xl">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 md:w-56 px-6 py-4 bg-white rounded-2xl border border-gray-100 font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="all">All Items</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 md:w-56 px-6 py-4 bg-white rounded-2xl border border-gray-100 font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onAddToCart={() => onAddToCart(p)} 
              isWishlisted={wishlist.includes(p.id)}
              onWishlistToggle={() => onWishlistToggle(p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
           <i className="fas fa-search text-5xl text-gray-200 mb-6"></i>
           <h3 className="text-2xl font-black font-montserrat tracking-tight mb-2">No results</h3>
           <p className="text-gray-400 font-light">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
