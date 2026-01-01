
import React from 'react';
import { CartItem } from '../types';
import { convertDriveLink } from '../utils/drive';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onRemove, onUpdateQty }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    let message = `Hello Trident Nova! I'd like to place an order:%0A%0A`;
    cart.forEach(item => {
      message += `• ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString()}%0A`;
    });
    message += `%0A*Total: ₹${total.toLocaleString()}*%0A%0APlease confirm availability and share payment details.`;
    
    const whatsappUrl = `https://wa.me/917871947562?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-montserrat">Your Bag</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {cart.length > 0 ? (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                    <img 
                      src={convertDriveLink(item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between mb-1">
                       <h3 className="font-bold text-gray-900 truncate pr-2">{item.name}</h3>
                       <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <i className="fas fa-trash-alt text-sm"></i>
                       </button>
                    </div>
                    <p className="text-blue-600 font-bold mb-3">₹{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-xl px-2 py-1">
                        <button onClick={() => onUpdateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-md">-</button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-md">+</button>
                      </div>
                      <span className="text-xs font-bold text-gray-400">Total: ₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-center justify-center items-center flex-col text-center opacity-50">
                 <i className="fas fa-shopping-bag text-6xl mb-4"></i>
                 <p className="text-xl font-bold">Your bag is empty</p>
                 <p className="text-sm">Start adding some premium items!</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-semibold">Subtotal</span>
              <span className="text-3xl font-black font-montserrat">₹{total.toLocaleString()}</span>
            </div>
            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
            >
              <i className="fab fa-whatsapp text-2xl"></i> Checkout on WhatsApp
            </button>
            <p className="text-center text-gray-400 text-xs mt-4">Safe & secure direct ordering via WhatsApp</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
