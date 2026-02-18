-- Create scan_history table
CREATE TABLE IF NOT EXISTS public.scan_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    image_url TEXT NOT NULL,
    plant_name TEXT NOT NULL,
    status TEXT NOT NULL,
    confidence NUMERIC,
    disease_name TEXT,
    severity TEXT,
    recommendations JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for scan_history
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scan history"
    ON public.scan_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan history"
    ON public.scan_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    type TEXT NOT NULL, -- 'weather', 'price', 'pest', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for alerts
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alerts"
    ON public.alerts
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts (mark as read)"
    ON public.alerts
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert alerts (via functions or user triggers)"
    ON public.alerts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Add missing fields to profiles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'sowing_date') THEN
        ALTER TABLE public.profiles ADD COLUMN sowing_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'selected_crop') THEN
        ALTER TABLE public.profiles ADD COLUMN selected_crop TEXT;
    END IF;
END $$;
