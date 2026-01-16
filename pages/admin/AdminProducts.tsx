
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Edit2, Trash2, X, Image as ImageIcon, Check } from 'lucide-react';
import { useProductContext } from '../../context/ProductContext';
import { useLabelContext } from '../../context/LabelContext';
import { useCategoryContext } from '../../context/CategoryContext';
import { usePlatformContext } from '../../context/PlatformContext';
import { Product } from '../../types';

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProductContext();
  const { labels } = useLabelContext();
  const { categories } = useCategoryContext();
  const { platforms } = usePlatformContext();
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Filter Active Master Data
  const activeCategories = categories.filter(c => c.isActive);
  const activePlatforms = platforms.filter(p => p.isActive);
  const activeLabels = labels.filter(l => l.isActive);

  // Form State
  const initialFormState: Product = {
    id: '',
    title: '',
    price: 0,
    image: '',
    images: [],
    description: '',
    category: activeCategories.length > 0 ? activeCategories[0].name : '',
    platform: activePlatforms.length > 0 ? activePlatforms[0].name : '',
    affiliateLink: '',
    label: '',
    tryOnEnabled: false
  };

  const [formData, setFormData] = useState<Product>(initialFormState);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Reset form when opening to add new
  const handleAddNew = () => {
    setFormData({ 
      ...initialFormState, 
      id: `prod-${Date.now()}`,
      category: activeCategories.length > 0 ? activeCategories[0].name : '',
      platform: activePlatforms.length > 0 ? activePlatforms[0].name : '',
    });
    setIsEditing(false);
    setView('form');
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
    setView('form');
  };

  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteProduct(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: string[] = [];
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          newImages.push(URL.createObjectURL(file));
        }
      }
      
      const updatedImages = [...formData.images, ...newImages].slice(0, 10);
      let mainImage = formData.image;
      if (!mainImage && updatedImages.length > 0) {
        mainImage = updatedImages[0];
      }
      setFormData({ ...formData, images: updatedImages, image: mainImage });
    }
  };

  const handleSetMainImage = (img: string) => {
    setFormData({ ...formData, image: img });
  };

  const removeImage = (index: number) => {
    const imgToRemove = formData.images[index];
    const newImages = formData.images.filter((_, i) => i !== index);
    let newMain = formData.image;
    if (imgToRemove === newMain) {
      newMain = newImages.length > 0 ? newImages[0] : '';
    }
    setFormData({ ...formData, images: newImages, image: newMain });
  };

  const handleSave = () => {
    if (formData.images.length < 4) {
      alert("Please upload at least 4 images.");
      return;
    }
    if (!formData.title.trim()) {
      alert("Title is required.");
      return;
    }
    if (!formData.category) {
      alert("Please select or create an active category first.");
      return;
    }
    if (!formData.platform) {
      alert("Please select or create an active platform first.");
      return;
    }

    if (isEditing) {
      updateProduct(formData);
    } else {
      addProduct(formData);
    }
    setView('list');
  };

  const renderForm = () => (
    <div className="pb-20 animate-in slide-in-from-bottom duration-500">
      <div className="bg-white p-6 space-y-8">
        {/* Images */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Product Gallery (4-10 Images)</label>
             <span className="text-xs text-slate-400 font-bold">{formData.images.length} / 10</span>
           </div>
           
           <div className="grid grid-cols-4 gap-3">
             {formData.images.map((img, idx) => (
               <div key={idx} className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${formData.image === img ? 'border-sky-500 ring-2 ring-sky-100 shadow-lg' : 'border-slate-100 hover:border-slate-200'}`} onClick={() => handleSetMainImage(img)}>
                  <img src={img} className="w-full h-full object-cover" />
                  {formData.image === img && (
                    <div className="absolute inset-0 bg-sky-500/10 flex items-end justify-center pb-1">
                       <span className="bg-sky-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">DEFAULT</span>
                    </div>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 backdrop-blur-sm active:scale-90 transition-transform">
                    <X size={10} />
                  </button>
               </div>
             ))}
             {formData.images.length < 10 && (
               <div onClick={() => imageInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-sky-400 hover:text-sky-400 transition-all bg-slate-50 hover:bg-sky-50">
                  <Plus size={20} />
                  <span className="text-[8px] font-bold uppercase mt-1">Upload</span>
               </div>
             )}
           </div>
           <input type="file" ref={imageInputRef} multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
           <p className="text-[10px] text-slate-400 italic">Tip: Tap an image to set it as the primary display photo.</p>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Product Title</label>
             <input 
               type="text" 
               className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all font-medium"
               placeholder="Enter luxury title..."
               value={formData.title}
               onChange={(e) => setFormData({...formData, title: e.target.value})}
             />
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
             <textarea 
               rows={4}
               className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all resize-none"
               placeholder="Describe the aesthetic..."
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
             ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 appearance-none font-bold text-slate-700"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {activeCategories.length > 0 ? (
                    activeCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                  ) : (
                    <option disabled value="">Create categories first</option>
                  )}
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Platform</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 appearance-none font-bold text-slate-700"
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                >
                  {activePlatforms.length > 0 ? (
                    activePlatforms.map(p => <option key={p.id} value={p.name}>{p.name}</option>)
                  ) : (
                    <option disabled value="">Create platforms first</option>
                  )}
                </select>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Affiliate Link</label>
             <input 
               type="url" 
               className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all font-medium"
               placeholder="https://original-store.link/item"
               value={formData.affiliateLink}
               onChange={(e) => setFormData({...formData, affiliateLink: e.target.value})}
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Label (Collection)</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 appearance-none font-bold text-slate-700"
                  value={formData.label || ''}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                >
                  <option value="">No Special Label</option>
                  {activeLabels.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Price (INR)</label>
               <input 
                 type="number" 
                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all font-bold text-slate-800"
                 placeholder="0.00"
                 value={formData.price || ''}
                 onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
               />
            </div>
          </div>

          <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
             <div>
                <span className="text-sm font-bold text-slate-800">Try Now Enabled</span>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Virtual Fashion Studio</p>
             </div>
             <button 
               onClick={() => setFormData({...formData, tryOnEnabled: !formData.tryOnEnabled})}
               className={`w-14 h-7 rounded-full transition-all relative ${formData.tryOnEnabled ? 'bg-green-500 shadow-lg shadow-green-100' : 'bg-slate-300'}`}
             >
               <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${formData.tryOnEnabled ? 'left-8' : 'left-1'}`}></div>
             </button>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold uppercase tracking-[2px] shadow-2xl active:scale-95 transition-all mt-4 text-xs"
          >
            {isEditing ? 'Save Changes' : 'Confirm & Publish'}
          </button>
        </div>
      </div>
    </div>
  );

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
           <button onClick={() => view === 'form' ? setView('list') : navigate('/admin')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">
             {view === 'form' ? (isEditing ? 'Edit Product' : 'New Creation') : 'Inventory'}
           </h1>
        </div>
        {view === 'list' && (
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform"
          >
            <Plus size={14} />
            <span>Upload</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="p-6">
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search collection..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>

           <div className="space-y-4 animate-in fade-in duration-700">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4 group hover:shadow-md transition-all">
                   <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0 overflow-hidden shadow-inner">
                      <img src={prod.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate">{prod.title}</h3>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{prod.category} • {prod.platform}</p>
                   </div>
                   <div className="flex space-x-1.5 pr-1">
                      <button onClick={() => handleEdit(prod)} className="p-2 bg-sky-50 text-sky-600 rounded-xl active:scale-90 transition-transform"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteClick(prod.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl active:scale-90 transition-transform"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-slate-300 italic text-sm">No items matching your search.</div>
              )}
           </div>
        </div>
      ) : (
        renderForm()
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300 border border-slate-100">
              <div className="text-center mb-6">
                 <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Discard Item?</h3>
                 <p className="text-sm text-slate-500 leading-relaxed">Removing this product will permanently delete it from the marketplace.</p>
              </div>
              <div className="flex space-x-4">
                 <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all">Cancel</button>
                 <button onClick={confirmDelete} className="flex-1 py-3.5 bg-rose-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-rose-100 active:scale-95 transition-all">Delete</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;