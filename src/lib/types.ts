export type UserRole = 'client' | 'trainer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string;
  phone?: string;
  created_at: string;
}

export interface TrainerProfile {
  id: string;
  user_id: string;
  bio: string;
  specialties: string[];
  qualifications: string[];
  experience_years: number;
  rating: number;
  client_count: number;
  hourly_rate: number;
  image_url: string;
}

export interface ClientProfile {
  id: string;
  user_id: string;
  trainer_id?: string;
  current_program_id?: string;
  goal: string;
  medical_conditions: string[];
  hba1c_percent?: number;
  target_glucose_fasting_mg_dl?: number;
  postpartum_stage?: string;
  fitness_level: 'Gentle / Rehabilitation' | 'Beginner' | 'Intermediate';
  height_cm: number;
  weight_kg: number;
  target_weight_kg: number;
  dietary_preferences: string[];
  injuries_notes?: string;
  streak_days: number;
  onboarding_completed: boolean;
  physician_clearance_status: 'Cleared' | 'Coordinated with Doctor' | 'Under Review';
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  category: 'Diabetes & Metabolic' | 'Postpartum & Pelvic' | 'Prenatal' | 'Joint & Orthopedic' | 'Cardiac & BP' | 'Clinical Nutrition';
  difficulty: 'Gentle Rehabilitation' | 'Low Impact' | 'Gradual Progression';
  duration_weeks: number;
  price: number;
  featured: boolean;
  included_services: string[];
  target_audience: string;
  clinical_safeguards: string[];
  trainer_id: string;
}

export interface WorkoutExercise {
  id: string;
  exercise_name: string;
  target_sets: number;
  target_reps: string;
  rest_seconds: number;
  notes: string;
  clinical_caution?: string;
  video_url?: string;
}

export interface WorkoutDay {
  id: string;
  day_name: string;
  day_order: number;
  exercises: WorkoutExercise[];
  completed?: boolean;
}

export interface WorkoutPlan {
  id: string;
  trainer_id: string;
  client_id?: string;
  title: string;
  description: string;
  days: WorkoutDay[];
  is_active: boolean;
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  client_id: string;
  workout_day_title: string;
  date: string;
  duration_minutes: number;
  completed_exercises: {
    exercise_name: string;
    sets: { set_num: number; reps: number; weight_kg: number }[];
  }[];
  rpe_scale?: number; // 1 to 10 clinical Borg exertion scale
  notes?: string;
}

export interface GlucoseLog {
  id: string;
  client_id: string;
  date: string;
  time: string;
  glucose_mg_dl: number;
  reading_type: 'Fasting' | 'Pre-Meal' | '2h Post-Meal' | 'Bedtime';
  notes?: string;
}

export interface BloodPressureLog {
  id: string;
  client_id: string;
  date: string;
  systolic: number;
  diastolic: number;
  heart_rate_bpm: number;
  notes?: string;
}

export interface MealPlanItem {
  id: string;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  title: string;
  description: string;
  glycemic_index: 'Low' | 'Medium' | 'Zero Sugar';
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
}

export interface MealPlan {
  id: string;
  trainer_id: string;
  client_id?: string;
  title: string;
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  items: MealPlanItem[];
  is_active: boolean;
}

export interface MealLog {
  id: string;
  client_id: string;
  date: string;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  meal_name: string;
  photo_url?: string;
  glycemic_impact?: 'Low' | 'Medium' | 'High';
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  trainer_feedback?: string;
}

export interface ProgressRecord {
  id: string;
  client_id: string;
  date: string;
  weight_kg: number;
  waist_cm?: number;
  fasting_glucose_mg_dl?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  notes?: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  client_name: string;
  trainer_id: string;
  trainer_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  session_type: '1-on-1 Clinical Exercise Consultation' | 'Postpartum Diastasis & Pelvic Floor Check' | 'Diabetic Glucose & Nutrition Review';
  meeting_link?: string;
  notes?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'workout' | 'glucose' | 'appointment' | 'nutrition' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  user_name: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'refunded';
  item_type: 'program' | 'membership' | 'coaching_session';
  item_name: string;
  payment_method: string;
  razorpay_payment_id: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  author_role: string;
  read_time: string;
  tags: string[];
  published_at: string;
}

// ==============================================================================
// FITCOIN & ROLE ACCESS TYPES
// ==============================================================================

export type FitCoinTransactionType =
  | 'referral_reward'
  | 'referral_first_workout_bonus'
  | 'workout_reward'
  | 'trainer_session_reward'
  | 'admin_adjustment'
  | 'redemption'
  | 'reversal';

export interface FitCoinWallet {
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  updated_at: string;
}

export interface FitCoinTransaction {
  id: string;
  user_id: string;
  user_name?: string;
  amount: number; // positive = credit, negative = debit
  transaction_type: FitCoinTransactionType;
  source_reference: string;
  idempotency_key: string;
  description: string;
  created_by?: string;
  creator_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  is_active: boolean;
  total_uses: number;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referrer_name: string;
  referred_user_id: string;
  referred_user_name: string;
  referral_code: string;
  status: 'pending' | 'qualified' | 'rewarded' | 'rejected';
  qualified_at?: string;
  rewarded_at?: string;
  referrer_reward_amount: number;
  referred_reward_amount: number;
  first_workout_bonus_rewarded: boolean;
  created_at: string;
}

export interface WorkoutCompletion {
  id: string;
  client_id: string;
  client_name: string;
  workout_id: string;
  workout_title: string;
  status: 'in_progress' | 'completed_pending_review' | 'approved' | 'rewarded' | 'rejected';
  completed_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  reward_amount: number;
  reward_transaction_id?: string;
}

export interface TrainerAssignment {
  id: string;
  trainer_id: string;
  trainer_name: string;
  client_id: string;
  client_name: string;
  status: 'active' | 'paused' | 'completed' | 'terminated';
  created_at: string;
}

export interface FitCoinSettings {
  referral_referrer_reward: { amount: number; enabled: boolean };
  referral_referred_reward: { amount: number; enabled: boolean };
  referral_eligibility_criteria: {
    rule: 'verified_signup_and_first_login' | 'verified_signup_and_profile' | 'first_workout' | 'first_session';
    description: string;
  };
  referral_first_workout_bonus: { amount: number; enabled: boolean };
  default_workout_reward: { amount: number; enabled: boolean };
  workout_requires_trainer_review: { value: boolean };
  max_trainer_award_per_session: { amount: number; enabled: boolean };
  admin_manual_adjustments_enabled: { enabled: boolean; max_amount: number };
  reward_expiry_policy: { enabled: boolean; days: number };
  redemption_enabled: { enabled: boolean };
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  target_type: string;
  target_id: string;
  old_state?: any;
  new_state?: any;
  reason?: string;
  created_at: string;
}

