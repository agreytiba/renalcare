-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    age INT,
    gender TEXT,
    weight NUMERIC,
    height NUMERIC,
    diabetes_type TEXT,
    dialysis_type TEXT,
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create foods table
CREATE TABLE IF NOT EXISTS public.foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_sw TEXT NOT NULL,
    potassium_level TEXT NOT NULL,
    sodium_level TEXT NOT NULL,
    sugar_impact TEXT NOT NULL,
    phosphorus_level TEXT NOT NULL,
    kidney_safety_score INT NOT NULL,
    diabetes_safety_score INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create glucose_logs table
CREATE TABLE IF NOT EXISTS public.glucose_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    level NUMERIC NOT NULL,
    reading_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create dialysis_sessions table
CREATE TABLE IF NOT EXISTS public.dialysis_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    duration_minutes INT NOT NULL,
    weight_before NUMERIC,
    weight_after NUMERIC,
    blood_pressure_before TEXT,
    blood_pressure_after TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create medications table
CREATE TABLE IF NOT EXISTS public.medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    time_of_day TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create water_intake table
CREATE TABLE IF NOT EXISTS public.water_intake (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount_ml INT NOT NULL,
    intake_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)

-- Users table RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Foods table RLS
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view foods" ON public.foods FOR SELECT USING (true);
CREATE POLICY "Anyone can insert foods" ON public.foods FOR INSERT WITH CHECK (true);

-- Glucose Logs RLS
ALTER TABLE public.glucose_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own glucose logs" ON public.glucose_logs USING (auth.uid() = user_id);

-- Dialysis Sessions RLS
ALTER TABLE public.dialysis_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own dialysis sessions" ON public.dialysis_sessions USING (auth.uid() = user_id);

-- Medications RLS
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own medications" ON public.medications USING (auth.uid() = user_id);

-- Water Intake RLS
ALTER TABLE public.water_intake ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own water intake" ON public.water_intake USING (auth.uid() = user_id);
