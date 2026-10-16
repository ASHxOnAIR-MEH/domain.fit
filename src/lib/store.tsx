'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  UserProfile,
  TrainerProfile,
  ClientProfile,
  Program,
  WorkoutPlan,
  WorkoutLog,
  MealPlan,
  MealLog,
  ProgressRecord,
  Appointment,
  Message,
  NotificationItem,
  PaymentTransaction,
  BlogPost,
  UserRole,
  GlucoseLog,
  BloodPressureLog,
  FitCoinWallet,
  FitCoinTransaction,
  FitCoinTransactionType,
  ReferralCode,
  Referral,
  WorkoutCompletion,
  TrainerAssignment,
  FitCoinSettings,
  AuditLog,
} from './types';

// Initial Profiles (Clients, Trainers, Administrators)
export const SEED_PROFILES: UserProfile[] = [
  {
    id: 'user-client-1',
    email: 'alex.carter@domainfit.io',
    full_name: 'Alex Carter',
    role: 'client',
    avatar_url: '/images/domainfit/home-fitness.jpg',
    phone: '+1 (555) 234-5678',
    created_at: '2026-08-10T10:00:00Z',
  },
  {
    id: 'user-client-2',
    email: 'anita.sharma@domainfit.io',
    full_name: 'Anita Sharma',
    role: 'client',
    avatar_url: '/images/domainfit/nutrition.jpg',
    phone: '+1 (555) 789-0123',
    created_at: '2026-09-01T11:00:00Z',
  },
  {
    id: 'user-client-3',
    email: 'robert.kapoor@domainfit.io',
    full_name: 'Robert Kapoor',
    role: 'client',
    avatar_url: '/images/domainfit/personal-coaching.jpg',
    phone: '+1 (555) 890-1234',
    created_at: '2026-09-15T14:30:00Z',
  },
  {
    id: 'user-trainer-1',
    email: 'marcus.vance@domainfit.io',
    full_name: 'Dr. Marcus Vance, PT, DPT',
    role: 'trainer',
    avatar_url: '/images/domainfit/trainer-marcus.jpg',
    phone: '+1 (555) 345-6789',
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'user-trainer-2',
    email: 'elena.rostova@domainfit.io',
    full_name: 'Elena Rostova, Pre/Postnatal Lead',
    role: 'trainer',
    avatar_url: '/images/domainfit/trainer-elena.jpg',
    phone: '+1 (555) 456-7890',
    created_at: '2026-02-20T11:00:00Z',
  },
  {
    id: 'user-trainer-3',
    email: 'david.kim@domainfit.io',
    full_name: 'David Kim, RD, CDCES',
    role: 'trainer',
    avatar_url: '/images/domainfit/trainer-david.jpg',
    phone: '+1 (555) 567-8901',
    created_at: '2026-03-01T08:30:00Z',
  },
  {
    id: 'user-admin-1',
    email: 'admin@domainfit.io',
    full_name: 'Elena Vance (Clinical Director)',
    role: 'admin',
    avatar_url: '/images/domainfit/trainer-elena.jpg',
    phone: '+1 (555) 999-0000',
    created_at: '2025-12-01T08:00:00Z',
  },
];

export const SEED_REFERRAL_CODES: ReferralCode[] = [
  {
    id: 'ref-code-1',
    user_id: 'user-client-1',
    code: 'ALEX2026',
    is_active: true,
    total_uses: 1,
    created_at: '2026-08-10T10:00:00Z',
  },
  {
    id: 'ref-code-2',
    user_id: 'user-client-2',
    code: 'ANITA2026',
    is_active: true,
    total_uses: 0,
    created_at: '2026-09-01T11:00:00Z',
  },
  {
    id: 'ref-code-3',
    user_id: 'user-client-3',
    code: 'ROBERT2026',
    is_active: true,
    total_uses: 0,
    created_at: '2026-09-15T14:30:00Z',
  },
];

export const SEED_REFERRALS: Referral[] = [
  {
    id: 'ref-row-1',
    referrer_id: 'user-client-1',
    referrer_name: 'Alex Carter',
    referred_user_id: 'user-client-2',
    referred_user_name: 'Anita Sharma',
    referral_code: 'ALEX2026',
    status: 'rewarded',
    qualified_at: '2026-09-01T11:05:00Z',
    rewarded_at: '2026-09-01T11:05:00Z',
    referrer_reward_amount: 50,
    referred_reward_amount: 25,
    first_workout_bonus_rewarded: true,
    created_at: '2026-09-01T11:00:00Z',
  },
];

export const SEED_WALLETS: Record<string, FitCoinWallet> = {
  'user-client-1': {
    user_id: 'user-client-1',
    balance: 145,
    total_earned: 145,
    total_spent: 0,
    updated_at: '2026-10-15T09:00:00Z',
  },
  'user-client-2': {
    user_id: 'user-client-2',
    balance: 40,
    total_earned: 40,
    total_spent: 0,
    updated_at: '2026-09-02T10:00:00Z',
  },
  'user-client-3': {
    user_id: 'user-client-3',
    balance: 30,
    total_earned: 30,
    total_spent: 0,
    updated_at: '2026-09-16T12:00:00Z',
  },
  'user-trainer-1': { user_id: 'user-trainer-1', balance: 0, total_earned: 0, total_spent: 0, updated_at: '2026-01-15T09:00:00Z' },
  'user-trainer-2': { user_id: 'user-trainer-2', balance: 0, total_earned: 0, total_spent: 0, updated_at: '2026-02-20T11:00:00Z' },
  'user-trainer-3': { user_id: 'user-trainer-3', balance: 0, total_earned: 0, total_spent: 0, updated_at: '2026-03-01T08:30:00Z' },
  'user-admin-1': { user_id: 'user-admin-1', balance: 0, total_earned: 0, total_spent: 0, updated_at: '2025-12-01T08:00:00Z' },
};

export const SEED_FITCOIN_TRANSACTIONS: FitCoinTransaction[] = [
  {
    id: 'tx-fc-1',
    user_id: 'user-client-1',
    user_name: 'Alex Carter',
    amount: 50,
    transaction_type: 'referral_reward',
    source_reference: 'referral:ref-row-1:referrer',
    idempotency_key: 'idemp-ref-row-1-referrer',
    description: 'Referral reward for inviting Anita Sharma',
    created_by: 'system',
    creator_name: 'DomainFit Referral Engine',
    created_at: '2026-09-01T11:05:00Z',
  },
  {
    id: 'tx-fc-2',
    user_id: 'user-client-1',
    user_name: 'Alex Carter',
    amount: 15,
    transaction_type: 'workout_reward',
    source_reference: 'workout:day-1',
    idempotency_key: 'idemp-workout-day-1-user-client-1',
    description: 'Completed: Day 1 Seated & Supported Muscle Activation',
    created_by: 'user-client-1',
    creator_name: 'Alex Carter',
    created_at: '2026-10-14T10:00:00Z',
  },
  {
    id: 'tx-fc-3',
    user_id: 'user-client-1',
    user_name: 'Alex Carter',
    amount: 30,
    transaction_type: 'trainer_session_reward',
    source_reference: 'appointment:apt-1',
    idempotency_key: 'idemp-apt-1',
    description: 'Coaching session: Outstanding 14-day glycemic log compliance',
    created_by: 'user-trainer-3',
    creator_name: 'David Kim, RD, CDCES',
    created_at: '2026-10-15T09:00:00Z',
  },
  {
    id: 'tx-fc-4',
    user_id: 'user-client-1',
    user_name: 'Alex Carter',
    amount: 50,
    transaction_type: 'referral_reward',
    source_reference: 'referral:welcome:user-client-1',
    idempotency_key: 'idemp-welcome-user-client-1',
    description: 'Welcome verification bonus on initial registration',
    created_by: 'system',
    creator_name: 'DomainFit Verification Engine',
    created_at: '2026-08-10T10:05:00Z',
  },
  {
    id: 'tx-fc-5',
    user_id: 'user-client-2',
    user_name: 'Anita Sharma',
    amount: 25,
    transaction_type: 'referral_reward',
    source_reference: 'referral:ref-row-1:referred',
    idempotency_key: 'idemp-ref-row-1-referred',
    description: 'Welcome referral reward (Referred by Alex Carter)',
    created_by: 'system',
    creator_name: 'DomainFit Referral Engine',
    created_at: '2026-09-01T11:05:00Z',
  },
  {
    id: 'tx-fc-6',
    user_id: 'user-client-2',
    user_name: 'Anita Sharma',
    amount: 15,
    transaction_type: 'workout_reward',
    source_reference: 'workout:anita-walk-1',
    idempotency_key: 'idemp-workout-anita-walk-1',
    description: 'Completed: Gentle Walking & Post-Meal Pacing',
    created_by: 'user-client-2',
    creator_name: 'Anita Sharma',
    created_at: '2026-09-02T10:00:00Z',
  },
];

