import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  PlusCircle, Trash2, Users, Package, ArrowLeft, Lock,
  CheckCircle2, ArrowRight, Upload, Image as ImageIcon, X,
  Tag, Edit2, AlertCircle, HelpCircle, FileSpreadsheet, Layers, LogOut
} from 'lucide-react';
import { getProducts, createProduct, deleteProduct, getAllCustomerLeads } from '../services/api';

const ADMIN_PIN = "1234";
const ADMIN_AUTH_KEY = "nr_admin_authenticated";
const ADMIN_VIEW_KEY = "nr_boutique_admin_view";
const QUICK_SIZES = ["Free Size", "S, M, L, XL", "M, L, XL, XXL", "Unstitched"];
const DEFAULT_GARMENT_IMAGE = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800";

export default function AdminPage({ onBackToCatalog, categories, setCategories }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState('upload');
  const [uploadMode, setUploadMode] = useState('single');
  const [uploadStep, setUploadStep] = useState(1);

  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [bulkItems, setBulkItems] = useState([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkPushing, setBulkPushing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'step1',
    targetId: null
  });

  const [newCatName, setNewCatName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: categories[1] || 'Silk Sarees',
    price: '',
    imageUrl: '',
    dimensions: '',
    material: '',
    description: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      localStorage.setItem(ADMIN_AUTH_KEY, "true");
      setIsAuthenticated(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Invalid Admin Passcode!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.setItem(ADMIN_VIEW_KEY, "false");
    setIsAuthenticated(false);
    setPinInput('');
    setPinError('');
    setUploadStep(1);
    if (onBackToCatalog) {
      onBackToCatalog();
    }
  };

  const loadData = async () => {
    try {
      const prodData = await getProducts();
      setProducts(Array.isArray(prodData) ? prodData : []);
      const leadsData = await getAllCustomerLeads();
      setLeads(Array.isArray(leadsData) ? leadsData : []);
    } catch (err) {
      console.warn("Could not fetch data", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setForm((prev) => ({ ...prev, imageUrl: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const syncCategoriesFromItems = (items) => {
    const existingLower = new Set(categories.map((c) => c.toLowerCase()));
    const added = [];

    items.forEach((item) => {
      const cat = (item.category || '').trim();
      if (cat && !existingLower.has(cat.toLowerCase())) {
        existingLower.add(cat.toLowerCase());
        added.push(cat);
      }
    });

    if (added.length > 0) {
      const updatedCats = [...categories, ...added];
      setCategories(updatedCats);
      localStorage.setItem('nr_boutique_categories', JSON.stringify(updatedCats));
    }
  };

  const handleExcelFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkFileName(file.name);
    setBulkProgress('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const parsedItems = rows
          .map((row, idx) => {
            const name = String(row.name || row.Name || row.title || row.Title || '').trim();
            const category = String(
              row.category || row.Category || categories[1] || 'Silk Sarees'
            ).trim();
            const rawPrice = String(row.price || row.Price || '0').replace(/[^0-9.]/g, '');
            const price = Number(rawPrice) || 0;
            const dimensions = String(
              row.dimensions || row.Dimensions || row.size || row.Size || row.sizes || row.Sizes || 'Free Size'
            ).trim();
            const material = String(
              row.material || row.Material || row.fabric || row.Fabric || ''
            ).trim();
            const description = String(
              row.description || row.Description || row.details || row.Details || ''
            ).trim();
            const imageUrl = String(
              row.imageUrl || row.image_url || row.Image || row.image || DEFAULT_GARMENT_IMAGE
            ).trim();

            return {
              tempId: `${Date.now()}-${idx}`,
              name,
              category: category || 'General',
              price,
              dimensions,
              material,
              description,
              imageUrl: imageUrl || DEFAULT_GARMENT_IMAGE,
              isAvailable: true
            };
          })
          .filter((item) => item.name.length > 0);

        setBulkItems(parsedItems);
        syncCategoriesFromItems(parsedItems);

        if (parsedItems.length === 0) {
          alert("No valid product rows found. Make sure your Excel/CSV has a 'name' column.");
        }
      } catch (err) {
        console.error("Excel parse error:", err);
        alert("Could not read this file. Please upload a valid .xlsx, .xls, or .csv file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePushBulkProducts = async () => {
    if (bulkItems.length === 0) return;

    setBulkPushing(true);
    setBulkProgress(`0 / ${bulkItems.length} pushed...`);
    syncCategoriesFromItems(bulkItems);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < bulkItems.length; i++) {
      const item = bulkItems[i];
      const payload = {
        name: item.name,
        category: item.category,
        price: Number(item.price) || 0,
        imageUrl: item.imageUrl || DEFAULT_GARMENT_IMAGE,
        dimensions: item.dimensions,
        material: item.material,
        description: item.description,
        isAvailable: true
      };

      try {
        await createProduct(payload);
        successCount += 1;
      } catch (err) {
        console.error("Bulk push error on item:", item.name, err);
        failCount += 1;
      }
      setBulkProgress(`${i + 1} / ${bulkItems.length} processed...`);
    }

    setBulkPushing(false);
    await loadData();

    if (failCount === 0) {
      setSuccessMsg(`${successCount} products grouped by category and pushed to live showcase!`);
      setBulkItems([]);
      setBulkFileName('');
      setBulkProgress('');
      setTimeout(() => setSuccessMsg(''), 4500);
    } else {
      alert(`Pushed ${successCount} items, ${failCount} failed. Please check backend connection.`);
    }
  };

  const groupedBulkItems = bulkItems.reduce((acc, item) => {
    const cat = item.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const handleProceedToDetails = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.imageUrl) {
      alert("Garment Title, Price, and Photo are required!");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Confirm Basic Garment Entry',
      message: 'Review your initial pricing & photo before adding sizes and fabric details.',
      type: 'step1',
      targetId: null
    });
  };

  const handleFinalPublishTrigger = (e) => {
    e.preventDefault();
    if (!form.dimensions.trim()) {
      alert("Please enter or select Available Sizes before publishing.");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Publish Garment to Live Showcase?',
      message: 'This design will appear on your live catalog immediately.',
      type: 'step2',
      targetId: null
    });
  };

  const handleDeleteTrigger = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Garment from Showcase?',
      message: `Are you sure you want to remove "${name}" from your catalog?`,
      type: 'delete',
      targetId: id
    });
  };

  const handleModalConfirm = async () => {
    const modalType = confirmModal.type;
    const targetId = confirmModal.targetId;
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
          dimensions: form.dimensions.trim(),
          material: form.material.trim(),
          description: form.description.trim(),
          isAvailable: true
        };

        await createProduct(payload);

        setSuccessMsg(`"${form.name}" has been published to live showcase!`);

        setForm({
          name: '',
          category: categories[1] || 'Silk Sarees',
          price: '',
          imageUrl: '',
          dimensions: '',
          material: '',
          description: ''
        });
        setUploadStep(1);
        loadData();

        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        console.error("Save error:", err);
        alert("Failed to save garment. Please check backend connection.");
      } finally {
        setLoading(false);
      }
    } else if (modalType === 'delete') {
      try {
        await deleteProduct(targetId);
        setProducts(products.filter((p) => p.id !== targetId));
      } catch (err) {
        alert("Could not remove item.");
      }
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#17070E] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-7 sm:p-8 shadow-2xl border border-amber-200/70 text-center">
          <div className="w-14 h-14 bg-[#210D15] text-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md border border-amber-400/20">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold font-serif text-stone-900">NR Mart Hub Admin</h2>
          <p className="text-xs text-stone-500 mt-1 mb-6">Enter Passcode to access boutique studio</p>

          {pinError && (
            <p className="text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-xl mb-4 border border-rose-200">
              {pinError}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              placeholder="Enter PIN (1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-bold py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-950"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#210D15] hover:bg-rose-950 text-amber-300 font-bold rounded-xl text-sm transition cursor-pointer shadow-md"
            >
              Unlock Studio
            </button>
          </form>

          <button
            type="button"
            onClick={onBackToCatalog}
            className="mt-6 text-xs text-stone-500 hover:text-rose-950 flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FBF8F3] flex flex-col font-sans relative overflow-x-hidden">
      <header className="bg-[#1C0A12] text-white w-full px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 border-b border-amber-500/20 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 min-w-0">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-white/10 hover:bg-white/15 border border-amber-400/20 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Back to Shop</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 border border-rose-400/40 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-sm"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold font-serif text-amber-100 truncate">
                NR Mart Hub • Atelier Console
              </h1>
              <p className="text-[11px] text-rose-200/75 truncate">Catalog, Bulk Excel &amp; Leads</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('upload'); setUploadStep(1); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-amber-400 text-rose-950 shadow-md'
                  : 'bg-white/10 text-rose-100 hover:bg-white/15'
              }`}
            >
              <PlusCircle size={14} className="shrink-0" />
              <span>Upload Product</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-amber-400 text-rose-950 shadow-md'
                  : 'bg-white/10 text-rose-100 hover:bg-white/15'
              }`}
            >
              <Tag size={14} className="shrink-0" />
              <span>Categories ({Math.max(0, categories.length - 1)})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-amber-400 text-rose-950 shadow-md'
                  : 'bg-white/10 text-rose-100 hover:bg-white/15'
              }`}
            >
              <Package size={14} className="shrink-0" />
              <span>Live Items ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-amber-400 text-rose-950 shadow-md'
                  : 'bg-white/10 text-rose-100 hover:bg-white/15'
              }`}
            >
              <Users size={14} className="shrink-0" />
              <span>Leads ({leads.length})</span>
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-3.5 sm:px-8 lg:px-12 py-6 sm:py-8 flex-1 max-w-7xl mx-auto">
        {successMsg && (
          <div className="mb-5 p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold shadow-xs">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-8 lg:p-10">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                Manage Showcase Categories
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Organize collection categories shown on the storefront filter bar.
              </p>
            </div>

            <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-md mb-6 sm:mb-8">
              <input
                type="text"
                required
                placeholder="e.g. Banarasi Silk, Kurtis..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-xs font-medium"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#210D15] hover:bg-rose-950 text-amber-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                <PlusCircle size={15} /> Add Category
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {categories.map((cat, idx) => (
                <div
                  key={cat}
                  className="bg-[#FAF7F2] border border-stone-200/80 rounded-2xl p-4 flex items-center justify-between gap-2"
                >
                  {editingIndex === idx ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="p-1.5 border border-stone-300 rounded-lg text-xs w-full bg-white font-bold min-w-0"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditCategory(idx)}
                        className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingIndex(null)}
                        className="px-2 py-1.5 bg-stone-200 text-stone-600 rounded-lg text-xs cursor-pointer shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 shrink-0 rounded-xl bg-amber-100 text-rose-950 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 text-sm truncate">{cat}</p>
                          <span className="text-[10px] text-stone-400 block">
                            {cat === 'All' ? 'Default Filter' : 'Custom Category'}
                          </span>
                        </div>
                      </div>

                      {cat !== 'All' && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setEditingIndex(idx); setEditValue(cat); }}
                            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 rounded-lg transition cursor-pointer"
                            title="Rename"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
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

        {activeTab === 'upload' && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-6 sm:mb-8">
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  {uploadMode === 'bulk'
                    ? 'Bulk Excel Upload (Auto Category Split & Push)'
                    : uploadStep === 1
                      ? 'Step 1: Photo, Title & Price'
                      : 'Step 2: Sizes, Fabric & Details'}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  {uploadMode === 'bulk'
                    ? 'Select an Excel/CSV file — products are automatically grouped by category and pushed live.'
                    : uploadStep === 1
                      ? 'Upload a crisp garment image and set showroom price.'
                      : 'Specify available sizes, fabric quality, and description.'}
                </p>
              </div>

              <div className="inline-flex rounded-xl bg-[#FAF7F2] p-1 border border-stone-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setUploadMode('single')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    uploadMode === 'single'
                      ? 'bg-[#210D15] text-amber-300 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Single Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('bulk')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    uploadMode === 'bulk'
                      ? 'bg-[#210D15] text-amber-300 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileSpreadsheet size={14} />
                  <span>Bulk Excel</span>
                </button>
              </div>
            </div>

            {uploadMode === 'bulk' && (
              <div className="space-y-6">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-stone-300 hover:border-rose-950 rounded-2xl cursor-pointer bg-[#FAF7F2] hover:bg-amber-50/40 transition p-5 text-center">
                  <FileSpreadsheet size={32} className="text-rose-950 mb-2" />
                  <span className="text-sm font-bold text-stone-900">
                    {bulkFileName ? `Selected: ${bulkFileName}` : 'Click to Choose Excel / CSV File'}
                  </span>
                  <span className="text-xs text-stone-500 mt-1">
                    Columns: name, category, price, dimensions, material, description, imageUrl
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleExcelFileUpload}
                    className="hidden"
                  />
                </label>

                {bulkItems.length > 0 && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-stone-900">
                        <Layers size={18} className="text-rose-950 shrink-0" />
                        <span>
                          {bulkItems.length} products found across{' '}
                          {Object.keys(groupedBulkItems).length} categories
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {bulkProgress && (
                          <span className="text-xs font-bold text-rose-950">{bulkProgress}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setBulkItems([]);
                            setBulkFileName('');
                            setBulkProgress('');
                          }}
                          disabled={bulkPushing}
                          className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-60"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={handlePushBulkProducts}
                          disabled={bulkPushing}
                          className="px-5 py-2.5 bg-[#210D15] hover:bg-rose-950 text-amber-300 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                        >
                          <CheckCircle2 size={15} />
                          <span>{bulkPushing ? 'Pushing...' : `Push All (${bulkItems.length})`}</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(groupedBulkItems).map(([catName, catProducts]) => (
                        <div
                          key={catName}
                          className="border border-stone-200 rounded-2xl overflow-hidden bg-white"
                        >
                          <div className="bg-[#FAF7F2] px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                            <span className="font-serif font-bold text-sm text-stone-900">
                              {catName}
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-amber-300">
                              {catProducts.length} items
                            </span>
                          </div>

                          <div className="divide-y divide-stone-100 text-xs">
                            {catProducts.map((item) => (
                              <div
                                key={item.tempId}
                                className="px-4 py-3 flex items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <p className="font-bold text-stone-900 truncate">{item.name}</p>
                                  <p className="text-[11px] text-stone-500 truncate">
                                    Size: {item.dimensions} {item.material ? `• ${item.material}` : ''}
                                  </p>
                                </div>
                                <span className="font-black text-rose-950 shrink-0">
                                  ₹{item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploadMode === 'single' && uploadStep === 1 && (
              <form onSubmit={handleProceedToDetails} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
                <div className="space-y-4 sm:space-y-5 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Garment Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kanchipuram Soft Silk Saree"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                        Category *
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none bg-white text-sm font-semibold"
                      >
                        {categories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        required
                        placeholder="e.g. 4999"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Select Photo From Device *
                    </label>

                    <label className="flex flex-col items-center justify-center w-full h-32 sm:h-36 border-2 border-dashed border-stone-300 hover:border-rose-950 rounded-2xl cursor-pointer bg-[#FAF7F2] hover:bg-amber-50/40 transition p-4 text-center">
                      <Upload size={26} className="text-rose-950 mb-2" />
                      <span className="text-xs font-bold text-stone-900">Click to Choose Photo</span>
                      <span className="text-[11px] text-stone-400 mt-1">Auto-optimized for fast loading</span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#210D15] hover:bg-rose-950 text-amber-300 font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Sizes &amp; Fabric</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] border border-stone-200/80 p-5 sm:p-6 rounded-2xl flex flex-col items-center justify-center min-h-[280px] sm:min-h-[340px] text-center">
                  {form.imageUrl ? (
                    <div className="w-full max-w-xs space-y-2.5 relative">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: '' })}
                        className="absolute -top-2 -right-2 p-1.5 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 cursor-pointer"
                        title="Remove Photo"
                      >
                        <X size={14} />
                      </button>
                      <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">Preview</p>
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full aspect-[3/4] object-cover rounded-2xl shadow-lg border border-stone-200"
                      />
                      <p className="font-bold text-stone-900 text-sm line-clamp-1">{form.name || 'Garment Name'}</p>
                      <p className="font-black text-rose-950 text-base">₹{form.price || '0'}</p>
                    </div>
                  ) : (
                    <div className="text-stone-400 space-y-2">
                      <ImageIcon size={40} className="mx-auto text-stone-300" />
                      <p className="text-xs font-semibold">No photo selected yet</p>
                      <p className="text-[11px]">Image preview will appear here</p>
                    </div>
                  )}
                </div>
              </form>
            )}

            {uploadMode === 'single' && uploadStep === 2 && (
              <form onSubmit={handleFinalPublishTrigger} className="space-y-5 sm:space-y-6 text-xs max-w-2xl mx-auto">
                <div className="p-3.5 sm:p-4 bg-[#FAF7F2] border border-stone-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={form.imageUrl}
                      alt=""
                      className="w-12 h-12 object-cover rounded-xl border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-stone-900 block truncate">{form.name}</span>
                      <span className="text-[11px] text-stone-500 block truncate">
                        {form.category} • ₹{form.price}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadStep(1)}
                    className="shrink-0 text-xs font-bold text-rose-950 underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                    Available Sizes *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S, M, L, XL or Free Size (6.3m)"
                    value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm font-medium"
                  />
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {QUICK_SIZES.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setForm({ ...form, dimensions: sz })}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                          form.dimensions === sz
                            ? 'bg-[#210D15] text-amber-300 border-[#210D15]'
                            : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                    Fabric / Material
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Mulberry Silk, Cotton, Organza"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Weave details, border work, occasion styling..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-950 focus:outline-none text-sm"
                  ></textarea>
                </div>

                <div className="flex gap-3 sm:gap-4 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setUploadStep(1)}
                    className="w-1/3 py-3 sm:py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-3 sm:py-3.5 bg-[#210D15] hover:bg-rose-950 text-amber-300 font-bold rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <CheckCircle2 size={17} className="shrink-0" />
                    <span className="truncate">{loading ? 'Publishing...' : 'Publish to Showcase'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 mb-4 border-b border-stone-100 pb-3">
              Published Showcase Items ({products.length})
            </h2>

            <div className="overflow-x-auto -mx-5 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-5 sm:px-0">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-[#FAF7F2] text-stone-900 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Garment</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Sizes</th>
                      <th className="p-3">Price</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF7F2]/60">
                        <td className="p-3 flex items-center gap-3 min-w-[180px]">
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-11 h-11 sm:w-12 sm:h-12 object-cover rounded-xl bg-stone-100 border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 line-clamp-1">{item.name}</p>
                            <p className="text-[11px] text-stone-400 line-clamp-1">{item.material}</p>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-rose-950 whitespace-nowrap">{item.category}</td>
                        <td className="p-3 font-medium text-stone-700 whitespace-nowrap">{item.dimensions || '-'}</td>
                        <td className="p-3 font-bold text-stone-900 whitespace-nowrap">₹{item.price}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteTrigger(item.id, item.name)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Item"
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
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 mb-4 border-b border-stone-100 pb-3">
              Customer Leads ({leads.length})
            </h2>
            <div className="overflow-x-auto -mx-5 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-5 sm:px-0">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-[#FAF7F2] text-stone-900 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="p-3 font-bold text-stone-900 whitespace-nowrap">{lead.name}</td>
                        <td className="p-3 text-stone-800 whitespace-nowrap">{lead.phoneNumber}</td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <a
                            href={`https://wa.me/91${lead.phoneNumber.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
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
          </div>
        )}
      </main>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-[#1C0A12] p-5 sm:p-6 text-white text-center">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-400/20">
                {confirmModal.type === 'delete' ? (
                  <AlertCircle size={24} className="text-rose-400" />
                ) : (
                  <HelpCircle size={24} className="text-amber-300" />
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif">{confirmModal.title}</h3>
              <p className="text-xs text-rose-200/80 mt-1">{confirmModal.message}</p>
            </div>

            {confirmModal.type === 'step1' && (
              <div className="p-4 bg-[#FAF7F2] border-b border-stone-200 flex items-center gap-3.5">
                <img
                  src={form.imageUrl}
                  alt=""
                  className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                />
                <div className="text-xs min-w-0">
                  <span className="font-bold text-stone-900 block line-clamp-1">{form.name}</span>
                  <span className="text-stone-500 block truncate">{form.category}</span>
                  <span className="font-black text-rose-950 block mt-0.5">₹{form.price}</span>
                </div>
              </div>
            )}

            <div className="p-4 sm:p-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="w-1/2 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalConfirm}
                className={`w-1/2 py-3 font-bold rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5 ${
                  confirmModal.type === 'delete'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-[#210D15] hover:bg-rose-950 text-amber-300'
                }`}
              >
                <span>{confirmModal.type === 'delete' ? 'Yes, Delete' : 'Confirm & Proceed'}</span>
                <ArrowRight size={14} className="shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}