
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Upload, Grid, Tag, Layers, ShoppingBag, Layout, FileText, Bell, BarChart, X, ChevronRight, User, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const { appLogo, setAppLogo } = useAppContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAppLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { icon: User, label: 'Back to Profile', action: () => navigate('/profile') },
    { icon: Layout, label: 'Dashboard', action: () => setIsDrawerOpen(false) },
    { icon: ShoppingBag, label: 'Products', action: () => navigate('/admin/products') },
    { icon: Layers, label: 'Platform', action: () => navigate('/admin/platforms') },
    { icon: Grid, label: 'Category', action: () => navigate('/admin/categories') },
    { icon: ImageIcon, label: 'Slider', action: () => navigate('/admin/sliders') },
    { icon: Tag, label: 'Label', action: () => navigate('/admin/labels') },
    { icon: FileText, label: 'Menu Pages', action: () => navigate('/admin/menu-pages') },
    { icon: BarChart, label: 'Reports', action: () => navigate('/admin/reports') },
    { icon: Bell, label: 'Notification', action: () => navigate('/admin/notifications') },
  ];

  const dashboardGrid = [
    { icon: ShoppingBag, label: 'Products', action: () => navigate('/admin/products') },
    { icon: Layers, label: 'Platform', action: () => navigate('/admin/platforms') },
    { icon: Grid, label: 'Category', action: () => navigate('/admin/categories') },
    { icon: ImageIcon, label: 'Slider', action: () => navigate('/admin/sliders') },
    { icon: Tag, label: 'Label', action: () => navigate('/admin/labels') },
    { icon: FileText, label: 'Menu Pages', action: () => navigate('/admin/menu-pages') },
    { icon: BarChart, label: 'Reports', action: () => navigate('/admin/reports') },
    { icon: Bell, label: 'Notification', action: () => navigate('/admin/notifications') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setIsDrawerOpen(true)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
          <Menu size={24} className="text-slate-800" />
        </button>
        <h1 className="font-serif font-bold text-lg text-slate-800">Admin Panel</h1>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
           <span className="font-bold text-xs text-slate-600">A</span>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-lg mx-auto">
        
        {/* Logo Upload Section */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-100 border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">App Logo</h2>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">Live Update</span>
           </div>
           
           <div className="flex flex-col items-center space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-sky-300 transition-colors overflow-hidden group relative"
              >
                {appLogo ? (
                   <img src={appLogo} className="w-full h-full object-contain p-2" alt="Logo" />
                ) : (
                   <div className="flex flex-col items-center text-slate-400 group-hover:text-sky-400">
                      <Upload size={24} />
                      <span className="text-[10px] font-bold mt-2">Upload</span>
                   </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-xs font-bold text-white">Change</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleLogoUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-transform"
              >
                Select Image
              </button>
           </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 gap-4">
           {dashboardGrid.map((item) => (
             <button 
               key={item.label}
               onClick={item.action}
               className="bg-white p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center justify-center space-y-3 aspect-square active:scale-95 group"
             >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                   <item.icon size={24} className="text-slate-600 group-hover:text-sky-500 transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Sidebar Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
           <div className="absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50">
                 <h2 className="font-serif font-bold text-xl text-slate-800">Menu</h2>
                 <button onClick={() => setIsDrawerOpen(false)} className="p-1"><X size={20} className="text-slate-500" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                 {menuItems.map((item, index) => (
                   <button 
                     key={item.label} 
                     onClick={item.action}
                     className={`w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${index === 0 ? 'text-blue-600' : 'text-slate-600'}`}
                   >
                      <div className="flex items-center space-x-4">
                         <item.icon size={20} />
                         <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                   </button>
                 ))}
              </div>

              <div className="p-6 border-t border-slate-50">
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">A</div>
                    <div>
                       <p className="text-sm font-bold text-slate-800">Admin</p>
                       <p className="text-xs text-slate-400">patwaadmin@gmail.com</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminHome;
