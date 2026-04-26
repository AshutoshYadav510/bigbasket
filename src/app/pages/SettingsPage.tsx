import { User, Bell, MapPin, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";

export function SettingsPage() {
  const { seniorMode, toggleSeniorMode, darkMode, toggleDarkMode, language, toggleLanguage } = useApp();

  const settingsSections = [
    {
      icon: User,
      title: language === "en" ? "Profile" : "प्रोफ़ाइल",
      items: [
        { label: language === "en" ? "Name: Priya Sharma" : "नाम: प्रिया शर्मा" },
        { label: language === "en" ? "Email: priya@example.com" : "ईमेल: priya@example.com" },
        { label: language === "en" ? "Phone: +91 98765 43210" : "फोन: +91 98765 43210" },
      ],
    },
    {
      icon: MapPin,
      title: language === "en" ? "Saved Addresses" : "सहेजे गए पते",
      items: [
        { label: language === "en" ? "Home - 123 MG Road, Bangalore" : "घर - 123 एमजी रोड, बेंगलुरु" },
        { label: language === "en" ? "Office - 456 Tech Park, Bangalore" : "कार्यालय - 456 टेक पार्क, बेंगलुरु" },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-8 mb-8 border-none shadow-2xl bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-[3rem] overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="h-24 w-24 md:h-32 md:w-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 text-4xl md:text-5xl font-black">
              PS
            </div>
            <div className="text-center md:text-left">
              <h1 className={`${seniorMode ? 'text-5xl mb-2' : 'text-3xl md:text-4xl mb-1'} font-black`}>
                Priya Sharma
              </h1>
              <p className={`${seniorMode ? 'text-2xl opacity-90' : 'text-lg opacity-80'} font-bold`}>
                +91 98765 43210 • {language === "en" ? "Premium Member" : "प्रीमियम सदस्य"}
              </p>
              <div className="mt-4 flex gap-2 justify-center md:justify-start">
                <Badge className="bg-white/20 text-white border-none px-3 py-1 text-xs">
                  5.0 ⭐ {language === "en" ? "Rating" : "रेटिंग"}
                </Badge>
                <Badge className="bg-white/20 text-white border-none px-3 py-1 text-xs">
                  {language === "en" ? "12 Orders this month" : "इस महीने 12 ऑर्डर"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className={seniorMode ? 'space-y-8' : 'space-y-6'}>
          {/* Accessibility Settings */}
          <Card className={`${seniorMode ? 'p-8' : 'p-6 md:p-8'} border-none shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-[2rem]`}>
            <h2 className={`${seniorMode ? 'text-4xl mb-8' : 'text-2xl mb-6'} font-black text-gray-900 dark:text-white tracking-tight`}>
              {language === "en" ? "App Preferences" : "ऐप प्राथमिकताएं"}
            </h2>

            <div className={`space-y-${seniorMode ? '10' : '8'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={`${seniorMode ? 'text-3xl mb-2' : 'text-lg mb-1'} block font-black text-gray-900 dark:text-white`}>
                    {language === "en" ? "Senior-Friendly Mode" : "वरिष्ठ-अनुकूल मोड"}
                  </Label>
                  <p className={`${seniorMode ? 'text-2xl' : 'text-sm'} font-bold text-gray-500 dark:text-gray-400`}>
                    {language === "en"
                      ? "Bigger text & high contrast"
                      : "बड़ा टेक्स्ट और उच्च कंट्रास्ट"}
                  </p>
                </div>
                <Switch
                  checked={seniorMode}
                  onCheckedChange={toggleSeniorMode}
                  className={seniorMode ? 'scale-150' : 'scale-125'}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={`${seniorMode ? 'text-3xl mb-2' : 'text-lg mb-1'} block font-black text-gray-900 dark:text-white`}>
                    {language === "en" ? "Language" : "भाषा"}
                  </Label>
                  <p className={`${seniorMode ? 'text-2xl' : 'text-sm'} font-bold text-gray-500 dark:text-gray-400`}>
                    {language === "en" ? "Current: English" : "वर्तमान: हिंदी"}
                  </p>
                </div>
                <Button 
                  onClick={toggleLanguage} 
                  size={seniorMode ? "lg" : "default"} 
                  className={`bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-none font-black rounded-xl transition-all active:scale-95 ${seniorMode ? 'text-2xl px-10 py-8' : ''}`}
                >
                  {language === "en" ? "Switch to हिंदी" : "English"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Profile Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {settingsSections.map((section, idx) => (
              <Card key={idx} className={`${seniorMode ? 'p-8' : 'p-6 md:p-8'} border-none shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-[2rem]`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                    <section.icon className={`${seniorMode ? 'h-8 w-8' : 'h-6 w-6'} text-green-600`} />
                  </div>
                  <h2 className={`${seniorMode ? 'text-3xl' : 'text-xl'} font-black text-gray-900 dark:text-white`}>
                    {section.title}
                  </h2>
                </div>
                <div className={`space-y-${seniorMode ? '4' : '3'}`}>
                  {section.items.map((item, itemIdx) => (
                    <p key={itemIdx} className={`${seniorMode ? 'text-2xl' : 'text-base'} font-bold text-gray-600 dark:text-gray-400`}>
                      {item.label}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className={`${seniorMode ? 'p-8' : 'p-6 md:p-8'} border-none shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-[2.5rem]`}>
            <h2 className={`${seniorMode ? 'text-4xl mb-8' : 'text-2xl mb-8'} font-black text-gray-900 dark:text-white tracking-tight`}>
              {language === "en" ? "Support & More" : "सहायता और अधिक"}
            </h2>
            <div className={`grid ${seniorMode ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
              <Button variant="ghost" className="h-16 justify-start font-black text-lg rounded-2xl hover:bg-white/50">
                <Bell className="h-6 w-6 mr-3 text-blue-500" />
                {language === "en" ? "Notifications" : "सूचनाएं"}
              </Button>
              <Button variant="ghost" className="h-16 justify-start font-black text-lg rounded-2xl hover:bg-white/50">
                <CreditCard className="h-6 w-6 mr-3 text-purple-500" />
                {language === "en" ? "Payments" : "भुगतान"}
              </Button>
              <Button variant="ghost" className="h-16 justify-start font-black text-lg rounded-2xl hover:bg-white/50">
                <HelpCircle className="h-6 w-6 mr-3 text-amber-500" />
                {language === "en" ? "Help Center" : "सहायता केंद्र"}
              </Button>
              <Button variant="ghost" className="h-16 justify-start font-black text-lg rounded-2xl hover:bg-white/50 text-red-500">
                <LogOut className="h-6 w-6 mr-3" />
                {language === "en" ? "Logout" : "लॉगआउट"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
