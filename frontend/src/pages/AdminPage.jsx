import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Trash2, Users, Package, ArrowLeft, Lock, 
  CheckCircle2, ArrowRight, Upload, Sparkles, Image as ImageIcon, X,
  Tag, Edit2, AlertCircle, HelpCircle
} from 'lucide-react';
import { getProducts, createProduct, deleteProduct, getAllCustomerLeads } from '../services/api';

const ADMIN_PIN = "1234";

export default function AdminPage({ onBackToCatalog, categories, setCategories }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'manage', 'leads', 'categories'
  const [uploadStep, setUploadStep] = useState(1);

  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Professional Center Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'step1', // 'step1', 'step2', 'delete'
    targetId: null
  });

  // Category Management State
  const [newCatName, setNewCatName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Garment Form State
  const [form, setForm] = useState({
    name: '',
    category: categories[1] || 'Silk Sarees',
    price: '',
    imageUrl: '',
    dimensions: 'Free Size (with Blouse)',
    material: 'Pure Soft Silk',
    description: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid Admin Passcode!');
    }
  };

  const loadData = async () => {
    try {
      const prodData = await getProducts();
      setProducts(prodData || []);
      const leadsData = await getAllCustomerLeads();
      setLeads(leadsData || []);
    } catch (err) {
      console.warn("Could not fetch data", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Handle Device File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Step 1 Confirmation Modal
  const handleProceedToDetails = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.imageUrl) {
      alert("Garment Title, Price, and Photo are required!");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Confirm Basic Garment Entry',
      message: 'Review your initial pricing & photo before configuring size charts and fabric specifics.',
      type: 'step1',
      targetId: null
    });
  };

  // Trigger Step 2 Final Confirmation Modal
  const handleFinalPublishTrigger = (e) => {
    e.preventDefault();
    setConfirmModal({
      isOpen: true,
      title: 'Publish Garment to Live Showcase?',
      message: 'This piece will immediately become visible to all registered visitors on your catalog.',
      type: 'step2',
      targetId: null
    });
  };

  // Trigger Delete Confirmation Modal
  const handleDeleteTrigger = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Garment from Showcase?',
      message: `Are you sure you want to remove "${name}" from your digital catalog?`,
      type: 'delete',
      targetId: id
    });
  };

  // Modal Confirm Action Execution
  const handleModalConfirm = async () => {
    const modalType = confirmModal.type;
    setConfirmModal({ ...confirmModal, isOpen: false });

    if (modalType === 'step1') {
      setUploadStep(2);
    } else if (modalType === 'step2') {
      setLoading(true);
      try {
        const payload = {
          name: form.name.trim(),
          category: form.category,
          price: Number(form.price),
          imageUrl: form.imageUrl,
          dimensions: form.dimensions,
          material: form.material,
          description: form.description,
          isAvailable: true
        };

        await createProduct(payload);

        setSuccessMsg(`"${form.name}" has been published to live showcase!`);
        
        setForm({
          name: '',
          category: categories[1] || 'Silk Sarees',
          price: '',
          imageUrl: '',
          dimensions: 'Free Size (with Blouse)',
          material: 'Pure Soft Silk',
          description: ''
        });
        setUploadStep(1);
        loadData();

        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        console.error("Save error:", err);
        alert("Failed to save garment. Ensure Spring Boot backend is active.");
      } finally {
        setLoading(false);
      }
    } else if (modalType === 'delete') {
      try {
        await deleteProduct(confirmModal.targetId);
        setProducts(products.filter((p) => p.id !== confirmModal.targetId));
      } catch (err) {
        alert("Could not remove item.");
      }
    }
  };

  // Category Actions
  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      alert("Category already exists!");
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    localStorage.setItem('nr_boutique_categories', JSON.stringify(updated));
    setNewCatName('');
    setSuccessMsg(`"${trimmed}" category added!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteCategory = (catToDelete) => {
    if (catToDelete === 'All') {
      alert("Cannot remove default 'All' filter.");
      return;
    }
    if (!window.confirm(`Delete "${catToDelete}" category?`)) return;
    const updated = categories.filter((c) => c !== catToDelete);
    setCategories(updated);
    localStorage.setItem('nr_boutique_categories', JSON.stringify(updated));
  };

  const handleSaveEditCategory = (index) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const updated = [...categories];
    updated[index] = trimmed;
    setCategories(updated);
    localStorage.setItem('nr_boutique_categories', JSON.stringify(updated));
    setEditingIndex(null);
    setEditValue('');
  };

  // 1. PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="w-screen min-h-screen bg-[#1c0810] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-rose-200 text-center">
          <div className="w-14 h-14 bg-rose-950 text-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Lock size={26} />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900">NR Mart Hub Admin</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">Enter Passcode (1234) to unlock console</p>

          {pinError && <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl mb-4 border border-rose-100">{pinError}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-bold py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-950"
            />
            <button
              type="submit"
              className="w-full py-3 bg-rose-950 hover:bg-rose-900 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-md"
            >
              Unlock Dashboard
            </button>
          </form>

          <button
            onClick={onBackToCatalog}
            className="mt-6 text-xs text-slate-500 hover:text-rose-900 flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-slate-100 flex flex-col font-sans relative">
      
      {/* Top Header */}
      <header className="bg-[#210D15] text-white w-full px-6 sm:px-12 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToCatalog}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-rose-900/60 hover:bg-rose-900 px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Shop
          </button>
          <div>
            <h1 className="text-lg font-bold font-serif">NR Mart Hub • Boutique Console</h1>
            <p className="text-[11px] text-rose-200">Catalog & Pipeline Control</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveTab('upload'); setUploadStep(1); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'upload' ? 'bg-amber-400 text-rose-950 shadow-md' : 'bg-rose-900/60 text-white hover:bg-rose-900'
            }`}
          >
            <PlusCircle size={15} /> Upload Product
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'categories' ? 'bg-amber-400 text-rose-950 shadow-md' : 'bg-rose-900/60 text-white hover:bg-rose-900'
            }`}
          >
            <Tag size={15} /> Manage Categories ({categories.length - 1})
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'manage' ? 'bg-amber-400 text-rose-950 shadow-md' : 'bg-rose-900/60 text-white hover:bg-rose-900'
            }`}
          >
            <Package size={15} /> Live Items ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'leads' ? 'bg-amber-400 text-rose-950 shadow-md' : 'bg-rose-900/60 text-white hover:bg-rose-900'
            }`}
          >
            <Users size={15} /> Visitor Leads ({leads.length})
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="w-full px-6 sm:px-12 py-8 flex-1 max-w-7xl mx-auto">
        
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-sm font-semibold shadow-xs">
            <CheckCircle2 size={18} className="text-emerald-600" />
            {successMsg}
          </div>
        )}

        {/* TAB: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold font-serif text-slate-900">Manage Showcase Categories</h2>
              <p className="text-xs text-slate-500 mt-1">Add or reorganize garment groups visible on the main page filter bar.</p>
            </div>

            <form onSubmit={handleAddCategory} className="flex gap-3 max-w-md mb-8">
              <input
                type="text"
                required
                placeholder="Enter new category (e.g. Sarees, Lehengas)..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-xs font-medium"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-rose-950 hover:bg-rose-900 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle size={15} /> Add Category
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat, idx) => (
                <div 
                  key={cat}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between"
                >
                  {editingIndex === idx ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="p-1.5 border border-slate-300 rounded-lg text-xs w-full bg-white font-bold"
                      />
                      <button
                        onClick={() => handleSaveEditCategory(idx)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-2 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{cat}</p>
                          <span className="text-[10px] text-slate-400">
                            {cat === 'All' ? 'System Default' : 'Custom Category'}
                          </span>
                        </div>
                      </div>

                      {cat !== 'All' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditingIndex(idx); setEditValue(cat); }}
                            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                            title="Rename"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: UPLOAD PRODUCT */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  {uploadStep === 1 ? "Step 1: Choose Garment Photo & Basic Price" : "Step 2: Fabric & Specifications"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {uploadStep === 1 ? "Select photo directly from your device." : "Specify fabric material, sizes, and care details."}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className={`px-3 py-1 rounded-full ${uploadStep === 1 ? 'bg-rose-950 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                  1. Photo & Basic Info
                </span>
                <span className="text-slate-300">→</span>
                <span className={`px-3 py-1 rounded-full ${uploadStep === 2 ? 'bg-rose-950 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  2. Specification Details
                </span>
              </div>
            </div>

            {uploadStep === 1 && (
              <form onSubmit={handleProceedToDetails} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                <div className="space-y-5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Garment Title / Model *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pure Kanchipuram Bridal Silk Saree"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Category *</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none bg-white text-sm font-semibold"
                      >
                        {categories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Showroom Price (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 5999"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Select Photo From Your Device *
                    </label>
                    
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-rose-300 hover:border-rose-950 rounded-2xl cursor-pointer bg-rose-50/40 hover:bg-rose-50/80 transition p-4 text-center">
                      <Upload size={28} className="text-rose-900 mb-2" />
                      <span className="text-xs font-bold text-rose-950">Click to Choose Photo</span>
                      <span className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP (Max 5MB)</span>
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-rose-950 hover:bg-rose-900 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Specifications</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-rose-50/30 border border-rose-100 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[340px] text-center">
                  {form.imageUrl ? (
                    <div className="w-full max-w-xs space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: '' })}
                        className="absolute -top-2 -right-2 p-1.5 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 cursor-pointer"
                        title="Remove Photo"
                      >
                        <X size={14} />
                      </button>
                      <p className="text-xs font-bold text-rose-900 uppercase tracking-wider">Photo Preview</p>
                      <img 
                        src={form.imageUrl} 
                        alt="Preview" 
                        className="w-full aspect-3/4 object-cover rounded-2xl shadow-lg border border-rose-200"
                      />
                      <p className="font-bold text-slate-900 text-sm">{form.name || 'Sample Title'}</p>
                      <p className="font-black text-rose-950 text-base">₹{form.price || '0'}</p>
                    </div>
                  ) : (
                    <div className="text-slate-400 space-y-2">
                      <ImageIcon size={44} className="mx-auto text-rose-300" />
                      <p className="text-xs font-semibold">No photo selected yet</p>
                      <p className="text-[11px] text-slate-400">Selected image will preview here instantly</p>
                    </div>
                  )}
                </div>

              </form>
            )}

            {uploadStep === 2 && (
              <form onSubmit={handleFinalPublishTrigger} className="space-y-6 text-xs max-w-2xl mx-auto">
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={form.imageUrl} 
                      alt="" 
                      className="w-12 h-12 object-cover rounded-xl border border-amber-300 shadow-xs"
                    />
                    <div>
                      <span className="font-bold text-amber-950 block">{form.name}</span>
                      <span className="text-[11px] text-amber-800">{form.category} • ₹{form.price}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadStep(1)}
                    className="text-xs font-bold text-rose-900 underline cursor-pointer"
                  >
                    Change Photo / Price
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Available Sizes</label>
                    <input
                      type="text"
                      placeholder="e.g. Free Size (6.3m) or S, M, L, XL"
                      value={form.dimensions}
                      onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Fabric Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Pure Mulberry Silk with Golden Zari"
                      value={form.material}
                      onChange={(e) => setForm({ ...form, material: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Garment Description</label>
                  <textarea
                    rows={4}
                    placeholder="Weave details, border styling, contrast pallu details..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setUploadStep(1)}
                    className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <CheckCircle2 size={18} />
                    <span>Publish to Live Showcase</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

        {/* TAB: MANAGE ITEMS */}
        {activeTab === 'manage' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-4 border-b border-slate-100 pb-3">
              Live Showcase Items ({products.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Garment</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-12 h-12 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-400">{item.material}</p>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-rose-900">{item.category}</td>
                      <td className="p-3 font-bold text-slate-900">₹{item.price}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteTrigger(item.id, item.name)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMER LEADS */}
        {activeTab === 'leads' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold font-serif text-slate-900 mb-4 border-b border-slate-100 pb-3">
              Customer Leads ({leads.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="p-3 font-bold text-slate-900">{lead.name}</td>
                      <td className="p-3 text-slate-800">{lead.phoneNumber}</td>
                      <td className="p-3">
                        <a
                          href={`https://wa.me/91${lead.phoneNumber.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold"
                        >
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* PROFESSIONAL CENTER CONFIRMATION MODAL POPUP */}
      {/* ========================================================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-100 transform transition-all scale-100">
            
            {/* Modal Header */}
            <div className="bg-[#210D15] p-6 text-white text-center relative">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
                {confirmModal.type === 'delete' ? (
                  <AlertCircle size={24} className="text-rose-400" />
                ) : (
                  <HelpCircle size={24} className="text-amber-300" />
                )}
              </div>
              <h3 className="text-lg font-bold font-serif">{confirmModal.title}</h3>
              <p className="text-xs text-rose-200 mt-1">{confirmModal.message}</p>
            </div>

            {/* Modal Content Preview (for product workflows) */}
            {confirmModal.type === 'step1' && (
              <div className="p-5 bg-rose-50/50 border-b border-rose-100 flex items-center gap-3.5">
                <img 
                  src={form.imageUrl} 
                  alt="" 
                  className="w-14 h-14 object-cover rounded-xl border border-rose-200 shadow-xs"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block line-clamp-1">{form.name}</span>
                  <span className="text-slate-500">{form.category}</span>
                  <span className="font-black text-rose-950 block mt-0.5">₹{form.price}</span>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="p-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalConfirm}
                className={`w-1/2 py-3 font-bold rounded-xl text-xs transition text-white shadow-md cursor-pointer flex items-center justify-center gap-1.5 ${
                  confirmModal.type === 'delete' 
                    ? 'bg-rose-600 hover:bg-rose-700' 
                    : 'bg-rose-950 hover:bg-rose-900'
                }`}
              >
                <span>{confirmModal.type === 'delete' ? 'Yes, Delete' : 'Confirm & Proceed'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}