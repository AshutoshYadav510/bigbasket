import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Mail, Loader2, ArrowRight } from "lucide-react";
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
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      if (isRegistering) {
        if (!name) {
          toast.error(language === "en" ? "Please enter your name" : "कृपया अपना नाम दर्ज करें");
          setLoading(false);
          return;
        }
        const user = await api.registerUser(name, email);
        login(user);
        toast.success(language === "en" ? "Account created successfully!" : "खाता सफलतापूर्वक बनाया गया!");
        navigate("/");
      } else {
        const user = await api.loginUser(email);
        if (user) {
          login(user);
          toast.success(language === "en" ? `Welcome back, ${user.name}!` : `वापसी पर स्वागत है, ${user.name}!`);
          navigate("/");
        } else {
          // User not found, switch to register mode
          setIsRegistering(true);
          toast.info(language === "en" ? "Account not found. Please sign up." : "खाता नहीं मिला. कृपया साइन अप करें.");
        }
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
              {isRegistering 
                ? (language === "en" ? "Create Account" : "खाता बनाएं")
                : (language === "en" ? "Welcome Back" : "वापसी पर स्वागत है")
              }
            </h1>
            <p className={`${seniorMode ? 'text-xl' : 'text-base'} text-gray-600 dark:text-gray-400`}>
              {language === "en" 
                ? "Sign in to access your orders and fast checkout." 
                : "अपने ऑर्डर और फास्ट चेकआउट तक पहुंचने के लिए साइन इन करें।"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={seniorMode ? "space-y-6" : "space-y-4"}>
            <div>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${seniorMode ? 'h-6 w-6' : 'h-5 w-5'}`} />
                <Input
                  type="email"
                  placeholder={language === "en" ? "Email address" : "ईमेल पता"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-2xl ${seniorMode ? 'py-8 text-xl' : 'py-6'}`}
                  disabled={loading || isRegistering}
                  required
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${seniorMode ? 'h-6 w-6' : 'h-5 w-5'}`} />
                  <Input
                    type="text"
                    placeholder={language === "en" ? "Full Name" : "पूरा नाम"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`pl-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-2xl ${seniorMode ? 'py-8 text-xl' : 'py-6'}`}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-500/25 ${seniorMode ? 'py-8 text-xl' : 'py-6 text-lg'}`}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  {isRegistering 
                    ? (language === "en" ? "Sign Up" : "साइन अप करें")
                    : (language === "en" ? "Continue with Email" : "ईमेल के साथ जारी रखें")}
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>
          
          {isRegistering && (
            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => setIsRegistering(false)} className="text-gray-500">
                {language === "en" ? "Back to Login" : "लॉगिन पर वापस आएं"}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
