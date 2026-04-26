import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function VoiceSearch() {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { seniorMode, language } = useApp();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "en" ? "en-US" : "hi-IN";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        toast.success(language === "en" ? `Searching for: "${transcript}"` : `खोज रहे हैं: "${transcript}"`);
        navigate(`/products/all?search=${encodeURIComponent(transcript)}`);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error !== "no-speech") {
          toast.error(language === "en" ? "Microphone error. Please try again." : "माइक्रोफ़ोन त्रुटि। कृपया पुनः प्रयास करें।");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language, navigate]);

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      toast.error(language === "en" ? "Voice search is not supported in your browser." : "आपके ब्राउज़र में वॉइस सर्च समर्थित नहीं है।");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSearchQuery("");
      recognitionRef.current.start();
      setIsListening(true);
      toast.info(language === "en" ? "Listening..." : "सुन रहा हूँ...");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-3 ${seniorMode ? 'top-5 h-7 w-7' : 'top-2.5 h-5 w-5'} text-gray-400`} />
          <Input
            type="text"
            placeholder={seniorMode 
              ? (language === "en" ? "Search for products..." : "उत्पादों की खोज करें...") 
              : (language === "en" ? "Search groceries..." : "किराने का सामान खोजें...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${seniorMode ? 'pl-14 pr-4 py-6 text-2xl' : 'pl-10 pr-4'} w-full rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 transition-colors shadow-inner`}
          />
        </div>
        <Button
          type="button"
          onClick={handleVoiceSearch}
          variant={isListening ? "default" : "outline"}
          size={seniorMode ? "lg" : "icon"}
          className={`rounded-xl transition-all ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse border-red-500 text-white' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {isListening ? (
            <MicOff className={`${seniorMode ? 'h-7 w-7' : 'h-5 w-5'}`} />
          ) : (
            <Mic className={`${seniorMode ? 'h-7 w-7' : 'h-5 w-5'} ${isListening ? '' : 'text-blue-500 dark:text-blue-400'}`} />
          )}
        </Button>
      </div>
    </form>
  );
}

