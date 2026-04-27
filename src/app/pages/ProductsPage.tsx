import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router";
import { AlertCircle, CheckCircle, Loader2, SearchX, Minus, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { api, Product } from "../../lib/api";

export function ProductsPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || undefined;
  
  const { addToCart, updateQuantity, cart, seniorMode, language, user } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Map category paths from frontend to DB categories if needed
        let dbCategory = category;
        if (category === "dairy") dbCategory = "Dairy & Eggs";
        if (category === "vegetables") dbCategory = "Fruits & Vegetables";
        if (category === "fruits") dbCategory = "Fruits & Vegetables";
        if (category === "snacks") dbCategory = "Snacks & Beverages";
        if (category === "beverages") dbCategory = "Snacks & Beverages";
        if (category === "grains") dbCategory = "Staples";

        const data = await api.getProducts(category === "all" ? undefined : dbCategory, searchQuery);
        setProducts(data);
      } catch (error) {
        toast.error(language === "en" ? "Failed to load products" : "उत्पाद लोड करने में विफल");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, searchQuery, language]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast.error(language === "en" ? "Please login to add items to cart" : "कार्ट में आइटम जोड़ने के लिए कृपया लॉगिन करें");
      navigate("/login");
      return;
    }
    if (!product.inStock) {
      toast.error(language === "en" ? "Out of stock" : "स्टॉक में नहीं");
      return;
    }
    // ensure cart items have required properties
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      inStock: product.inStock,
    });
    toast.success(language === "en" ? "Added to cart" : "कार्ट में जोड़ा गया");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-6 md:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
        <div>
          <h1 className={`${seniorMode ? 'text-4xl md:text-6xl' : 'text-3xl md:text-5xl'} font-black text-gray-900 dark:text-white capitalize tracking-tight`}>
            {searchQuery 
              ? (language === "en" ? `Search: "${searchQuery}"` : `खोज: "${searchQuery}"`)
              : category === "all" ? (language === "en" ? "All Products" : "सभी उत्पाद") : category}
          </h1>
          {searchQuery && (
            <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
              {products.length} {language === "en" ? "results found" : "परिणाम मिले"}
            </p>
          )}
        </div>
      </div>

      {/* Stock Integrity Notice */}
      {!searchQuery && (
        <Card className={`${seniorMode ? 'p-6 md:p-8 text-xl' : 'p-4 md:p-5 text-sm md:text-base'} mb-8 md:mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none shadow-sm rounded-2xl`}>
          <p className="text-blue-900 dark:text-blue-200 font-medium flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            {language === "en"
              ? "Real-time stock updates • All prices include taxes"
              : "रीयल-टाइम स्टॉक अपडेट • सभी कीमतों में कर शामिल हैं"}
          </p>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 blur-[30px] opacity-20 rounded-full" />
            <Loader2 className="h-16 w-16 animate-spin text-green-600 relative z-10" />
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full mb-6">
            <SearchX className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {language === "en" ? "No products found" : "कोई उत्पाद नहीं मिला"}
          </h2>
          <p className="text-gray-500 text-lg max-w-md">
            {searchQuery 
              ? (language === "en" ? "Try adjusting your search terms or browse our categories." : "अपने खोज शब्दों को समायोजित करने का प्रयास करें या हमारी श्रेणियों को ब्राउज़ करें।")
              : (language === "en" ? "This category is currently empty. Check back later!" : "यह श्रेणी वर्तमान में खाली है। बाद में वापस आएं!")}
          </p>
          {searchQuery && (
            <Link to="/products/all">
              <Button className="mt-8 bg-green-600 rounded-full px-8 py-6 text-lg">
                {language === "en" ? "View All Products" : "सभी उत्पाद देखें"}
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className={`grid ${seniorMode ? 'grid-cols-1 md:grid-cols-2 gap-8' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8'}`}>
          {products.map((product) => (
            <Card 
              key={product.id} 
              className={`${seniorMode ? 'p-6 md:p-8 rounded-[2rem]' : 'p-4 md:p-6 rounded-[1.5rem]'} relative overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-white/40 dark:border-gray-800/60 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group`}
            >
              {/* Decorative Blur blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-700" />

              {/* Stock Status Badge */}
              <Badge
                className={`absolute z-10 ${seniorMode ? 'top-6 right-6 text-lg px-4 py-2 rounded-xl' : 'top-4 right-4 text-xs md:text-sm px-3 py-1.5 rounded-lg'} border-none shadow-md ${
                  product.inStock
                    ? 'bg-white/90 text-green-700 dark:bg-gray-800/90 dark:text-green-400 backdrop-blur-md'
                    : 'bg-red-500 text-white shadow-red-500/30'
                }`}
              >
                {product.inStock ? (
                  <CheckCircle className={`${seniorMode ? 'h-5 w-5' : 'h-3.5 w-3.5'} mr-1.5 inline`} />
                ) : (
                  <AlertCircle className={`${seniorMode ? 'h-5 w-5' : 'h-3.5 w-3.5'} mr-1.5 inline`} />
                )}
                <span className="font-bold tracking-wide">
                  {product.inStock
                    ? (language === "en" ? "In Stock" : "स्टॉक में")
                    : (language === "en" ? "Out of Stock" : "स्टॉक में नहीं")}
                </span>
              </Badge>

              <Link to={`/product/${product.id}`}>
                <div className={`${seniorMode ? 'h-56 md:h-72 mb-6' : 'h-40 md:h-48 lg:h-56 mb-4 md:mb-5'} p-4 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>

              <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <h3 className={`${seniorMode ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'} font-black text-gray-900 dark:text-white truncate leading-tight`}>
                  {product.name}
                </h3>
                <p className={`${seniorMode ? 'text-xl' : 'text-sm md:text-base'} text-gray-500 dark:text-gray-400 font-medium`}>
                  {product.unit} • <span className="capitalize">{product.category}</span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 md:gap-4 mt-auto">
                <span className={`${seniorMode ? 'text-4xl' : 'text-2xl md:text-3xl'} font-black text-green-600 dark:text-green-400 tracking-tight`}>
                  ₹{product.price}
                </span>
                {(() => {
                  const cartItem = cart.find(item => item.id === product.id);
                  if (cartItem) {
                    return (
                      <div className={`flex items-center bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 ${seniorMode ? 'rounded-2xl p-1.5' : 'rounded-xl p-1'}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                          className={`${seniorMode ? 'h-10 w-10' : 'h-8 w-8'} rounded-lg hover:bg-white dark:hover:bg-gray-700 active:scale-90 transition-all`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className={`${seniorMode ? 'w-10 text-xl' : 'w-8 text-base'} text-center font-black text-green-700 dark:text-green-400`}>
                          {cartItem.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                          className={`${seniorMode ? 'h-10 w-10' : 'h-8 w-8'} rounded-lg hover:bg-white dark:hover:bg-gray-700 active:scale-90 transition-all`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  }
                  return (
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      size={seniorMode ? "lg" : "default"}
                      className={`flex-1 max-w-[120px] md:max-w-none ${seniorMode ? 'text-xl px-8 py-7 rounded-2xl' : 'text-sm md:text-base py-5 md:py-6 rounded-xl'} font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 transition-all active:scale-95`}
                    >
                      {language === "en" ? "Add" : "जोड़ें"}
                    </Button>
                  );
                })()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


