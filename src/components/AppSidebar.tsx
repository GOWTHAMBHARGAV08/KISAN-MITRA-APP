import { useState, useEffect } from 'react';
import {
  Cloud,
  Leaf,
  Bug,
  MessageCircle,
  Home,
  User,
  Thermometer,
  Lightbulb,
  CloudRain
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";

const menuItems = [
  { id: 'home', title: 'Dashboard', icon: Home },
  { id: 'weather', title: 'Weather', icon: CloudRain },
  { id: 'plant-analyzer', title: 'Plant Health', icon: Leaf },
  { id: 'pest-fertilizer', title: 'Pest & Fertilizer', icon: Bug },
  { id: 'chatbot', title: 'AI Assistant', icon: MessageCircle },
];

const farmingTips = [
  "Irrigate early morning to save water",
  "Rotate crops to reduce fungal infections",
  "Use organic compost for soil health",
  "Monitor plants daily for pests",
  "Plant companion crops naturally",
  "Maintain proper plant spacing"
];

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface WeatherData {
  temperature: number;
  condition: string;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTip, setCurrentTip] = useState('');

  useEffect(() => {
    // Set daily farming tip
    const tipIndex = new Date().getDate() % farmingTips.length;
    setCurrentTip(farmingTips[tipIndex]);

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=76e2744e2ea54d4492e152146251009&q=Bangalore&aqi=no`
        );
        const data = await response.json();
        setWeather({
          temperature: data.current?.temp_c,
          condition: data.current?.condition?.text
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <Sidebar
      side="left"
      className="bg-card border-none"
      collapsible="icon"
    >
      <SidebarContent className="p-4 space-y-4">

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full justify-start text-base font-medium py-6 px-4 rounded-xl transition-all duration-200 ${activeSection === item.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${activeSection === item.id ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Info Widget (Only visible when expanded) */}
        {state !== "collapsed" && (
          <div className="mt-auto space-y-4">
            {/* Weather Snapshot */}
            {weather && (
              <Card className="border-none shadow-sm bg-blue-50/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <CloudRain className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-blue-900">Weather</p>
                      <p className="text-sm font-bold text-blue-700">{weather.temperature}°C</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Farming Tip */}
            <Card className="border-none shadow-sm bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Daily Tip</span>
                </div>
                <p className="text-xs text-green-800 leading-relaxed italic">"{currentTip}"</p>
              </CardContent>
            </Card>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}