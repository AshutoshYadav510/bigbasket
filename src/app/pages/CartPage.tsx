import { Link } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, Clock, ShieldCheck, Sparkles, LogIn } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, seniorMode, language, user } = useApp();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = cart.length === 0;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <LogIn className={`${seniorMode ? 'h-40 w-40' : 'h-24 w-24'} mx-auto mb-6 text-gray-400`} />
        <h2 className={`${seniorMode ? 'text-5xl mb-6' : 'text-3xl mb-4'} font-bold text-gray-900 dark:text-white`}>
          {language === "en" ? "Login Required" : "लॉगिन आवश्यक है"}
        </h2>
        <p className={`${seniorMode ? 'text-3xl mb-10' : 'text-xl mb-8'} text-gray-600 dark:text-gray-400`}>
          {language === "en" ? "Please login to view your cart and shop" : "अपनी कार्ट देखने और खरीदारी करने के लिए कृपया लॉगिन करें"}
        </p>
        <Link to="/login">
          <Button size={seniorMode ? "lg" : "lg"} className={`bg-green-600 hover:bg-green-700 text-white ${seniorMode ? 'text-2xl px-12 py-8' : ''}`}>
            {language === "en" ? "Login / Sign Up" : "लॉगिन / साइन अप"}
          </Button>
        </Link>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className={`${seniorMode ? 'h-40 w-40' : 'h-24 w-24'} mx-auto mb-6 text-gray-400`} />
        <h2 className={`${seniorMode ? 'text-5xl mb-6' : 'text-3xl mb-4'} font-bold text-gray-900 dark:text-white`}>
          {language === "en" ? "Your cart is empty" : "आपकी कार्ट खाली है"}
        </h2>
        <p className={`${seniorMode ? 'text-3xl mb-10' : 'text-xl mb-8'} text-gray-600 dark:text-gray-400`}>
          {language === "en" ? "Add some items to get started" : "शुरू करने के लिए कुछ आइटम जोड़ें"}
        </p>
        <Link to="/">
          <Button size={seniorMode ? "lg" : "lg"} className={seniorMode ? 'text-2xl px-12 py-8' : ''}>
            {language === "en" ? "Start Shopping" : "खरीदारी शुरू करें"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24">

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-8">
        {/* Delivery Estimate Banner */}
        <Card className="mb-6 md:mb-8 p-3 sm:p-4 border-none shadow-lg bg-blue-600 text-white rounded-2xl flex items-center justify-between overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="p-2 bg-white/20 rounded-xl flex-shrink-0">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm sm:text-lg leading-none truncate">
                {language === "en" ? "Lightning Fast Delivery" : "बिजली जैसी तेज डिलीवरी"}
              </p>
              <p className="text-xs sm:text-sm font-bold opacity-80 mt-1 truncate">
                {language === "en" ? "Arriving in 15-20 minutes" : "15-20 मिनट में आ रहा है"}
              </p>
            </div>
          </div>
          <Badge className="bg-white text-blue-600 border-none font-black px-3 py-1 hidden sm:block flex-shrink-0">
            {language === "en" ? "EXPRESS" : "एक्सप्रेस"}
          </Badge>
        </Card>

        <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
          <h1 className={`${seniorMode ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl md:text-4xl'} font-extrabold text-gray-900 dark:text-white tracking-tight leading-none`}>
            {language === "en" ? "My Cart" : "मेरी कार्ट"}
          </h1>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-none px-3 sm:px-4 py-1.5 font-black rounded-full text-sm">
            {cart.length} {language === "en" ? "Items" : "आइटम"}
          </Badge>
        </div>

        <div className={`grid ${seniorMode ? 'grid-cols-1 gap-6 md:gap-8' : 'grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'}`}>
          {/* Cart Items */}
          <div className={seniorMode ? 'space-y-5 md:space-y-6' : 'lg:col-span-2 space-y-4 sm:space-y-5'}>
            {cart.map((item) => (
              <Card key={item.id} className={`${seniorMode ? 'p-5 sm:p-8' : 'p-3 sm:p-5 md:p-7'} border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all group overflow-hidden relative`}>
                {/* Subtle highlight for premium look */}
                <div className="absolute top-0 left-0 w-2 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Mobile layout: stacked; Desktop: row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 md:gap-8">
                  {/* Top row on mobile: image + info + delete */}
                  <div className="flex items-center gap-3 sm:gap-5 md:gap-8 w-full sm:w-auto sm:flex-1 min-w-0">
                    <div className={`${seniorMode ? 'h-24 w-24 sm:h-36 sm:w-36' : 'h-20 w-20 sm:h-28 sm:w-28'} bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-inner flex-shrink-0 group-hover:rotate-2 transition-transform`}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-none px-2 py-0 text-[10px] font-black uppercase tracking-tighter">
                          {language === "en" ? "Price Drop" : "कीमत गिरी"}
                        </Badge>
                      </div>
                      <h3 className={`${seniorMode ? 'text-xl sm:text-3xl md:text-4xl mb-1 sm:mb-2' : 'text-base sm:text-xl md:text-2xl mb-1'} font-black text-gray-900 dark:text-white truncate tracking-tight`}>
                        {item.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <p className={`${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-black text-green-600 dark:text-green-400`}>
                          ₹{item.price}
                        </p>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest line-through decoration-red-500/50">₹{item.price + 10}</span>
                      </div>
                    </div>

                    {/* Delete button - visible on mobile in the top-right area */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all flex-shrink-0 sm:hidden"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Bottom row on mobile: quantity controls; on desktop: inline */}
                  <div className="flex items-center justify-between sm:justify-center gap-3 sm:gap-4 sm:flex-col">
                    <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl sm:rounded-2xl p-1 shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl hover:bg-white dark:hover:bg-gray-700 shadow-sm active:scale-90 transition-all"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 sm:w-10 text-center font-black text-lg sm:text-xl">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl hover:bg-white dark:hover:bg-gray-700 shadow-sm active:scale-90 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Item total on mobile */}
                    <p className={`${seniorMode ? 'text-2xl' : 'text-lg'} font-black text-gray-700 dark:text-gray-300 sm:hidden`}>
                      ₹{item.price * item.quantity}
                    </p>

                    {/* Delete button - visible on desktop */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all hidden sm:flex"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Promo Code Section */}
            <Card className="p-4 sm:p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 bg-transparent rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl sm:rounded-2xl flex-shrink-0">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-gray-900 dark:text-white text-sm sm:text-base">
                    {language === "en" ? "Have a Coupon?" : "कूपन है?"}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-gray-500 truncate">
                    {language === "en" ? "Apply for extra discounts" : "अतिरिक्त छूट के लिए आवेदन करें"}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="font-black rounded-xl px-6 sm:px-8 border-2 w-full sm:w-auto">
                {language === "en" ? "Apply" : "लागू करें"}
              </Button>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="h-fit lg:sticky lg:top-24">
            <Card className={`${seniorMode ? 'p-6 sm:p-8' : 'p-5 sm:p-6 md:p-8'} border-none shadow-2xl bg-green-600 dark:bg-green-700 text-white rounded-2xl sm:rounded-[3rem] overflow-hidden relative`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              
              <h2 className={`${seniorMode ? 'text-3xl sm:text-4xl mb-6 sm:mb-8' : 'text-xl sm:text-2xl mb-6 sm:mb-8'} font-black tracking-tight leading-none`}>
                {language === "en" ? "Order Summary" : "ऑर्डर सारांश"}
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {/* Subtotal Row */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:gap-4 border-b border-white/10 pb-3">
                  <div className="flex flex-col min-w-0">
                    <span className={`${seniorMode ? 'text-lg sm:text-2xl' : 'text-[10px]'} font-black opacity-60 uppercase tracking-[0.2em] truncate`}>
                      {language === "en" ? "Subtotal" : "उप-योग"}
                    </span>
                    <span className={`${seniorMode ? 'text-lg sm:text-2xl' : 'text-xs sm:text-sm'} font-black text-white/90 truncate`}>
                      {language === "en" ? "Fresh Grocery Items" : "ताजा किराना सामान"}
                    </span>
                  </div>
                  <span className={`${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-black text-white whitespace-nowrap`}>
                    ₹{total}
                  </span>
                </div>

                {/* Delivery Row */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:gap-4 border-b border-white/10 pb-3">
                  <div className="flex flex-col min-w-0">
                    <span className={`${seniorMode ? 'text-lg sm:text-2xl' : 'text-[10px]'} font-black opacity-60 uppercase tracking-[0.2em] truncate`}>
                      {language === "en" ? "Delivery Fee" : "डिलीवरी शुल्क"}
                    </span>
                    <span className={`${seniorMode ? 'text-lg sm:text-2xl' : 'text-xs sm:text-sm'} font-black text-amber-300 truncate`}>
                      {total >= 200 ? (language === "en" ? "Free Express" : "मुफ्त एक्सप्रेस") : (language === "en" ? "Standard Delivery" : "मानक डिलीवरी")}
                    </span>
                  </div>
                  <span className={`${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-black text-white whitespace-nowrap`}>
                    {total >= 200 ? "₹0" : "₹40"}
                  </span>
                </div>

                {/* Total Row */}
                <div className="pt-4 sm:pt-6 mt-2">
                  <div className="flex flex-col gap-1">
                    <span className={`${seniorMode ? 'text-lg sm:text-2xl' : 'text-xs'} font-black opacity-60 uppercase tracking-[0.2em]`}>
                      {language === "en" ? "Final Amount to Pay" : "भुगतान के लिए अंतिम राशि"}
                    </span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`${seniorMode ? 'text-5xl sm:text-7xl' : 'text-4xl sm:text-6xl'} font-black text-white leading-none tracking-tighter`}>
                        ₹{total >= 200 ? total : total + 40}
                      </span>
                      <span className="text-[10px] sm:text-xs font-black opacity-60 uppercase">incl. all taxes</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button className={`w-full bg-white text-green-700 hover:bg-gray-50 border-none font-black rounded-xl sm:rounded-2xl shadow-xl transition-all active:scale-95 ${seniorMode ? 'text-xl sm:text-2xl py-8 sm:py-12' : 'text-lg sm:text-xl py-6 sm:py-8'}`}>
                  {language === "en" ? "Checkout Now" : "अभी चेकआउट करें"}
                </Button>
              </Link>
              
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 opacity-70">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
              </div>
            </Card>
            
            {/* Savings Box */}
            {total >= 200 && (
              <Card className="mt-3 sm:mt-4 p-3 sm:p-4 border-none shadow-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-2xl flex items-center gap-3">
                <Sparkles className="h-5 w-5 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-black italic">
                  {language === "en" ? "You saved ₹40 on delivery!" : "आपने डिलीवरी पर ₹40 बचाए!"}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
