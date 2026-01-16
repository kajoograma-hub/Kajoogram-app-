
import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  isLoggedIn?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLoggedIn = false }) => {
  const navigate = useNavigate();

  const handleTryNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/auth');
    } else {
      // Navigate to create/try-on feature
      navigate('/create');
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate opening affiliate link
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank');
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-[20px] overflow-hidden shadow-sm border border-slate-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col"
    >
      <div className="relative aspect-square shrink-0 overflow-hidden bg-slate-50">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <span className="glass px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-600 uppercase tracking-wider border border-white/40 shadow-sm">
            {product.platform}
          </span>
        </div>
        {product.originalPrice && (
          <div className="absolute bottom-2 right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-1 justify-between space-y-2">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-slate-800 line-clamp-1 leading-tight">{product.title}</h3>
          <div className="flex items-baseline space-x-1.5 flex-wrap">
            <span className="text-sm font-bold text-slate-900">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-slate-400 line-through decoration-slate-400">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button 
            onClick={handleBuyNow}
            className={`py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center space-x-1 transition-all active:scale-95 ${!product.tryOnEnabled ? 'col-span-2' : ''}`}
          >
            <span>Buy</span>
          </button>
          
          {product.tryOnEnabled && (
            <button 
              onClick={handleTryNow}
              className="py-2 bg-gradient-to-r from-sky-100 to-lavender-100 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center space-x-1 transition-all active:scale-95 hover:shadow-sm border border-white"
            >
              <Sparkles size={12} className="text-sky-500" />
              <span>Try</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
