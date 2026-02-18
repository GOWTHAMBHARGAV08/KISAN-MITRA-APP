import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Sunrise, CloudRain, Mic, MicOff, Wind, Thermometer, Droplets, MapPin, Leaf, MessageCircle, ShoppingCart, Phone, Globe, Users, ArrowRight, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { MarketPricesSection } from '@/components/MarketPricesSection';
import { SmartSummaryCard } from './SmartSummaryCard';

interface GreetingSectionProps {
  onSectionChange?: (section: string) => void;
  userName?: string;
  sowingDate?: string | null;
  selectedCrop?: string | null;
}

export const GreetingSection = ({ onSectionChange, userName, sowingDate, selectedCrop }: GreetingSectionProps) => {
  const [greeting, setGreeting] = useState('');
  const [currentIcon, setCurrentIcon] = useState<any>(Sun);
  const [weather, setWeather] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      const displayName = userName || 'Farmer'; // Default name

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting(`Good Morning, ${displayName}`);
        setCurrentIcon(Sunrise);
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting(`Good Afternoon, ${displayName}`);
        setCurrentIcon(Sun);
      } else {
        setGreeting(`Good Evening, ${displayName}`);
        setCurrentIcon(Moon);
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [userName]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=76e2744e2ea54d4492e152146251009&q=Bangalore&aqi=no`
        );
        const data = await response.json();
        setWeather({
          temperature: data.current?.temp_c,
          humidity: data.current?.humidity,
          windSpeed: data.current?.wind_kph,
          condition: data.current?.condition?.text,
          location: data.location?.name
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 300000);
    return () => clearInterval(weatherInterval);
  }, []);

  const quickAccessTiles = [
    {
      icon: Leaf,
      title: 'Check Crops',
      description: 'Analyze health',
      section: 'plant-analyzer',
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      icon: CloudRain,
      title: 'Weather',
      description: 'See forecast',
      section: 'weather',
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      icon: ShoppingCart,
      title: 'Buy Seeds',
      description: 'Go to store',
      section: 'pest-fertilizer',
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      icon: MessageCircle,
      title: 'Ask Expert',
      description: 'AI Assistant',
      section: 'chatbot',
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  const supportLinks = [
    { icon: Phone, label: 'Helpline', subtitle: 'Call 1800-123' },
    { icon: Globe, label: 'Schemes', subtitle: 'View Benefits' },
    { icon: Users, label: 'Community', subtitle: 'Join Group' }
  ];

  const farmingTips = [
    "Rotate crops to keep soil healthy.",
    "Water plants early in the morning.",
    "Use organic compost for better growth.",
    "Check leaves daily for bugs.",
    "Plant flowers nearby to stop pests."
  ];

  const todaysTip = farmingTips[new Date().getDate() % farmingTips.length];

  const getWeatherAlert = () => {
    if (!weather) return null;
    const temp = weather.temperature;
    if (temp > 40) return `High Heat Alert (${temp}°C)! Water more.`;
    if (weather.condition?.toLowerCase().includes('rain')) return `Rain expected! Cover harvested crops.`;
    return null;
  };

  const weatherAlert = getWeatherAlert();

  // Voice assistant logic (simplified for UI focus)
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        const cmd = text.toLowerCase();
        if (cmd.includes('weather')) onSectionChange?.('weather');
        else if (cmd.includes('plant')) onSectionChange?.('plant-analyzer');
        else if (cmd.includes('chat')) onSectionChange?.('chatbot');
        toast.success(`Heard: "${text}"`);
      };
      recognition.start();
    } else {
      toast.error("Voice not supported in this browser.");
    }
  };

  const CurrentIcon = currentIcon;

  return (
    <div className="space-y-8 animate-fade-in">

      {/* 1. Smart Summary Card (Replaces Hero) */}
      <SmartSummaryCard
        weather={weather}
        sowingDate={sowingDate || null}
        selectedCrop={selectedCrop || null}
        userName={userName || "Farmer"}
      />

      {/* Quick Action for Plant Doctor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={() => onSectionChange?.('plant-analyzer')}
          className="bg-[#2FAE63] text-white hover:bg-[#258d50] text-lg font-bold h-16 rounded-[1.5rem] shadow-lg shadow-green-200 hover:shadow-xl hover:scale-[1.02] transition-all w-full flex items-center justify-center gap-3"
        >
          <div className="bg-white/20 p-2 rounded-full">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          Check Plant Health
        </Button>

        <Button
          onClick={() => onSectionChange?.('weather')}
          className="bg-white text-blue-600 hover:bg-blue-50 text-lg font-bold h-16 rounded-[1.5rem] shadow-sm border border-blue-100 hover:shadow-md transition-all w-full flex items-center justify-center gap-3"
        >
          <div className="bg-blue-100 p-2 rounded-full">
            <CloudRain className="h-5 w-5 text-blue-600" />
          </div>
          View Full Forecast
        </Button>
      </div>

      {/* 2. Critical Alerts */}
      {weatherAlert && (
        <div className="bg-orange-50/80 backdrop-blur-sm border-l-8 border-orange-500 p-5 rounded-r-2xl shadow-sm flex items-start gap-4 animate-accordion-down">
          <div className="bg-orange-100 p-2 rounded-full">
            <Wind className="h-6 w-6 text-orange-600 flex-shrink-0" />
          </div>
          <div>
            <h3 className="font-bold text-orange-900 text-lg">Weather Alert</h3>
            <p className="text-orange-800 font-medium leading-relaxed">{weatherAlert}</p>
          </div>
        </div>
      )}

      {/* 3. Market Prices Section */}
      <MarketPricesSection onNavigateToProfile={() => onSectionChange?.('profile')} />

      {/* 4. Weather & Tips Grid */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Weather Card */}
        {weather && (
          <div className="card-farmer p-0 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-0">
            <div className="p-6 md:p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-blue-100 flex items-center gap-2 mb-1">
                    <CloudRain className="h-5 w-5 text-blue-200" />
                    Weather
                  </h3>
                  <p className="text-2xl font-bold text-white tracking-tight">{weather.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter block">{weather.temperature}°</span>
                  <span className="text-blue-100 font-medium text-lg">{weather.condition}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-center border border-white/10">
                  <Droplets className="h-5 w-5 text-blue-200 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{weather.humidity}%</p>
                  <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Humid</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-center border border-white/10">
                  <Wind className="h-5 w-5 text-blue-200 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{weather.windSpeed}</p>
                  <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Wind</p>
                </div>
                <button
                  onClick={() => onSectionChange?.('weather')}
                  className="bg-white text-blue-600 hover:bg-blue-50 p-3 rounded-2xl text-center flex flex-col items-center justify-center transition-colors shadow-lg"
                >
                  <ArrowRight className="h-6 w-6 mb-1" />
                  <span className="text-xs font-bold uppercase tracking-wider">Forecast</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daily Tip Card */}
        <div className="card-farmer p-6 md:p-8 bg-gradient-to-br from-[#FFF8E1] to-white border-amber-100/50 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24 text-amber-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <TrendingUp className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-amber-900">Daily Wisdom</h3>
            </div>
            <p className="text-xl md:text-2xl font-serif font-medium text-amber-800 italic leading-relaxed mb-6">
              "{todaysTip}"
            </p>
            <div className="flex gap-2.5">
              <Badge variant="outline" className="bg-white/60 border-amber-200 text-amber-800 px-3 py-1 rounded-lg">Soil Health</Badge>
              <Badge variant="outline" className="bg-white/60 border-amber-200 text-amber-800 px-3 py-1 rounded-lg">Organic</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Voice Assistant (Enhanced) */}
      <div className={`card-farmer p-6 md:p-8 bg-gradient-to-r from-purple-50 to-white flex flex-col md:flex-row items-center justify-between gap-6 transition-all border-l-8 ${isListening ? 'border-l-red-500 shadow-md ring-2 ring-red-100' : 'border-l-purple-500'}`}>
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className={`p-4 rounded-full transition-all duration-300 ${isListening ? 'bg-red-100 animate-pulse scale-110' : 'bg-purple-100'}`}>
            {isListening ? <Mic className="h-8 w-8 text-red-600" /> : <Mic className="h-8 w-8 text-purple-600" />}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-xl">
              {isListening ? "Listening..." : "Voice Assistant"}
            </h3>
            <p className="text-base text-muted-foreground">
              {isListening ? "Speak now..." : "Tap the button to speak your query"}
            </p>
          </div>
        </div>
        <Button
          onClick={isListening ? () => setIsListening(false) : startListening}
          variant={isListening ? "destructive" : "secondary"}
          size="lg"
          className={`rounded-2xl font-bold h-14 px-8 text-base w-full md:w-auto ${isListening ? 'shadow-red-200 shadow-lg' : ''}`}
        >
          {isListening ? 'Stop Listening' : 'Start Speaking'}
        </Button>
      </div>

      {/* Transcript Feedback */}
      {transcript && (
        <div className="text-center p-4 bg-white/50 backdrop-blur border rounded-2xl text-base text-muted-foreground animate-fade-in shadow-sm max-w-2xl mx-auto">
          You said: <span className="font-medium text-foreground">"{transcript}"</span>
        </div>
      )}

    </div>
  );
};