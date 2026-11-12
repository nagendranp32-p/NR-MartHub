import axios from 'axios';

// Render-la irukura unga backend live URL inga varum (kadasila '/' poda vendaam)
const BASE_HOST = import.meta.env.VITE_API_URL || 'https://nr-marthub.onrender.com';

const API_BASE_URL = `${BASE_HOST}/api/products`;
const LEADS_BASE_URL = `${BASE_HOST}/api/leads`;

// Products
export const getProducts = async (category = '') => {
  const url = category && category !== 'All' 
    ? `${API_BASE_URL}?category=${encodeURIComponent(category)}` 
    : API_BASE_URL;
  const res = await axios.get(url);
  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/categories`);
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await axios.post(API_BASE_URL, productData);
  return res.data;
};

export const deleteProduct = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

// Customer Leads / Visitors
export const registerCustomerLead = async (name, phoneNumber) => {
  const res = await axios.post(`${LEADS_BASE_URL}/register`, {
    name,
    phoneNumber,
  });
  return res.data;
};

export const getAllCustomerLeads = async () => {
  const res = await axios.get(LEADS_BASE_URL);
  return res.data;
};