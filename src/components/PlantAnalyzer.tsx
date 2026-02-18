import { useState, useRef } from 'react';
import { Leaf, Upload, Camera, X, CheckCircle, AlertTriangle, Bug, Pill, Shield, ShoppingCart, Globe, RefreshCw, ChevronRight, ArrowRight, AlertCircle } from 'lucide-react';
import { resizeImage } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfileLanguage } from '@/hooks/useProfileLanguage';
import { LANGUAGES } from '@/constants/languages';
import { getTranslatedText } from '@/constants/cropTranslations';
import { getDiseaseInfo } from '@/constants/diseaseData';

interface AnalysisResult {
  plantName: string;
  plantConfidence?: number;
  status: 'HEALTHY' | 'DISEASED' | 'PEST' | 'NUTRIENT_DEFICIENCY' | 'uncertain';
  confidence: number;
  description: string;
  diseaseDetected?: string;
  diseaseId?: string; // New field for translation lookup
  recommendations: string[];
  precautions: string[];
  severity?: 'low' | 'medium' | 'high';
  error?: string;
}

interface ProductRecommendation {
  name: string;
  description: string;
  type: 'pesticide' | 'fertilizer';
}

interface DiseaseRecommendations {
  pesticides: ProductRecommendation[];
  fertilizers: ProductRecommendation[];
}

