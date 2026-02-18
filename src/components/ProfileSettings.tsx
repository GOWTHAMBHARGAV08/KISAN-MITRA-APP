import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, MapPin, Phone, Tractor, Save, Loader2, Globe, LogOut } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LANGUAGES } from '@/constants/languages';
import { CROP_LIST } from '@/constants/marketData';
import { Checkbox } from '@/components/ui/checkbox';
import { Sprout } from 'lucide-react';



interface ProfileSettingsProps {
  onLogout?: () => void;
}

interface ProfileData {
  display_name: string;
  phone: string;
  address: string;
  state: string;
  district: string;
  farm_name: string;
  farm_size: string;
  preferred_language: string;
  selected_crops: string[];
}

const emptyProfile: ProfileData = {
  display_name: '',
  phone: '',
  address: '',
  state: '',
  district: '',
  farm_name: '',
  farm_size: '',
  preferred_language: 'english',
  selected_crops: [],
};

export const ProfileSettings = ({ onLogout }: ProfileSettingsProps) => {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserEmail(user.email || '');

      const { data } = await supabase
        .from('profiles')
        .select('display_name, phone, address, state, district, farm_name, farm_size, preferred_language')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          display_name: data.display_name || '',
          phone: data.phone || '',
          address: data.address || '',
          state: data.state || '',
          district: data.district || '',
          farm_name: data.farm_name || '',
          farm_size: data.farm_size || '',
          preferred_language: data.preferred_language || 'english',
          selected_crops: [],
        });
      }

      // Load selected crops from localStorage
      const savedCrops = localStorage.getItem('kisanMitra_selectedCrops');
      if (savedCrops) {
        setProfile(prev => ({ ...prev, selected_crops: JSON.parse(savedCrops) }));
      }

      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('Not authenticated');
      setSaving(false);
      return;
    }

    // 1. Update Supabase Profile
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: profile.display_name.trim() || null,
        phone: profile.phone.trim() || null,
        address: profile.address.trim() || null,
        state: profile.state.trim() || null,
        district: profile.district.trim() || null,
        farm_name: profile.farm_name.trim() || null,
        farm_size: profile.farm_size.trim() || null,
        preferred_language: profile.preferred_language || 'english',
      })
      .eq('user_id', user.id);

    // 2. Update LocalStorage for Crops
    localStorage.setItem('kisanMitra_selectedCrops', JSON.stringify(profile.selected_crops));

    if (error) {
      toast.error('Failed to save profile');
    } else {
      toast.success('Profile updated successfully!');
    }
    setSaving(false);
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleCrop = (crop: string) => {
    setProfile(prev => {
      const currentCrops = prev.selected_crops || [];
      const newCrops = currentCrops.includes(crop)
        ? currentCrops.filter(c => c !== crop)
        : [...currentCrops, crop];
      return { ...prev, selected_crops: newCrops };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto w-full">
      {/* Header Profile Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 text-center border border-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto rounded-full bg-white p-1 shadow-lg mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white">
              <User className="h-10 w-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{profile.display_name || 'Farmer'}</h2>
          <p className="text-sm text-foreground/70 font-medium bg-white/50 inline-block px-3 py-1 rounded-full">{userEmail}</p>
        </div>
      </div>

      {/* Personal Details */}
      <div className="card-farmer p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
            <User className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Personal Info</h3>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="display_name" className="text-foreground/80 font-medium">Full Name</Label>
            <Input
              id="display_name"
              value={profile.display_name}
              onChange={e => updateField('display_name', e.target.value)}
              placeholder="Enter your name"
              className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground/80 font-medium">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                value={profile.phone}
                onChange={e => updateField('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                type="tel"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="card-farmer p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
          <div className="bg-red-100 text-red-600 p-2 rounded-xl">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Location</h3>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state" className="text-foreground/80 font-medium">State</Label>
              <Input
                id="state"
                value={profile.state}
                onChange={e => updateField('state', e.target.value)}
                placeholder="e.g. Karnataka"
                className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district" className="text-foreground/80 font-medium">District</Label>
              <Input
                id="district"
                value={profile.district}
                onChange={e => updateField('district', e.target.value)}
                placeholder="e.g. Bangalore Rural"
                className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground/80 font-medium">Village / Town</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={e => updateField('address', e.target.value)}
              placeholder="Enter your village name"
              className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="card-farmer p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
          <div className="bg-purple-100 text-purple-600 p-2 rounded-xl">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg text-foreground">App Language</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred_language" className="text-foreground/80 font-medium">Preferred Language</Label>
          <Select value={profile.preferred_language} onValueChange={(val) => updateField('preferred_language', val)}>
            <SelectTrigger id="preferred_language" className="h-12 rounded-xl bg-gray-50 border-gray-200 text-base">
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
          <p className="text-xs text-muted-foreground ml-1">This will change the AI assistant's response language.</p>
        </div>
      </div>

      {/* Farm Details */}
      <div className="card-farmer p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
          <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
            <Tractor className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Farm Details</h3>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farm_name" className="text-foreground/80 font-medium">Farm Name</Label>
              <Input
                id="farm_name"
                value={profile.farm_name}
                onChange={e => updateField('farm_name', e.target.value)}
                placeholder="My Farm"
                className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farm_size" className="text-foreground/80 font-medium">Farm Size</Label>
              <Input
                id="farm_size"
                value={profile.farm_size}
                onChange={e => updateField('farm_size', e.target.value)}
                placeholder="e.g. 5 acres"
                className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-border/40">
          <Label className="text-foreground/80 font-medium mb-3 block">Crops You Grow (Select all that apply)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CROP_LIST.map((crop) => (
              <div key={crop} className="flex items-center space-x-2 border border-input p-3 rounded-xl hover:bg-accent/50 transition-colors bg-card">
                <Checkbox
                  id={`crop-${crop}`}
                  checked={profile.selected_crops?.includes(crop)}
                  onCheckedChange={() => toggleCrop(crop)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label
                  htmlFor={`crop-${crop}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full py-1"
                >
                  {crop}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-20 md:bottom-6 z-20 bg-background/80 backdrop-blur-lg p-2 rounded-2xl border border-border shadow-lg space-y-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full btn-primary h-14 text-lg font-bold shadow-lg shadow-green-200"
        >
          {saving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
          {saving ? 'Saving Changes...' : 'Save Profile'}
        </Button>
      </div>

      <div className="text-center pt-4">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          KisanMitra v1.0 • Proudly built for Indian Farmers 🇮🇳
        </p>
      </div>
    </div >
  );
};
