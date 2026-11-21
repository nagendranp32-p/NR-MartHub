import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CatalogPage from './pages/CatalogPage';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import { getProducts } from './services/api';

const ADMIN_VIEW_KEY = 'nr_boutique_admin_view';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return localStorage.getItem(ADMIN_VIEW_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(ADMIN_VIEW_KEY, JSON.stringify(isAdminView));
  }, [isAdminView]);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('nr_boutique_darkmode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem('nr_boutique_darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nr_catalog_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [categories, setCategories] = useState(() => {
    const savedCats = localStorage.getItem('nr_boutique_categories');
    return savedCats
      ? JSON.parse(savedCats)
      : ['All', 'Silk Sarees', 'Kurtis & Suits', 'Bridal Lehengas', 'Mens Ethnic'];
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const refreshProducts = () => {
    setLoadingProducts(true);
    getProducts(selectedCategory)
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  };

  useEffect(() => {
    refreshProducts();
  }, [selectedCategory, isAdminView]);

  if (isAdminView) {
    return (
      <AdminPage
        onBackToCatalog={() => {
          setIsAdminView(false);
          refreshProducts();
        }}
        categories={categories}
        setCategories={setCategories}
      />
    );
  }

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name?.toLowerCase().includes(query) ||
      p.material?.toLowerCase().includes(query) ||
      p.dimensions?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`w-full min-h-screen flex flex-col font-sans antialiased overflow-x-clip transition-colors duration-300 ${
        darkMode ? 'bg-[#0E060B] text-rose-100' : 'bg-[#FAF7F2] text-stone-900'
      }`}
    >
      {!currentUser && <LoginModal onLoginSuccess={(user) => setCurrentUser(user)} />}

      <Navbar
        currentUser={currentUser}
        onOpenAdmin={() => setIsAdminView(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <CatalogPage
        darkMode={darkMode}
        loadingProducts={loadingProducts}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredProducts={filteredProducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      <Footer />
    </div>
  );
}