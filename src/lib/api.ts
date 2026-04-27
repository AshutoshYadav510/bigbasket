/// <reference types="vite/client" />
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  unit: string;
  inStock: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}

export interface OrderItem {
  id?: string;
  productId: string;
  quantity: number;
  price?: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string | null;
  total: number;
  status: string;
  address: string | null;
  createdAt: string;
  items: OrderItem[];
}

export const api = {
  loginUser: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      if (res.status === 404) return null; // user not found
      if (res.status === 401) {
        throw new Error("Incorrect password");
      }
      throw new Error("Failed to login");
    }
    const data = await res.json();
    return data.data as User;
  },

  registerUser: async (name: string, email: string, password: string, phone?: string, address?: string) => {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, address }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to register");
    }
    const data = await res.json();
    return data.data as User;
  },

  getProducts: async (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    
    const res = await fetch(`${API_URL}/products?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data.data as Product[];
  },

  getProduct: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    const data = await res.json();
    return data.data as Product;
  },

  createOrder: async (items: { productId: string; quantity: number }[], userId?: string, address?: string) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, userId, address }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create order");
    }
    const data = await res.json();
    return data.data as Order;
  },

  getOrders: async (userId?: string) => {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    
    const res = await fetch(`${API_URL}/orders?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data.data as Order[];
  },
};

