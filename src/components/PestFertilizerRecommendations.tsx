import { useState } from 'react';
import { Bug, Zap, ChevronDown, Leaf, AlertTriangle, Shield, Sprout, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Recommendation {
  pestControl: {
    commonPests: string[];
    organicSolutions: string[];
    chemicalSolutions: string[];
    preventiveMeasures: string[];
  };
  fertilizer: {
    primaryFertilizers: string[];
    organicOptions: string[];
    applicationTiming: string[];
    dosage: string;
  };
}

const cropRecommendations: Record<string, Recommendation> = {
  rice: {
    pestControl: {
      commonPests: ['Brown Plant Hopper', 'Stem Borer', 'Leaf Folder', 'Rice Bug'],
      organicSolutions: ['Neem oil spray', 'Trichoderma application', 'Pheromone traps', 'Biological control agents'],
      chemicalSolutions: ['Imidacloprid', 'Chlorpyrifos', 'Cartap hydrochloride', 'Thiamethoxam'],
      preventiveMeasures: ['Proper water management', 'Resistant varieties', 'Crop rotation', 'Clean cultivation']
    },
    fertilizer: {
      primaryFertilizers: ['Urea (46-0-0)', 'DAP (18-46-0)', 'Potash (0-0-60)', 'Complex NPK (10-26-26)'],
      organicOptions: ['Farmyard manure', 'Compost', 'Green manure', 'Vermicompost'],
      applicationTiming: ['Basal dose at transplanting', 'First top dress at 15-20 DAT', 'Second top dress at 40-45 DAT'],
      dosage: '120 kg N, 60 kg P2O5, 40 kg K2O per hectare'
    }
  },
  wheat: {
    pestControl: {
      commonPests: ['Aphids', 'Termites', 'Army Worm', 'Wheat Weevil'],
      organicSolutions: ['Neem cake', 'Sticky traps', 'Bacillus thuringiensis', 'Companion planting'],
      chemicalSolutions: ['Dimethoate', 'Malathion', 'Cypermethrin', 'Imidacloprid'],
      preventiveMeasures: ['Seed treatment', 'Timely sowing', 'Proper irrigation', 'Weed management']
    },
    fertilizer: {
      primaryFertilizers: ['Urea (46-0-0)', 'DAP (18-46-0)', 'NPK (12-32-16)', 'Single Super Phosphate'],
      organicOptions: ['Well-rotted manure', 'Compost', 'Bone meal', 'Mustard cake'],
      applicationTiming: ['Full P & K at sowing', 'Half N at sowing', 'Remaining N at crown root initiation'],
      dosage: '120 kg N, 60 kg P2O5, 40 kg K2O per hectare'
    }
  },
  cotton: {
    pestControl: {
      commonPests: ['Bollworm', 'Aphids', 'Jassids', 'Thrips', 'White Fly'],
      organicSolutions: ['Bt cotton varieties', 'Nuclear Polyhedrosis Virus', 'Trichogramma release', 'Neem extract'],
      chemicalSolutions: ['Spinosad', 'Emamectin benzoate', 'Acetamiprid', 'Profenofos'],
      preventiveMeasures: ['Pink bollworm resistant varieties', 'Refuge crop', 'Pheromone traps', 'Border crops']
    },
    fertilizer: {
      primaryFertilizers: ['Urea (46-0-0)', 'DAP (18-46-0)', 'Potash (0-0-60)', 'NPK (19-19-19)'],
      organicOptions: ['Farmyard manure', 'Cotton cake', 'Castor cake', 'Vermicompost'],
      applicationTiming: ['Basal at sowing', '30 days after sowing', '60 days after sowing', 'At flowering stage'],
      dosage: '150 kg N, 75 kg P2O5, 75 kg K2O per hectare'
    }
  },
  tomato: {
    pestControl: {
      commonPests: ['Fruit Borer', 'Leaf Miner', 'Whitefly', 'Aphids', 'Thrips'],
      organicSolutions: ['Bacillus thuringiensis', 'Yellow sticky traps', 'Neem oil', 'Marigold companion planting'],
      chemicalSolutions: ['Abamectin', 'Spiromesifen', 'Diafenthiuron', 'Thiamethoxam'],
      preventiveMeasures: ['Crop rotation', 'Resistant varieties', 'Mulching', 'Proper spacing']
    },
    fertilizer: {
      primaryFertilizers: ['NPK (19-19-19)', 'Calcium nitrate', 'Potassium sulphate', 'Magnesium sulphate'],
      organicOptions: ['Compost', 'Vermicompost', 'Bone meal', 'Seaweed extract'],
      applicationTiming: ['Basal before transplanting', '15 days after transplanting', 'At flowering', 'Fruit development'],
      dosage: '200 kg N, 100 kg P2O5, 150 kg K2O per hectare'
    }
  },
  maize: {
    pestControl: {
      commonPests: ['Fall Army Worm', 'Stem Borer', 'Shoot Fly', 'Cutworm'],
      organicSolutions: ['Trichogramma cards', 'Metarhizium anisopliae', 'Neem seed kernel extract', 'Bird perches'],
      chemicalSolutions: ['Spinetoram', 'Chlorantraniliprole', 'Emamectin benzoate', 'Cypermethrin'],
      preventiveMeasures: ['Early sowing', 'Seed treatment', 'Inter-cropping', 'Pheromone traps']
    },
    fertilizer: {
      primaryFertilizers: ['Urea (46-0-0)', 'DAP (18-46-0)', 'Potash (0-0-60)', 'Zinc sulphate'],
      organicOptions: ['Farmyard manure', 'Compost', 'Poultry manure', 'Green manure'],
      applicationTiming: ['Basal at sowing', '30 days after sowing', '50 days after sowing'],
      dosage: '150 kg N, 75 kg P2O5, 50 kg K2O per hectare'
    }
  }
};

export const PestFertilizerRecommendations = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'pest' | 'fertilizer'>('pest');

  const recommendation = selectedCrop ? cropRecommendations[selectedCrop] : null;

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header Card */}
      <div className="card-farmer p-6 md:p-8 bg-gradient-to-r from-orange-50 to-white border-l-8 border-orange-400">
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3.5 rounded-2xl text-orange-600 shadow-sm">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Crop Care Guide</h2>
            <p className="text-muted-foreground font-medium text-lg">Expert advice for healthy growth</p>
          </div>
        </div>

        <div className="mt-8">
          <label className="text-sm font-bold text-foreground ml-1 uppercase tracking-wider mb-2 block">Select Your Crop</label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-full h-16 rounded-2xl border-2 border-orange-100 bg-white text-xl shadow-sm hover:border-orange-300 transition-colors">
              <SelectValue placeholder="Tap to choose a crop..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rice">Rice (Paddy)</SelectItem>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
              <SelectItem value="tomato">Tomato</SelectItem>
              <SelectItem value="maize">Maize (Corn)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedCrop && recommendation && (
        <div className="space-y-6">
          {/* Custom Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            <button
              className={`flex-1 py-4 px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'pest'
                ? 'bg-white text-red-600 shadow-md transform scale-[1.02]'
                : 'text-muted-foreground hover:bg-gray-200'
                }`}
              onClick={() => setActiveTab('pest')}
            >
              <Bug className="w-5 h-5" />
              Pest Control
            </button>
            <button
              className={`flex-1 py-4 px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'fertilizer'
                ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]'
                : 'text-muted-foreground hover:bg-gray-200'
                }`}
              onClick={() => setActiveTab('fertilizer')}
            >
              <Zap className="w-5 h-5" />
              Fertilizers
            </button>
          </div>

          {activeTab === 'pest' && (
            <div className="space-y-6 animate-fade-in">
              <div className="card-farmer p-6 md:p-8 border-l-4 border-l-red-500 bg-red-50/30">
                <h4 className="font-bold text-red-800 text-xl mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Common Pests
                </h4>
                <div className="flex flex-wrap gap-3">
                  {recommendation.pestControl.commonPests.map((pest, i) => (
                    <span key={i} className="bg-white text-red-700 px-4 py-2 rounded-xl text-base font-bold border border-red-100 shadow-sm">
                      {pest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card-farmer p-6 md:p-8">
                <h4 className="font-bold text-green-700 text-xl mb-4 flex items-center gap-2">
                  <Leaf className="w-6 h-6" />
                  Organic Solutions
                </h4>
                <ul className="space-y-3">
                  {recommendation.pestControl.organicSolutions.map((sol, i) => (
                    <li key={i} className="flex gap-4 items-center p-3 hover:bg-green-50 rounded-xl transition-colors border border-transparent hover:border-green-100">
                      <div className="w-3 h-3 bg-green-500 rounded-full shrink-0 shadow-sm" />
                      <span className="text-foreground font-medium text-lg">{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-farmer p-6 md:p-8 bg-gray-50/50">
                <h4 className="font-bold text-blue-700 text-xl mb-4">Chemical Solutions</h4>
                <ul className="space-y-3">
                  {recommendation.pestControl.chemicalSolutions.map((sol, i) => (
                    <li key={i} className="flex gap-4 items-center p-3 hover:bg-blue-50 rounded-xl transition-colors">
                      <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0 shadow-sm" />
                      <span className="text-foreground font-medium text-lg">{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'fertilizer' && (
            <div className="space-y-6 animate-fade-in">
              <div className="card-farmer p-6 md:p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-none">
                <h4 className="font-bold text-blue-100 mb-2 uppercase tracking-wide text-sm">Recommended Dosage</h4>
                <p className="text-white text-2xl md:text-3xl font-bold leading-tight">{recommendation.fertilizer.dosage}</p>
              </div>

              <div className="card-farmer p-6 md:p-8 border-l-4 border-l-orange-500">
                <h4 className="font-bold text-orange-800 text-xl mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Application Schedule
                </h4>
                <div className="space-y-6 relative pl-6 border-l-2 border-orange-100 ml-3">
                  {recommendation.fertilizer.applicationTiming.map((time, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-orange-100 border-4 border-white shadow-sm flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:bg-white" />
                      </div>
                      <p className="text-foreground font-bold text-lg group-hover:text-orange-700 transition-colors">{time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-farmer p-6 md:p-8">
                  <h4 className="font-bold text-primary text-xl mb-4">Primary Fertilizers</h4>
                  <ul className="space-y-2">
                    {recommendation.fertilizer.primaryFertilizers.map((fert, i) => (
                      <li key={i} className="text-base p-3 bg-primary/5 rounded-xl text-primary-dark font-semibold border border-primary/10">
                        {fert}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-farmer p-6 md:p-8">
                  <h4 className="font-bold text-green-700 text-xl mb-4">Organic Options</h4>
                  <ul className="space-y-2">
                    {recommendation.fertilizer.organicOptions.map((opt, i) => (
                      <li key={i} className="text-base p-3 bg-green-50 rounded-xl text-green-800 font-semibold border border-green-100">
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedCrop && (
        <div className="text-center py-20 opacity-60">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sprout className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-xl text-muted-foreground font-medium">Select a crop above to see the guide</p>
        </div>
      )}
    </div>
  );
};