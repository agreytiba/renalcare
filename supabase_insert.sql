-- RenalCare Supabase Test Data Seeding Script
-- Use this script to populate your database with test users and realistic medical tracking logs.

-- Clean existing mock data first
DELETE FROM public.water_intake;
DELETE FROM public.medications;
DELETE FROM public.dialysis_sessions;
DELETE FROM public.glucose_logs;
DELETE FROM public.foods;

-- SAFE DELETE: Preserve your existing profile row in public.users
DELETE FROM public.users WHERE id != '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9';

-- =========================================================================
-- 1. SEED AUTHENTICATION CREDENTIALS (auth.users)
-- We register other dummy credentials to satisfy multi-patient foreign keys.
-- Your active ID '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9' is already in auth.users and is ignored to prevent conflict.
-- =========================================================================
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174001', 
    'jane@example.com', 
    '$2a$10$TJhZkL6b8P/d1hK5b.m6u.V005wQhWlh9/C4F72Q4e3.rZk47xMye', 
    NOW(), 
    '{"provider":"email","providers":["email"]}', 
    '{}', 
    NOW(), 
    NOW(), 
    'authenticated', 
    'authenticated'
  ),
  (
    '123e4567-e89b-12d3-a456-426614174002', 
    'ahmed@example.com', 
    '$2a$10$TJhZkL6b8P/d1hK5b.m6u.V005wQhWlh9/C4F72Q4e3.rZk47xMye', 
    NOW(), 
    '{"provider":"email","providers":["email"]}', 
    '{}', 
    NOW(), 
    NOW(), 
    'authenticated', 
    'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 2. SEED TEST PATIENT PROFILES (public.users)
-- Performs a safe upsert (ON CONFLICT DO UPDATE) for your active User ID 
-- to populate mock values without deleting your row or causing key conflicts.
-- =========================================================================
INSERT INTO public.users (id, full_name, age, gender, weight, height, diabetes_type, dialysis_type, preferred_language)
VALUES 
  ('6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 'John Doe (You)', 45, 'Male', 75.5, 175.0, 'Type 2', 'Hemodialysis', 'en')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  age = EXCLUDED.age,
  gender = EXCLUDED.gender,
  weight = EXCLUDED.weight,
  height = EXCLUDED.height,
  diabetes_type = EXCLUDED.diabetes_type,
  dialysis_type = EXCLUDED.dialysis_type,
  preferred_language = EXCLUDED.preferred_language;

-- Seed other mock profiles
INSERT INTO public.users (id, full_name, age, gender, weight, height, diabetes_type, dialysis_type, preferred_language)
VALUES
  ('123e4567-e89b-12d3-a456-426614174001', 'Jane Smith', 60, 'Female', 68.2, 160.0, 'Type 1', 'Peritoneal', 'sw'),
  ('123e4567-e89b-12d3-a456-426614174002', 'Ahmed Ali', 55, 'Male', 80.0, 180.0, 'Type 2', 'None', 'en')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 3. SEED SEARCH-OPTIMIZED BILINGUAL FOOD SAFETY REGISTRY
-- =========================================================================
INSERT INTO public.foods (id, name_en, name_sw, potassium_level, sodium_level, sugar_impact, phosphorus_level, kidney_safety_score, diabetes_safety_score)
VALUES 
  (uuid_generate_v4(), 'Apple', 'Tofaha', 'Low', 'Low', 'Medium', 'Low', 9, 7),
  (uuid_generate_v4(), 'Banana', 'Ndizi', 'High', 'Low', 'High', 'Low', 3, 3),
  (uuid_generate_v4(), 'White Bread', 'Mkate Mweupe', 'Low', 'Medium', 'High', 'Medium', 6, 2),
  (uuid_generate_v4(), 'Spinach', 'Mchicha', 'High', 'Low', 'Low', 'Medium', 4, 9),
  (uuid_generate_v4(), 'Chicken Breast', 'Kifua cha Kuku', 'Medium', 'Low', 'Low', 'High', 7, 10),
  (uuid_generate_v4(), 'White Rice', 'Wali Mweupe', 'Low', 'Low', 'High', 'Low', 8, 4),
  (uuid_generate_v4(), 'Avocado', 'Parachichi', 'High', 'Low', 'Low', 'Medium', 2, 8),
  (uuid_generate_v4(), 'Sweet Potato', 'Kiazi Kitamu', 'High', 'Low', 'Medium', 'Low', 3, 6),
  (uuid_generate_v4(), 'Fish (Tilapia)', 'Samaki (Sato)', 'Medium', 'Low', 'Low', 'High', 7, 10),
  (uuid_generate_v4(), 'Cabbage', 'Kabeji', 'Low', 'Low', 'Low', 'Low', 9, 9),
  (uuid_generate_v4(), 'Oatmeal', 'Uji wa Oti', 'Medium', 'Low', 'Medium', 'Medium', 8, 8),
  (uuid_generate_v4(), 'Egg White', 'Ute wa Yai', 'Low', 'Low', 'Low', 'Low', 10, 10),
  (uuid_generate_v4(), 'Watermelon', 'Tikiti Maji', 'Medium', 'Low', 'High', 'Low', 6, 4),
  (uuid_generate_v4(), 'Broccoli', 'Brokoli', 'Medium', 'Low', 'Low', 'Medium', 7, 9);

-- =========================================================================
-- 4. SEED GLUCOSE TEST RECORDS (Weekly Trend Line Visuals)
-- =========================================================================
INSERT INTO public.glucose_logs (id, user_id, level, reading_time, notes)
VALUES 
  -- Your blood sugar readings (Dashboard Trend Line Data points)
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 110, NOW() - INTERVAL '6 days', 'Before Breakfast'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 145, NOW() - INTERVAL '5 days', 'After Dinner'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 95, NOW() - INTERVAL '4 days', 'Fasting Sugar'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 130, NOW() - INTERVAL '3 days', 'Before Lunch'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 115, NOW() - INTERVAL '2 days', 'Fasting Sugar'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 150, NOW() - INTERVAL '1 day', 'After Dessert'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 105, NOW(), 'Fasting (Today)'),

  -- Jane Smith's blood sugar readings
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 90, NOW() - INTERVAL '4 days', 'Fasting'),
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 180, NOW() - INTERVAL '3 days', 'Missed Insulin dose'),
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 110, NOW() - INTERVAL '2 days', 'Post Meal'),
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 100, NOW() - INTERVAL '1 day', 'Before Bedtime'),
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 95, NOW(), 'Fasting (Today)');

