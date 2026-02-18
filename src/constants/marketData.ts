import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const CROP_LIST = [
    "Rice (Paddy)",
    "Sugarcane",
    "Corn (Maize)",
    "Tobacco",
    "Chillies",
    "Cotton",
    "Minumu (Black Gram)",
    "Sanaga (Bengal Gram)"
];

export interface MandiPrice {
    cropName: string;
    modalPrice: number; // Price per quintal (100kg)
    minPrice: number;
    maxPrice: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
}

// Helper to generate random price fluctuations for demo purposes
const getRandomPrice = (base: number, variance: number) => {
    return Math.floor(base + (Math.random() * variance * 2 - variance));
};

export const getMarketPrices = (selectedCrops: string[]): MandiPrice[] => {
    const prices: Record<string, { base: number; variance: number }> = {
        "Rice (Paddy)": { base: 2200, variance: 150 },
        "Sugarcane": { base: 3100, variance: 100 },
        "Corn (Maize)": { base: 2050, variance: 120 },
        "Tobacco": { base: 8500, variance: 500 },
        "Chillies": { base: 18000, variance: 1500 },
        "Cotton": { base: 6800, variance: 300 },
        "Minumu (Black Gram)": { base: 7200, variance: 400 },
        "Sanaga (Bengal Gram)": { base: 5800, variance: 250 }
    };

    return selectedCrops
        .filter(crop => prices[crop]) // Ensure crop exists in our 'database'
        .map(crop => {
            const { base, variance } = prices[crop];
            const modalPrice = getRandomPrice(base, variance);
            const minPrice = modalPrice - getRandomPrice(variance / 2, 50);
            const maxPrice = modalPrice + getRandomPrice(variance / 2, 50);

            const trendRandom = Math.random();
            const trend = trendRandom > 0.6 ? 'up' : trendRandom < 0.4 ? 'down' : 'stable';

            return {
                cropName: crop,
                modalPrice,
                minPrice,
                maxPrice,
                trend,
                lastUpdated: new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })
            };
        });
};

export interface MandiPriceHistory {
    date: string;
    price: number;
}

export const getCropPriceHistory = (cropName: string, district: string): MandiPriceHistory[] => {
    // Simulate 30 days of data
    const history: MandiPriceHistory[] = [];
    const basePrice = getMarketPrices([cropName])[0]?.modalPrice || 2000;
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Add some random fluctuation but keep a general trend
        // We'll use a simple sine wave + random noise for realistic looking data
        const trendFactor = Math.sin(i / 5) * 50;
        const randomNoise = (Math.random() - 0.5) * 100;

        let price = Math.floor(basePrice + trendFactor + randomNoise);

        // Ensure price is positive
        price = Math.max(price, 100);

        history.push({
            date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: price
        });
    }

    // Ensure the last point matches current price somewhat closely (optional polish)
    // But for now, independent simulation is fine as long as it looks good.
    return history;
};

export const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
        case 'up': return TrendingUp;
        case 'down': return TrendingDown;
        default: return Minus;
    }
};

export const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
        case 'up': return 'text-green-600';
        case 'down': return 'text-red-500';
        default: return 'text-gray-500';
    }
};
