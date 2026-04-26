import { useState } from "react";
import { Mic, MicOff, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function VoiceSearch() {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { seniorMode } = useApp();
  const navigate = useNavigate();

  const handleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate voice recognition result
      const mockResults = ["tomatoes", "milk", "rice", "bread", "eggs"];
      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      setSearchQuery(result);
      toast.success(`Voice search: "${result}"`);
      navigate(`/products/${result}`);
    } else {
      setIsListening(true);
      toast.info("Listening...");
      // Auto-stop after 3 seconds
      setTimeout(() => setIsListening(false), 3000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/${searchQuery.trim()}`);
      setSearchQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-3 ${seniorMode ? 'top-5 h-7 w-7' : 'top-2.5 h-5 w-5'} text-gray-400`} />
          <Input
            type="text"
            placeholder={seniorMode ? "Search for products..." : "Search groceries..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${seniorMode ? 'pl-14 pr-4 py-6 text-2xl' : 'pl-10 pr-4'} w-full`}
          />
        </div>
        <Button
          type="button"
          onClick={handleVoiceSearch}
          variant={isListening ? "default" : "outline"}
          size={seniorMode ? "lg" : "icon"}
          className={isListening ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          {isListening ? (
            <MicOff className={seniorMode ? 'h-7 w-7' : 'h-5 w-5'} />
          ) : (
            <Mic className={seniorMode ? 'h-7 w-7' : 'h-5 w-5'} />
          )}
        </Button>
      </div>
    </form>
  );
}
