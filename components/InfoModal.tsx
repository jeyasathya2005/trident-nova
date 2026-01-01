
import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  type: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'About Trident Nova',
          icon: 'fa-gem',
          body: 'Trident Nova was founded on the principle that luxury should be accessible and shopping should be a personal experience. We curate high-end electronics, fashion, and home goods for the discerning customer who values quality over quantity. Our team hand-picks every item in our inventory, ensuring it meets our rigorous standards of craftsmanship and innovation.'
        };
      case 'sustainability':
        return {
          title: 'Our Sustainability Commitment',
          icon: 'fa-leaf',
          body: 'We believe in responsible luxury. Trident Nova is committed to reducing our carbon footprint by optimizing our logistics network and encouraging paperless transactions. We prioritize manufacturers who adhere to ethical labor practices and sustainable material sourcing. Luxury doesn\'t have to cost the Earth.'
        };
      case 'service':
        return {
          title: 'White-Glove Service',
          icon: 'fa-concierge-bell',
          body: 'At Trident Nova, you are not just a customer; you are a patron. Our White-Glove service includes personalized WhatsApp consultations, expedited priority shipping, and dedicated support for every purchase. We handle every step of your journey with care, from the moment you browse to the moment your premium item arrives at your door.'
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: 'fa-user-lock',
          body: 'Your data is treated with the same respect as our products. We only collect essential information required for order fulfillment and communication. We never sell your personal data to third parties. All transactions via WhatsApp are encrypted and handled directly by our team.'
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: 'fa-file-contract',
          body: 'By using Trident Nova, you agree to our direct-checkout model. Prices are subject to availability. As we deal in premium items, returns are handled on a case-by-case basis to ensure the integrity of our inventory. Warranty support is provided according to original manufacturer specifications.'
        };
      default:
        return { title: 'Information', icon: 'fa-info-circle', body: 'Content coming soon.' };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
           <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-6">
           <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <i className={`fas ${content.icon} text-3xl`}></i>
           </div>
           <h2 className="text-2xl font-black font-montserrat">{content.title}</h2>
        </div>

        <div className="text-gray-600 leading-relaxed text-center">
           {content.body}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InfoModal;