export const SEED_WORKOUT_COMPLETIONS: WorkoutCompletion[] = [
  {
    id: 'wc-1',
    client_id: 'user-client-1',
    client_name: 'Alex Carter',
    workout_id: 'day-1',
    workout_title: 'Day 1: Seated & Supported Muscle Activation (Glucose Clearing)',
    status: 'rewarded',
    completed_at: '2026-10-14T10:00:00Z',
    reward_amount: 15,
    reward_transaction_id: 'tx-fc-2',
  },
];

export const SEED_TRAINER_ASSIGNMENTS: TrainerAssignment[] = [
  {
    id: 'ta-1',
    trainer_id: 'user-trainer-1',
    trainer_name: 'Dr. Marcus Vance, PT, DPT',
    client_id: 'user-client-1',
    client_name: 'Alex Carter',
    status: 'active',
    created_at: '2026-08-10T10:00:00Z',
  },
  {
    id: 'ta-2',
    trainer_id: 'user-trainer-3',
    trainer_name: 'David Kim, RD, CDCES',
    client_id: 'user-client-1',
    client_name: 'Alex Carter',
    status: 'active',
    created_at: '2026-08-12T11:00:00Z',
  },
  {
    id: 'ta-3',
    trainer_id: 'user-trainer-3',
    trainer_name: 'David Kim, RD, CDCES',
    client_id: 'user-client-2',
    client_name: 'Anita Sharma',
    status: 'active',
    created_at: '2026-09-01T11:00:00Z',
  },
  {
    id: 'ta-4',
    trainer_id: 'user-trainer-1',
    trainer_name: 'Dr. Marcus Vance, PT, DPT',
    client_id: 'user-client-3',
    client_name: 'Robert Kapoor',
    status: 'active',
    created_at: '2026-09-15T14:30:00Z',
  },
];

export const DEFAULT_FITCOIN_SETTINGS: FitCoinSettings = {
  referral_referrer_reward: { amount: 50, enabled: true },
  referral_referred_reward: { amount: 25, enabled: true },
  referral_eligibility_criteria: {
    rule: 'verified_signup_and_first_login',
    description: 'Verified email signup and successful initial sign in',
  },
  referral_first_workout_bonus: { amount: 20, enabled: true },
  default_workout_reward: { amount: 15, enabled: true },
  workout_requires_trainer_review: { value: false },
  max_trainer_award_per_session: { amount: 50, enabled: true },
  admin_manual_adjustments_enabled: { enabled: true, max_amount: 500 },
  reward_expiry_policy: { enabled: false, days: 365 },
  redemption_enabled: { enabled: false },
};

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    actor_id: 'user-admin-1',
    actor_name: 'Elena Vance (Clinical Director)',
    action: 'INITIALIZE_FITCOIN_SETTINGS',
    target_type: 'fitcoin_settings',
    target_id: 'global',
    new_state: DEFAULT_FITCOIN_SETTINGS,
    reason: 'Initial platform FitCoin economy provisioning',
    created_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'audit-2',
    actor_id: 'user-admin-1',
    actor_name: 'Elena Vance (Clinical Director)',
    action: 'POLICY_UPDATE',
    target_type: 'fitcoin_settings',
    target_id: 'max_trainer_award_per_session',
    old_state: { amount: 100 },
    new_state: { amount: 50 },
    reason: 'Clinical governance: capped session awards to 50 FitCoins to safeguard economy',
    created_at: '2026-09-01T10:00:00Z',
  },
];


export const SEED_TRAINERS: TrainerProfile[] = [
  {
    id: 'trainer-1',
    user_id: 'user-trainer-1',
    bio: 'Doctor of Physical Therapy and ACSM Certified Clinical Exercise Physiologist specializing in orthopedic rehab, chronic joint disease, and safe metabolic adaptations for non-gym clients.',
    specialties: ['Orthopedic Rehabilitation', 'Diabetic Neuropathy Safe Exercise', 'Joint-Friendly Resistance', 'Cardiac Safe Pacing'],
    qualifications: ['Doctor of Physical Therapy (DPT)', 'ACSM-CEP (Clinical Exercise Physiologist)', 'Certified Orthopedic Specialist'],
    experience_years: 11,
    rating: 4.97,
    client_count: 28,
    hourly_rate: 80,
    image_url: '/images/domainfit/trainer-marcus.jpg',
  },
  {
    id: 'trainer-2',
    user_id: 'user-trainer-2',
    bio: 'Pelvic health educator and certified Pre/Postnatal corrective exercise specialist. Dedicated to postpartum diastasis recti recovery, safe pelvic floor rehabilitation, and gentle prenatal movement at home.',
    specialties: ['Postpartum Core Rehab', 'Diastasis Recti Repair', 'Pelvic Floor Activation', 'Trimester-Safe Prenatal Movement'],
    qualifications: ['PCES (Postnatal Corrective Exercise Specialist)', 'Pelvic Floor Rehabilitation Educator', 'Pregnancy Fitness Certified'],
    experience_years: 8,
    rating: 4.99,
    client_count: 24,
    hourly_rate: 75,
    image_url: '/images/domainfit/trainer-elena.jpg',
  },
  {
    id: 'trainer-3',
    user_id: 'user-trainer-3',
    bio: 'Registered Dietitian and Certified Diabetes Care and Education Specialist (CDCES). Helps clients stabilize blood sugars, manage insulin resistance, and eat enjoyably without restrictive deprivation.',
    specialties: ['Type 2 Diabetes Glycemic Control', 'Insulin Sensitivity Nutrition', 'Postpartum Nutrient Repletion', 'Cardiovascular Health'],
    qualifications: ['Registered Dietitian (RD)', 'CDCES (Certified Diabetes Educator)', 'M.S. Clinical Nutrition'],
    experience_years: 10,
    rating: 4.95,
    client_count: 26,
    hourly_rate: 70,
    image_url: '/images/domainfit/trainer-david.jpg',
  },
];

