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
    <>
      {/* Spacer to prevent content from being hidden behind the fixed bottom nav */}
      <div className="md:hidden h-20" />
      
      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Frosted glass navbar */}
        <div className="mx-2 mb-2 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.08)] px-2 py-1.5">
          <div className="flex justify-around items-center max-w-lg mx-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-400 dark:text-gray-500 active:scale-90'
                  }`}
                >
                  {/* Active indicator pill */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-green-500 rounded-full shadow-lg shadow-green-500/40" />
                  )}
                  
                  <div className="relative">
                    <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-green-100/80 dark:bg-green-900/30 scale-110' 
                        : ''
                    }`}>
                      <item.icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                    </div>
                    {item.count ? (
                      <Badge className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[9px] px-1.5 py-0 min-w-[16px] h-[16px] flex justify-center items-center rounded-full border-2 border-white dark:border-gray-900 shadow-sm font-black">
                        {item.count}
                      </Badge>
                    ) : null}
                  </div>
                  <span className={`text-[9px] font-bold tracking-tight uppercase transition-all duration-300 ${
                    isActive ? 'text-green-700 dark:text-green-400 font-black' : ''
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
