-- ==============================================================================
-- DOMAINFIT MIGRATION: ROLE-BASED ACCESS CONTROL, REFERRALS & FITCOIN REWARDS
-- ==============================================================================

-- 1. Ensure extensions and ENUM
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('client', 'trainer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. TRAINER ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.trainer_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'paused', 'completed', 'terminated')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_active_trainer_client UNIQUE (trainer_id, client_id, status)
);

CREATE INDEX IF NOT EXISTS idx_trainer_assignments_trainer ON public.trainer_assignments(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_assignments_client ON public.trainer_assignments(client_id);

-- 3. REFERRAL CODES TABLE
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  total_uses INTEGER DEFAULT 0 NOT NULL CHECK (total_uses >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(UPPER(code));

-- 4. REFERRALS ATTRIBUTION TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'qualified', 'rewarded', 'rejected')),
  qualified_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  referrer_reward_amount INTEGER DEFAULT 0 NOT NULL,
  referred_reward_amount INTEGER DEFAULT 0 NOT NULL,
  first_workout_bonus_rewarded BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT prevent_self_referral CHECK (referrer_id <> referred_user_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_user_id);

-- 5. WORKOUT COMPLETIONS TABLE
CREATE TABLE IF NOT EXISTS public.workout_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  workout_id TEXT NOT NULL,
  workout_title TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress' NOT NULL CHECK (status IN ('in_progress', 'completed_pending_review', 'approved', 'rewarded', 'rejected')),
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT DEFAULT '',
  reward_transaction_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_client_workout_completion UNIQUE (client_id, workout_id)
);

CREATE INDEX IF NOT EXISTS idx_workout_completions_client ON public.workout_completions(client_id);

