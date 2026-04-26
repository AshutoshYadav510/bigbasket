import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CreditCard, MapPin, Clock, Check, UserPlus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { api } from "../../lib/api";

export function CheckoutPage() {
  const { cart, clearCart, seniorMode, language, user } = useApp();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<string>("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState("123 MG Road, Bangalore, Karnataka 560001");

  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = total >= 200 ? 0 : 40;
  const finalTotal = total + deliveryFee;

  const paymentMethods = [
    { id: "upi", name: language === "en" ? "UPI (GPay, PhonePe, Paytm)" : "UPI (गूगल पे, फोनपे)", icon: "💳", popular: true },
    { id: "phonepe", name: language === "en" ? "PhonePe" : "फोनपे", icon: "📱", popular: true },
    { id: "googlepay", name: language === "en" ? "Google Pay" : "गूगल पे", icon: "🔵", popular: true },
    { id: "paytm", name: language === "en" ? "Paytm" : "पेटीएम", icon: "💙", popular: false },
    { id: "card", name: language === "en" ? "Credit/Debit Card" : "क्रेडिट/डेबिट कार्ड", icon: "💳", popular: false },
    { id: "netbanking", name: language === "en" ? "Net Banking" : "नेट बैंकिंग", icon: "🏦", popular: false },
    { id: "wallet", name: language === "en" ? "Digital Wallets" : "डिजिटल वॉलेट", icon: "👛", popular: false },
    { id: "cod", name: language === "en" ? "Cash on Delivery" : "कैश ऑन डिलीवरी", icon: "💵", popular: false },
  ];

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error(language === "en" ? "Please login to place an order" : "ऑर्डर देने के लिए कृपया लॉगिन करें");
      navigate("/login");
      return;
    }

    if (selectedPayment === "upi" && !upiId.trim()) {
      toast.error(language === "en" ? "Please enter UPI ID" : "कृपया UPI ID दर्ज करें");
      return;
    }

    if (cart.length === 0) {
      toast.error(language === "en" ? "Cart is empty" : "कार्ट खाली है");
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));
      
      await api.createOrder(orderItems, user.id, address);

      toast.success(language === "en" ? "Order placed successfully!" : "ऑर्डर सफलतापूर्वक रखा गया!");
      clearCart();
      navigate("/orders");
    } catch (error: any) {
      toast.error(error.message || (language === "en" ? "Failed to place order" : "ऑर्डर देने में विफल"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-32">
      <h1 className={`${seniorMode ? 'text-4xl md:text-5xl mb-8 md:mb-10' : 'text-3xl md:text-4xl mb-6 md:mb-8'} font-black text-gray-900 dark:text-white tracking-tight`}>
        {language === "en" ? "Checkout" : "चेकआउट"}
      </h1>

      {!user && (
        <Card className="p-5 md:p-6 mb-6 md:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none rounded-[1.5rem] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">
              {language === "en" ? "Login for faster checkout" : "तेज चेकआउट के लिए लॉगिन करें"}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {language === "en" ? "Save your address and track orders easily." : "अपना पता सहेजें और ऑर्डर आसानी से ट्रैक करें।"}
            </p>
          </div>
          <Button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 whitespace-nowrap">
            <UserPlus className="h-4 w-4 mr-2" />
            {language === "en" ? "Login Now" : "अभी लॉगिन करें"}
          </Button>
        </Card>
      )}

      <div className={`flex flex-col-reverse lg:grid ${seniorMode ? 'grid-cols-1 gap-8' : 'lg:grid-cols-3 gap-6 lg:gap-8'}`}>
        {/* Checkout Form */}
        <div className={seniorMode ? 'space-y-8' : 'lg:col-span-2 space-y-6'}>
          {/* Delivery Address */}
          <Card className={`${seniorMode ? 'p-6 md:p-8 rounded-[2rem]' : 'p-5 md:p-6 rounded-[1.5rem]'} bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-white/40 dark:border-gray-800/60 shadow-xl`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-green-100 dark:bg-green-900/50 rounded-2xl">
                <MapPin className={`${seniorMode ? 'h-8 w-8' : 'h-6 w-6'} text-green-600 dark:text-green-400`} />
              </div>
              <h2 className={`${seniorMode ? 'text-3xl' : 'text-xl md:text-2xl'} font-black text-gray-900 dark:text-white`}>
                {language === "en" ? "Delivery Address" : "डिलीवरी पता"}
              </h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              <Label htmlFor="address" className="text-gray-600 dark:text-gray-400 font-medium">
                {language === "en" ? "Full Address" : "पूरा पता"}
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`bg-gray-50/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 rounded-xl transition-all shadow-inner ${seniorMode ? 'py-8 text-xl' : 'py-6'}`}
                placeholder="123 Street Name, City, PIN"
              />
            </div>
          </Card>

          {/* Delivery Slot */}
          <Card className={`${seniorMode ? 'p-6 md:p-8 rounded-[2rem]' : 'p-5 md:p-6 rounded-[1.5rem]'} bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-white/40 dark:border-gray-800/60 shadow-xl`}>
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-2xl">
                <Clock className={`${seniorMode ? 'h-8 w-8' : 'h-6 w-6'} text-blue-600 dark:text-blue-400`} />
              </div>
              <h2 className={`${seniorMode ? 'text-3xl' : 'text-xl md:text-2xl'} font-black text-gray-900 dark:text-white`}>
                {language === "en" ? "Delivery Slot" : "डिलीवरी स्लॉट"}
              </h2>
            </div>
            <Card className={`${seniorMode ? 'p-5 md:p-6' : 'p-4 md:p-5'} bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 rounded-xl`}>
              <p className={`${seniorMode ? 'text-2xl' : 'text-base md:text-lg'} text-green-800 dark:text-green-300 font-bold`}>
                {language === "en" ? "Tomorrow, 7:00 AM - 9:00 AM" : "कल, सुबह 7:00 - सुबह 9:00"}
              </p>
            </Card>
          </Card>

          {/* Payment Method */}
          <Card className={`${seniorMode ? 'p-6 md:p-8 rounded-[2rem]' : 'p-5 md:p-6 rounded-[1.5rem]'} bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-white/40 dark:border-gray-800/60 shadow-xl`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-2xl">
                <CreditCard className={`${seniorMode ? 'h-8 w-8' : 'h-6 w-6'} text-purple-600 dark:text-purple-400`} />
              </div>
              <h2 className={`${seniorMode ? 'text-3xl' : 'text-xl md:text-2xl'} font-black text-gray-900 dark:text-white`}>
                {language === "en" ? "Payment Method" : "भुगतान विधि"}
              </h2>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-${seniorMode ? '4' : '3'}`}>
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`${seniorMode ? 'p-4 md:p-5' : 'p-3 md:p-4'} cursor-pointer rounded-xl transition-all duration-300 border-2 ${
                    selectedPayment === method.id
                      ? "bg-green-50/80 dark:bg-green-900/20 border-green-500 dark:border-green-500 shadow-md shadow-green-500/10 scale-[1.02]"
                      : "bg-gray-50/50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={seniorMode ? 'text-3xl' : 'text-2xl'}>{method.icon}</span>
                      <div className="flex flex-col items-start gap-1">
                        <span className={`${seniorMode ? 'text-lg md:text-xl' : 'text-sm font-bold'} text-gray-900 dark:text-white line-clamp-1`}>
                          {method.name}
                        </span>
                        {method.popular && (
                          <span className={`${seniorMode ? 'text-xs px-2 py-0.5' : 'text-[10px] px-1.5 py-0.5'} bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-black uppercase tracking-wider`}>
                            {language === "en" ? "Popular" : "लोकप्रिय"}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedPayment === method.id && (
                      <Check className={`${seniorMode ? 'h-6 w-6' : 'h-5 w-5'} text-green-600 flex-shrink-0`} />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {selectedPayment === "upi" && (
              <div className={`${seniorMode ? 'mt-8' : 'mt-6'} p-4 md:p-5 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl`}>
                <Label htmlFor="upi" className={`${seniorMode ? 'text-2xl mb-4' : 'mb-3 font-bold text-gray-700 dark:text-gray-300'} block`}>
                  {language === "en" ? "Enter UPI ID" : "UPI ID दर्ज करें"}
                </Label>
                <Input
                  id="upi"
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-inner ${seniorMode ? 'text-2xl py-6' : 'py-5 font-medium'}`}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="relative">
          <Card className={`${seniorMode ? 'p-6 md:p-8 rounded-[2rem]' : 'p-5 md:p-6 rounded-[1.5rem]'} bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-white/40 dark:border-gray-800/60 shadow-2xl h-fit lg:sticky lg:top-24`}>
            {/* Decorative Blur blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full blur-2xl -z-10" />

            <h2 className={`${seniorMode ? 'text-3xl mb-8' : 'text-xl md:text-2xl mb-6'} font-black text-gray-900 dark:text-white`}>
              {language === "en" ? "Order Summary" : "ऑर्डर सारांश"}
            </h2>

            <div className={`space-y-${seniorMode ? '6' : '4'} mb-6 md:mb-8`}>
              <div className="max-h-[30vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <span className={`${seniorMode ? 'text-xl' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium leading-tight`}>
                      {item.name} <span className="text-gray-400 dark:text-gray-500 font-black ml-1">x{item.quantity}</span>
                    </span>
                    <span className={`${seniorMode ? 'text-xl' : 'text-sm'} font-bold text-gray-900 dark:text-white whitespace-nowrap`}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className={`pt-${seniorMode ? '6' : '4'} border-t border-gray-200 dark:border-gray-800 space-y-3`}>
                <div className="flex justify-between">
                  <span className={`${seniorMode ? 'text-2xl' : 'text-sm md:text-base'} text-gray-500 dark:text-gray-400 font-medium`}>
                    {language === "en" ? "Subtotal" : "उप-योग"}
                  </span>
                  <span className={`${seniorMode ? 'text-2xl' : 'text-sm md:text-base'} font-bold text-gray-900 dark:text-white`}>
                    ₹{total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${seniorMode ? 'text-2xl' : 'text-sm md:text-base'} text-gray-500 dark:text-gray-400 font-medium`}>
                    {language === "en" ? "Delivery" : "डिलीवरी"}
                  </span>
                  <span className={`${seniorMode ? 'text-2xl' : 'text-sm md:text-base'} font-black ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {deliveryFee === 0 ? (language === "en" ? "FREE" : "मुफ्त") : `₹${deliveryFee}`}
                  </span>
                </div>
                
                <div className={`pt-${seniorMode ? '6' : '4'} mt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-end`}>
                  <div className="flex flex-col">
                    <span className={`${seniorMode ? 'text-3xl' : 'text-xl md:text-2xl'} font-black text-gray-900 dark:text-white`}>
                      {language === "en" ? "Total" : "कुल"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Incl. of all taxes</span>
                  </div>
                  <span className={`${seniorMode ? 'text-4xl' : 'text-2xl md:text-3xl'} font-black text-green-600 dark:text-green-400 tracking-tight`}>
                    ₹{finalTotal}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              size={seniorMode ? "lg" : "default"}
              className={`w-full rounded-2xl shadow-xl shadow-green-600/20 transition-all active:scale-95 bg-green-600 hover:bg-green-700 text-white font-black ${seniorMode ? 'text-2xl py-8' : 'text-lg py-7'}`}
            >
              {isProcessing
                ? (language === "en" ? "Processing..." : "प्रोसेसिंग...")
                : (language === "en" ? `Pay ₹${finalTotal}` : `₹${finalTotal} भुगतान करें`)}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

