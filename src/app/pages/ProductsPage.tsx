import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { api, Product } from "../../lib/api";

export function ProductsPage() {
  const { category } = useParams();
  const { addToCart, seniorMode, language } = useApp();
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

        const data = await api.getProducts(category === "all" ? undefined : dbCategory);
        setProducts(data);
      } catch (error) {
        toast.error(language === "en" ? "Failed to load products" : "उत्पाद लोड करने में विफल");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, language]);

  const handleAddToCart = (product: Product) => {
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
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
      <h1 className={`${seniorMode ? 'text-3xl md:text-5xl mb-6 md:mb-10' : 'text-2xl md:text-3xl mb-4 md:mb-8'} font-bold text-gray-900 dark:text-white capitalize`}>
        {category === "all" ? (language === "en" ? "All Products" : "सभी उत्पाद") : category}
      </h1>

      {/* Stock Integrity Notice */}
      <Card className={`${seniorMode ? 'p-6 md:p-8 mb-8 md:mb-12 text-lg md:text-xl' : 'p-3 md:p-4 mb-6 md:mb-8'} bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800`}>
        <p className="text-blue-900 dark:text-blue-100">
          {language === "en"
            ? "✓ Real-time stock updates • All prices include taxes"
            : "✓ रीयल-टाइम स्टॉक अपडेट • सभी कीमतों में कर शामिल हैं"}
        </p>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {language === "en" ? "No products found in this category." : "इस श्रेणी में कोई उत्पाद नहीं मिला।"}
          </p>
        </div>
      ) : (
        <div className={`grid ${seniorMode ? 'grid-cols-1 md:grid-cols-2 gap-6 md:gap-8' : 'grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'}`}>
          {products.map((product) => (
            <Card key={product.id} className={`${seniorMode ? 'p-6 md:p-8' : 'p-4 md:p-6'} relative`}>
              {/* Stock Status Badge */}
              <Badge
                className={`absolute ${seniorMode ? 'top-4 right-4 md:top-6 md:right-6 text-sm md:text-lg px-3 py-1 md:px-4 md:py-2' : 'top-3 right-3 md:top-4 md:right-4 text-xs md:text-sm'} ${
                  product.inStock
                    ? 'bg-green-600'
                    : 'bg-red-600'
                }`}
              >
                {product.inStock ? (
                  <CheckCircle className={`${seniorMode ? 'h-4 w-4 md:h-5 md:w-5' : 'h-3 w-3 md:h-4 md:w-4'} mr-1 inline`} />
                ) : (
                  <AlertCircle className={`${seniorMode ? 'h-4 w-4 md:h-5 md:w-5' : 'h-3 w-3 md:h-4 md:w-4'} mr-1 inline`} />
                )}
                <span className="hidden md:inline">
                  {product.inStock
                    ? (language === "en" ? "In Stock" : "स्टॉक में")
                    : (language === "en" ? "Out of Stock" : "स्टॉक में नहीं")}
                </span>
              </Badge>

              <Link to={`/product/${product.id}`}>
                <div className={`${seniorMode ? 'h-48 md:h-64 mb-4 md:mb-6' : 'h-40 md:h-52 mb-3 md:mb-4'} overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900 group`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>

              <h3 className={`${seniorMode ? 'text-xl md:text-3xl mb-2 md:mb-3' : 'text-base md:text-lg mb-1 md:mb-2'} font-semibold text-gray-900 dark:text-white truncate`}>
                {product.name}
              </h3>

              <p className={`${seniorMode ? 'text-lg md:text-2xl mb-3 md:mb-4' : 'text-xs md:text-sm mb-2'} text-gray-600 dark:text-gray-400`}>
                {product.category} • {product.unit}
              </p>

              <div className="flex items-center justify-between gap-2">
                <span className={`${seniorMode ? 'text-2xl md:text-4xl' : 'text-lg md:text-2xl'} font-bold text-green-600 dark:text-green-400`}>
                  ₹{product.price}
                </span>
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  size={seniorMode ? "default" : "sm"}
                  className={seniorMode ? 'text-base md:text-xl px-4 md:px-8 py-4 md:py-6' : 'text-xs md:text-sm'}
                >
                  {language === "en" ? "Add" : "जोड़ें"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

