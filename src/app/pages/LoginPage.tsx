import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { toast } from "sonner";
import { api } from "../../lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, seniorMode, language } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(language === "en" ? "Please fill in all fields" : "कृपया सभी फ़ील्ड भरें");
      return;
    }

    setLoading(true);

    try {
      const user = await api.loginUser(email, password);
      if (user) {
        login(user);
        toast.success(language === "en" ? `Welcome back, ${user.name}!` : `वापसी पर स्वागत है, ${user.name}!`);
        navigate("/");
      } else {
        // User not found
        toast.error(language === "en" ? "Account not found. Please sign up." : "खाता नहीं मिला. कृपया साइन अप करें.");
      }
    } catch (error: any) {
      toast.error(error.message || (language === "en" ? "Authentication failed" : "प्रमाणीकरण विफल"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className={`${seniorMode ? 'p-8 max-w-lg' : 'p-6 max-w-md'} w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-none shadow-2xl rounded-3xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 -rotate-12 transform translate-x-10 -translate-y-10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rotate-12 transform -translate-x-10 translate-y-10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className={`${seniorMode ? 'text-4xl' : 'text-3xl'} font-bold text-gray-900 dark:text-white mb-2`}>
              {language === "en" ? "Welcome Back" : "वापसी पर स्वागत है"}
            </h1>
            <p className={`${seniorMode ? 'text-xl' : 'text-base'} text-gray-600 dark:text-gray-400`}>
              {language === "en" 
                ? "Sign in to access your orders and fast checkout." 
                : "अपने ऑर्डर और फास्ट चेकआउट तक पहुंचने के लिए साइन इन करें।"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={seniorMode ? "space-y-6" : "space-y-5"}>
            <div>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${seniorMode ? 'h-6 w-6' : 'h-5 w-5'}`} />
                <Input
                  type="email"
                  placeholder={language === "en" ? "Email address" : "ईमेल पता"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-2xl ${seniorMode ? 'py-8 text-xl' : 'py-6'}`}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${seniorMode ? 'h-6 w-6' : 'h-5 w-5'}`} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={language === "en" ? "Password" : "पासवर्ड"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-12 pr-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-2xl ${seniorMode ? 'py-8 text-xl' : 'py-6'}`}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-500/25 ${seniorMode ? 'py-8 text-xl' : 'py-6 text-lg'}`}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  {language === "en" ? "Login" : "लॉगिन करें"}
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {language === "en" ? "Don't have an account? " : "क्या आपके पास खाता नहीं है? "}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-bold">
                {language === "en" ? "Sign Up" : "साइन अप करें"}
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
