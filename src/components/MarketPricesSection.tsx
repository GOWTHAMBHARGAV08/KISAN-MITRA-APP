import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMarketPrices, MandiPrice, getTrendIcon, getTrendColor } from '@/constants/marketData';
import { ArrowRight, IndianRupee, Sprout } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CropDetailView } from './CropDetailView';

interface MarketPricesSectionProps {
    onNavigateToProfile?: () => void;
}

export const MarketPricesSection = ({ onNavigateToProfile }: MarketPricesSectionProps) => {
    const [prices, setPrices] = useState<MandiPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCrop, setSelectedCrop] = useState<MandiPrice | null>(null);

    useEffect(() => {
        const loadPrices = () => {
            // Decode selected crops from localStorage
            const savedCrops = localStorage.getItem('kisanMitra_selectedCrops');
            const selectedCrops: string[] = savedCrops ? JSON.parse(savedCrops) : [];

            if (selectedCrops.length > 0) {
                const marketData = getMarketPrices(selectedCrops);
                setPrices(marketData);
            } else {
                setPrices([]);
            }
            setLoading(false);
        };

        loadPrices();

        // Auto-refresh prices periodically (simulated live data)
        const interval = setInterval(loadPrices, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) return null; // Or a skeleton loader if preferred

    if (prices.length === 0) {
        return (
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-100 shadow-sm animate-fade-in">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <Sprout className="w-6 h-6 text-green-700" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-green-900">Personalize Your Market Prices</h3>
                            <p className="text-sm text-green-700">Select the crops you grow to see live mandi prices here.</p>
                        </div>
                    </div>
                    <Button
                        onClick={onNavigateToProfile}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md whitespace-nowrap"
                    >
                        Update Profile <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-800">Nearby Mandi Prices</h2>
                </div>
                <p className="text-xs text-muted-foreground">Prices per Quintal (100kg)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prices.map((price) => {
                    const TrendIcon = getTrendIcon(price.trend);
                    const trendColor = getTrendColor(price.trend);

                    return (
                        <Card
                            key={price.cropName}
                            className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
                            onClick={() => setSelectedCrop(price)}
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800">{price.cropName}</h3>
                                    <Badge variant="outline" className={`${trendColor} bg-opacity-10 border-opacity-20 flex items-center gap-1`}>
                                        <TrendIcon className="w-3 h-3" />
                                        {price.trend === 'up' ? 'Rising' : price.trend === 'down' ? 'Falling' : 'Stable'}
                                    </Badge>
                                </div>

                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-2xl font-extrabold text-green-700">₹{price.modalPrice.toLocaleString('en-IN')}</span>
                                    <span className="text-sm text-muted-foreground">/ quintal</span>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-xs">Min</span>
                                        <span className="font-medium">₹{price.minPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-xs">Max</span>
                                        <span className="font-medium">₹{price.maxPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="mt-2 text-[10px] text-right text-gray-400">
                                    Updated: {price.lastUpdated}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {selectedCrop && (
                <CropDetailView
                    crop={selectedCrop}
                    onClose={() => setSelectedCrop(null)}
                />
            )}
        </div>
    );
};
