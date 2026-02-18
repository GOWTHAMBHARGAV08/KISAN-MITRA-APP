import { Home, CloudRain, Leaf, MessageCircle, User } from 'lucide-react';

interface MobileBottomNavProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const MobileBottomNav = ({ activeSection, onSectionChange }: MobileBottomNavProps) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'weather', label: 'Weather', icon: CloudRain },
        { id: 'plant-analyzer', label: 'Plants', icon: Leaf },
        { id: 'chatbot', label: 'Ask AI', icon: MessageCircle },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Gradient Background Container */}
            <div className="bg-gradient-to-b from-[#2FAE63] to-[#1F8A4C] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.15)] rounded-t-[20px] md:hidden transition-all duration-300">
                <div className="flex justify-around items-center h-[var(--bottom-nav-height)] px-2">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 group ${isActive ? '-translate-y-1' : ''}`}
                            >
                                {/* Active Indicator Pill */}
                                {isActive && (
                                    <div className="absolute top-1 w-12 h-8 bg-white/20 rounded-full blur-xl animate-pulse" />
                                )}

                                <div
                                    className={`relative p-2 rounded-2xl transition-all duration-300 ${isActive
                                            ? 'bg-white text-[#1F8A4C] shadow-lg scale-110 ring-4 ring-white/10'
                                            : 'text-green-50 hover:bg-white/10'
                                        }`}
                                >
                                    <item.icon
                                        className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px] opacity-80'}`}
                                    />
                                </div>
                                <span
                                    className={`text-[11px] font-medium mt-1 transition-all duration-300 ${isActive
                                            ? 'text-white font-bold tracking-wide scale-105 opacity-100'
                                            : 'text-green-100/70 opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