export const SEED_PROGRAMS: Program[] = [
  {
    id: 'prog-diabetes-metabolic',
    title: 'Type 2 Diabetes & Insulin Sensitivity Protocol',
    slug: 'type-2-diabetes-metabolic',
    description: 'An evidence-based home movement protocol engineered to lower blood glucose spikes, improve GLUT-4 muscle glucose uptake, and support glycemic stability with gentle resistance bands and post-meal pacing.',
    image_url: '/images/domainfit/weight-management.jpg',
    category: 'Diabetes & Metabolic',
    difficulty: 'Low Impact',
    duration_weeks: 12,
    price: 3999,
    featured: true,
    included_services: [
      'Gentle low-impact muscle activation circuits (no heavy joint stress)',
      '15-minute post-meal glucose clearing walk guidance',
      'Daily blood glucose and fasting insulin log analysis',
      'Clinical consultation with Certified Diabetes Educator (CDCES)'
    ],
    target_audience: 'Individuals with Type 2 Diabetes, Prediabetes, or Insulin Resistance who need safe home exercise.',
    clinical_safeguards: [
      'Hypoglycemia precaution check before every session',
      'No high-impact jumping or intense valsalva maneuvers',
      'Foot-check protocol for peripheral neuropathy safety'
    ],
    trainer_id: 'trainer-3',
  },
  {
    id: 'prog-postpartum-pelvic',
    title: 'Postpartum Core & Pelvic Floor Rehabilitation',
    slug: 'postpartum-core-pelvic-rehab',
    description: 'A gentle, physician-aligned 12-week rehabilitation journey for new mothers. Repair diastasis recti, restore deep transverse abdominis control, and rehabilitate pelvic floor stability safely from your living room.',
    image_url: '/images/domainfit/home-fitness.jpg',
    category: 'Postpartum & Pelvic',
    difficulty: 'Gentle Rehabilitation',
    duration_weeks: 12,
    price: 3499,
    featured: true,
    included_services: [
      'Diastasis recti width and depth self-check monitoring',
      'Breath-synchronized transverse abdominis and pelvic floor activation',
      'Safe lifting and stroller-posture ergonomics guidance',
      'Bi-weekly video review with Pre/Postnatal Corrective Specialist'
    ],
    target_audience: 'Mothers 6+ weeks postpartum (vaginal or C-section) recovering from pregnancy abdominal separation or pelvic weakness.',
    clinical_safeguards: [
      'Strict prohibition of crunches, sit-ups, or intra-abdominal pressure spikes',
      'C-section scar tissue gentle desensitization cues',
      'Physician or OB/GYN clearance verification'
    ],
    trainer_id: 'trainer-2',
  },
  {
    id: 'prog-prenatal-safe',
    title: 'Prenatal Safe Movement & Trimester Mobility',
    slug: 'prenatal-safe-movement',
    description: 'Nurturing, trimester-adapted home movement to alleviate lower back pressure, prevent pelvic girdle pain (PGP), and maintain stamina for labor and delivery.',
    image_url: '/images/domainfit/mobility.jpg',
    category: 'Prenatal',
    difficulty: 'Gentle Rehabilitation',
    duration_weeks: 8,
    price: 2999,
    featured: false,
    included_services: [
      'Trimester-specific gentle movement flows',
      'Sacroiliac joint and round ligament relief exercises',
      'Labor preparation pelvic opening & breathing exercises',
      'Direct messaging with Prenatal Fitness Educator'
    ],
    target_audience: 'Expectant mothers seeking safe, low-stress physical activity and postural comfort during pregnancy.',
    clinical_safeguards: [
      'No supine (flat-on-back) exercises past 16 weeks gestation',
      'Zero balance hazards or unstable single-leg risks',
      'Continuous hydration and heart-rate conversation test'
    ],
    trainer_id: 'trainer-2',
  },
  {
    id: 'prog-joint-friendly-arthritis',
    title: 'Arthritis & Joint-Friendly Home Conditioning',
    slug: 'arthritis-joint-friendly',
    description: 'Protect arthritic knees, hips, and spines with non-impact chair-supported strength, isometric tension, and end-range synovial fluid circulation.',
    image_url: '/images/domainfit/personal-coaching.jpg',
    category: 'Joint & Orthopedic',
    difficulty: 'Low Impact',
    duration_weeks: 10,
    price: 3499,
    featured: true,
    included_services: [
      'Chair-assisted & seated resistance band strength routines',
      'Joint synovial lubrication morning routines',
      'Pain-scale tracking before and after sessions',
      'Physical Therapist guidance on flare-up pacing'
    ],
    target_audience: 'Adults with osteoarthritis, chronic back pain, or orthopedic conditions unable to perform standard gym exercises.',
    clinical_safeguards: [
      'Zero high-impact axial spinal loading',
      'Stop-rule on sharp joint sensations',
      'Custom chair and cushion adaptation guides'
    ],
    trainer_id: 'trainer-1',
  },
  {
    id: 'prog-hypertension-cardiac',
    title: 'Cardiac-Safe Pacing & Hypertension Management',
    slug: 'cardiac-safe-pacing',
    description: 'Gentle Zone-2 steady movement protocols designed to lower arterial resistance, manage resting blood pressure, and improve daily functional stamina.',
    image_url: '/images/domainfit/endurance.jpg',
    category: 'Cardiac & BP',
    difficulty: 'Gradual Progression',
    duration_weeks: 8,
    price: 3499,
    featured: false,
    included_services: [
      'RPE (Borg Scale 1-10) guided cardio walking flows',
      'Pre- and post-session blood pressure monitoring log',
      'Breathing-regulated cool-downs to prevent postural hypotension',
      'Doctor-coordinated exercise pacing'
    ],
    target_audience: 'Individuals with elevated blood pressure, mild hypertension, or cardiac deconditioning needing home exercise.',
    clinical_safeguards: [
      'Mandatory BP check before exertion (> 160/100 mmHg pause rule)',
      'No breath-holding (valsalva) during resistance movements',
      'Extended 10-minute warm-up and cool-down periods'
    ],
    trainer_id: 'trainer-1',
  },
  {
    id: 'prog-clinical-nutrition',
    title: 'Clinical Low-Glycemic Diabetes Nutrition Mastery',
    slug: 'clinical-diabetes-nutrition',
    description: 'Transform your metabolic health through clinical carbohydrate pacing, soluble fiber prioritization, and balanced meals that prevent insulin spikes.',
    image_url: '/images/domainfit/nutrition.jpg',
    category: 'Clinical Nutrition',
    difficulty: 'Low Impact',
    duration_weeks: 8,
    price: 2999,
    featured: false,
    included_services: [
      'Glycemic Index & Glycemic Load meal sequencing guide',
      'Personalized carbohydrate budgeting per meal',
      'Daily meal photo glycemic review by Registered Dietitian',
      'Restaurant dining and family cooking playbooks'
    ],
    target_audience: 'Diabetic and prediabetic clients, or postpartum mothers seeking balanced energy and hormone recovery.',
    clinical_safeguards: [
      'No extreme ketogenic or starvation protocols',
      'Safe carbohydrate minimums for medication compatibility',
      'Direct coordination with patient physician'
    ],
    trainer_id: 'trainer-3',
  },
];

export const SEED_WORKOUT_PLAN: WorkoutPlan = {
  id: 'plan-med-1',
  trainer_id: 'trainer-1',
  client_id: 'user-client-1',
  title: 'Gentle Metabolic & Joint-Safe Home Movement',
  description: 'Low-impact resistance band exercises designed to clear blood glucose without joint inflammation or elevated blood pressure spikes.',
  is_active: true,
  created_at: '2026-10-01T09:00:00Z',
  days: [
    {
      id: 'day-1',
      day_name: 'Day 1: Seated & Supported Muscle Activation (Glucose Clearing)',
      day_order: 1,
      completed: true,
      exercises: [
        {
          id: 'ex-1',
          exercise_name: 'Chair-Assisted Squat to Box',
          target_sets: 3,
          target_reps: '8-10 reps',
          rest_seconds: 60,
          notes: 'Tap hips lightly to chair, press through heels while exhaling. Activates large quad & glute muscles for glucose uptake.',
          clinical_caution: 'Do not hold breath. Maintain steady rhythmic nasal breathing.',
        },
        {
          id: 'ex-2',
          exercise_name: 'Seated Resistance Band Chest Press',
          target_sets: 3,
          target_reps: '10-12 reps',
          rest_seconds: 60,
          notes: 'Anchor band behind back or chair. Smooth forward press without locking elbows.',
          clinical_caution: 'Avoid hunching shoulders to protect neck and cervical spine.',
        },
        {
          id: 'ex-3',
          exercise_name: 'Standing Resistance Band Row',
          target_sets: 3,
          target_reps: '10-12 reps',
          rest_seconds: 60,
          notes: 'Squeeze shoulder blades gently together to relieve desk worker thoracic strain.',
          clinical_caution: 'Gentle tension only; keep elbows close to ribcage.',
        },
      ],
    },
    {
      id: 'day-2',
      day_name: 'Day 2: Core Stabilization & Diaphragmatic Breathwork',
      day_order: 2,
      completed: false,
      exercises: [
        {
          id: 'ex-4',
          exercise_name: 'Diaphragmatic 360 Breathing with Pelvic Floor Activation',
          target_sets: 3,
          target_reps: '8 deep cycles',
          rest_seconds: 45,
          notes: 'Inhale into sides of ribs, gentle pelvic floor release. Exhale gently drawing navel toward spine.',
          clinical_caution: 'Safe for diastasis recti and blood pressure stabilization.',
        },
        {
          id: 'ex-5',
          exercise_name: 'Supine Alternating Heel Slides',
          target_sets: 3,
          target_reps: '8 per leg',
          rest_seconds: 60,
          notes: 'Keep lower back resting comfortably flat on mat. Slide heel out and gently pull back with core.',
          clinical_caution: 'Zero coning or doming of the abdominal midline.',
        },
        {
          id: 'ex-6',
          exercise_name: 'Quadruped Bird-Dog (Arm & Leg Extension)',
          target_sets: 3,
          target_reps: '6-8 per side',
          rest_seconds: 60,
          notes: 'Slow, steady limb reach. Maintain neutral spine without sagging into lumbar.',
          clinical_caution: 'If balance is sensitive, perform arm reach only.',
        },
      ],
    },
    {
      id: 'day-3',
      day_name: 'Day 3: Low-Impact Post-Meal Walk & Mobility Flow',
      day_order: 3,
      completed: false,
      exercises: [
        {
          id: 'ex-7',
          exercise_name: 'Post-Meal Zone-1 Rhythmic Indoor / Outdoor Walk',
          target_sets: 1,
          target_reps: '15-20 minutes',
          rest_seconds: 0,
          notes: 'Start 20 minutes after lunch or dinner. Conversation pace to enhance insulin receptor sensitivity.',
          clinical_caution: 'Stay hydrated; check blood sugar before and after.',
        },
        {
          id: 'ex-8',
          exercise_name: 'Supported Wall Calf & Hamstring Gentle Stretch',
          target_sets: 2,
          target_reps: '30s hold per side',
          rest_seconds: 30,
          notes: 'Gentle calf stretch against wall to promote lower-limb venous circulation.',
          clinical_caution: 'Gentle tension only, no bouncing.',
        },
      ],
    },
  ],
};

