import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, CheckCircle, AlertCircle, Truck, Shield, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { api, Product } from "../../lib/api";

export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, seniorMode, language } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="relative min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            <Card className={`${seniorMode ? 'h-[400px] md:h-[600px]' : 'h-[350px] md:h-[500px]'} border-none shadow-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[3rem] flex items-center justify-center p-8 relative overflow-hidden`}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-110"
              />
            </Card>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="mb-8">
              <Badge className={`${seniorMode ? 'text-xl px-6 py-3 mb-6' : 'mb-4'} rounded-full border-none shadow-lg ${product.inStock ? 'bg-green-600' : 'bg-red-600'}`}>
                {product.inStock ? (
                  <CheckCircle className={`${seniorMode ? 'h-6 w-6' : 'h-4 w-4'} mr-2 inline`} />
                ) : (
                  <AlertCircle className={`${seniorMode ? 'h-6 w-6' : 'h-4 w-4'} mr-2 inline`} />
                )}
                {product.inStock
                  ? (language === "en" ? "Fresh & Available" : "ताजा और उपलब्ध")
                  : (language === "en" ? "Out of Stock" : "स्टॉक में नहीं")}
              </Badge>

              <h1 className={`${seniorMode ? 'text-6xl md:text-7xl mb-4' : 'text-4xl md:text-6xl mb-3'} font-black text-gray-900 dark:text-white tracking-tight leading-none`}>
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <div className={`${seniorMode ? 'text-7xl' : 'text-5xl'} font-black text-green-600 dark:text-green-400`}>
                  ₹{product.price}
                </div>
                <div className={`${seniorMode ? 'text-3xl' : 'text-xl'} font-bold text-gray-500 dark:text-gray-400`}>
                  / {product.unit}
                </div>
              </div>

              <p className={`${seniorMode ? 'text-2xl mb-8' : 'text-lg mb-6'} text-gray-600 dark:text-gray-400 font-medium leading-relaxed`}>
                {product.description || "Fresh produce delivered to your doorstep."}
              </p>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full bg-green-600 hover:bg-green-700 text-white border-none font-black rounded-3xl shadow-xl transition-all active:scale-95 ${seniorMode ? 'text-3xl py-12 mb-10' : 'text-xl py-8 mb-8'}`}
            >
              {language === "en" ? "Add to Cart" : "कार्ट में जोड़ें"}
            </Button>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <Card className="p-4 border-none shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl flex items-center gap-3">
                <Truck className="h-6 w-6 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Fast Delivery</span>
              </Card>
              <Card className="p-4 border-none shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl flex items-center gap-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Quality Check</span>
              </Card>
            </div>

            {/* Collapsible/Sections Details */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Product Details</h3>
                <div className="grid gap-4">
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="font-bold text-gray-500">Category</span>
                    <span className="font-bold text-green-600">{product.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
