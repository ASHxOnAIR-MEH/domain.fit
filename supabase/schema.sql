-- ==============================================================================
-- DOMAINFIT POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES ENUM
CREATE TYPE user_role AS ENUM ('client', 'trainer', 'admin');

-- 1. PROFILES (Base user records tied to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'client'::user_role NOT NULL,
  avatar_url TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. TRAINER PROFILES
CREATE TABLE IF NOT EXISTS public.trainer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bio TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  qualifications TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 1,
  rating NUMERIC(3,2) DEFAULT 5.00,
  client_count INTEGER DEFAULT 0,
  hourly_rate NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. CLIENT PROFILES
CREATE TABLE IF NOT EXISTS public.client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  trainer_id UUID REFERENCES public.trainer_profiles(id) ON DELETE SET NULL,
  current_program_id UUID,
  goal TEXT DEFAULT 'Build Strength & Improve Consistency',
  fitness_level TEXT DEFAULT 'Intermediate',
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  target_weight_kg NUMERIC(5,2),
  dietary_preferences TEXT[] DEFAULT '{}',
  injuries_notes TEXT DEFAULT '',
  streak_days INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. PROGRAMS
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration_weeks INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  included_services TEXT[] DEFAULT '{}',
  target_audience TEXT NOT NULL,
  trainer_id UUID REFERENCES public.trainer_profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. PROGRAM ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.program_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  current_week INTEGER DEFAULT 1,
  progress_pct INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. WORKOUT PLANS & EXERCISES
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workout_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
  day_name TEXT NOT NULL,
  day_order INTEGER DEFAULT 1 NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_day_id UUID REFERENCES public.workout_days(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  target_sets INTEGER DEFAULT 3,
  target_reps TEXT DEFAULT '8-12',
  rest_seconds INTEGER DEFAULT 90,
  notes TEXT DEFAULT '',
  video_url TEXT DEFAULT ''
);

-- 7. WORKOUT LOGS
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.client_profiles(id) ON DELETE CASCADE NOT NULL,
  workout_day_title TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. MEAL PLANS & LOGS
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  daily_calories INTEGER DEFAULT 2200,
  protein_g INTEGER DEFAULT 160,
  carbs_g INTEGER DEFAULT 220,
  fats_g INTEGER DEFAULT 65,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.meal_plan_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  calories INTEGER DEFAULT 0,
  protein_g INTEGER DEFAULT 0,
  carbs_g INTEGER DEFAULT 0,
  fats_g INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.meal_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.client_profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  meal_type TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  photo_url TEXT DEFAULT '',
  calories INTEGER DEFAULT 0,
  protein_g INTEGER DEFAULT 0,
  carbs_g INTEGER DEFAULT 0,
  fats_g INTEGER DEFAULT 0,
  trainer_feedback TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. PROGRESS RECORDS
CREATE TABLE IF NOT EXISTS public.progress_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.client_profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  waist_cm NUMERIC(5,2),
  chest_cm NUMERIC(5,2),
  arms_cm NUMERIC(5,2),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. APPOINTMENTS
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.client_profiles(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES public.trainer_profiles(id) ON DELETE CASCADE NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  session_type TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed' NOT NULL,
  meeting_link TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_trainer_time_slot UNIQUE (trainer_id, session_date, start_time)
);

-- 11. MESSAGES & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  status TEXT DEFAULT 'succeeded' NOT NULL,
  item_type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  payment_method TEXT DEFAULT 'Razorpay Test',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 1. Profiles policy: Anyone can read basic trainer/public profiles; users can update own profile
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Programs policy: Everyone can view published programs
CREATE POLICY "Public programs are viewable by everyone"
  ON public.programs FOR SELECT
  USING (is_published = true);

-- 3. Client profiles: Client reads own, assigned trainer reads client, admin reads all
CREATE POLICY "Clients can view their own profile"
  ON public.client_profiles FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    EXISTS (SELECT 1 FROM public.trainer_profiles tp WHERE tp.user_id = auth.uid() AND tp.id = trainer_id)
  );

-- 4. Workout Logs: Client can view and insert their own logs
CREATE POLICY "Clients can manage their own workout logs"
  ON public.workout_logs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.client_profiles cp WHERE cp.id = client_id AND cp.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 5. Appointments: Both trainer and client can view and manage their appointment
CREATE POLICY "Clients and trainers can access their appointments"
  ON public.appointments FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.client_profiles cp WHERE cp.id = client_id AND cp.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.trainer_profiles tp WHERE tp.id = trainer_id AND tp.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
