import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { User, Mail, Loader2, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { toast } from "sonner";
import { api } from "../../lib/api";

export function SignupPage() {
  const navigate = useNavigate();
  const { login, seniorMode, language } = useApp();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error(language === "en" ? "Please fill in all fields" : "कृपया सभी फ़ील्ड भरें");
      return;
    }

    setLoading(true);

    try {
      const user = await api.registerUser(name, email);
      login(user);
      toast.success(language === "en" ? "Account created successfully!" : "खाता सफलतापूर्वक बनाया गया!");
      navigate("/");
    } catch (error: any) {
      // If email already exists, API will throw error
      toast.error(error.message || (language === "en" ? "Registration failed" : "पंजीकरण विफल रहा"));
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
              {language === "en" ? "Create Account" : "खाता बनाएं"}
            </h1>
            <p className={`${seniorMode ? 'text-xl' : 'text-base'} text-gray-600 dark:text-gray-400`}>
              {language === "en" 
                ? "Sign up to start shopping for fresh groceries." 
                : "ताज़ा किराने का सामान खरीदने के लिए साइन अप करें।"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={seniorMode ? "space-y-6" : "space-y-5"}>
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

            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-500/25 ${seniorMode ? 'py-8 text-xl' : 'py-6 text-lg'}`}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  {language === "en" ? "Sign Up" : "साइन अप करें"}
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {language === "en" ? "Already have an account? " : "क्या आपके पास पहले से एक खाता है? "}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-bold">
                {language === "en" ? "Login" : "लॉगिन करें"}
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
