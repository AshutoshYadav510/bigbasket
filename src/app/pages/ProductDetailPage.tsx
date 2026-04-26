import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, CheckCircle, AlertCircle, Truck, Shield, Loader2, Minus, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { api, Product } from "../../lib/api";

export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, cart, updateQuantity, seniorMode, language } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const cartItem = cart.find(item => item.id === product?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getProduct(id);
        setProduct(data);
      } catch (error) {
        toast.error(language === "en" ? "Failed to load product details" : "उत्पाद विवरण लोड करने में विफल");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, language]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!product.inStock) {
      toast.error(language === "en" ? "Out of stock" : "स्टॉक में नहीं");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      inStock: product.inStock,
    });
    toast.success(language === "en" ? "Added to cart" : "कार्ट में जोड़ा गया");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-green-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">
          {language === "en" ? "Product not found" : "उत्पाद नहीं मिला"}
        </h2>
        <Link to="/">
          <Button className="mt-4">{language === "en" ? "Return Home" : "होम पर लौटें"}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Link to="/">
          <Button variant="ghost" size={seniorMode ? "lg" : "default"} className={`${seniorMode ? 'text-xl mb-8' : 'mb-6'} rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm`}>
            <ArrowLeft className={`${seniorMode ? 'h-7 w-7' : 'h-4 w-4'} mr-2`} />
            {language === "en" ? "Back" : "वापस"}
          </Button>
        </Link>

        <div className={`grid ${seniorMode ? 'grid-cols-1 gap-12' : 'md:grid-cols-2 gap-8 lg:gap-16 items-start'}`}>
          {/* Product Image Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <Card className={`${seniorMode ? 'h-[400px] md:h-[600px]' : 'h-[350px] md:h-[500px]'} border-white/40 dark:border-gray-800/60 shadow-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] flex items-center justify-center p-8 relative overflow-hidden`}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-110"
              />
            </Card>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col relative">
            <div className="mb-6 md:mb-8">
              <Badge className={`${seniorMode ? 'text-xl px-6 py-3 mb-6' : 'mb-4'} rounded-full border-none shadow-md ${product.inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                {product.inStock ? (
                  <CheckCircle className={`${seniorMode ? 'h-6 w-6' : 'h-4 w-4'} mr-2 inline`} />
                ) : (
                  <AlertCircle className={`${seniorMode ? 'h-6 w-6' : 'h-4 w-4'} mr-2 inline`} />
                )}
                <span className="font-bold">
                  {product.inStock
                    ? (language === "en" ? "Fresh & Available" : "ताजा और उपलब्ध")
                    : (language === "en" ? "Out of Stock" : "स्टॉक में नहीं")}
                </span>
              </Badge>

              <h1 className={`${seniorMode ? 'text-5xl md:text-7xl mb-4' : 'text-3xl md:text-5xl lg:text-6xl mb-3'} font-black text-gray-900 dark:text-white tracking-tight leading-none`}>
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-4 md:mb-6">
                <div className={`${seniorMode ? 'text-6xl' : 'text-4xl md:text-5xl'} font-black text-green-600 dark:text-green-400`}>
                  ₹{product.price}
                </div>
                <div className={`${seniorMode ? 'text-3xl' : 'text-lg md:text-xl'} font-bold text-gray-500 dark:text-gray-400`}>
                  / {product.unit}
                </div>
              </div>

              <p className={`${seniorMode ? 'text-2xl mb-8' : 'text-base md:text-lg mb-6'} text-gray-600 dark:text-gray-400 font-medium leading-relaxed`}>
                {product.description || (language === "en" ? "Fresh produce delivered to your doorstep. Premium quality guaranteed." : "आपके दरवाजे पर पहुंचाए गए ताजे उत्पाद। प्रीमियम गुणवत्ता की गारंटी।")}
              </p>
            </div>

            {/* Desktop Add to Cart */}
            <div className="hidden md:block mb-10">
              {cartItem ? (
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-3xl">
                  <Button 
                    variant="ghost" 
                    onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                    className="h-14 w-14 rounded-full text-2xl hover:bg-white dark:hover:bg-gray-700 shadow-sm"
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <span className="text-2xl font-black">{cartItem.quantity}</span>
                  <Button 
                    variant="ghost" 
                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                    className="h-14 w-14 rounded-full text-2xl hover:bg-white dark:hover:bg-gray-700 shadow-sm"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white border-none font-black rounded-[2rem] shadow-xl shadow-green-600/20 transition-all active:scale-95 ${seniorMode ? 'text-3xl py-12' : 'text-xl py-8'}`}
                >
                  {language === "en" ? "Add to Cart" : "कार्ट में जोड़ें"}
                </Button>
              )}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
              <Card className="p-3 md:p-4 border-none shadow-md bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                  <Truck className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 leading-tight">
                  {language === "en" ? "Fast Delivery" : "तेज डिलीवरी"}
                </span>
              </Card>
              <Card className="p-3 md:p-4 border-none shadow-md bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 leading-tight">
                  {language === "en" ? "Quality Check" : "गुणवत्ता जांच"}
                </span>
              </Card>
            </div>

            {/* Collapsible/Sections Details */}
            <div className="space-y-6">
              <div className="p-5 md:p-6 rounded-3xl bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                  {language === "en" ? "Product Details" : "उत्पाद विवरण"}
                </h3>
                <div className="grid gap-4">
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                    <span className="font-bold text-gray-500">{language === "en" ? "Category" : "श्रेणी"}</span>
                    <span className="font-bold text-gray-900 dark:text-white capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                    <span className="font-bold text-gray-500">{language === "en" ? "Unit" : "इकाई"}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{product.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Footer */}
      <div className="md:hidden fixed bottom-[65px] left-0 right-0 p-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="hidden sm:block flex-1">
            <p className="font-bold text-gray-900 dark:text-white truncate">{product.name}</p>
            <p className="text-sm font-black text-green-600 dark:text-green-400">₹{product.price}</p>
          </div>
          <div className="flex-1">
            {cartItem ? (
              <div className="flex items-center justify-between p-1 bg-gray-100 dark:bg-gray-800 rounded-full h-[52px]">
                <Button 
                  variant="ghost" 
                  onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                  className="h-10 w-10 rounded-full hover:bg-white dark:hover:bg-gray-700 shadow-sm"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-xl font-black">{cartItem.quantity}</span>
                <Button 
                  variant="ghost" 
                  onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                  className="h-10 w-10 rounded-full hover:bg-white dark:hover:bg-gray-700 shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full h-[52px] bg-green-600 hover:bg-green-700 text-white border-none font-black rounded-full shadow-lg transition-all active:scale-95 text-lg"
              >
                {language === "en" ? "Add to Cart" : "कार्ट में जोड़ें"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

