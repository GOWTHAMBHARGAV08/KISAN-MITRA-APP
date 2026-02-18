import { useState, useEffect } from 'react';
import { GreetingSection } from './GreetingSection';
import { WeatherSection } from './WeatherSection';
import { PlantAnalyzer } from './PlantAnalyzer';
import { PestFertilizerRecommendations } from './PestFertilizerRecommendations';
import { MultilangChatbot } from './MultilangChatbot';
import { ProfileSettings } from './ProfileSettings';
import { AppSidebar } from './AppSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from "@/components/ui/sidebar";
import { User, Menu } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const kisanmitraLogoUrl = '/lovable-uploads/3ad415cf-80f1-4add-92a5-d08cd8333756.png';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState('home');
  const [userName, setUserName] = useState('');
  const [sowingDate, setSowingDate] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  // Scroll to top when section changes
  useEffect(() => {
    const mainContent = document.getElementById('main-content-scroll');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('display_name, state, district, sowing_date, selected_crop')
          .eq('user_id', user.id)
          .single();

        if (data) {
          if (data.display_name) setUserName(data.display_name);
          if (data.sowing_date) setSowingDate(data.sowing_date);
          if (data.selected_crop) setSelectedCrop(data.selected_crop);
          // We can pass other data down if needed, but for now we might need state for them

          // Redirect to profile if critical fields are missing
          if (!data.state || !data.district) {
            setActiveSection('profile');
            // Small delay to ensure UI is ready
            setTimeout(() => {
              toast.info("Welcome! Please complete your profile to get personalized recommendations.", {
                duration: 5000,
              });
            }, 500);
          }
        }
      }
    };
    fetchProfile();
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <GreetingSection
          onSectionChange={setActiveSection}
          userName={userName}
        />;
      case 'weather':
        return <WeatherSection />;
      case 'plant-analyzer':
        return <PlantAnalyzer onNavigateToStore={() => setActiveSection('pest-fertilizer')} />;
      case 'pest-fertilizer':
        return <PestFertilizerRecommendations />;
      case 'chatbot':
        return <MultilangChatbot />;
      case 'profile':
        return <ProfileSettings onLogout={onLogout} />;
      default:
        return <GreetingSection
          onSectionChange={setActiveSection}
          userName={userName}
        />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden relative">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className="hidden md:block h-full border-r border-border/40 bg-card z-30">
          <AppSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main Layout Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full w-full relative">

          {/* FIXED HEADER */}
          <header className="h-[var(--header-height)] flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-border/50 z-40 px-4 md:px-6 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-3">
              {/* Logo / Brand */}
              <div className="w-10 h-10 relative">
                <img
                  src={kisanmitraLogoUrl}
                  alt="Kisan Mitra"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title - Logic: Show Icon/Logo only on mobile, Full Key on desktop */}
              <div className="flex flex-col justify-center">
                <h1 className="text-lg font-bold leading-tight tracking-tight text-primary">
                  <span className="md:hidden">Dashboard</span> {/* Mobile only shows Page Title if possible, or just Brand Key */}
                  <span className="hidden md:inline">KisanMitra</span>
                </h1>
                <p className="text-[10px] text-muted-foreground hidden md:block">Smart Farming Companion</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveSection('profile')}
                className="rounded-full w-10 h-10 bg-secondary/10 hover:bg-secondary/20 text-primary"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </div>
          </header>

          {/* SCROLLABLE CONTENT AREA */}
          <main
            id="main-content-scroll"
            className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth w-full bg-warm-gradient pb-[var(--bottom-nav-height)] md:pb-8"
          >
            <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8 animate-fade-in">
              {renderActiveSection()}
            </div>

            {/* Desktop Footer (Inline at bottom of content) */}
            <footer className="hidden md:block py-8 text-center text-sm text-muted-foreground border-t border-border/40 mt-12 mx-8">
              <p>© 2026 KisanMitra. Empowering Farmers.</p>
            </footer>
          </main>

          {/* MOBILE BOTTOM NAV */}
          <MobileBottomNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};