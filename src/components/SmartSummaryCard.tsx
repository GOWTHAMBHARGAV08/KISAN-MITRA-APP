import { Card } from "@/components/ui/card";
import { CloudRain, Droplets, Thermometer, TrendingUp, TrendingDown, Minus, Calendar, AlertTriangle } from "lucide-react";
import { getMarketPrices, MandiPrice } from "@/constants/marketData";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface SmartSummaryCardProps {
    weather: any;
    sowingDate: string | null;
    selectedCrop: string | null;
    userName: string;
}

export const SmartSummaryCard = ({ weather, sowingDate, selectedCrop, userName }: SmartSummaryCardProps) => {
    const [marketData, setMarketData] = useState<MandiPrice | null>(null);

    useEffect(() => {
        if (selectedCrop) {
            // Clean up crop name if needed (e.g. remove emojis if they exist in profile)
            const cropName = selectedCrop.split(' ')[0];
            const prices = getMarketPrices([cropName]);
            if (prices.length > 0) {
                setMarketData(prices[0]);
            }
        }
    }, [selectedCrop]);

    // Logic 1: Crop Stage
    const getCropStage = () => {
        if (!sowingDate) return { stage: "Not Set", days: 0 };
        const start = new Date(sowingDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) return { stage: "Vegetative", days: diffDays };
        if (diffDays < 60) return { stage: "Flowering", days: diffDays };
        if (diffDays < 90) return { stage: "Fruiting", days: diffDays };
        return { stage: "Harvest", days: diffDays };
    };

    const cropStage = getCropStage();

    // Logic 2: Spray Recommendation
    const getSprayRecommendation = () => {
        if (!weather) return { status: "Loading...", color: "text-gray-500" };
        // Simple logic: Rain or High Wind = Unsafe
        if (weather.condition?.toLowerCase().includes('rain') || (weather.windSpeed > 20)) {
            return { status: "Not Safe", color: "text-red-500", icon: AlertTriangle };
        }
        return { status: "Safe to Spray", color: "text-green-600", icon: Droplets };
    };

    const sprayRec = getSprayRecommendation();

    // Logic 3: Pest Risk
    const getPestRisk = () => {
        if (!weather) return "Low";
        if (weather.humidity > 85 && weather.temperature > 25) return "High";
        if (weather.humidity > 70) return "Medium";
        return "Low";
    };

    const pestRisk = getPestRisk();

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-float border border-green-100 p-6 md:p-8 transition-all duration-500 hover:shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                {/* Personalized Greeting & Crop Info */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {new Date().getHours() < 12 ? "Good Morning" : "Hello"}, <span className="text-[#2FAE63]">{userName || "Farmer"}</span>!
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {sowingDate ? `Day ${cropStage.days} • ${cropStage.stage}` : "Set Sowing Date"}
                        </span>
                        {selectedCrop && (
                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                                {selectedCrop}
                            </span>
                        )}
                    </div>
                </div>

                {/* Smart Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 w-full md:w-auto">

                    {/* 1. Spray Condition */}
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center min-w-[90px]">
                        <Droplets className={`w-5 h-5 mb-1 ${sprayRec.color}`} />
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Spray</span>
                        <span className={`text-sm font-bold ${sprayRec.color} leading-tight`}>{sprayRec.status}</span>
                    </div>

                    {/* 2. Pest Risk */}
                    <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center min-w-[90px] ${pestRisk === 'High' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <AlertTriangle className={`w-5 h-5 mb-1 ${pestRisk === 'High' ? 'text-red-500' : 'text-green-500'}`} />
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pest Risk</span>
                        <span className={`text-sm font-bold ${pestRisk === 'High' ? 'text-red-600' : 'text-green-600'}`}>{pestRisk}</span>
                    </div>

                    {/* 3. Market Price Movement */}
                    <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100 flex flex-col items-center justify-center text-center min-w-[90px]">
                        {marketData ? (
                            <>
                                {marketData.trend === 'up' ? <TrendingUp className="w-5 h-5 text-green-600 mb-1" /> :
                                    marketData.trend === 'down' ? <TrendingDown className="w-5 h-5 text-red-600 mb-1" /> :
                                        <Minus className="w-5 h-5 text-gray-400 mb-1" />}
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Price</span>
                                <span className="text-sm font-bold text-gray-700">₹{marketData.modalPrice}</span>
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-5 h-5 text-gray-400 mb-1" />
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Price</span>
                                <span className="text-xs text-gray-500">--</span>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
