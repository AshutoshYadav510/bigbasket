import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  inStock: boolean;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  reorder: (orderId: string) => void;
  seniorMode: boolean;
  toggleSeniorMode: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: "en" | "hi";
  toggleLanguage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ord-001",
      date: "2026-04-15",
      items: [
        { id: "p1", name: "Organic Tomatoes", price: 45, quantity: 2, image: "/images/product_tomatoes.png", inStock: true },
        { id: "p2", name: "Fresh Milk", price: 60, quantity: 1, image: "/images/product_milk.png", inStock: true },
      ],
      total: 150,
    },
  ]);
  const [seniorMode, setSeniorMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const reorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setCart(order.items);
    }
  };

  const toggleSeniorMode = () => setSeniorMode(!seniorMode);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "hi" : "en"));

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        orders,
        reorder,
        seniorMode,
        toggleSeniorMode,
        darkMode,
        toggleDarkMode,
        language,
        toggleLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
