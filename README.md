# DOMAINFIT — ONLINE FITNESS & MANAGEMENT PLATFORM

DomainFit is a full-stack, responsive online fitness coaching and business management ecosystem. Designed for fitness businesses, independent coaches, nutrition specialists, and athletes to manage the entire online fitness journey through one integrated platform.

---

## 🌟 Key Architecture & Capabilities

1. **Public Marketing & Conversion Website**
   - High-impact editorial hero photography generated with Gemini
   - Interactive Client Dashboard preview directly on the home page
   - Curated fitness curriculums with detailed weekly periodization breakdowns
   - Faculty coach directory with verified credentials (NSCA-CSCS, ISSN, FRC)
   - Transparent membership pricing with monthly/annual toggle and 14-day guarantee
   - Client case studies with verified progression metrics and ethical disclaimers
   - Sports science educational CMS articles (`/blog`)

2. **Client Portal (`/dashboard`)**
   - Real-time consistency streak tracking
   - Today's workout directive & upcoming 1-on-1 coach video consultations
   - Interactive workout logger: set by set logging of weights (kg), reps, and completion
   - Biomechanics exercise demo video guide modal
   - Daily macronutrient progress bars (Protein, Carbohydrates, Healthy Fats, Calories)
   - Interactive daily hydration logger (+250ml, +500ml, +1,000ml, reset)
   - Recharts visual bodyweight trajectory analytics & biometric measurements
   - Appointment booking calendar with real-time slot conflict & double-booking prevention
   - Direct encrypted coach messaging channel

3. **Trainer Faculty Portal (`/trainer`)**
   - Athlete roster oversight with onboarding questionnaires & injury history
   - Interactive Workout Plan Builder with dynamic days, exercise volume, rep targets, and form cues
   - Nutrition Plan Builder with daily macro calculators and recipe templates
   - Availability calendar with custom hours, session durations, and rest buffers
   - Client direct chat thread

4. **Administrator Suite (`/admin`)**
   - Executive KPIs: Gross revenue, active faculty, published programs, attendance
   - User & Coach Management with role assignments (Client, Trainer, Admin)
   - Fitness Programs Catalog manager (create, publish, price, edit)
   - Membership subscription tier configuration
   - Unified appointment booking ledger with conflict prevention logs
   - Payment ledger with Razorpay sandbox integration and refund actions
   - Educational article CMS manager

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Vanilla CSS Design Tokens (`/src/app/globals.css`) with dark charcoal & lime-green theme (`#0B0D0C`, `#141815`, `#1B211D`, `#B7F34A`)
- **Typography**: Space Grotesk (Headings) & Inter (Body)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Payment Gateway**: Razorpay (Sandbox / Test Mode) with simulated verification
- **Database & Auth**: PostgreSQL through Supabase with Row Level Security (RLS)
- **Visual Assets**: Original high-resolution editorial fitness photography generated via Gemini

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🔐 Environment Variables (`.env.local`)

To link with a live Supabase project and live Razorpay credentials, configure `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Razorpay Configuration (Test Mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```

*Note: The platform features a graceful fallback simulation engine. If Supabase or Razorpay keys are omitted, all client, trainer, and admin interactive workflows operate with local persistent state and instant role switching.*

---

## 🗄️ Database Schema & RLS Migrations

The complete PostgreSQL migration script is provided in `supabase/schema.sql`. It includes:
- Normalized tables (`profiles`, `trainer_profiles`, `client_profiles`, `programs`, `workout_plans`, `workout_logs`, `meal_plans`, `meal_logs`, `appointments`, `messages`, `payments`)
- PostgreSQL Row Level Security (RLS) policies ensuring clients access only their records and trainers access only assigned clients.