export const PlantAnalyzer = ({ onNavigateToStore }: { onNavigateToStore?: () => void }) => {
  const { profileLanguage } = useProfileLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  // Removed retranslating state as we now use static translations
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'treatments' | 'products'>('analysis');
  const [language, setLanguage] = useState<string | null>(null);
  // Removed lastImageBase64 as we don't need to re-analyze
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Use profile language as default once loaded
  const effectiveLanguage = language ?? profileLanguage ?? 'english';

  // Get localized disease info based on the stored ID
  // Prioritize diseaseId for lookup, fallback to diseaseDetected if needed (though diseaseDetected is specific name)
  const diseaseInfo = analysisResult ? getDiseaseInfo(analysisResult.diseaseId || analysisResult.diseaseDetected, effectiveLanguage) : null;
  const translatedPlantName = analysisResult ? getTranslatedText(analysisResult.plantName, 'CROP', effectiveLanguage) : '';
  const translatedStatus = analysisResult ? getTranslatedText(analysisResult.status, 'STATUS', effectiveLanguage) : '';

  // Disease to product mapping
  const getDiseaseRecommendations = (disease: string): DiseaseRecommendations => {
    const diseaseMap: Record<string, DiseaseRecommendations> = {
      'LEAF_SPOT': {
        pesticides: [
          { name: 'Copper Fungicide', description: 'Controls fungal leaf spot diseases', type: 'pesticide' },
          { name: 'Neem Oil', description: 'Organic treatment for leaf spots', type: 'pesticide' }
        ],
        fertilizers: [
          { name: 'Balanced NPK Fertilizer', description: 'Strengthens plant immunity', type: 'fertilizer' },
          { name: 'Potassium Rich Fertilizer', description: 'Improves disease resistance', type: 'fertilizer' }
        ]
      },
      'BLIGHT': {
        pesticides: [
          { name: 'Carbendazim', description: 'Systemic fungicide for blight control', type: 'pesticide' },
          { name: 'Mancozeb', description: 'Protective fungicide for blight', type: 'pesticide' }
        ],
        fertilizers: [
          { name: 'Organic Compost', description: 'Improves soil health and plant vigor', type: 'fertilizer' },
          { name: 'Calcium Fertilizer', description: 'Strengthens cell walls against blight', type: 'fertilizer' }
        ]
      },
      'RUST': {
        pesticides: [
          { name: 'Propiconazole', description: 'Effective against rust diseases', type: 'pesticide' },
          { name: 'Sulfur Dust', description: 'Organic rust control', type: 'pesticide' }
        ],
        fertilizers: [
          { name: 'Nitrogen Fertilizer', description: 'Promotes healthy leaf growth', type: 'fertilizer' },
          { name: 'Iron Chelate', description: 'Prevents iron deficiency', type: 'fertilizer' }
        ]
      },
      'POWDERY_MILDEW': {
        pesticides: [
          { name: 'Potassium Bicarbonate', description: 'Organic powdery mildew control', type: 'pesticide' },
          { name: 'Triforine', description: 'Systemic mildew fungicide', type: 'pesticide' }
        ],
        fertilizers: [
          { name: 'Phosphorus Fertilizer', description: 'Improves root development', type: 'fertilizer' },
          { name: 'Micronutrient Mix', description: 'Boosts overall plant health', type: 'fertilizer' }
        ]
      }
    };

    // Default recommendations for unknown diseases
    const defaultRecommendations: DiseaseRecommendations = {
      pesticides: [
        { name: 'Multi-Purpose Fungicide', description: 'Broad spectrum disease control', type: 'pesticide' },
        { name: 'Neem Oil Spray', description: 'Organic pest and disease control', type: 'pesticide' }
      ],
      fertilizers: [
        { name: 'Complete NPK Fertilizer', description: 'Balanced nutrition for plant health', type: 'fertilizer' },
        { name: 'Organic Compost', description: 'Natural soil enrichment', type: 'fertilizer' }
      ]
    };

    // Try to match disease name (case insensitive, partial match)
    // Try to match disease name (normalize keys)
    const normalizedDisease = (disease || '').toUpperCase().replace(/\s+/g, '_');

    // Direct match
    if (diseaseMap[normalizedDisease]) {
      return diseaseMap[normalizedDisease];
    }

    // Fuzzy match
    for (const [key, recommendations] of Object.entries(diseaseMap)) {
      if (normalizedDisease.includes(key) || key.includes(normalizedDisease)) {
        return recommendations;
      }
    }

    return defaultRecommendations;
  };

  const handleBuyProduct = (productName: string) => {
    toast({
      title: "Redirecting to Store",
      description: `Taking you to purchase ${productName}`,
    });
    if (onNavigateToStore) {
      onNavigateToStore();
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeWithGroq = async (imageBase64: string): Promise<AnalysisResult> => {
    // Mode is 'analyze'. Language is passed but now backend returns standardized IDs, so lang implies prompting to be consistent?
    // Actually we want standardized IDs regardless of language.
    // We pass language just in case backend needs it for other things, but our new prompt ignores it for the JSON keys.
    const { data, error } = await supabase.functions.invoke('farming-chat', {
      body: { imageBase64, mode: 'analyze', language: 'english' }, // Enforce English for consistent IDs
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message);
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    const response = data?.response;

    // Check if response is the object we expect
    if (response && typeof response === 'object') {
      return response as AnalysisResult;
    }

    const aiResponse = typeof response === 'string' ? response : '';

    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {
        plantName: 'Unknown Plant',
        status: 'DISEASED',
        confidence: 0,
        description: aiResponse || "Unable to analyze response.",
        recommendations: ['Consult with local agricultural expert', 'Monitor plant closely'],
        precautions: ['Regular monitoring', 'Proper watering'],
        severity: 'medium'
      };
    } catch (e) {
      console.error("JSON Parse error:", e);
      return {
        plantName: 'UNKNOWN',
        status: 'uncertain',
        confidence: 0,
        description: "Analysis failed.",
        recommendations: [],
        precautions: [],
        severity: 'medium',
        error: "Analysis failed. Please try again."
      };
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setAnalysisResult(null);
      // setLastImageBase64(null); // Removed

      toast({
        title: "Image uploaded",
        description: "Click 'Analyze Plant' to get health assessment.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive"
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], "plant.jpg", { type: "image/jpeg" });

      // Resize image to 1024x1024 max for consistency and performance
      // Resize image to 1024x1024 max for consistency and performance
      const imageBase64 = await resizeImage(file, 1024, 1024);
      // setLastImageBase64(imageBase64); // Removed as we don't re-analyze

      const result = await analyzeWithGroq(imageBase64);
      setAnalysisResult(result);

      toast({
        title: "Analysis Complete",
        description: "Plant health assessment is ready.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const removeImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
      setAnalysisResult(null);
      // setLastImageBase64(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-primary">
            <Leaf className="w-6 h-6 md:w-8 md:h-8 text-green-600 fill-green-50" />
            Crop Doctor
          </h2>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Select value={effectiveLanguage} onValueChange={setLanguage}>
              <SelectTrigger className="w-[140px] h-9 text-sm rounded-xl border-primary/20 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Removed re-translate button as it is automatic now */}
      </div>

      {/* Main Upload Card */}
      <div className={`card-farmer p-6 md:p-10 transition-all duration-500 ${analysisResult ? 'border-b-0 rounded-b-none shadow-none' : 'hover:shadow-float'}`}>
        <div className="text-center space-y-8">
          {!selectedImage ? (
            <div className="py-8 md:py-16">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-200 rounded-full blur-2xl opacity-40 animate-pulse" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50/50">
                  <Leaf className="w-12 h-12 text-[#2FAE63]" />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">Check Crop Health</h3>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg leading-relaxed">
                Take a photo of your crop. Our AI Doctor will diagnose issues instantly.
              </p>

              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <Button
                  size="lg"
                  onClick={() => cameraInputRef.current?.click()}
                  className="rounded-2xl btn-primary h-20 text-xl shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-[1.02] transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                  <Camera className="w-8 h-8 mr-3" />
                  Take a Photo
                </Button>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">OR</span>
                  <div className="h-px bg-border flex-1" />
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl h-14 text-base border-2 border-dashed border-primary/30 hover:bg-green-50 hover:border-primary text-foreground font-medium transition-all"
                >
                  <Upload className="w-5 h-5 mr-2 text-primary" />
                  Upload from Gallery
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="relative inline-block w-full max-w-lg mx-auto aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-black/5">
                <img
                  src={selectedImage}
                  alt="Plant to analyze"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full shadow-lg w-12 h-12 border-2 border-white"
                  onClick={removeImage}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {!analysisResult && (
                <div className="max-w-md mx-auto">
                  <Button
                    onClick={analyzeImage}
                    disabled={analyzing}
                    className="w-full btn-primary h-16 text-xl rounded-2xl shadow-xl shadow-green-200 animate-pulse"
                  >
                    {analyzing ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 animate-spin rounded-full border-4 border-white border-t-transparent" />
                        Analyzing...
                      </div>
                    ) : (
                      <>
                        <Leaf className="w-6 h-6 mr-2" />
                        Diagnose Now
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4 font-medium">
                    This usually takes 5-10 seconds
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="animate-fade-in -mt-4 relative z-10">
          {/* Top Info Bar */}
          <div className={`
            p-8 rounded-3xl shadow-float mb-8 relative overflow-hidden text-white
            ${analysisResult.status === 'HEALTHY'
              ? 'bg-gradient-to-br from-[#2FAE63] to-[#1F8A4C]'
              : 'bg-gradient-to-br from-red-500 to-red-700'}
          `}>
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

            {analysisResult.error ? (
              <div className="bg-red-500/10 backdrop-blur-md p-6 rounded-2xl border border-red-500/20 text-white mt-4">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-red-200 shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Analysis Uncertain</h3>
                    <p className="opacity-90 leading-relaxed">{analysisResult.error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
                <div>
                  <p className="opacity-90 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    Analysis Result
                  </p>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{translatedPlantName || analysisResult.plantName}</h2>

                  {/* Disease Name Display */}
                  {analysisResult.status !== 'HEALTHY' && (
                    <div className="mb-3">
                      <h3 className="text-xl md:text-2xl font-semibold text-white/90">
                        {analysisResult.diseaseDetected || "Issue Detected"}
                      </h3>
                      {/* Optional: Show translated generic name if specific name is in English?? 
                           User said: "Language switching only translates the structured fields"
                           If diseaseId exists, diseaseInfo.name will be the translated generic name (e.g. Leaf Curl).
                           analysisResult.diseaseDetected is specific (e.g. Chilli Leaf Curl Virus).
                           Maybe show both? Or just specific? 
                           User Request: "Chilli Leaf Curl Virus detected" 
                           If I show English specific name, it violates "translated".
                           But I can't translate specific name without AI.
                           Hybrid: Show specific name. If translation available for ID, show that as subtitle?
                       */}
                    </div>
                  )}

                  <p className="text-lg opacity-90 font-medium max-w-xl">
                    {analysisResult.status === 'HEALTHY'
                      ? (effectiveLanguage === 'hindi' ? "खुशखबरी! आपका पौधा स्वस्थ है। कोई रोग नहीं मिला।" : "Great news! Your plant looks healthy. No visible disease detected.")
                      : (analysisResult.confidence < 65 ? "Possible condition detected. Please verify symptoms." : (diseaseInfo?.description || analysisResult.description))}
                  </p>
                </div>

                <div className={`
                px-6 py-3 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 
                flex items-center gap-3 shadow-lg transform transition-transform hover:scale-105
              `}>
                  {analysisResult.status === 'HEALTHY'
                    ? <CheckCircle className="w-8 h-8 text-white" />
                    : <AlertTriangle className="w-8 h-8 text-white" />}
                  <div>
                    <span className="block text-xs font-bold uppercase opacity-80">Status</span>
                    <span className="text-xl font-bold capitalize tracking-wide">{translatedStatus || analysisResult.status}</span>
                    {/* Removed duplicate disease display here involving diseaseInfo.name to focus on prominent display above */}
                  </div>
                </div>
              </div>
            )}

            {!analysisResult.error && (
              <div className="mt-6 flex flex-wrap gap-3">
                {analysisResult.severity && analysisResult.status !== 'HEALTHY' && (
                  <div className="text-xs font-bold uppercase py-1.5 px-4 bg-black/20 rounded-full backdrop-blur-md border border-white/10">
                    Severity: {analysisResult.severity}
                  </div>
                )}
                {analysisResult.plantConfidence && (
                  <div className="text-xs font-bold uppercase py-1.5 px-4 bg-black/20 rounded-full backdrop-blur-md border border-white/10">
                    Plant ID: {analysisResult.plantConfidence}%
                  </div>
                )}
                <div className="text-xs font-bold uppercase py-1.5 px-4 bg-black/20 rounded-full backdrop-blur-md border border-white/10">
                  Diagnosis: {analysisResult.confidence}%
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 max-w-2xl mx-auto">
            {[
              { id: 'analysis', label: 'Diagnosis', icon: Bug },
              { id: 'treatments', label: 'Remedies', icon: Pill },
              { id: 'products', label: 'Shop', icon: ShoppingCart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-300 border-2 ${activeTab === tab.id
                  ? 'bg-white border-[#2FAE63] text-[#1F8A4C] shadow-lg scale-105 z-10'
                  : 'bg-gray-50 border-transparent text-muted-foreground hover:bg-white hover:border-gray-200'
                  }`}
              >
                <tab.icon className={`w-6 h-6 mb-2 ${activeTab === tab.id ? 'fill-current' : ''}`} />
                <span className="text-xs md:text-sm font-bold tracking-wide uppercase">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="space-y-8">
            {activeTab === 'analysis' && (
              <div className="card-farmer p-6 md:p-8 animate-fade-in bg-white/60 backdrop-blur-sm border-l-4 border-l-orange-400">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  Diagnosis Details
                </h3>
                <p className="text-foreground/80 leading-relaxed text-lg font-medium">
                  {diseaseInfo?.description || analysisResult.description}
                </p>
              </div>
            )}

            {activeTab === 'treatments' && (
              <div className="space-y-6 animate-fade-in">
                <div className="card-farmer p-6 md:p-8 border-l-4 border-l-blue-500">
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
                      <Pill className="w-6 h-6" />
                    </div>
                    Step-by-Step Cure
                  </h3>
                  <ul className="space-y-4">
                    {(diseaseInfo?.recommendations || analysisResult.recommendations).map((rec, i) => (
                      <li key={i} className="flex gap-4 items-start bg-blue-50/50 p-4 rounded-xl">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {i + 1}
                        </span>
                        <span className="text-foreground font-medium py-1 text-lg">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-farmer p-6 md:p-8 border-l-4 border-l-green-500">
                  <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-3">
                    <div className="p-2.5 bg-green-100 rounded-xl text-green-600">
                      <Shield className="w-6 h-6" />
                    </div>
                    Prevent Future Attacks
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(diseaseInfo?.precautions || analysisResult.precautions).map((item, i) => (
                      <div key={i} className="flex gap-3 items-center bg-green-50/50 p-4 rounded-xl border border-green-100">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="font-medium text-green-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6 animate-fade-in">
                {analysisResult.diseaseDetected ? (
                  <>
                    <div className="flex items-center justify-between px-2">
                      <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        Recommended Products
                      </h3>
                      <span className="text-xs font-bold tracking-wider text-[#1F8A4C] bg-green-100 px-3 py-1.5 rounded-full uppercase">Verified</span>
                    </div>

                    <div className="grid gap-4">
                      {(() => {
                        const recommendations = getDiseaseRecommendations(analysisResult.diseaseDetected || '');
                        const allProducts = [...recommendations.pesticides, ...recommendations.fertilizers];

                        return allProducts.map((product, idx) => (
                          <div key={idx} className="card-farmer p-5 flex flex-col md:flex-row gap-5 items-start md:items-center group cursor-pointer hover:border-[#2FAE63] hover:shadow-lg transition-all" onClick={() => handleBuyProduct(product.name)}>
                            <div className={`w-full md:w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${product.type === 'pesticide' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                              }`}>
                              <Bug className="w-10 h-10" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg text-foreground group-hover:text-[#2FAE63] transition-colors">{product.name}</h4>
                                <Badge variant="outline" className="capitalize ml-2">{product.type}</Badge>
                              </div>
                              <p className="text-muted-foreground mt-1 text-base">{product.description}</p>
                            </div>
                            <Button size="icon" className="h-12 w-12 rounded-full shrink-0 shadow-sm bg-gray-50 hover:bg-[#2FAE63] hover:text-white transition-colors self-end md:self-center">
                              <ChevronRight className="w-6 h-6" />
                            </Button>
                          </div>
                        ));
                      })()}
                    </div>

                    <div className="mt-8 text-center">
                      <Button variant="outline" size="lg" className="rounded-2xl w-full py-8 text-lg font-bold text-[#1F8A4C] border-[#2FAE63]/30 hover:bg-green-50 hover:border-[#2FAE63]" onClick={onNavigateToStore}>
                        Visit Store for More
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="card-farmer p-12 text-center bg-gradient-to-br from-green-50 to-white">
                    <div className="w-24 h-24 bg-green-100 text-[#2FAE63] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">All Good!</h3>
                    <p className="text-lg text-muted-foreground max-w-sm mx-auto">Your plant looks healthy. You don't need any medicines right now.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />
    </div>
  );
};