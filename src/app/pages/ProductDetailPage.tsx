import { useParams, Link } from "react-router";
import { ArrowLeft, CheckCircle, AlertCircle, Truck, Shield } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const mockProductDetails: Record<string, any> = {
  p1: { id: "p1", name: "Organic Tomatoes", price: 45, unit: "500g", image: "/images/product_tomatoes.png", inStock: true, quality: "Premium", description: "Fresh organic tomatoes sourced directly from certified farms. Rich in vitamins and antioxidants.", nutritionFacts: "Calories: 18 per 100g • Vitamin C: 21% DV • Fiber: 1.2g", origin: "Maharashtra Farms" },
  p2: { id: "p2", name: "Fresh Milk", price: 60, unit: "1L", image: "/images/product_milk.png", inStock: true, quality: "Farm Fresh", description: "Farm fresh cow milk, pasteurized and homogenized for safety. Pure and nutritious.", nutritionFacts: "Calories: 42 per 100g • Protein: 3.4g • Calcium: 120mg", origin: "Local Dairy" },
  p3: { id: "p3", name: "Basmati Rice", price: 180, unit: "1kg", image: "/images/product_rice.png", inStock: false, quality: "Premium", description: "Aromatic long-grain basmati rice. Aged for perfection and superior taste.", nutritionFacts: "Calories: 350 per 100g • Carbs: 78g • Protein: 7g", origin: "Punjab Grains" },
  p4: { id: "p4", name: "Whole Wheat Bread", price: 40, unit: "400g", image: "/images/product_bread.png", inStock: true, quality: "Freshly Baked", description: "Hearty whole wheat bread baked fresh every day. No preservatives.", nutritionFacts: "Calories: 250 per 100g • Fiber: 7g • Iron: 15% DV", origin: "City Bakery" },
  p5: { id: "p5", name: "Fresh Spinach", price: 30, unit: "250g", image: "/images/product_spinach.png", inStock: true, quality: "Organic", description: "Tender and vibrant spinach leaves. Perfect for salads or cooking.", nutritionFacts: "Calories: 23 per 100g • Iron: 15% DV • Vitamin K: 460% DV", origin: "Organic Gardens" },
  p6: { id: "p6", name: "Greek Yogurt", price: 80, unit: "400g", image: "/images/product_yogurt.png", inStock: true, quality: "Probiotic", description: "Creamy and thick Greek yogurt with live probiotics. Great for gut health.", nutritionFacts: "Calories: 59 per 100g • Protein: 10g • Fat: 0.4g", origin: "Premium Dairy" },
};


export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, seniorMode, language } = useApp();

  const product = mockProductDetails[id || "p1"] || mockProductDetails.p1;

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error(language === "en" ? "Out of stock" : "स्टॉक में नहीं");
      return;
    }
    addToCart(product);
    toast.success(language === "en" ? "Added to cart" : "कार्ट में जोड़ा गया");
  };

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
                {product.description}
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
                    <span className="font-bold text-gray-500">Origin</span>
                    <span className="font-bold">{product.origin}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="font-bold text-gray-500">Quality</span>
                    <span className="font-bold text-green-600">{product.quality}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500">Nutrition</span>
                    <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{product.nutritionFacts}</span>
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