-- 6. FITCOIN WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.fitcoin_wallets (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance INTEGER DEFAULT 0 NOT NULL CHECK (balance >= 0),
  total_earned INTEGER DEFAULT 0 NOT NULL CHECK (total_earned >= 0),
  total_spent INTEGER DEFAULT 0 NOT NULL CHECK (total_spent >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. FITCOIN TRANSACTIONS TABLE (LEDGER)
CREATE TABLE IF NOT EXISTS public.fitcoin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (
    transaction_type IN (
      'referral_reward',
      'referral_first_workout_bonus',
      'workout_reward',
      'trainer_session_reward',
      'admin_adjustment',
      'redemption',
      'reversal'
    )
  ),
  source_reference TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fitcoin_tx_user ON public.fitcoin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_fitcoin_tx_type ON public.fitcoin_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_fitcoin_tx_created ON public.fitcoin_transactions(created_at DESC);

-- 8. FITCOIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.fitcoin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT NOT NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed default FitCoin settings
INSERT INTO public.fitcoin_settings (key, value, description)
VALUES
  ('referral_referrer_reward', '{"amount": 50, "enabled": true}'::jsonb, 'FitCoins awarded to the referrer upon qualification'),
  ('referral_referred_reward', '{"amount": 25, "enabled": true}'::jsonb, 'FitCoins awarded to the newly referred client upon qualification'),
  ('referral_eligibility_criteria', '{"rule": "verified_signup_and_first_login", "description": "Verified email signup and successful initial sign in"}'::jsonb, 'Rule required for referral qualification'),
  ('referral_first_workout_bonus', '{"amount": 20, "enabled": true}'::jsonb, 'Optional extra referral bonus on completion of first workout'),
  ('default_workout_reward', '{"amount": 15, "enabled": true}'::jsonb, 'FitCoins awarded for completing an assigned workout session'),
  ('workout_requires_trainer_review', '{"value": false}'::jsonb, 'Whether workout rewards require trainer review before crediting'),
  ('max_trainer_award_per_session', '{"amount": 50, "enabled": true}'::jsonb, 'Maximum FitCoins a trainer can award for a completed coaching session'),
  ('admin_manual_adjustments_enabled', '{"enabled": true, "max_amount": 500}'::jsonb, 'Allow administrative manual credit/debit adjustments up to maximum'),
  ('reward_expiry_policy', '{"enabled": false, "days": 365}'::jsonb, 'Optional expiration policy for unused FitCoin balances'),
  ('redemption_enabled', '{"enabled": false}'::jsonb, 'Flag reserved for future marketplace merchandise/subscription redemption')
ON CONFLICT (key) DO NOTHING;

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  old_state JSONB,
  new_state JSONB,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.trainer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitcoin_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitcoin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitcoin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- TRAINER ASSIGNMENTS:
CREATE POLICY "Clients can view their trainer assignments"
  ON public.trainer_assignments FOR SELECT
  USING (client_id = auth.uid() OR trainer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins manage trainer assignments"
  ON public.trainer_assignments FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- REFERRAL CODES:
CREATE POLICY "Users can view their own referral code"
  ON public.referral_codes FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can lookup active referral codes"
  ON public.referral_codes FOR SELECT
  USING (is_active = true);

-- REFERRALS:
CREATE POLICY "Users can view referrals they are involved in"
  ON public.referrals FOR SELECT
  USING (referrer_id = auth.uid() OR referred_user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- WORKOUT COMPLETIONS:
CREATE POLICY "Clients can manage their own workout completions"
  ON public.workout_completions FOR ALL
  USING (
    client_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.trainer_assignments ta WHERE ta.trainer_id = auth.uid() AND ta.client_id = workout_completions.client_id) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- FITCOIN WALLETS: (STRICT SECURITY - No user can write directly)
CREATE POLICY "Users view own wallet balance"
  ON public.fitcoin_wallets FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- FITCOIN TRANSACTIONS: (STRICT SECURITY - No user can insert or modify directly)
CREATE POLICY "Users view own transactions"
  ON public.fitcoin_transactions FOR SELECT
  USING (
    user_id = auth.uid() OR 
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- FITCOIN SETTINGS:
CREATE POLICY "Settings are readable by authenticated users"
  ON public.fitcoin_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update fitcoin settings"
  ON public.fitcoin_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- AUDIT LOGS:
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ==============================================================================
-- ATOMIC POSTGRESQL FUNCTIONS (SECURITY DEFINER)
-- ==============================================================================

-- 1. Atomic Transaction Processor
CREATE OR REPLACE FUNCTION public.issue_fitcoin_transaction(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_source_ref TEXT,
  p_idempotency_key TEXT,
  p_description TEXT,
  p_created_by UUID,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER := 0;
  v_new_balance INTEGER := 0;
  v_tx_id UUID;
  v_existing_tx RECORD;
BEGIN
  -- Idempotency check: if transaction with this key already processed, return existing
  SELECT * INTO v_existing_tx FROM public.fitcoin_transactions WHERE idempotency_key = p_idempotency_key;
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_processed', true,
      'transaction_id', v_existing_tx.id,
      'amount', v_existing_tx.amount,
      'message', 'Transaction already executed idempotently'
    );
  END IF;

  -- Ensure wallet row exists with row lock
  INSERT INTO public.fitcoin_wallets (user_id, balance, total_earned, total_spent, updated_at)
  VALUES (p_user_id, 0, 0, 0, NOW())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT balance INTO v_current_balance
  FROM public.fitcoin_wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Verify non-negative balance constraint
  v_new_balance := v_current_balance + p_amount;
  IF v_new_balance < 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient FitCoin balance for debit operation'
    );
  END IF;

  -- Insert ledger entry
  INSERT INTO public.fitcoin_transactions (
    user_id,
    amount,
    transaction_type,
    source_reference,
    idempotency_key,
    description,
    created_by,
    metadata,
    created_at
  ) VALUES (
    p_user_id,
    p_amount,
    p_type,
    p_source_ref,
    p_idempotency_key,
    p_description,
    p_created_by,
    p_metadata,
    NOW()
  ) RETURNING id INTO v_tx_id;

  -- Update wallet totals
  UPDATE public.fitcoin_wallets
  SET
    balance = v_new_balance,
    total_earned = CASE WHEN p_amount > 0 THEN total_earned + p_amount ELSE total_earned END,
    total_spent = CASE WHEN p_amount < 0 THEN total_spent + ABS(p_amount) ELSE total_spent END,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Add in-app notification
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    created_at
  ) VALUES (
    p_user_id,
    CASE WHEN p_amount >= 0 THEN 'FitCoins Credited! 🪙' ELSE 'FitCoins Debited' END,
    p_description || ' (' || CASE WHEN p_amount >= 0 THEN '+' ELSE '' END || p_amount::text || ' FitCoins)',
    'system',
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_tx_id,
    'new_balance', v_new_balance,
    'amount', p_amount
  );
END;
$$;

-- 2. Process Qualified Referral Rewards
CREATE OR REPLACE FUNCTION public.process_referral_reward(
  p_referral_id UUID,
  p_actor_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ref RECORD;
  v_ref_settings RECORD;
  v_referrer_coins INTEGER := 50;
  v_referred_coins INTEGER := 25;
  v_res1 JSONB;
  v_res2 JSONB;
BEGIN
  SELECT * INTO v_ref FROM public.referrals WHERE id = p_referral_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Referral attribution not found');
  END IF;

  IF v_ref.status = 'rewarded' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Referral rewards have already been issued');
  END IF;

  -- Read configured settings
  SELECT (value->>'amount')::int INTO v_referrer_coins
  FROM public.fitcoin_settings WHERE key = 'referral_referrer_reward';
  
  SELECT (value->>'amount')::int INTO v_referred_coins
  FROM public.fitcoin_settings WHERE key = 'referral_referred_reward';

  -- Issue reward to referrer
  v_res1 := public.issue_fitcoin_transaction(
    v_ref.referrer_id,
    COALESCE(v_referrer_coins, 50),
    'referral_reward',
    'referral:' || v_ref.id::text || ':referrer',
    'idemp-ref-' || v_ref.id::text || '-referrer',
    'Referral bonus for inviting client',
    p_actor_id,
    jsonb_build_object('referral_id', v_ref.id, 'referred_user_id', v_ref.referred_user_id)
  );

  -- Issue reward to referred user
  v_res2 := public.issue_fitcoin_transaction(
    v_ref.referred_user_id,
    COALESCE(v_referred_coins, 25),
    'referral_reward',
    'referral:' || v_ref.id::text || ':referred',
    'idemp-ref-' || v_ref.id::text || '-referred',
    'Welcome referral reward for joining DomainFit',
    p_actor_id,
    jsonb_build_object('referral_id', v_ref.id, 'referrer_id', v_ref.referrer_id)
  );

  -- Mark referral rewarded
  UPDATE public.referrals
  SET
    status = 'rewarded',
    qualified_at = COALESCE(qualified_at, NOW()),
    rewarded_at = NOW(),
    referrer_reward_amount = COALESCE(v_referrer_coins, 50),
    referred_reward_amount = COALESCE(v_referred_coins, 25)
  WHERE id = p_referral_id;

  RETURN jsonb_build_object('success', true, 'message', 'Referral rewards issued successfully');
END;
$$;

-- 3. Trainer Session Reward Function
CREATE OR REPLACE FUNCTION public.trainer_award_session_fitcoins(
  p_appointment_id UUID,
  p_trainer_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_apt RECORD;
  v_max_allowed INTEGER := 50;
  v_res JSONB;
BEGIN
  -- Verify appointment exists
  SELECT a.*, cp.user_id as client_user_id, tp.user_id as trainer_user_id
  INTO v_apt
  FROM public.appointments a
  JOIN public.client_profiles cp ON cp.id = a.client_id
  JOIN public.trainer_profiles tp ON tp.id = a.trainer_id
  WHERE a.id = p_appointment_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Coaching appointment not found');
  END IF;

  -- Ensure trainer owns session or matches trainer_user_id
  IF v_apt.trainer_user_id <> p_trainer_id AND v_apt.trainer_id::text <> p_trainer_id::text THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Trainer not assigned to this session');
  END IF;

  -- Prevent self-awarding
  IF v_apt.client_user_id = p_trainer_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Security Violation: Trainers cannot award FitCoins to themselves');
  END IF;

  -- Read maximum allowed award limit
  SELECT (value->>'amount')::int INTO v_max_allowed
  FROM public.fitcoin_settings WHERE key = 'max_trainer_award_per_session';

  IF p_amount <= 0 OR p_amount > COALESCE(v_max_allowed, 50) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Award amount must be between 1 and ' || COALESCE(v_max_allowed, 50)::text || ' FitCoins'
    );
  END IF;

  -- Check if session already completed & rewarded
  IF v_apt.status = 'completed' THEN
    -- Check if transaction already exists for this appointment
    IF EXISTS (SELECT 1 FROM public.fitcoin_transactions WHERE source_reference = 'appointment:' || p_appointment_id::text) THEN
      RETURN jsonb_build_object('success', false, 'error', 'Session has already been rewarded with FitCoins');
    END IF;
  END IF;

  -- Mark appointment completed
  UPDATE public.appointments
  SET status = 'completed'
  WHERE id = p_appointment_id;

  -- Issue transaction atomically
  v_res := public.issue_fitcoin_transaction(
    v_apt.client_user_id,
    p_amount,
    'trainer_session_reward',
    'appointment:' || p_appointment_id::text,
    'idemp-apt-' || p_appointment_id::text,
    CASE WHEN p_reason <> '' THEN 'Coaching session: ' || p_reason ELSE 'Completed 1-on-1 coaching session award' END,
    p_trainer_id,
    jsonb_build_object('appointment_id', p_appointment_id, 'session_type', v_apt.session_type, 'notes', p_reason)
  );

  RETURN v_res;
END;
$$;

-- 4. Admin Correction / Reversal Function
CREATE OR REPLACE FUNCTION public.admin_reverse_fitcoin_transaction(
  p_transaction_id UUID,
  p_admin_id UUID,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_orig RECORD;
  v_rev_amount INTEGER;
  v_res JSONB;
BEGIN
  -- Verify admin role
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND role = 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Admin role required for reversals');
  END IF;

  SELECT * INTO v_orig FROM public.fitcoin_transactions WHERE id = p_transaction_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Original transaction not found');
  END IF;

  IF v_orig.transaction_type = 'reversal' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot reverse an existing reversal transaction');
  END IF;

  -- Check if already reversed
  IF EXISTS (SELECT 1 FROM public.fitcoin_transactions WHERE source_reference = 'reversal:' || p_transaction_id::text) THEN
    RETURN jsonb_build_object('success', false, 'error', 'This transaction has already been reversed');
  END IF;

  v_rev_amount := -1 * v_orig.amount;

  -- Issue reversal transaction atomically
  v_res := public.issue_fitcoin_transaction(
    v_orig.user_id,
    v_rev_amount,
    'reversal',
    'reversal:' || p_transaction_id::text,
    'idemp-rev-' || p_transaction_id::text,
    'Auditable Reversal: ' || p_reason,
    p_admin_id,
    jsonb_build_object('original_transaction_id', p_transaction_id, 'original_type', v_orig.transaction_type, 'reason', p_reason)
  );

  -- Log audit record
  INSERT INTO public.audit_logs (
    actor_id, action, target_type, target_id, old_state, new_state, reason, created_at
  ) VALUES (
    p_admin_id,
    'FITCOIN_TRANSACTION_REVERSAL',
    'fitcoin_transaction',
    p_transaction_id::text,
    to_jsonb(v_orig),
    v_res,
    p_reason,
    NOW()
  );

  RETURN v_res;
END;
$$;