export const SEED_MEAL_PLAN: MealPlan = {
  id: 'mealplan-med-1',
  trainer_id: 'trainer-3',
  client_id: 'user-client-1',
  title: 'Low-Glycemic & Insulin-Stabilizing Nutrition Plan',
  daily_calories: 1850,
  protein_g: 110,
  carbs_g: 145,
  fats_g: 55,
  is_active: true,
  items: [
    {
      id: 'item-1',
      meal_type: 'Breakfast',
      title: 'Chia Seed & Berry Fiber Bowl with Cinnamon',
      description: '3 tbsp chia seeds soaked in unsweetened almond milk, Ceylon cinnamon (promotes insulin sensitivity), fresh blueberries, and crushed walnuts.',
      glycemic_index: 'Low',
      calories: 380,
      protein_g: 16,
      carbs_g: 28,
      fats_g: 22,
    },
    {
      id: 'item-2',
      meal_type: 'Lunch',
      title: 'Mediterranean Grilled Chicken & Green Lentil Salad',
      description: '140g roasted lemon-herb chicken breast, 1/2 cup cooked green lentils, cucumbers, cherry tomatoes, and cold-pressed extra virgin olive oil.',
      glycemic_index: 'Low',
      calories: 520,
      protein_g: 44,
      carbs_g: 36,
      fats_g: 18,
    },
    {
      id: 'item-3',
      meal_type: 'Dinner',
      title: 'Baked Wild Salmon with Steamed Broccoli & Roasted Zucchini',
      description: '150g baked omega-3 rich salmon fillet with steamed garlic broccoli florets, sautéed spinach, and 1/3 cup brown basmati rice.',
      glycemic_index: 'Low',
      calories: 490,
      protein_g: 42,
      carbs_g: 26,
      fats_g: 18,
    },
    {
      id: 'item-4',
      meal_type: 'Snacks',
      title: 'Raw Almonds & Unsweetened Greek Yogurt',
      description: '150g plain unsweetened Greek yogurt with 15 raw almonds (delivers slow protein and healthy fats to prevent glucose dips).',
      glycemic_index: 'Zero Sugar',
      calories: 240,
      protein_g: 18,
      carbs_g: 8,
      fats_g: 14,
    },
  ],
};

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-med-1',
    title: 'How 15-Minute Post-Meal Walks Dramatically Blunt Blood Sugar Spikes',
    slug: 'post-meal-walks-blood-sugar',
    excerpt: 'Clinical research reveals that light muscle contractions within 30 minutes of eating clear glucose from the bloodstream via non-insulin pathways.',
    content: 'For individuals managing Type 2 Diabetes or insulin resistance, timing physical movement matters as much as exercise intensity. When skeletal muscle contracts gently after a meal, GLUT-4 glucose transporters translocate to the cell surface independently of insulin, transporting glucose directly out of the bloodstream and preventing post-prandial glycemic excursions.',
    cover_image: '/images/domainfit/home-fitness.jpg',
    author: 'David Kim, RD, CDCES',
    author_role: 'Certified Diabetes Educator',
    read_time: '5 min read',
    tags: ['Type 2 Diabetes', 'Blood Sugar', 'Metabolic Health'],
    published_at: 'Oct 14, 2026',
  },
  {
    id: 'post-med-2',
    title: 'The Postpartum Core: Healing Diastasis Recti Without Harmful Crunches',
    slug: 'postpartum-diastasis-recti-healing',
    excerpt: 'Why traditional sit-ups worsen abdominal separation, and how breath-synchronized transverse abdominis activation restores pelvic stability.',
    content: 'During pregnancy, the linea alba connective tissue stretches to accommodate fetal growth. Traditional abdominal crunches create excessive forward intra-abdominal pressure, causing outward coning or doming that inhibits connective tissue recovery. By re-educating the transverse abdominis and pelvic floor with 360-degree diaphragmatic breathing, new mothers safely restore midline tension.',
    cover_image: '/images/domainfit/mobility.jpg',
    author: 'Elena Rostova, PCES',
    author_role: 'Pre/Postnatal Specialist',
    read_time: '6 min read',
    tags: ['Postpartum', 'Diastasis Recti', 'Pelvic Health'],
    published_at: 'Oct 10, 2026',
  },
  {
    id: 'post-med-3',
    title: 'Home Fitness for Severe Knee Arthritis: Synovial Fluid & Isometric Pacing',
    slug: 'home-fitness-knee-arthritis',
    excerpt: 'Joint movement is joint lubrication. How seated and chair-assisted exercises preserve cartilage without high-impact degradation.',
    content: 'Cartilage is an avascular tissue that depends on cyclic compression and decompression to absorb nutrients from synovial fluid. Complete rest accelerates joint stiffness. By performing supported isometric knee extensions and gentle chair squats, patients with osteoarthritis stimulate joint lubrication and strengthen supporting tendons with zero ground-reaction impact.',
    cover_image: '/images/domainfit/personal-coaching.jpg',
    author: 'Dr. Marcus Vance, PT, DPT',
    author_role: 'Doctor of Physical Therapy',
    read_time: '7 min read',
    tags: ['Joint Health', 'Arthritis', 'Physical Therapy'],
    published_at: 'Oct 04, 2026',
  },
];

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  allProfiles: UserProfile[];
  trainers: TrainerProfile[];
  programs: Program[];
  workoutPlan: WorkoutPlan;
  setWorkoutPlan: React.Dispatch<React.SetStateAction<WorkoutPlan>>;
  mealPlan: MealPlan;
  workoutLogs: WorkoutLog[];
  logWorkout: (log: Omit<WorkoutLog, 'id'>) => void;
  glucoseLogs: GlucoseLog[];
  logGlucose: (log: Omit<GlucoseLog, 'id'>) => void;
  bpLogs: BloodPressureLog[];
  logBloodPressure: (bp: Omit<BloodPressureLog, 'id'>) => void;
  mealLogs: MealLog[];
  logMeal: (meal: Omit<MealLog, 'id'>) => void;
  waterIntakeMl: number;
  addWater: (amount: number) => void;
  resetWater: () => void;
  progressRecords: ProgressRecord[];
  addProgressRecord: (record: Omit<ProgressRecord, 'id'>) => void;
  appointments: Appointment[];
  bookAppointment: (booking: Omit<Appointment, 'id' | 'status'>) => { success: boolean; error?: string };
  cancelAppointment: (id: string) => void;
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  transactions: PaymentTransaction[];
  createPayment: (amount: number, itemName: string, itemType: 'program' | 'membership') => Promise<{ success: boolean; transactionId: string }>;
  clientStreak: number;
  incrementStreak: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  clientProfile: ClientProfile;
  updateClientProfile: (updates: Partial<ClientProfile>) => void;
  createProgram: (newProg: Omit<Program, 'id'>) => void;

  // FITCOIN & ROLES
  wallets: Record<string, FitCoinWallet>;
  fitcoinTransactions: FitCoinTransaction[];
  referralCodes: ReferralCode[];
  referrals: Referral[];
  workoutCompletions: WorkoutCompletion[];
  trainerAssignments: TrainerAssignment[];
  fitcoinSettings: FitCoinSettings;
  auditLogs: AuditLog[];
  getCurrentUserWallet: () => FitCoinWallet;
  issueFitcoinTransaction: (params: {
    userId: string;
    amount: number;
    type: FitCoinTransactionType;
    sourceReference: string;
    idempotencyKey: string;
    description: string;
    createdBy?: string;
    creatorName?: string;
    metadata?: Record<string, any>;
  }) => { success: boolean; error?: string; transactionId?: string; newBalance?: number };
  awardReferralReward: (referralId: string) => { success: boolean; error?: string };
  completeWorkoutAndReward: (
    workoutId: string,
    workoutTitle: string
  ) => { success: boolean; error?: string; status: WorkoutCompletion['status']; rewardAmount: number };
  trainerReviewWorkout: (
    completionId: string,
    approved: boolean,
    notes?: string
  ) => { success: boolean; error?: string };
  trainerAwardSessionFitcoins: (
    appointmentId: string,
    amount: number,
    reason?: string
  ) => { success: boolean; error?: string; transactionId?: string };
  adminAdjustFitcoins: (
    targetUserId: string,
    amount: number,
    reason: string
  ) => { success: boolean; error?: string; transactionId?: string };
  adminReverseFitcoinTransaction: (
    transactionId: string,
    reason: string
  ) => { success: boolean; error?: string; transactionId?: string };
  updateFitcoinSetting: <K extends keyof FitCoinSettings>(
    key: K,
    value: FitCoinSettings[K]
  ) => { success: boolean; error?: string };
  registerClient: (
    fullName: string,
    email: string,
    password: string,
    referralCodeInput?: string
  ) => { success: boolean; error?: string; user?: UserProfile };
  loginWithRole: (
    email: string,
    password: string,
    requiredRole?: UserRole
  ) => { success: boolean; error?: string; user?: UserProfile };
  assignClientToTrainer: (clientId: string, trainerId: string) => { success: boolean; error?: string };
  toggleTrainerStatus: (trainerUserId: string, isActive: boolean) => { success: boolean; error?: string };
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(SEED_PROFILES[0]);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(SEED_PROFILES);
  const [trainers] = useState<TrainerProfile[]>(SEED_TRAINERS);
  const [programs, setPrograms] = useState<Program[]>(SEED_PROGRAMS);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>(SEED_WORKOUT_PLAN);
  const [mealPlan, setMealPlan] = useState<MealPlan>(SEED_MEAL_PLAN);

  // FITCOIN & ROLE ACCESS STATE
  const [wallets, setWallets] = useState<Record<string, FitCoinWallet>>(SEED_WALLETS);
  const [fitcoinTransactions, setFitcoinTransactions] = useState<FitCoinTransaction[]>(SEED_FITCOIN_TRANSACTIONS);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>(SEED_REFERRAL_CODES);
  const [referrals, setReferrals] = useState<Referral[]>(SEED_REFERRALS);
  const [workoutCompletions, setWorkoutCompletions] = useState<WorkoutCompletion[]>(SEED_WORKOUT_COMPLETIONS);
  const [trainerAssignments, setTrainerAssignments] = useState<TrainerAssignment[]>(SEED_TRAINER_ASSIGNMENTS);
  const [fitcoinSettings, setFitcoinSettings] = useState<FitCoinSettings>(DEFAULT_FITCOIN_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);


  // Client Profile tailored for clinical & medical rehabilitation
  const [clientProfile, setClientProfile] = useState<ClientProfile>({
    id: 'client-1',
    user_id: 'user-client-1',
    trainer_id: 'trainer-3',
    current_program_id: 'prog-diabetes-metabolic',
    goal: 'Regulate Fasting Blood Glucose & Rebuild Gentle Core Stability at Home',
    medical_conditions: ['Type 2 Diabetes (Managed)', 'Mild Postpartum Pelvic Weakness', 'Sedentary Knee Stiffness'],
    hba1c_percent: 6.4,
    target_glucose_fasting_mg_dl: 95,
    postpartum_stage: '5 Months Postpartum',
    fitness_level: 'Gentle / Rehabilitation',
    height_cm: 165,
    weight_kg: 72.4,
    target_weight_kg: 68.0,
    dietary_preferences: ['Low Glycemic', 'High Soluble Fiber', 'Zero Refined Sugars'],
    injuries_notes: 'Cannot attend commercial gym due to medical care schedule. Requires seated and band adaptations.',
    streak_days: 14,
    onboarding_completed: true,
    physician_clearance_status: 'Coordinated with Doctor',
  });

  // Glucose logs
  const [glucoseLogs, setGlucoseLogs] = useState<GlucoseLog[]>([
    { id: 'gluc-1', client_id: 'user-client-1', date: '2026-10-13', time: '07:30', glucose_mg_dl: 118, reading_type: 'Fasting', notes: 'Woke up, feeling rested' },
    { id: 'gluc-2', client_id: 'user-client-1', date: '2026-10-13', time: '14:30', glucose_mg_dl: 134, reading_type: '2h Post-Meal', notes: 'After lentil salad & 15m walk' },
    { id: 'gluc-3', client_id: 'user-client-1', date: '2026-10-14', time: '07:45', glucose_mg_dl: 112, reading_type: 'Fasting', notes: 'Consistent improvement' },
    { id: 'gluc-4', client_id: 'user-client-1', date: '2026-10-15', time: '07:30', glucose_mg_dl: 108, reading_type: 'Fasting', notes: 'Lowest fasting reading this month!' },
  ]);

  // Blood Pressure logs
  const [bpLogs, setBpLogs] = useState<BloodPressureLog[]>([
    { id: 'bp-1', client_id: 'user-client-1', date: '2026-10-13', systolic: 124, diastolic: 82, heart_rate_bpm: 72, notes: 'Pre-workout check' },
    { id: 'bp-2', client_id: 'user-client-1', date: '2026-10-15', systolic: 120, diastolic: 78, heart_rate_bpm: 68, notes: 'Post-walk reading normal' },
  ]);

  // Workout Logs
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([
    {
      id: 'log-1',
      client_id: 'user-client-1',
      workout_day_title: 'Day 1: Seated & Supported Muscle Activation (Glucose Clearing)',
      date: '2026-10-14',
      duration_minutes: 28,
      rpe_scale: 4,
      completed_exercises: [
        {
          exercise_name: 'Chair-Assisted Squat to Box',
          sets: [
            { set_num: 1, reps: 10, weight_kg: 0 },
            { set_num: 2, reps: 10, weight_kg: 0 },
            { set_num: 3, reps: 8, weight_kg: 0 },
          ],
        },
      ],
      notes: 'No knee discomfort. Kept breathing steady, blood sugar tested 116 mg/dL 45 mins later.',
    },
  ]);

  // Meal Logs
  const [mealLogs, setMealLogs] = useState<MealLog[]>([
    {
      id: 'meal-log-1',
      client_id: 'user-client-1',
      date: '2026-10-15',
      meal_type: 'Breakfast',
      meal_name: 'Chia Seed & Berry Fiber Bowl with Cinnamon',
      photo_url: '/images/domainfit/nutrition.jpg',
      glycemic_impact: 'Low',
      calories: 380,
      protein_g: 16,
      carbs_g: 28,
      fats_g: 22,
      trainer_feedback: 'Excellent breakfast choice Alex. The soluble fiber from chia and cinnamon blunted morning glucose response perfectly.',
    },
  ]);

  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(2250);

  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([
    { id: 'prog-1', client_id: 'user-client-1', date: '2026-09-01', weight_kg: 74.2, fasting_glucose_mg_dl: 128, systolic_bp: 130 },
    { id: 'prog-2', client_id: 'user-client-1', date: '2026-09-15', weight_kg: 73.6, fasting_glucose_mg_dl: 122, systolic_bp: 126 },
    { id: 'prog-3', client_id: 'user-client-1', date: '2026-10-01', weight_kg: 73.0, fasting_glucose_mg_dl: 114, systolic_bp: 122 },
    { id: 'prog-4', client_id: 'user-client-1', date: '2026-10-14', weight_kg: 72.4, fasting_glucose_mg_dl: 108, systolic_bp: 120 },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      client_id: 'user-client-1',
      client_name: 'Alex Carter',
      trainer_id: 'trainer-3',
      trainer_name: 'David Kim, RD, CDCES',
      session_date: '2026-10-17',
      start_time: '10:00',
      end_time: '10:45',
      status: 'confirmed',
      session_type: 'Diabetic Glucose & Nutrition Review',
      meeting_link: 'https://meet.domainfit.io/clinical-alex-david',
      notes: 'Review 14-day fasting blood glucose trend and adjust soluble fiber timing.',
    },
    {
      id: 'apt-2',
      client_id: 'user-client-1',
      client_name: 'Alex Carter',
      trainer_id: 'trainer-2',
      trainer_name: 'Elena Rostova, Pre/Postnatal Lead',
      session_date: '2026-10-21',
      start_time: '14:00',
      end_time: '14:45',
      status: 'confirmed',
      session_type: 'Postpartum Diastasis & Pelvic Floor Check',
      meeting_link: 'https://meet.domainfit.io/pelvic-check-alex-elena',
      notes: 'Evaluate midline transverse abdominis tone and update gentle home glute bridges.',
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender_id: 'user-trainer-3',
      sender_name: 'David Kim, RD, CDCES',
      receiver_id: 'user-client-1',
      content: 'Alex, your fasting glucose dropped to 108 mg/dL this morning! That 15-minute post-dinner walk is making a measurable difference to your insulin response.',
      created_at: '2026-10-15T08:15:00Z',
      is_read: true,
    },
    {
      id: 'msg-2',
      sender_id: 'user-client-1',
      sender_name: 'Alex Carter',
      receiver_id: 'user-trainer-3',
      content: 'Thank you David! My knees felt completely fine with the chair squats yesterday. Very glad I can do all of this safely from home.',
      created_at: '2026-10-15T08:45:00Z',
      is_read: true,
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      user_id: 'user-client-1',
      title: 'Post-Meal Walking Prompt',
      message: 'Finished lunch? Take a gentle 15-minute walk to assist glucose clearing.',
      type: 'glucose',
      is_read: false,
      created_at: '2026-10-15T13:00:00Z',
    },
    {
      id: 'notif-2',
      user_id: 'user-client-1',
      title: 'Clinical Feedback Received',
      message: 'David Kim reviewed your breakfast log and fasting glucose entry.',
      type: 'glucose',
      is_read: false,
      created_at: '2026-10-15T08:20:00Z',
    },
  ]);

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: 'tx-1',
      user_id: 'user-client-1',
      user_name: 'Alex Carter',
      amount: 3999,
      currency: 'INR',
      status: 'succeeded',
      item_type: 'program',
      item_name: 'Type 2 Diabetes & Insulin Sensitivity Protocol (12 Weeks)',
      payment_method: 'Razorpay UPI (Test)',
      razorpay_payment_id: 'pay_test_MED88A92',
      created_at: '2026-08-10T10:30:00Z',
    },
    {
      id: 'tx-2',
      user_id: 'user-client-1',
      user_name: 'Alex Carter',
      amount: 3499,
      currency: 'INR',
      status: 'succeeded',
      item_type: 'membership',
      item_name: 'DomainFit Clinical Coached Membership',
      payment_method: 'Razorpay Card (Test)',
      razorpay_payment_id: 'pay_test_CLINIC90',
      created_at: '2026-10-01T12:00:00Z',
    },
  ]);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: UserRole) => {
    const target = SEED_PROFILES.find((p) => p.role === role) || SEED_PROFILES[0];
    setCurrentUser(target);
    addToast(`Switched active view to ${target.full_name} (${role.toUpperCase()})`, 'info');
  };

  const logWorkout = (log: Omit<WorkoutLog, 'id'>) => {
    const newLog: WorkoutLog = {
      ...log,
      id: `log-${Date.now()}`,
    };
    setWorkoutLogs((prev) => [newLog, ...prev]);
    setClientProfile((prev) => ({
      ...prev,
      streak_days: prev.streak_days + 1,
    }));
    addToast('Gentle home session logged! Consistency streak updated.', 'success');
  };

  const logGlucose = (reading: Omit<GlucoseLog, 'id'>) => {
    const newLog: GlucoseLog = {
      ...reading,
      id: `gluc-${Date.now()}`,
    };
    setGlucoseLogs((prev) => [newLog, ...prev]);
    addToast(`Blood glucose logged: ${reading.glucose_mg_dl} mg/dL (${reading.reading_type})`, 'success');
  };

  const logBloodPressure = (bp: Omit<BloodPressureLog, 'id'>) => {
    const newLog: BloodPressureLog = {
      ...bp,
      id: `bp-${Date.now()}`,
    };
    setBpLogs((prev) => [newLog, ...prev]);
    addToast(`Blood pressure recorded: ${bp.systolic}/${bp.diastolic} mmHg`, 'success');
  };

  const logMeal = (meal: Omit<MealLog, 'id'>) => {
    const newMeal: MealLog = {
      ...meal,
      id: `meal-${Date.now()}`,
    };
    setMealLogs((prev) => [newMeal, ...prev]);
    addToast(`${meal.meal_name} added to your clinical nutrition log!`, 'success');
  };

  const addWater = (amount: number) => {
    setWaterIntakeMl((prev) => {
      const next = prev + amount;
      addToast(`Logged +${amount}ml water. Total: ${next}ml`, 'info');
      return next;
    });
  };

  const resetWater = () => {
    setWaterIntakeMl(0);
    addToast('Daily water log reset', 'info');
  };

  const addProgressRecord = (record: Omit<ProgressRecord, 'id'>) => {
    const newRec: ProgressRecord = {
      ...record,
      id: `prog-${Date.now()}`,
    };
    setProgressRecords((prev) => [...prev, newRec]);
    setClientProfile((prev) => ({ ...prev, weight_kg: record.weight_kg }));
    addToast(`Clinical check-in recorded: ${record.weight_kg}kg!`, 'success');
  };

  const bookAppointment = (booking: Omit<Appointment, 'id' | 'status'>) => {
    const conflict = appointments.some(
      (apt) =>
        apt.trainer_id === booking.trainer_id &&
        apt.session_date === booking.session_date &&
        apt.start_time === booking.start_time &&
        apt.status !== 'cancelled'
    );

    if (conflict) {
      addToast('Specialist already has a clinical consultation at this time. Please select another slot.', 'error');
      return { success: false, error: 'Slot conflict: Specialist already scheduled at this time' };
    }

    const newApt: Appointment = {
      ...booking,
      id: `apt-${Date.now()}`,
      status: 'confirmed',
      meeting_link: `https://meet.domainfit.io/clinical-${Date.now()}`,
    };

    setAppointments((prev) => [newApt, ...prev]);
    addToast('Consultation confirmed with your clinical specialist!', 'success');
    return { success: true };
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
    addToast('Appointment cancelled according to clinical policy.', 'info');
  };

  const sendMessage = (receiverId: string, content: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    addToast('Message sent to clinical coach', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const createPayment = async (
    amount: number,
    itemName: string,
    itemType: 'program' | 'membership'
  ): Promise<{ success: boolean; transactionId: string }> => {
    const txId = `pay_med_test_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      amount,
      currency: 'INR',
      status: 'succeeded',
      item_type: itemType,
      item_name: itemName,
      payment_method: 'Razorpay Test Mode',
      razorpay_payment_id: txId,
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    addToast(`Payment of ₹${amount.toLocaleString()} confirmed via Razorpay Test!`, 'success');
    return { success: true, transactionId: txId };
  };

  const incrementStreak = () => {
    setClientProfile((prev) => ({ ...prev, streak_days: prev.streak_days + 1 }));
  };

  const updateClientProfile = (updates: Partial<ClientProfile>) => {
    setClientProfile((prev) => ({ ...prev, ...updates }));
    addToast('Clinical profile updated successfully!', 'success');
  };

  const createProgram = (newProg: Omit<Program, 'id'>) => {
    const prog: Program = {
      ...newProg,
      id: `prog-${Date.now()}`,
    };
    setPrograms((prev) => [prog, ...prev]);
    addToast(`Medical track "${prog.title}" published!`, 'success');
  };

  // ==============================================================================
  // FITCOIN & ROLE ACCESS METHODS
  // ==============================================================================

  const getCurrentUserWallet = (): FitCoinWallet => {
    return (
      wallets[currentUser.id] || {
        user_id: currentUser.id,
        balance: 0,
        total_earned: 0,
        total_spent: 0,
        updated_at: new Date().toISOString(),
      }
    );
  };

  const issueFitcoinTransaction = ({
    userId,
    amount,
    type,
    sourceReference,
    idempotencyKey,
    description,
    createdBy = currentUser.id,
    creatorName = currentUser.full_name,
    metadata = {},
  }: {
    userId: string;
    amount: number;
    type: FitCoinTransactionType;
    sourceReference: string;
    idempotencyKey: string;
    description: string;
    createdBy?: string;
    creatorName?: string;
    metadata?: Record<string, any>;
  }) => {
    // 1. Idempotency check: if transaction with this key exists, return idempotent success
    const existing = fitcoinTransactions.find((t) => t.idempotency_key === idempotencyKey);
    if (existing) {
      return {
        success: true,
        transactionId: existing.id,
        newBalance: wallets[userId]?.balance || 0,
        error: 'Transaction already processed (Idempotent)',
      };
    }

    // 2. Balance check for debits
    const currentWallet = wallets[userId] || {
      user_id: userId,
      balance: 0,
      total_earned: 0,
      total_spent: 0,
      updated_at: new Date().toISOString(),
    };

    const newBalance = currentWallet.balance + amount;
    if (newBalance < 0) {
      addToast('Insufficient FitCoin balance for this operation', 'error');
      return { success: false, error: 'Insufficient balance: FitCoin balance cannot be negative' };
    }

    const txId = `tx-fc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const targetUser = allProfiles.find((p) => p.id === userId);

    const newTx: FitCoinTransaction = {
      id: txId,
      user_id: userId,
      user_name: targetUser?.full_name || 'Client',
      amount,
      transaction_type: type,
      source_reference: sourceReference,
      idempotency_key: idempotencyKey,
      description,
      created_by: createdBy,
      creator_name: creatorName,
      metadata,
      created_at: new Date().toISOString(),
    };

    // Update wallet atomically
    setWallets((prev) => ({
      ...prev,
      [userId]: {
        user_id: userId,
        balance: newBalance,
        total_earned: amount > 0 ? currentWallet.total_earned + amount : currentWallet.total_earned,
        total_spent: amount < 0 ? currentWallet.total_spent + Math.abs(amount) : currentWallet.total_spent,
        updated_at: new Date().toISOString(),
      },
    }));

    // Append to ledger
    setFitcoinTransactions((prev) => [newTx, ...prev]);

    // In-app notification
    const notif: NotificationItem = {
      id: `notif-fc-${Date.now()}`,
      user_id: userId,
      title: amount >= 0 ? 'FitCoins Credited! 🪙' : 'FitCoins Debited',
      message: `${description} (${amount >= 0 ? '+' : ''}${amount} FitCoins)`,
      type: 'system',
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      amount >= 0
        ? `+${amount} FitCoins credited! (${description})`
        : `${amount} FitCoins debited: ${description}`,
      amount >= 0 ? 'success' : 'info'
    );

    return { success: true, transactionId: txId, newBalance };
  };

  const awardReferralReward = (referralId: string) => {
    const ref = referrals.find((r) => r.id === referralId);
    if (!ref) return { success: false, error: 'Referral attribution not found' };
    if (ref.status === 'rewarded') {
      return { success: false, error: 'Referral rewards have already been issued' };
    }

    const referrerCoins = fitcoinSettings.referral_referrer_reward.enabled
      ? fitcoinSettings.referral_referrer_reward.amount
      : 0;
    const referredCoins = fitcoinSettings.referral_referred_reward.enabled
      ? fitcoinSettings.referral_referred_reward.amount
      : 0;

    if (referrerCoins > 0) {
      issueFitcoinTransaction({
        userId: ref.referrer_id,
        amount: referrerCoins,
        type: 'referral_reward',
        sourceReference: `referral:${ref.id}:referrer`,
        idempotencyKey: `idemp-ref-${ref.id}-referrer`,
        description: `Referral reward for inviting ${ref.referred_user_name}`,
        createdBy: 'system',
        creatorName: 'DomainFit Referral Engine',
        metadata: { referral_id: ref.id, referred_user_id: ref.referred_user_id },
      });
    }

    if (referredCoins > 0) {
      issueFitcoinTransaction({
        userId: ref.referred_user_id,
        amount: referredCoins,
        type: 'referral_reward',
        sourceReference: `referral:${ref.id}:referred`,
        idempotencyKey: `idemp-ref-${ref.id}-referred`,
        description: `Welcome referral bonus (Invited by ${ref.referrer_name})`,
        createdBy: 'system',
        creatorName: 'DomainFit Referral Engine',
        metadata: { referral_id: ref.id, referrer_id: ref.referrer_id },
      });
    }

    setReferrals((prev) =>
      prev.map((r) =>
        r.id === referralId
          ? {
              ...r,
              status: 'rewarded',
              qualified_at: new Date().toISOString(),
              rewarded_at: new Date().toISOString(),
              referrer_reward_amount: referrerCoins,
              referred_reward_amount: referredCoins,
            }
          : r
      )
    );

    return { success: true };
  };

  const completeWorkoutAndReward = (
    workoutId: string,
    workoutTitle: string
  ): { success: boolean; error?: string; status: WorkoutCompletion['status']; rewardAmount: number } => {
    const idempKey = `idemp-workout-${workoutId}-${currentUser.id}`;
    const existingCompletion = workoutCompletions.find(
      (wc) => wc.client_id === currentUser.id && wc.workout_id === workoutId
    );

    if (
      existingCompletion &&
      (existingCompletion.status === 'rewarded' ||
        existingCompletion.status === 'completed_pending_review')
    ) {
      addToast('This workout has already been recorded and rewarded!', 'info');
      return {
        success: true,
        status: existingCompletion.status,
        rewardAmount: existingCompletion.reward_amount,
      };
    }

    const requiresReview = fitcoinSettings.workout_requires_trainer_review.value;
    const rewardAmount = fitcoinSettings.default_workout_reward.enabled
      ? fitcoinSettings.default_workout_reward.amount
      : 0;

    if (requiresReview) {
      const comp: WorkoutCompletion = {
        id: `wc-${Date.now()}`,
        client_id: currentUser.id,
        client_name: currentUser.full_name,
        workout_id: workoutId,
        workout_title: workoutTitle,
        status: 'completed_pending_review',
        completed_at: new Date().toISOString(),
        reward_amount: rewardAmount,
      };
      setWorkoutCompletions((prev) => [comp, ...prev]);
      addToast('Workout completed! Submitted for trainer verification before FitCoins are released.', 'info');
      return { success: true, status: 'completed_pending_review', rewardAmount };
    } else {
      // Immediate automated reward
      const txRes = issueFitcoinTransaction({
        userId: currentUser.id,
        amount: rewardAmount,
        type: 'workout_reward',
        sourceReference: `workout:${workoutId}`,
        idempotencyKey: idempKey,
        description: `Completed: ${workoutTitle}`,
        createdBy: currentUser.id,
        creatorName: currentUser.full_name,
      });

      const comp: WorkoutCompletion = {
        id: `wc-${Date.now()}`,
        client_id: currentUser.id,
        client_name: currentUser.full_name,
        workout_id: workoutId,
        workout_title: workoutTitle,
        status: 'rewarded',
        completed_at: new Date().toISOString(),
        reward_amount: rewardAmount,
        reward_transaction_id: txRes.transactionId,
      };
      setWorkoutCompletions((prev) => [comp, ...prev]);

      // Check first-workout referral bonus
      if (fitcoinSettings.referral_first_workout_bonus.enabled) {
        const activeRef = referrals.find(
          (r) => r.referred_user_id === currentUser.id && !r.first_workout_bonus_rewarded
        );
        if (activeRef) {
          issueFitcoinTransaction({
            userId: currentUser.id,
            amount: fitcoinSettings.referral_first_workout_bonus.amount,
            type: 'referral_first_workout_bonus',
            sourceReference: `referral:${activeRef.id}:first_workout`,
            idempotencyKey: `idemp-first-workout-${currentUser.id}`,
            description: 'Special bonus: First completed workout milestone!',
            createdBy: 'system',
            creatorName: 'DomainFit Milestone Engine',
          });
          setReferrals((prev) =>
            prev.map((r) =>
              r.id === activeRef.id ? { ...r, first_workout_bonus_rewarded: true } : r
            )
          );
        }
      }

      return { success: true, status: 'rewarded', rewardAmount };
    }
  };

  const trainerReviewWorkout = (completionId: string, approved: boolean, notes = '') => {
    const comp = workoutCompletions.find((wc) => wc.id === completionId);
    if (!comp) return { success: false, error: 'Workout completion not found' };
    if (comp.status !== 'completed_pending_review') {
      return { success: false, error: 'Workout is not pending review' };
    }

    if (approved) {
      const txRes = issueFitcoinTransaction({
        userId: comp.client_id,
        amount: comp.reward_amount,
        type: 'workout_reward',
        sourceReference: `workout:${comp.workout_id}`,
        idempotencyKey: `idemp-workout-${comp.workout_id}-${comp.client_id}`,
        description: `Approved workout: ${comp.workout_title} (Reviewed by ${currentUser.full_name})`,
        createdBy: currentUser.id,
        creatorName: currentUser.full_name,
      });

      setWorkoutCompletions((prev) =>
        prev.map((wc) =>
          wc.id === completionId
            ? {
                ...wc,
                status: 'rewarded',
                reviewed_by: currentUser.id,
                reviewed_at: new Date().toISOString(),
                review_notes: notes,
                reward_transaction_id: txRes.transactionId,
              }
            : wc
        )
      );
      addToast(`Workout approved and ${comp.reward_amount} FitCoins awarded to ${comp.client_name}!`, 'success');
    } else {
      setWorkoutCompletions((prev) =>
        prev.map((wc) =>
          wc.id === completionId
            ? {
                ...wc,
                status: 'rejected',
                reviewed_by: currentUser.id,
                reviewed_at: new Date().toISOString(),
                review_notes: notes,
              }
            : wc
        )
      );
      addToast(`Workout submission rejected for ${comp.client_name}.`, 'info');
    }

    return { success: true };
  };

  const trainerAwardSessionFitcoins = (appointmentId: string, amount: number, reason = '') => {
    if (currentUser.role !== 'trainer') {
      return { success: false, error: 'Only authorized trainers can award coaching session FitCoins' };
    }

    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) {
      return { success: false, error: 'Coaching appointment not found' };
    }

    // Prevent self-awarding
    if (apt.client_id === currentUser.id) {
      return { success: false, error: 'Security violation: Trainers cannot award FitCoins to themselves' };
    }

    // Check assignment or match
    const isAssigned =
      trainerAssignments.some(
        (ta) =>
          ta.trainer_id === currentUser.id &&
          ta.client_id === apt.client_id &&
          ta.status === 'active'
      ) ||
      appointments.some((a) => a.id === appointmentId && (a.trainer_id === currentUser.id || a.trainer_name.includes(currentUser.full_name)));

    if (!isAssigned) {
      return { success: false, error: 'Security violation: Trainer is not assigned to this client' };
    }

    // Validate amount limits from admin settings
    const maxLimit = fitcoinSettings.max_trainer_award_per_session.amount;
    if (amount <= 0 || amount > maxLimit) {
      return {
        success: false,
        error: `Award amount must be between 1 and ${maxLimit} FitCoins per session`,
      };
    }

    // Check if session has already been rewarded
    const idempKey = `idemp-session-reward-${appointmentId}`;
    const existing = fitcoinTransactions.find((t) => t.idempotency_key === idempKey);
    if (existing) {
      return { success: false, error: 'This coaching session has already received a FitCoin reward' };
    }

    // Issue transaction
    const txRes = issueFitcoinTransaction({
      userId: apt.client_id,
      amount,
      type: 'trainer_session_reward',
      sourceReference: `appointment:${appointmentId}`,
      idempotencyKey: idempKey,
      description: reason
        ? `Coaching session: ${reason}`
        : `Completed 1-on-1 coaching session with ${currentUser.full_name}`,
      createdBy: currentUser.id,
      creatorName: currentUser.full_name,
      metadata: { appointment_id: appointmentId, session_type: apt.session_type, notes: reason },
    });

    // Mark appointment completed
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'completed' } : a))
    );

    return { success: true, transactionId: txRes.transactionId };
  };

  const adminAdjustFitcoins = (targetUserId: string, amount: number, reason: string) => {
    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator privileges required' };
    }

    if (!fitcoinSettings.admin_manual_adjustments_enabled.enabled) {
      return { success: false, error: 'Manual FitCoin adjustments are currently disabled by platform policy' };
    }

    const maxAdj = fitcoinSettings.admin_manual_adjustments_enabled.max_amount;
    if (Math.abs(amount) > maxAdj) {
      return { success: false, error: `Adjustment exceeds maximum permitted limit of ${maxAdj} FitCoins` };
    }

    const idempKey = `idemp-admin-adj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const txRes = issueFitcoinTransaction({
      userId: targetUserId,
      amount,
      type: 'admin_adjustment',
      sourceReference: `admin_adj:${currentUser.id}:${Date.now()}`,
      idempotencyKey: idempKey,
      description: `Administrative adjustment: ${reason}`,
      createdBy: currentUser.id,
      creatorName: currentUser.full_name,
      metadata: { reason, adjusted_by: currentUser.full_name },
    });

    if (!txRes.success) return txRes;

    // Record audit log
    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: 'ADMIN_FITCOIN_ADJUSTMENT',
      target_type: 'fitcoin_wallet',
      target_id: targetUserId,
      new_state: { amount, new_balance: txRes.newBalance },
      reason,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return { success: true, transactionId: txRes.transactionId };
  };

  const adminReverseFitcoinTransaction = (transactionId: string, reason: string) => {
    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator privileges required' };
    }

    const origTx = fitcoinTransactions.find((t) => t.id === transactionId);
    if (!origTx) return { success: false, error: 'Transaction not found in ledger' };

    if (origTx.transaction_type === 'reversal') {
      return { success: false, error: 'Cannot reverse a reversal transaction' };
    }

    // Check if already reversed
    const alreadyReversed = fitcoinTransactions.some(
      (t) => t.source_reference === `reversal:${transactionId}`
    );
    if (alreadyReversed) {
      return { success: false, error: 'This transaction has already been reversed' };
    }

    const revAmount = -1 * origTx.amount;
    const idempKey = `idemp-rev-${transactionId}`;

    const txRes = issueFitcoinTransaction({
      userId: origTx.user_id,
      amount: revAmount,
      type: 'reversal',
      sourceReference: `reversal:${transactionId}`,
      idempotencyKey: idempKey,
      description: `Auditable Reversal: ${reason}`,
      createdBy: currentUser.id,
      creatorName: currentUser.full_name,
      metadata: { original_tx_id: transactionId, original_type: origTx.transaction_type, reason },
    });

    if (!txRes.success) return txRes;

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: 'TRANSACTION_REVERSAL',
      target_type: 'fitcoin_transaction',
      target_id: transactionId,
      old_state: origTx,
      new_state: { reversal_tx_id: txRes.transactionId, reversed_amount: revAmount },
      reason,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return { success: true, transactionId: txRes.transactionId };
  };

  const updateFitcoinSetting = <K extends keyof FitCoinSettings>(key: K, value: FitCoinSettings[K]) => {
    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin role required to update reward rules' };
    }

    const oldVal = fitcoinSettings[key];
    setFitcoinSettings((prev) => ({ ...prev, [key]: value }));

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: 'UPDATE_FITCOIN_SETTING',
      target_type: 'fitcoin_settings',
      target_id: String(key),
      old_state: oldVal,
      new_state: value,
      reason: `Platform setting updated by ${currentUser.full_name}`,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);
    addToast(`FitCoin policy "${String(key)}" updated!`, 'success');
    return { success: true };
  };

  const registerClient = (
    fullName: string,
    email: string,
    password: string,
    referralCodeInput = ''
  ) => {
    if (allProfiles.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUserId = `user-client-${Date.now()}`;
    const newProfile: UserProfile = {
      id: newUserId,
      email: email.toLowerCase(),
      full_name: fullName,
      role: 'client', // STRICT: new public registrations ALWAYS get client role!
      avatar_url: '/images/domainfit/home-fitness.jpg',
      created_at: new Date().toISOString(),
    };

    setAllProfiles((prev) => [newProfile, ...prev]);
    setCurrentUser(newProfile);

    // Generate unique personal referral code
    const cleanCode = fullName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '') || 'FIT';
    const uniqueCode = `${cleanCode}${Math.floor(1000 + Math.random() * 9000)}`;
    const refCodeObj: ReferralCode = {
      id: `ref-code-${Date.now()}`,
      user_id: newUserId,
      code: uniqueCode,
      is_active: true,
      total_uses: 0,
      created_at: new Date().toISOString(),
    };
    setReferralCodes((prev) => [refCodeObj, ...prev]);

    // Initialize empty wallet
    setWallets((prev) => ({
      ...prev,
      [newUserId]: {
        user_id: newUserId,
        balance: 0,
        total_earned: 0,
        total_spent: 0,
        updated_at: new Date().toISOString(),
      },
    }));

    // Handle referral code attribution if provided
    if (referralCodeInput.trim()) {
      const trimmedCode = referralCodeInput.trim().toUpperCase();
      const matchedRef = referralCodes.find(
        (rc) => rc.code.toUpperCase() === trimmedCode && rc.is_active
      );

      if (matchedRef) {
        if (matchedRef.user_id === newUserId) {
          addToast('Self-referrals are not permitted', 'error');
        } else {
          const referrerUser = allProfiles.find((p) => p.id === matchedRef.user_id);
          const refRow: Referral = {
            id: `ref-row-${Date.now()}`,
            referrer_id: matchedRef.user_id,
            referrer_name: referrerUser?.full_name || 'Member',
            referred_user_id: newUserId,
            referred_user_name: fullName,
            referral_code: matchedRef.code,
            status: 'qualified',
            qualified_at: new Date().toISOString(),
            referrer_reward_amount: 0,
            referred_reward_amount: 0,
            first_workout_bonus_rewarded: false,
            created_at: new Date().toISOString(),
          };
          setReferrals((prev) => [refRow, ...prev]);

          // Increment referral code usage count
          setReferralCodes((prev) =>
            prev.map((rc) =>
              rc.id === matchedRef.id ? { ...rc, total_uses: rc.total_uses + 1 } : rc
            )
          );

          // If rule is verified_signup_and_first_login, issue rewards immediately!
          if (
            fitcoinSettings.referral_eligibility_criteria.rule === 'verified_signup_and_first_login'
          ) {
            setTimeout(() => {
              awardReferralReward(refRow.id);
            }, 300);
          }
        }
      }
    }

    addToast(`Welcome to DomainFit, ${fullName}! Your client profile has been created.`, 'success');
    return { success: true, user: newProfile };
  };

  const loginWithRole = (email: string, password: string, requiredRole?: UserRole) => {
    const matched = allProfiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (!matched) {
      return { success: false, error: 'Invalid email address or credentials' };
    }

    // Security check: ensure user possesses the required role
    if (requiredRole && matched.role !== requiredRole) {
      return {
        success: false,
        error: `Access Denied: Account does not have ${requiredRole.toUpperCase()} credentials. Please use the /login/${matched.role} portal.`,
      };
    }

    setCurrentUser(matched);
    addToast(`Authenticated as ${matched.full_name} (${matched.role.toUpperCase()})`, 'success');
    return { success: true, user: matched };
  };

  const assignClientToTrainer = (clientId: string, trainerId: string) => {
    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin privileges required' };
    }
    const clientUser = allProfiles.find((p) => p.id === clientId);
    const trainerUser = allProfiles.find((p) => p.id === trainerId);
    if (!clientUser || !trainerUser) return { success: false, error: 'User not found' };

    const assignment: TrainerAssignment = {
      id: `ta-${Date.now()}`,
      trainer_id: trainerId,
      trainer_name: trainerUser.full_name,
      client_id: clientId,
      client_name: clientUser.full_name,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setTrainerAssignments((prev) => [assignment, ...prev]);
    addToast(`Assigned ${clientUser.full_name} to coach ${trainerUser.full_name}`, 'success');
    return { success: true };
  };

  const toggleTrainerStatus = (trainerUserId: string, isActive: boolean) => {
    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin privileges required' };
    }
    addToast(`Trainer account ${isActive ? 'activated' : 'deactivated'}`, 'info');
    return { success: true };
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        allProfiles,
        trainers,
        programs,
        workoutPlan,
        setWorkoutPlan,
        mealPlan,
        workoutLogs,
        logWorkout,
        glucoseLogs,
        logGlucose,
        bpLogs,
        logBloodPressure,
        mealLogs,
        logMeal,
        waterIntakeMl,
        addWater,
        resetWater,
        progressRecords,
        addProgressRecord,
        appointments,
        bookAppointment,
        cancelAppointment,
        messages,
        sendMessage,
        notifications,
        markNotificationRead,
        transactions,
        createPayment,
        clientStreak: clientProfile.streak_days,
        incrementStreak,
        toasts,
        addToast,
        removeToast,
        clientProfile,
        updateClientProfile,
        createProgram,

        // FitCoin & Roles
        wallets,
        fitcoinTransactions,
        referralCodes,
        referrals,
        workoutCompletions,
        trainerAssignments,
        fitcoinSettings,
        auditLogs,
        getCurrentUserWallet,
        issueFitcoinTransaction,
        awardReferralReward,
        completeWorkoutAndReward,
        trainerReviewWorkout,
        trainerAwardSessionFitcoins,
        adminAdjustFitcoins,
        adminReverseFitcoinTransaction,
        updateFitcoinSetting,
        registerClient,
        loginWithRole,
        assignClientToTrainer,
        toggleTrainerStatus,
      }}
    >
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: '#1B211D',
              borderLeft: `4px solid ${
                toast.type === 'success'
                  ? 'var(--accent-primary)'
                  : toast.type === 'error'
                  ? 'var(--status-error)'
                  : 'var(--status-info)'
              }`,
              borderTop: '1px solid var(--border-color)',
              borderRight: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: 'var(--text-muted)',
                fontSize: '1.2rem',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
