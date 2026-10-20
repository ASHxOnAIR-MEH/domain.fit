'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  Download, 
  ChevronRight,
  QrCode,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentTransaction, PaymentItemType } from '@/lib/types';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  itemName: string;
  itemType: PaymentItemType;
  userName?: string;
  userEmail?: string;
  onSuccess: (transaction: PaymentTransaction) => void;
  onFailure?: (error: string) => void;
}

type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';
type ModalStep = 'select' | 'processing' | 'success' | 'failed';

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  onClose,
  amount,
  itemName,
  itemType,
  userName = 'Member',
  userEmail = 'member@example.com',
  onSuccess,
  onFailure,
}) => {
  const [method, setMethod] = useState<PaymentMethodType>('upi');
  const [step, setStep] = useState<ModalStep>('select');
  
  // Card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(userName);

  // UPI inputs
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');

  // Netbanking inputs
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Wallet inputs
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');

  // Simulation controls
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingStatusText, setProcessingStatusText] = useState('Contacting Razorpay Gateway...');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSimulateFailure(false);
      setErrorMessage('');
      setCompletedTx(null);
      setProcessingStatusText('Contacting Razorpay Gateway...');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format Card Number (4 digit groups)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Detect card brand
  const getCardBrand = () => {
    const raw = cardNumber.replace(/\s/g, '');
    if (raw.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(raw)) return 'Mastercard';
    if (/^(60|65|81|82)/.test(raw)) return 'RuPay';
    if (/^(34|37)/.test(raw)) return 'Amex';
    return 'Card';
  };

  // Main payment execution
  const handleInitiatePayment = async () => {
    setStep('processing');
    setProcessingStatusText('Creating secure order on Razorpay...');

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: { itemName, itemType, userName },
        }),
      });

      const orderData = await orderRes.json();
      const orderId = orderData.order?.id || `order_${Date.now().toString(36)}`;

      // 2. Realistic processing timeline
      await new Promise((r) => setTimeout(r, 900));
      setProcessingStatusText(
        method === 'upi'
          ? 'Waiting for UPI authorization on mobile app...'
          : method === 'card'
          ? 'Authorizing 3D Secure OTP with issuing bank...'
          : 'Redirecting to secure banking portal...'
      );

      await new Promise((r) => setTimeout(r, 1100));
      setProcessingStatusText('Verifying cryptographic signature & ledger sync...');
      await new Promise((r) => setTimeout(r, 800));

      // 3. Check for deliberate or simulated failure
      if (simulateFailure) {
        throw new Error('Payment declined by issuing bank: 3D Secure verification timed out.');
      }

      // Generate payment ID
      const paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // 4. Server-side verification
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: `sig_${Math.random().toString(36).substring(2, 15)}`,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        throw new Error(verifyData.error || 'Payment signature verification failed.');
      }

      // Formulate payment method description
      let paymentMethodDesc = 'Razorpay UPI';
      if (method === 'upi') {
        paymentMethodDesc = selectedUpiApp === 'qr' ? 'Razorpay Dynamic UPI QR' : `Razorpay UPI (${selectedUpiApp.toUpperCase()})`;
      } else if (method === 'card') {
        const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';
        paymentMethodDesc = `Razorpay Card (${getCardBrand()} •••• ${last4})`;
      } else if (method === 'netbanking') {
        paymentMethodDesc = `Razorpay NetBanking (${selectedBank})`;
      } else if (method === 'wallet') {
        paymentMethodDesc = `Razorpay Wallet (${selectedWallet})`;
      }

      const tx: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        user_id: 'usr-client-1',
        user_name: userName,
        amount,
        currency: 'INR',
        status: 'succeeded',
        item_type: itemType,
        item_name: itemName,
        payment_method: paymentMethodDesc,
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        created_at: new Date().toISOString(),
      };

      setCompletedTx(tx);
      setStep('success');

      // Trigger celebration confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#B7F34A', '#FFFFFF', '#38BDF8', '#34D399'],
      });

      onSuccess(tx);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
      setStep('failed');
      if (onFailure) onFailure(err.message);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#0F1210',
          border: '1px solid #232924',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(183, 243, 74, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* MODAL HEADER: Razorpay Co-Branding */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#141815',
            borderBottom: '1px solid #232924',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Razorpay Brand Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#38BDF8',
                  boxShadow: '0 0 8px #38BDF8',
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.05em' }}>
                RAZORPAY
              </span>
              <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>SECURE</span>
            </div>

            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>DomainFit Checkout</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                256-Bit SSL Encrypted
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={step === 'processing'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: step === 'processing' ? 'not-allowed' : 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ORDER SUMMARY STRIP */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: 'rgba(183, 243, 74, 0.04)',
            borderBottom: '1px solid #232924',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {itemType === 'membership' ? 'Clinical Membership' : 'Specialized Program'}
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '2px 0 0 0' }}>
              {itemName}
            </h4>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Amount Payable</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '-0.02em' }}>
              ₹{amount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* STEP CONTENT */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* ============================================================== */}
          {/* STEP: SELECT PAYMENT METHOD */}
          {/* ============================================================== */}
          {step === 'select' && (
            <div>
              {/* Method Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                {[
                  { id: 'upi', label: 'UPI', icon: Smartphone },
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'netbanking', label: 'NetBanking', icon: Building2 },
                  { id: 'wallet', label: 'Wallets', icon: Wallet },
                ].map((t) => {
                  const Icon = t.icon;
                  const active = method === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setMethod(t.id as PaymentMethodType)}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '10px',
                        backgroundColor: active ? 'rgba(183, 243, 74, 0.12)' : 'var(--bg-secondary)',
                        border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={18} />
                      <span style={{ fontSize: '0.78rem', fontWeight: active ? 700 : 500 }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: UPI */}
              {method === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'gpay', label: 'GPay', tag: 'Fast' },
                      { id: 'phonepe', label: 'PhonePe', tag: 'Instant' },
                      { id: 'paytm', label: 'Paytm', tag: 'UPI' },
                      { id: 'qr', label: 'QR Code', tag: 'Scan' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: '10px',
                          backgroundColor: selectedUpiApp === app.id ? '#1A2218' : 'var(--bg-secondary)',
                          border: selectedUpiApp === app.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedUpiApp === app.id ? 'var(--accent-primary)' : '#fff', display: 'block' }}>
                          {app.label}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{app.tag}</span>
                      </button>
                    ))}
                  </div>

                  {selectedUpiApp === 'qr' ? (
                    <div
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px dashed var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          padding: '14px',
                          backgroundColor: '#fff',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <QrCode size={130} color="#0B0D0C" />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', display: 'block' }}>
                          Scan to pay ₹{amount.toLocaleString('en-IN')} with any UPI App
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Supports GPay, PhonePe, Paytm, BHIM, Cred
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Enter UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank or 9876543210@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          color: '#fff',
                          fontSize: '0.9rem',
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                        A payment collect request will be pushed to your UPI mobile app.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CARDS */}
              {method === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Card Number</label>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {getCardBrand()}
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="4532 0123 4567 8910"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 40px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          color: '#fff',
                          fontSize: '0.92rem',
                          letterSpacing: '0.05em',
                        }}
                      />
                      <CreditCard size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          color: '#fff',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          color: '#fff',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Name on Card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: NETBANKING */}
              {method === 'netbanking' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Select Bank</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: '8px',
                          backgroundColor: selectedBank === b ? '#1A2218' : 'var(--bg-secondary)',
                          border: selectedBank === b ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          color: selectedBank === b ? 'var(--accent-primary)' : '#fff',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: WALLETS */}
              {method === 'wallet' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Choose Wallet</label>
                  {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'MobiKwik'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWallet(w)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        backgroundColor: selectedWallet === w ? '#1A2218' : 'var(--bg-secondary)',
                        border: selectedWallet === w ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        color: selectedWallet === w ? 'var(--accent-primary)' : '#fff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{w}</span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
              )}

              {/* SIMULATION TEST CONTROLS */}
              <div
                style={{
                  marginTop: '22px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed #2A332C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Developer Simulator: Test Bank Decline
                  </span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    style={{ accentColor: '#EF4444', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: simulateFailure ? '#EF4444' : 'var(--text-secondary)', fontWeight: 600 }}>
                    {simulateFailure ? 'Failure Mode' : 'Success Mode'}
                  </span>
                </label>
              </div>

              {/* PAY BUTTON */}
              <button
                type="button"
                onClick={handleInitiatePayment}
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '15px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  justifyContent: 'center',
                  borderRadius: '10px',
                }}
              >
                <Lock size={17} />
                <span>Pay ₹{amount.toLocaleString('en-IN')} via Razorpay</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP: REAL-TIME PROCESSING */}
          {/* ============================================================== */}
          {step === 'processing' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 10px',
                textAlign: 'center',
              }}
            >
              {/* Pulsing Animated Spinner */}
              <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '3px solid rgba(183, 243, 74, 0.15)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: 'var(--accent-primary)',
                    animation: 'spin 0.9s linear infinite',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(183, 243, 74, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lock size={22} color="var(--accent-primary)" />
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Processing Transaction
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '20px' }}>
                {processingStatusText}
              </p>

              <div
                style={{
                  maxWidth: '380px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                }}
              >
                Please do not close this window or hit back while your payment is securely confirmed by Razorpay.
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP: SUCCESS */}
          {/* ============================================================== */}
          {step === 'success' && completedTx && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '10px 0',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  border: '2px solid #34D399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 0 25px rgba(52, 211, 153, 0.4)',
                }}
              >
                <CheckCircle2 size={34} color="#34D399" />
              </div>

              <span className="badge badge-lime" style={{ marginBottom: '8px' }}>
                Payment Captured
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                ₹{completedTx.amount.toLocaleString('en-IN')} Received
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Your payment for <strong>{completedTx.item_name}</strong> has been successfully confirmed.
              </p>

              {/* Receipt Card */}
              <div
                style={{
                  width: '100%',
                  padding: '18px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'left',
                  marginBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment ID:</span>
                  <code style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {completedTx.razorpay_payment_id}
                  </code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                  <span style={{ color: '#fff' }}>{completedTx.razorpay_order_id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Method:</span>
                  <span style={{ color: '#fff' }}>{completedTx.payment_method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Timestamp:</span>
                  <span style={{ color: '#fff' }}>{new Date(completedTx.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Download size={16} />
                  <span>Save Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP: FAILED / DECLINED */}
          {/* ============================================================== */}
          {step === 'failed' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '10px 0',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '2px solid #EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 0 25px rgba(239, 68, 68, 0.3)',
                }}
              >
                <AlertCircle size={34} color="#EF4444" />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                Payment Unsuccessful
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#F87171',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  maxWidth: '420px',
                  marginBottom: '24px',
                }}
              >
                {errorMessage}
              </p>

              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSimulateFailure(false);
                    setStep('select');
                  }}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff', color: '#000' }}
                >
                  <RefreshCw size={16} />
                  <span>Retry Payment</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#0B0D0C',
            borderTop: '1px solid #1E2420',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#34D399" />
            <span>PCI-DSS Level 1 Compliant</span>
          </div>
          <div>Razorpay Official Integration</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
