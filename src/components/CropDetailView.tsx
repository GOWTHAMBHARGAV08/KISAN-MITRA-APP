import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCropPriceHistory, MandiPriceHistory, MandiPrice } from '@/constants/marketData';

interface CropDetailViewProps {
    crop: MandiPrice;
    onClose: () => void;
}

export const CropDetailView = ({ crop, onClose }: CropDetailViewProps) => {
    const [history, setHistory] = useState<MandiPriceHistory[]>([]);
    const [stats, setStats] = useState({
        high: 0,
        low: 0,
        average: 0
    });

    useEffect(() => {
        // Fetch history
        const data = getCropPriceHistory(crop.cropName, 'Your District'); // District can be dynamic later
        setHistory(data);

        // Calculate stats
        const prices = data.map(d => d.price);
        const high = Math.max(...prices);
        const low = Math.min(...prices);
        const sum = prices.reduce((a, b) => a + b, 0);
        const average = Math.floor(sum / prices.length);

        setStats({ high, low, average });
    }, [crop]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <Card className="w-full max-w-lg bg-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-green-50 to-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{crop.cropName}</h2>
                        <p className="text-xs text-muted-foreground">30-Day Price Trend (Per Quintal)</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto">
                    {/* Main Price Display */}
                    <div className="flex items-baseline justify-center gap-2 mb-6">
                        <span className="text-4xl font-extrabold text-green-700">₹{crop.modalPrice.toLocaleString('en-IN')}</span>
                        <div className={`flex items-center text-sm font-medium ${crop.trend === 'up' ? 'text-green-600' : crop.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                            {crop.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : crop.trend === 'down' ? <TrendingDown className="w-4 h-4 mr-1" /> : <Minus className="w-4 h-4 mr-1" />}
                            {crop.trend === 'up' ? 'Rising' : crop.trend === 'down' ? 'Falling' : 'Stable'}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-64 w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#6B7280' }}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={6}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 10, fill: '#6B7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#15803d', fontWeight: 'bold' }}
                                    formatter={(value: number) => [`₹${value}`, 'Price']}
                                    labelStyle={{ color: '#374151', marginBottom: '0.25rem' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-2">
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">Highest</p>
                            <p className="font-bold text-gray-800">₹{stats.high.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">Lowest</p>
                            <p className="font-bold text-gray-800">₹{stats.low.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">Average</p>
                            <p className="font-bold text-gray-800">₹{stats.average.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </Card>
        </div>
    );
};
