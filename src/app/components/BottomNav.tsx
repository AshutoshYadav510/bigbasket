import { Link, useLocation } from "react-router";
import { Home, Search, ShoppingBag, Heart, User, LogIn } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Badge } from "./ui/badge";

export function BottomNav() {
  const { cart, user } = useApp();
  const location = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/products/all" },
    { icon: ShoppingBag, label: "Cart", path: "/cart", count: cartCount },
    { icon: Heart, label: "Orders", path: "/orders" },
    { 
      icon: user ? User : LogIn, 
      label: user ? "Profile" : "Login", 
      path: user ? "/settings" : "/login" 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 py-3 shadow-2xl">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-green-600 dark:text-green-400 scale-110' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            >
              <div className="relative">
                <item.icon className={`h-6 w-6 ${isActive ? 'fill-current' : ''}`} />
                {item.count ? (
                  <Badge className="absolute -top-2 -right-2 bg-green-600 text-[10px] px-1.5 py-0.5 min-w-[18px] flex justify-center items-center">
                    {item.count}
                  </Badge>
                ) : null}
              </div>
              <span className="text-[10px] font-bold tracking-tight uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
