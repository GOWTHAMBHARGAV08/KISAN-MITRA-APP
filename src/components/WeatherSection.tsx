import { useState, useEffect } from 'react';
import { Cloud, Droplets, Thermometer, Wind, Search, MapPin, Cloudy, Sun, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WEATHER_API_KEY = "76e2744e2ea54d4492e152146251009";

interface WeatherData {
  location: {
    name: string;
    region: string;
  };
  current: {
    temp_c: number;
    condition: { text: string; icon: string };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: { text: string; icon: string };
        daily_chance_of_rain: number;
      };
    }>;
  };
}

export const WeatherSection = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const { toast } = useToast();

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${cityName}&days=3&aqi=no&alerts=no`
      );
      if (!response.ok) throw new Error('Weather data not found');

      const data = await response.json();
      setWeatherData(data);
      toast({ title: "Weather Updated", description: `Showing forecast for ${data.location.name}` });
    } catch (error) {
      toast({ title: "Error", description: "City not found. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadRequiredData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('district').eq('user_id', user.id).maybeSingle();
        if (data?.district) {
          fetchWeather(data.district);
          return;
        }
      }
      fetchWeather('Delhi');
    };
    loadRequiredData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) fetchWeather(searchCity.trim());
  };

  if (loading && !weatherData) {
    return (
      <div className="card-farmer p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
        <p className="text-muted-foreground animate-pulse">Checking the sky...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">

      {/* Search Header */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="pl-9 border-none shadow-none bg-transparent h-12 text-base font-medium"
          />
        </div>
        <Button onClick={handleSearch} className="h-12 px-6 rounded-xl bg-[#2FAE63] hover:bg-[#1F8A4C] transition-colors">
          Search
        </Button>
      </div>

      {weatherData && (
        <>
          {/* Main Weather Card */}
          <div className="card-farmer p-0 overflow-hidden bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-white shadow-xl border-none relative group">
            {/* Background Decor */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/15 transition-colors" />
            <div className="absolute top-1/2 -left-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="p-6 md:p-8 relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1 opacity-90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">{weatherData.location.name}</span>
                  </div>
                  <h2 className="text-5xl font-bold tracking-tighter mb-2">{Math.round(weatherData.current.temp_c)}°</h2>
                  <p className="text-lg font-medium text-blue-50 capitalize">{weatherData.current.condition.text}</p>
                </div>
                <img
                  src={`https:${weatherData.current.condition.icon}`}
                  alt="Weather Icon"
                  className="w-24 h-24 filter drop-shadow-lg transform transition-transform group-hover:scale-110 duration-500"
                />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/20 transition-colors">
                  <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                  <span className="block font-bold text-xl">{weatherData.current.humidity}%</span>
                  <span className="text-xs text-blue-100 font-bold uppercase tracking-wider">Humidity</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/20 transition-colors">
                  <Wind className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                  <span className="block font-bold text-xl">{weatherData.current.wind_kph}</span>
                  <span className="text-xs text-blue-100 font-bold uppercase tracking-wider">km/h</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/20 transition-colors">
                  <Thermometer className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                  <span className="block font-bold text-xl">{Math.round(weatherData.current.temp_c)}°</span> {/* API doesn't give feelslike in this response type usually, defaulting to temp for UI or could calculate */}
                  <span className="text-xs text-blue-100 font-bold uppercase tracking-wider">Temp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advisory & Forecast Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Advisory Card */}
            <div className="card-farmer bg-gradient-to-r from-emerald-50 to-green-50 p-6 border-l-8 border-l-emerald-500 shadow-sm flex flex-col justify-center">
              <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 p-2 rounded-lg shadow-sm">👨‍🌾</span>
                Farming Advisory
              </h3>
              {(() => {
                const rainChance = weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
                const isRainy = rainChance > 40;
                return (
                  <div className="space-y-4">
                    <div className="bg-white/60 p-4 rounded-xl border border-emerald-100/50">
                      <p className={`font-bold text-lg mb-1 ${isRainy ? 'text-orange-700' : 'text-emerald-800'}`}>
                        {isRainy ? '⚠️ Rain Expected' : '✅ Field Work Safe'}
                      </p>
                      <p className="text-foreground/80 leading-relaxed font-medium">
                        {isRainy
                          ? "Avoid spraying pesticides. Ensure good drainage in fields."
                          : "Ideal conditions for spraying and harvesting."}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Forecast List */}
            <div className="card-farmer p-6 md:p-8">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-orange-500" />
                3-Day Forecast
              </h3>
              <div className="space-y-4">
                {weatherData.forecast.forecastday.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="flex items-center gap-4">
                      <img src={`https:${day.day.condition.icon}`} alt="icon" className="w-10 h-10" />
                      <div>
                        <p className="font-bold text-foreground">
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">{day.day.condition.text}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-lg text-foreground">{Math.round(day.day.maxtemp_c)}°</span>
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 justify-end">
                        <Droplets className="w-3 h-3" /> {day.day.daily_chance_of_rain}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};