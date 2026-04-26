import { Phone, Mail, MessageCircle, Clock, MapPin, Headphones } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function SupportPage() {
  const { seniorMode, language } = useApp();

  const contactMethods = [
    {
      icon: Phone,
      title: language === "en" ? "Call Us" : "हमें कॉल करें",
      detail: "1800-123-4567",
      subtext: language === "en" ? "Toll-Free, 24/7 Available" : "टोल-फ्री, 24/7 उपलब्ध",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      icon: MessageCircle,
      title: language === "en" ? "WhatsApp" : "व्हाट्सएप",
      detail: "+91 98765 43210",
      subtext: language === "en" ? "Chat with our support team" : "हमारी सहायता टीम से चैट करें",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      icon: Mail,
      title: language === "en" ? "Email" : "ईमेल",
      detail: "support@bigbasket.com",
      subtext: language === "en" ? "Response within 24 hours" : "24 घंटे के भीतर जवाब",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      icon: Headphones,
      title: language === "en" ? "Live Chat" : "लाइव चैट",
      detail: language === "en" ? "Start Chat" : "चैट शुरू करें",
      subtext: language === "en" ? "Instant support available" : "तुरंत सहायता उपलब्ध",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  const officeLocations = [
    {
      city: language === "en" ? "Bangalore HQ" : "बेंगलुरु मुख्यालय",
      address: "MG Road, Bangalore, Karnataka 560001",
      phone: "+91 80 1234 5678",
    },
    {
      city: language === "en" ? "Mumbai Office" : "मुंबई कार्यालय",
      address: "Andheri East, Mumbai, Maharashtra 400069",
      phone: "+91 22 1234 5678",
    },
    {
      city: language === "en" ? "Delhi Office" : "दिल्ली कार्यालय",
      address: "Connaught Place, New Delhi 110001",
      phone: "+91 11 1234 5678",
    },
  ];

  const faqs = [
    {
      question: language === "en" ? "How do I track my order?" : "मैं अपने ऑर्डर को कैसे ट्रैक करूं?",
      answer: language === "en"
        ? "Go to 'My Orders' section and click on your order to see real-time tracking."
        : "'मेरे ऑर्डर' अनुभाग में जाएं और रियल-टाइम ट्रैकिंग देखने के लिए अपने ऑर्डर पर क्लिक करें।",
    },
    {
      question: language === "en" ? "What is the return policy?" : "रिटर्न नीति क्या है?",
      answer: language === "en"
        ? "100% money back guarantee if you're not satisfied with product quality. Return within 24 hours of delivery."
        : "यदि आप उत्पाद की गुणवत्ता से संतुष्ट नहीं हैं तो 100% पैसे वापस की गारंटी। डिलीवरी के 24 घंटे के भीतर वापस करें।",
    },
    {
      question: language === "en" ? "Is there a minimum order amount?" : "क्या न्यूनतम ऑर्डर राशि है?",
      answer: language === "en"
        ? "No minimum order. Free delivery on orders above ₹200, otherwise ₹40 delivery charge applies."
        : "कोई न्यूनतम ऑर्डर नहीं। ₹200 से अधिक के ऑर्डर पर मुफ्त डिलीवरी, अन्यथा ₹40 डिलीवरी शुल्क लागू होता है।",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
      <h1 className={`${seniorMode ? 'text-4xl md:text-5xl mb-8 md:mb-10' : 'text-2xl md:text-3xl mb-6 md:mb-8'} font-bold text-gray-900 dark:text-white`}>
        {language === "en" ? "Help & Support" : "सहायता और समर्थन"}
      </h1>

      {/* Contact Methods */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${seniorMode ? 'gap-6 md:gap-8 mb-10 md:mb-16' : 'gap-4 md:gap-6 mb-8 md:mb-12'}`}>
        {contactMethods.map((method, idx) => (
          <Card key={idx} className={`${seniorMode ? 'p-6 md:p-8' : 'p-4 md:p-6'} ${method.bgColor} hover:shadow-lg transition-shadow cursor-pointer`}>
            <div className="flex items-start gap-4">
              <method.icon className={`${seniorMode ? 'h-10 w-10 md:h-12 md:w-12' : 'h-8 w-8 md:h-10 md:w-10'} ${method.color}`} />
              <div className="flex-1">
                <h3 className={`${seniorMode ? 'text-2xl md:text-3xl mb-2 md:mb-3' : 'text-lg md:text-xl mb-1 md:mb-2'} font-semibold text-gray-900 dark:text-white`}>
                  {method.title}
                </h3>
                <p className={`${seniorMode ? 'text-xl md:text-2xl mb-1 md:mb-2' : 'text-base md:text-lg mb-1'} font-medium ${method.color}`}>
                  {method.detail}
                </p>
                <p className={`${seniorMode ? 'text-lg md:text-xl' : 'text-sm md:text-base'} text-gray-600 dark:text-gray-400`}>
                  {method.subtext}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Working Hours */}
      <Card className={`${seniorMode ? 'p-6 md:p-8 mb-10 md:mb-16' : 'p-4 md:p-6 mb-8 md:mb-12'} bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950`}>
        <div className="flex items-center gap-4">
          <Clock className={`${seniorMode ? 'h-10 w-10 md:h-12 md:w-12' : 'h-8 w-8 md:h-10 md:w-10'} text-blue-600`} />
          <div>
            <h3 className={`${seniorMode ? 'text-2xl md:text-3xl mb-1 md:mb-2' : 'text-lg md:text-xl mb-1'} font-semibold text-gray-900 dark:text-white`}>
              {language === "en" ? "Customer Support Hours" : "ग्राहक सहायता समय"}
            </h3>
            <p className={`${seniorMode ? 'text-xl md:text-2xl' : 'text-base md:text-lg'} text-gray-700 dark:text-gray-300`}>
              {language === "en"
                ? "Monday - Sunday: 6:00 AM - 11:00 PM (IST)"
                : "सोमवार - रविवार: सुबह 6:00 बजे - रात 11:00 बजे (IST)"}
            </p>
          </div>
        </div>
      </Card>

      {/* Office Locations */}
      <h2 className={`${seniorMode ? 'text-3xl md:text-4xl mb-6 md:mb-8' : 'text-xl md:text-2xl mb-4 md:mb-6'} font-bold text-gray-900 dark:text-white`}>
        {language === "en" ? "Our Offices" : "हमारे कार्यालय"}
      </h2>
      <div className={`grid grid-cols-1 md:grid-cols-3 ${seniorMode ? 'gap-6 md:gap-8 mb-10 md:mb-16' : 'gap-4 md:gap-6 mb-8 md:mb-12'}`}>
        {officeLocations.map((office, idx) => (
          <Card key={idx} className={`${seniorMode ? 'p-6 md:p-8' : 'p-4 md:p-6'}`}>
            <MapPin className={`${seniorMode ? 'h-10 w-10 md:h-12 md:w-12 mb-4' : 'h-8 w-8 mb-3'} text-green-600`} />
            <h3 className={`${seniorMode ? 'text-2xl md:text-3xl mb-3' : 'text-lg md:text-xl mb-2'} font-semibold text-gray-900 dark:text-white`}>
              {office.city}
            </h3>
            <p className={`${seniorMode ? 'text-lg md:text-xl mb-2 md:mb-3' : 'text-sm md:text-base mb-2'} text-gray-600 dark:text-gray-400`}>
              {office.address}
            </p>
            <p className={`${seniorMode ? 'text-xl md:text-2xl' : 'text-base md:text-lg'} font-medium text-green-600 dark:text-green-400`}>
              {office.phone}
            </p>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <h2 className={`${seniorMode ? 'text-3xl md:text-4xl mb-6 md:mb-8' : 'text-xl md:text-2xl mb-4 md:mb-6'} font-bold text-gray-900 dark:text-white`}>
        {language === "en" ? "Frequently Asked Questions" : "अक्सर पूछे जाने वाले प्रश्न"}
      </h2>
      <div className={seniorMode ? 'space-y-6 md:space-y-8' : 'space-y-4 md:space-y-6'}>
        {faqs.map((faq, idx) => (
          <Card key={idx} className={`${seniorMode ? 'p-6 md:p-8' : 'p-4 md:p-6'}`}>
            <h3 className={`${seniorMode ? 'text-2xl md:text-3xl mb-3 md:mb-4' : 'text-lg md:text-xl mb-2 md:mb-3'} font-semibold text-gray-900 dark:text-white`}>
              {faq.question}
            </h3>
            <p className={`${seniorMode ? 'text-xl md:text-2xl' : 'text-base md:text-lg'} text-gray-600 dark:text-gray-400`}>
              {faq.answer}
            </p>
          </Card>
        ))}
      </div>

      {/* Emergency Support */}
      <Card className={`${seniorMode ? 'p-6 md:p-10 mt-10 md:mt-16' : 'p-4 md:p-8 mt-8 md:mt-12'} bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-center`}>
        <h3 className={`${seniorMode ? 'text-3xl md:text-4xl mb-4 md:mb-6' : 'text-xl md:text-2xl mb-3 md:mb-4'} font-bold text-red-900 dark:text-red-100`}>
          {language === "en" ? "Need Urgent Help?" : "तत्काल सहायता चाहिए?"}
        </h3>
        <p className={`${seniorMode ? 'text-2xl md:text-3xl mb-6 md:mb-8' : 'text-lg md:text-xl mb-4 md:mb-6'} text-red-800 dark:text-red-200`}>
          {language === "en"
            ? "Call our emergency helpline for immediate assistance"
            : "तत्काल सहायता के लिए हमारी आपातकालीन हेल्पलाइन पर कॉल करें"}
        </p>
        <Button size={seniorMode ? "lg" : "lg"} className={`${seniorMode ? 'text-2xl md:text-3xl px-8 md:px-12 py-6 md:py-10' : ''} bg-red-600 hover:bg-red-700`}>
          <Phone className={`${seniorMode ? 'h-8 w-8 md:h-10 md:w-10' : 'h-5 w-5'} mr-3`} />
          1800-URGENT-HELP
        </Button>
      </Card>
    </div>
  );
}
