
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Upload, X, CheckCircle, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useCategoryContext } from '../../context/CategoryContext';
import { useProductContext } from '../../context/ProductContext';
import { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategory } = useCategoryContext();
  const { products, updateProduct } = useProductContext();
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form State
  const initialFormState: Category = {
    id: '',
    name: '',
    image: '',
    isActive: true
  };
  const [formData, setFormData] = useState<Category>(initialFormState);
  const [originalName, setOriginalName] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (category: Category) => {
    setFormData(category);
    setOriginalName(category.name);
    setIsEditing(true);
    setView('form');
  };

  const handleAddNew = () => {
    setFormData({ ...initialFormState, id: `cat-${Date.now()}` });
    setIsEditing(false);
    setView('form');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, image: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.image) {
      alert("Category name and icon are required.");
      return;
    }
    if (isEditing) {
      updateCategory(formData);
      if (originalName && originalName !== formData.name) {
          products.filter(p => p.category === originalName).forEach(p => {
              updateProduct({ ...p, category: formData.name });
          });
      }
    } else {
      addCategory(formData);
    }
    setView('list');
  };

  const toggleStatus = (cat: Category) => {
    updateCategory({ ...cat, isActive: !cat.isActive });
  };

  const renderForm = () => (
    <div className="pb-20 animate-in slide-in-from-bottom duration-500">
       <div className="bg-white p-6 space-y-8">
          <div className="space-y-4">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center block">Category Visual (1:1)</label>
             <div className="flex flex-col items-center">
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className="w-32 h-32 rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-sky-300 transition-all overflow-hidden group shadow-inner"
                >
                  {formData.image ? (
                     <img src={formData.image} className="w-full h-full object-cover" />
                  ) : (
                     <Upload size={24} className="text-slate-300 group-hover:text-sky-400" />
                  )}
                </div>
                <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
             </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category Title</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 font-bold text-slate-800"
                  placeholder="e.g. Accessories, Outerwear..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
             </div>

             <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-200">
                <span className="text-sm font-bold text-slate-800">Master Visibility</span>
                <button 
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`w-14 h-7 rounded-full transition-all relative ${formData.isActive ? 'bg-sky-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${formData.isActive ? 'left-8' : 'left-1'}`}></div>
                </button>
             </div>

             <button 
               onClick={handleSave}
               className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold uppercase tracking-[2px] shadow-xl active:scale-95 transition-all text-xs"
             >
               {isEditing ? 'Save Category' : 'Register Category'}
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
           <button onClick={() => view === 'form' ? setView('list') : navigate('/admin')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">
             {view === 'form' ? 'Modify Catalog' : 'Catalog Categories'}
           </h1>
        </div>
        {view === 'list' && (
          <button onClick={handleAddNew} className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform">
            <Plus size={14} />
            <span>Create</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="p-6 space-y-4">
           {categories.map((cat, index) => (
             <div key={cat.id} className={`bg-white p-3 rounded-3xl border flex items-center space-x-4 transition-all ${cat.isActive ? 'border-slate-100' : 'border-slate-100 opacity-60 bg-slate-50'}`}>
                {/* Priority Controls */}
                <div className="flex flex-col space-y-1">
                   <button 
                     disabled={index === 0 || !cat.isActive}
                     onClick={() => reorderCategory(index, 'up')}
                     className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                   >
                      <ChevronUp size={16} strokeWidth={3} />
                   </button>
                   <button 
                     disabled={index === categories.length - 1 || !cat.isActive}
                     onClick={() => reorderCategory(index, 'down')}
                     className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                   >
                      <ChevronDown size={16} strokeWidth={3} />
                   </button>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0 overflow-hidden shadow-inner border border-slate-50">
                   <img src={cat.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                   <h3 className="text-sm font-bold text-slate-800 truncate">{cat.name}</h3>
                   <span className={`text-[8px] font-bold uppercase ${cat.isActive ? 'text-green-500' : 'text-slate-400'}`}>{cat.isActive ? 'Enabled' : 'Hidden'}</span>
                </div>
                <div className="flex items-center space-x-1">
                   <button onClick={() => toggleStatus(cat)} className="p-2 rounded-xl bg-slate-50 text-slate-400">
                      {cat.isActive ? <XCircle size={16} /> : <CheckCircle size={16} className="text-green-500" />}
                   </button>
                   <button onClick={() => handleEdit(cat)} className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Edit2 size={16} /></button>
                   <button onClick={() => setShowDeleteConfirm(cat.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Trash2 size={16} /></button>
                </div>
             </div>
           ))}
        </div>
      ) : renderForm()}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Delete Group?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">Products linked to this category will be marked as uncategorized.</p>
              <div className="flex space-x-4">
                 <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Cancel</button>
                 <button onClick={() => { deleteCategory(showDeleteConfirm); setShowDeleteConfirm(null); }} className="flex-1 py-3.5 bg-rose-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-rose-100">Delete</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
