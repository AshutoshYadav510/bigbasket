import { Link, useLocation } from "react-router";
import { ShoppingCart, User, Package, Languages, Accessibility, Home, Menu, X, HelpCircle, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { VoiceSearch } from "./VoiceSearch";
import { useState } from "react";

export function NavBar() {
  const { cart, seniorMode, toggleSeniorMode, language, toggleLanguage, user, logout } = useApp();
  const location = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${seniorMode ? 'py-4 md:py-6' : 'py-3 md:py-4'}`}>
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <Link to="/" className={`font-bold text-green-600 dark:text-green-400 ${seniorMode ? 'text-3xl' : 'text-2xl'}`}>
              BigBasket
            </Link>

            <VoiceSearch />

            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size={seniorMode ? "lg" : "icon"} className={seniorMode ? 'px-6 py-6' : ''}>
                  <Home className={seniorMode ? 'h-8 w-8' : 'h-5 w-5'} />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size={seniorMode ? "lg" : "icon"}
                onClick={toggleLanguage}
                className={`${seniorMode ? 'text-lg px-6 py-6' : ''} hidden lg:flex`}
              >
                <Languages className={seniorMode ? 'h-8 w-8' : 'h-5 w-5'} />
                {seniorMode && <span className="ml-2">{language === "en" ? "हिंदी" : "English"}</span>}
              </Button>


              <Button
                variant={seniorMode ? "default" : "ghost"}
                size={seniorMode ? "lg" : "icon"}
                onClick={toggleSeniorMode}
                className={`${seniorMode ? 'text-lg px-6 py-6 bg-blue-600 hover:bg-blue-700' : ''} hidden lg:flex`}
              >
                <Accessibility className={seniorMode ? 'h-8 w-8' : 'h-5 w-5'} />
                {seniorMode && <span className="ml-2">Senior Mode ON</span>}
              </Button>

              <Link to="/support">
                <Button variant="ghost" size={seniorMode ? "lg" : "icon"} className={seniorMode ? 'px-6 py-6' : ''}>
                  <HelpCircle className={seniorMode ? 'h-8 w-8' : 'h-5 w-5'} />
                </Button>
              </Link>

              <Link to={user ? "/orders" : "/login"}>
                <Button variant="ghost" size={seniorMode ? "lg" : "icon"} className={seniorMode ? 'px-6 py-6' : ''}>
                  <Package className={seniorMode ? 'h-8 w-8' : 'h-5 w-5'} />
                </Button>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/settings">
                    <Button variant="ghost" className={seniorMode ? 'px-6 py-6 text-lg' : 'rounded-full'}>
                      <span className="font-medium mr-2">{user.name.split(' ')[0]}</span>
                      <User className={seniorMode ? 'h-8 w-8' : 'h-5 w-5'} />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className={seniorMode ? 'h-8 w-8' : 'h-5 w-5'} />
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="default" className={`bg-green-600 hover:bg-green-700 text-white rounded-full ${seniorMode ? 'text-xl px-6 py-6' : ''}`}>
                    {language === "en" ? "Login" : "लॉगिन"}
                  </Button>
                </Link>
              )}

              <Link to="/cart" className="relative">
                <Button variant="ghost" size={seniorMode ? "lg" : "icon"} className={seniorMode ? 'px-6 py-6' : ''}>
                  <ShoppingCart className={seniorMode ? 'h-8 w-8' : 'h-5 w-5'} />
                  {cartCount > 0 && (
                    <Badge className={`absolute ${seniorMode ? '-top-1 -right-1 text-lg px-3 py-2' : '-top-2 -right-2 text-xs'} bg-green-600`}>
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between gap-2">
            <Link to="/" className={`font-bold text-green-600 dark:text-green-400 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
              BigBasket
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>


          {/* Mobile Search - Below header on mobile */}
          <div className="md:hidden mt-3">
            <VoiceSearch />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[120px] bg-white dark:bg-gray-900 z-40 overflow-y-auto">
          <div className="px-4 py-6 space-y-4">
            {user ? (
              <>
                <div className="p-4 mb-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                  <p className="text-sm text-gray-500">{language === "en" ? "Logged in as" : "लॉग इन किया है"}</p>
                  <p className="font-bold text-lg">{user.name}</p>
                </div>
                
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start text-lg py-6">
                    <Package className="h-6 w-6 mr-3" />
                    {language === "en" ? "My Orders" : "मेरे ऑर्डर"}
                  </Button>
                </Link>

                <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start text-lg py-6">
                    <User className="h-6 w-6 mr-3" />
                    {language === "en" ? "Settings" : "सेटिंग्स"}
                  </Button>
                </Link>

                <Button variant="outline" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-start text-lg py-6 text-red-600">
                  <LogOut className="h-6 w-6 mr-3" />
                  {language === "en" ? "Logout" : "लॉग आउट"}
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full justify-start text-lg py-6 bg-green-600 hover:bg-green-700 text-white">
                  <User className="h-6 w-6 mr-3" />
                  {language === "en" ? "Login / Sign Up" : "लॉगिन / साइन अप"}
                </Button>
              </Link>
            )}

            <Link to="/support" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start text-lg py-6 mt-4">
                <HelpCircle className="h-6 w-6 mr-3" />
                {language === "en" ? "Support" : "सहायता"}
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start text-lg py-6"
            >
              <Languages className="h-6 w-6 mr-3" />
              {language === "en" ? "Switch to हिंदी" : "Switch to English"}
            </Button>


            <Button
              variant={seniorMode ? "default" : "outline"}
              onClick={() => {
                toggleSeniorMode();
              }}
              className="w-full justify-start text-lg py-6"
            >
              <Accessibility className="h-6 w-6 mr-3" />
              {language === "en" ? "Senior Mode" : "वरिष्ठ मोड"} {seniorMode ? "ON" : "OFF"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

