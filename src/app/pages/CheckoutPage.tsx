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
    { id: "upi", name: language === "en" ? "UPI (Google Pay, PhonePe, Paytm)" : "UPI (गूगल पे, फोनपे, पेटीएम)", icon: "💳", popular: true },
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className={`${seniorMode ? 'text-5xl mb-10' : 'text-3xl mb-8'} font-bold text-gray-900 dark:text-white`}>
        {language === "en" ? "Checkout" : "चेकआउट"}
      </h1>

      {!user && (
        <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {language === "en" ? "Login for faster checkout" : "तेज चेकआउट के लिए लॉगिन करें"}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {language === "en" ? "Save your address and track orders easily." : "अपना पता सहेजें और ऑर्डर आसानी से ट्रैक करें।"}
            </p>
          </div>
          <Button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            {language === "en" ? "Login" : "लॉगिन"}
          </Button>
        </Card>
      )}

      <div className={`grid ${seniorMode ? 'grid-cols-1 gap-8' : 'lg:grid-cols-3 gap-8'}`}>
        {/* Checkout Form */}
        <div className={seniorMode ? 'space-y-8' : 'lg:col-span-2 space-y-6'}>
          {/* Delivery Address */}
          <Card className={`${seniorMode ? 'p-8' : 'p-6'}`}>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className={`${seniorMode ? 'h-8 w-8' : 'h-6 w-6'} text-green-600`} />
              <h2 className={`${seniorMode ? 'text-3xl' : 'text-xl'} font-semibold text-gray-900 dark:text-white`}>
                {language === "en" ? "Delivery Address" : "डिलीवरी पता"}
              </h2>
            </div>
            <div className="space-y-4">
              <Label htmlFor="address">{language === "en" ? "Full Address" : "पूरा पता"}</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`bg-gray-50 dark:bg-gray-900 ${seniorMode ? 'py-8 text-xl' : ''}`}
                placeholder="123 Street Name, City, PIN"
              />
            </div>
          </Card>

          {/* Delivery Slot */}
          <Card className={`${seniorMode ? 'p-8' : 'p-6'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Clock className={`${seniorMode ? 'h-8 w-8' : 'h-6 w-6'} text-blue-600`} />
              <h2 className={`${seniorMode ? 'text-3xl' : 'text-xl'} font-semibold text-gray-900 dark:text-white`}>
                {language === "en" ? "Delivery Slot" : "डिलीवरी स्लॉट"}
              </h2>
            </div>
            <Card className={`${seniorMode ? 'p-6' : 'p-4'} bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800`}>
              <p className={`${seniorMode ? 'text-2xl' : 'text-base'} text-green-900 dark:text-green-100 font-medium`}>
                {language === "en" ? "Tomorrow, 7:00 AM - 9:00 AM" : "कल, सुबह 7:00 - सुबह 9:00"}
              </p>
            </Card>
          </Card>

          {/* Payment Method */}
          <Card className={`${seniorMode ? 'p-8' : 'p-6'}`}>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className={`${seniorMode ? 'h-8 w-8' : 'h-6 w-6'} text-purple-600`} />
              <h2 className={`${seniorMode ? 'text-3xl' : 'text-xl'} font-semibold text-gray-900 dark:text-white`}>
                {language === "en" ? "Payment Method" : "भुगतान विधि"}
              </h2>
            </div>

            <div className={`space-y-${seniorMode ? '4' : '3'}`}>
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`${seniorMode ? 'p-4 md:p-6' : 'p-3 md:p-4'} cursor-pointer transition-all ${
                    selectedPayment === method.id
                      ? "bg-green-50 dark:bg-green-950 border-green-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className={seniorMode ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}>{method.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`${seniorMode ? 'text-xl md:text-2xl' : 'text-sm md:text-base'} font-medium text-gray-900 dark:text-white`}>
                            {method.name}
                          </span>
                          {method.popular && (
                            <span className={`${seniorMode ? 'text-xs md:text-sm px-2 py-1' : 'text-xs px-1.5 py-0.5'} bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded`}>
                              {language === "en" ? "Popular" : "लोकप्रिय"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedPayment === method.id && (
                      <Check className={`${seniorMode ? 'h-6 w-6 md:h-8 md:w-8' : 'h-5 w-5 md:h-6 md:w-6'} text-green-600`} />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {selectedPayment === "upi" && (
              <div className={`${seniorMode ? 'mt-8' : 'mt-6'}`}>
                <Label htmlFor="upi" className={`${seniorMode ? 'text-2xl mb-4' : 'mb-2'} block`}>
                  {language === "en" ? "Enter UPI ID" : "UPI ID दर्ज करें"}
                </Label>
                <Input
                  id="upi"
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className={seniorMode ? 'text-2xl py-6' : ''}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Order Summary */}
        <Card className={`${seniorMode ? 'p-8' : 'p-6'} h-fit sticky top-24`}>
          <h2 className={`${seniorMode ? 'text-4xl mb-8' : 'text-2xl mb-6'} font-bold text-gray-900 dark:text-white`}>
            {language === "en" ? "Order Summary" : "ऑर्डर सारांश"}
          </h2>

          <div className={`space-y-${seniorMode ? '6' : '4'} mb-6`}>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className={`${seniorMode ? 'text-2xl' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
                  {item.name} x{item.quantity}
                </span>
                <span className={`${seniorMode ? 'text-2xl' : 'text-sm'} font-medium text-gray-900 dark:text-white`}>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <div className={`pt-${seniorMode ? '6' : '4'} border-t border-gray-200 dark:border-gray-700 space-y-3`}>
              <div className="flex justify-between">
                <span className={`${seniorMode ? 'text-2xl' : 'text-base'} text-gray-600 dark:text-gray-400`}>
                  {language === "en" ? "Subtotal" : "उप-योग"}
                </span>
                <span className={`${seniorMode ? 'text-2xl' : 'text-base'} font-semibold text-gray-900 dark:text-white`}>
                  ₹{total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${seniorMode ? 'text-2xl' : 'text-base'} text-gray-600 dark:text-gray-400`}>
                  {language === "en" ? "Delivery" : "डिलीवरी"}
                </span>
                <span className={`${seniorMode ? 'text-2xl' : 'text-base'} font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                  {deliveryFee === 0 ? (language === "en" ? "FREE" : "मुफ्त") : `₹${deliveryFee}`}
                </span>
              </div>
              <div className={`pt-${seniorMode ? '6' : '4'} border-t border-gray-200 dark:border-gray-700 flex justify-between`}>
                <span className={`${seniorMode ? 'text-3xl' : 'text-xl'} font-bold text-gray-900 dark:text-white`}>
                  {language === "en" ? "Total" : "कुल"}
                </span>
                <span className={`${seniorMode ? 'text-3xl' : 'text-xl'} font-bold text-green-600 dark:text-green-400`}>
                  ₹{finalTotal}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            size={seniorMode ? "lg" : "lg"}
            className={`w-full ${seniorMode ? 'text-2xl py-8' : ''}`}
          >
            {isProcessing
              ? (language === "en" ? "Processing..." : "प्रोसेसिंग...")
              : (language === "en" ? `Pay ₹${finalTotal}` : `₹${finalTotal} भुगतान करें`)}
          </Button>
        </Card>
      </div>
    </div>
  );
}

