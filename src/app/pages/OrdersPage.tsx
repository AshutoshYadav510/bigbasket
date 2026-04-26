import { useState, useEffect } from "react";
import { RotateCcw, Package, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { api, Order } from "../../lib/api";

export function OrdersPage() {
  const { addToCart, seniorMode, language } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (error) {
        toast.error(language === "en" ? "Failed to load orders" : "ऑर्डर लोड करने में विफल");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [language]);

  const handle1TapReorder = (order: Order) => {
    order.items.forEach(item => {
      if (item.product) {
        addToCart({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          inStock: item.product.inStock,
        });
      }
    });
    toast.success(language === "en" ? "Items added to cart - ready to checkout!" : "आइटम कार्ट में जोड़े गए - चेकआउट के लिए तैयार!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-green-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Package className={`${seniorMode ? 'h-40 w-40' : 'h-24 w-24'} mx-auto mb-6 text-gray-400`} />
        <h2 className={`${seniorMode ? 'text-5xl mb-6' : 'text-3xl mb-4'} font-bold text-gray-900 dark:text-white`}>
          {language === "en" ? "No orders yet" : "अभी तक कोई ऑर्डर नहीं"}
        </h2>
        <p className={`${seniorMode ? 'text-3xl' : 'text-xl'} text-gray-600 dark:text-gray-400`}>
          {language === "en" ? "Your past orders will appear here" : "आपके पिछले ऑर्डर यहां दिखाई देंगे"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`${seniorMode ? 'text-5xl' : 'text-3xl md:text-4xl'} font-extrabold text-gray-900 dark:text-white tracking-tight leading-none`}>
            {language === "en" ? "My Orders" : "मेरे ऑर्डर"}
          </h1>
          <Badge className={`${seniorMode ? 'text-xl px-6 py-3' : 'px-4 py-1.5'} bg-green-600 text-white border-none rounded-full shadow-lg`}>
            {language === "en" ? "1-Tap Reorder Ready" : "1-टैप पुनः ऑर्डर तैयार"}
          </Badge>
        </div>

        <div className={seniorMode ? 'space-y-8' : 'space-y-6'}>
          {orders.map((order) => (
            <Card key={order.id} className={`${seniorMode ? 'p-8' : 'p-6'} border-none shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-[2rem] overflow-hidden relative`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 -rotate-12 transform translate-x-10 -translate-y-10 rounded-full" />
              
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className={`${seniorMode ? 'text-3xl mb-3' : 'text-xl mb-1'} font-black text-gray-900 dark:text-white`}>
                    {language === "en" ? "Order" : "ऑर्डर"} #{order.id.slice(-6).toUpperCase()}
                  </h3>
                  <p className={`${seniorMode ? 'text-2xl' : 'text-sm'} font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest`}>
                    {new Date(order.createdAt).toLocaleDateString(language === "en" ? "en-IN" : "hi-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge className={`${seniorMode ? 'text-xl px-6 py-3' : 'px-3 py-1'} bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-none rounded-full`}>
                  {order.status || (language === "en" ? "Delivered" : "डिलीवर किया गया")}
                </Badge>
              </div>

              {/* Order Items */}
              <div className={`${seniorMode ? 'space-y-6 mb-8' : 'space-y-4 mb-6'}`}>
                {order.items.map((item) => (
                  <div key={item.id || item.productId} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                      <div className={`${seniorMode ? 'h-24 w-24' : 'h-16 w-16'} bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm`}>
                        <img src={item.product?.image || "/images/placeholder.png"} alt={item.product?.name || "Product"} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className={`${seniorMode ? 'text-2xl' : 'text-base'} font-black text-gray-900 dark:text-white`}>
                          {item.product?.name || "Unknown Product"}
                        </p>
                        <p className={`${seniorMode ? 'text-xl' : 'text-sm'} font-bold text-gray-500 dark:text-gray-400`}>
                          {language === "en" ? "Quantity" : "मात्रा"}: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className={`${seniorMode ? 'text-2xl' : 'text-lg'} font-black text-gray-900 dark:text-white`}>
                      ₹{(item.price || item.product?.price || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total and Reorder */}
              <div className={`pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4`}>
                <div className="flex items-baseline gap-2">
                  <span className={`${seniorMode ? 'text-2xl' : 'text-sm'} font-bold text-gray-500 uppercase tracking-widest`}>
                    {language === "en" ? "Total Paid:" : "कुल भुगतान:"}
                  </span>
                  <span className={`${seniorMode ? 'text-5xl' : 'text-4xl'} font-black text-green-600 dark:text-green-400`}>
                    ₹{order.total}
                  </span>
                </div>
                <Button
                  onClick={() => handle1TapReorder(order)}
                  className={`bg-green-600 hover:bg-green-700 text-white border-none font-black rounded-2xl shadow-lg transition-all active:scale-95 ${seniorMode ? 'text-2xl px-12 py-8' : 'px-8 py-6'}`}
                >
                  <RotateCcw className={`${seniorMode ? 'h-6 w-6' : 'h-5 w-5'} mr-2`} />
                  {language === "en" ? "Order Again" : "पुनः ऑर्डर करें"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
