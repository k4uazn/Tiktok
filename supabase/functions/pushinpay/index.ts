import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PUSHINPAY_API_KEY = Deno.env.get('PUSHINPAY_API_KEY');
    
    if (!PUSHINPAY_API_KEY) {
      throw new Error('PUSHINPAY_API_KEY not configured');
    }

    const { action, amount, transactionId, webhookUrl } = await req.json();
    const baseUrl = 'https://api.pushinpay.com.br/api';

    if (action === 'create') {
      // Convert amount from "32,67" format to centavos (3267)
      const valueInCents = Math.round(
        parseFloat(amount.replace('.', '').replace(',', '.')) * 100
      );

      console.log('Creating PIX with value:', valueInCents, 'centavos');

      const response = await fetch(`${baseUrl}/pix/cashIn`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PUSHINPAY_API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: valueInCents,
          webhook_url: webhookUrl || undefined,
        }),
      });

      const responseText = await response.text();
      console.log('PushinPay response status:', response.status);
      console.log('PushinPay response:', responseText);

      if (!response.ok) {
        throw new Error(`PushinPay API error: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);

      return new Response(JSON.stringify({
        success: true,
        transactionId: data.id,
        qrCode: data.qr_code,
        qrCodeBase64: data.qr_code_base64?.replace('data:image/png;base64,', '') || '',
        pixCode: data.qr_code,
        status: data.status,
        value: data.value,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'status') {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      console.log('Checking status for transaction:', transactionId);

      const response = await fetch(`${baseUrl}/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PUSHINPAY_API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      console.log('PushinPay status response:', response.status);
      console.log('PushinPay status data:', responseText);

      if (!response.ok) {
        throw new Error(`PushinPay API error: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);

      return new Response(JSON.stringify({
        success: true,
        status: data.status, // 'created', 'paid', 'canceled'
        transactionId: data.id,
        value: data.value,
        payerName: data.payer_name,
        payerDocument: data.payer_national_registration,
        endToEndId: data.end_to_end_id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error(`Invalid action: ${action}`);
    }

  } catch (error) {
    console.error('PushinPay error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