-- =========================================================================
-- 5. SEED DIALYSIS SESSIONS LOGS (Last Session stats & comments)
-- =========================================================================
INSERT INTO public.dialysis_sessions (id, user_id, session_date, duration_minutes, weight_before, weight_after, blood_pressure_before, blood_pressure_after, notes)
VALUES 
  -- Your Dialysis Sessions logs
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', CURRENT_DATE - INTERVAL '5 days', 240, 77.5, 75.0, '140/85', '125/80', 'Patient felt slightly dizzy towards the end of fluid clearance.'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', CURRENT_DATE - INTERVAL '2 days', 240, 78.0, 75.5, '138/90', '130/80', 'Excellent clearance. BP remained stable through all four hours.'),

  -- Jane Smith's sessions (Peritoneal Dialysis Patient)
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', CURRENT_DATE - INTERVAL '1 day', 480, 69.5, 68.2, '120/75', '118/70', 'Overnight cycler session. High clearance rate reported.');

-- =========================================================================
-- 6. SEED DAILY MEDICATION SCHEDULE PLANS
-- =========================================================================
INSERT INTO public.medications (id, user_id, name, dosage, frequency, time_of_day, notes)
VALUES 
  -- Your active prescriptions
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 'Amlodipine', '5mg', 'Once daily', 'Morning', 'Take with water for blood pressure management.'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 'Sevelamer', '800mg', 'With meals', 'Evening', 'Phosphorus binder. Take strictly with dinner.'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 'Atorvastatin', '20mg', 'Once daily', 'Night', 'Cholesterol stabilizer.'),

  -- Jane Smith's active prescriptions
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 'Insulin Glargine', '10 Units', 'Once daily', 'Night', 'Long-acting insulin.'),
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 'Calcium Carbonate', '500mg', 'Twice daily', 'Morning', 'Take with breakfast.');

-- =========================================================================
-- 7. SEED TODAY'S LIQUID RECORDINGS (Progress circles metrics)
-- =========================================================================
INSERT INTO public.water_intake (id, user_id, amount_ml, intake_time)
VALUES 
  -- Your fluids logged today (Total: 850ml)
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 250, NOW() - INTERVAL '5 hours'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 100, NOW() - INTERVAL '3 hours'),
  (uuid_generate_v4(), '6de13ccc-f8fc-49ab-8e59-c1a7f95d02f9', 500, NOW() - INTERVAL '1 hour'),

  -- Jane Smith's fluids today (Total: 1200ml)
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 500, NOW() - INTERVAL '6 hours'),
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 500, NOW() - INTERVAL '4 hours'),
  (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174001', 200, NOW() - INTERVAL '2 hours');
