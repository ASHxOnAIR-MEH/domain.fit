-- ==============================================================================
-- DOMAINFIT MIGRATION: RAZORPAY PAYMENT GATEWAY & FINANCIAL AUDIT LEDGER
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'INR' NOT NULL,
  status TEXT DEFAULT 'created' NOT NULL CHECK (
    status IN ('created', 'processing', 'succeeded', 'failed', 'refunded')
  ),
  item_type TEXT NOT NULL CHECK (
    item_type IN ('program', 'membership', 'coaching_session')
  ),
  item_name TEXT NOT NULL,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  payment_method TEXT,
  error_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for ultra-fast lookup & reconciliation
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_rzp_order ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_rzp_payment ON public.payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users view their own payment receipts
CREATE POLICY "Users view own payments"
  ON public.payments FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policy: Admins have full access to manage and reconcile payments
CREATE POLICY "Admins manage all payments"
  ON public.payments FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Atomic Function: Record or update Razorpay Payment
CREATE OR REPLACE FUNCTION public.record_razorpay_payment(
  p_user_id UUID,
  p_amount INTEGER,
  p_currency TEXT,
  p_status TEXT,
  p_item_type TEXT,
  p_item_name TEXT,
  p_order_id TEXT,
  p_payment_id TEXT,
  p_method TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment RECORD;
BEGIN
  INSERT INTO public.payments (
    user_id,
    amount,
    currency,
    status,
    item_type,
    item_name,
    razorpay_order_id,
    razorpay_payment_id,
    payment_method,
    metadata,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_amount,
    p_currency,
    p_status,
    p_item_type,
    p_item_name,
    p_order_id,
    p_payment_id,
    p_method,
    p_metadata,
    NOW(),
    NOW()
  )
  ON CONFLICT (razorpay_payment_id) DO UPDATE
  SET
    status = EXCLUDED.status,
    updated_at = NOW(),
    metadata = payments.metadata || EXCLUDED.metadata
  RETURNING * INTO v_payment;

  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment.id,
    'status', v_payment.status,
    'razorpay_payment_id', v_payment.razorpay_payment_id
  );
END;
$$;
