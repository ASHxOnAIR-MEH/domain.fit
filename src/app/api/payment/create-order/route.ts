import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Amount in Razorpay is represented in paise (smallest currency unit, 1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // If live/sandbox server credentials are provided, call official Razorpay API
    if (keyId && keySecret) {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: notes || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Razorpay API error:', errorData);
        return NextResponse.json(
          { success: false, error: errorData.error?.description || 'Razorpay order creation failed' },
          { status: response.status }
        );
      }

      const orderData = await response.json();
      return NextResponse.json({
        success: true,
        order: orderData,
        key_id: keyId,
      });
    }

    // High-fidelity Sandbox / Mock Fallback when server keys are not configured yet
    const simulatedOrderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    const mockOrder = {
      id: simulatedOrderId,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: notes || {},
      created_at: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json({
      success: true,
      order: mockOrder,
      key_id: keyId || 'rzp_test_domainfit_demo',
      mode: 'sandbox',
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
