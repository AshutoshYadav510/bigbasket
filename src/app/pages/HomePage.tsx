import { Link } from "react-router";
import { Sparkles, Clock, ShieldCheck, Leaf } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const categories = [
  { name: "Fresh Vegetables", image: "/images/category_vegetables.png", path: "vegetables", color: "from-green-500/20 to-emerald-500/20" },
  { name: "Fresh Fruits", image: "/images/category_fruits.png", path: "fruits", color: "from-red-500/20 to-orange-500/20" },
  { name: "Dairy & Eggs", image: "/images/category_dairy.png", path: "dairy", color: "from-blue-500/20 to-cyan-500/20" },
  { name: "Rice & Grains", image: "/images/category_grains.png", path: "grains", color: "from-yellow-500/20 to-amber-500/20" },
  { name: "Snacks", image: "/images/category_snacks.png", path: "snacks", color: "from-purple-500/20 to-pink-500/20" },
  { name: "Beverages", image: "/images/category_beverages.png", path: "beverages", color: "from-indigo-500/20 to-blue-500/20" },
];

export function HomePage() {
  const { seniorMode, language } = useApp();

  const heading = language === "en" ? "Freshness Delivered" : "ताजगी आपके द्वार";
  const subheading = language === "en"
    ? "Premium quality groceries at your fingertips"
    : "प्रीमियम गुणवत्ता वाला किराना आपकी उंगलियों पर";

  return (
    <div className="pb-20 relative">
      {/* Page-Specific Abstract Shapes */}
      <div className="absolute top-[200px] right-[-30px] w-48 h-48 bg-lime-400/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-[500px] left-[-50px] w-64 h-64 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] right-[-100px] w-96 h-96 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[1200px] left-[10%] w-32 h-32 bg-amber-400/20 rounded-full blur-2xl animate-bounce duration-[15000ms] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[550px] w-full overflow-hidden shadow-2xl rounded-b-[4rem]">
        <img 
          src="/images/hero_banner.png" 
          alt="Fresh Groceries" 
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-6 md:p-20">
          {/* Abstract Hero Art Overlay */}
          <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-color-dodge">
            <img src="/images/abstract_grocery_vibrant.png" alt="" className="w-full h-full object-cover" />
          </div>

          <div className="max-w-7xl mx-auto w-full">
            <h1 className={`${seniorMode ? 'text-4xl md:text-7xl mb-4' : 'text-3xl md:text-5xl mb-2'} font-extrabold text-white tracking-tight`}>
              {heading}
            </h1>
            <p className={`${seniorMode ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'} text-gray-200 font-medium max-w-2xl`}>
              {subheading}
            </p>
            <Button 
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white border-none px-8 py-6 text-lg rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              {language === "en" ? "Shop Now" : "अभी खरीदें"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Value Props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-20">
          {[
            { icon: Sparkles, text: language === "en" ? "Premium Quality" : "प्रीमियम गुणवत्ता", color: "bg-green-100 text-green-700" },
            { icon: Clock, text: language === "en" ? "Express Delivery" : "एक्सप्रेस डिलीवरी", color: "bg-blue-100 text-blue-700" },
            { icon: ShieldCheck, text: language === "en" ? "Verified Stores" : "सत्यापित स्टोर", color: "bg-purple-100 text-purple-700" },
            { icon: Leaf, text: language === "en" ? "Farm Fresh" : "खेत से ताजा", color: "bg-emerald-100 text-emerald-700" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className={`p-4 md:p-6 rounded-2xl ${item.color} mb-3 transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                <item.icon className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <p className={`${seniorMode ? 'text-lg md:text-xl' : 'text-sm md:text-base'} font-semibold text-gray-800 dark:text-gray-200`}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <div id="categories" className="flex justify-between items-end mb-8 scroll-mt-24">
          <div>
            <h2 className={`${seniorMode ? 'text-3xl md:text-5xl mb-2' : 'text-2xl md:text-4xl mb-1'} font-bold text-gray-900 dark:text-white`}>
              {language === "en" ? "Categories" : "श्रेणियां"}
            </h2>
            <div className="h-1.5 w-20 bg-green-500 rounded-full" />
          </div>
          <Link to="/products/all" className="text-green-600 font-semibold hover:underline hidden md:block">
            {language === "en" ? "View All" : "सभी देखें"}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {categories.map((category) => (
            <Link key={category.path} to={`/products/${category.path}`} className="group">
              <Card className="relative overflow-hidden border-none rounded-3xl aspect-[4/5] md:aspect-square shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity`} />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <h3 className={`${seniorMode ? 'text-xl md:text-3xl' : 'text-lg md:text-xl'} font-bold text-white mb-1`}>
                    {category.name}
                  </h3>
                  <div className="flex items-center text-green-400 text-sm font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {language === "en" ? "Explore" : "देखें"} <Sparkles className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
