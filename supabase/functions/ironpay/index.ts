import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('IRONPAY_API_KEY');
    if (!apiKey) {
      throw new Error('IRONPAY_API_KEY not configured');
    }

    const { action, transactionId, amount, description } = await req.json();

    if (action === 'create') {
      // Create a new PIX payment
      const response = await fetch('https://api.ironpayapp.com.br/v1/pix/qrcode', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount.replace(',', '.')),
          description: description || 'Taxa de confirmação',
          expires_in: 3600, // 1 hour
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('IronPay API error:', errorText);
        throw new Error(`IronPay API error: ${response.status}`);
      }

      const data = await response.json();
      
      return new Response(JSON.stringify({
        success: true,
        transactionId: data.transaction_id || data.id,
        qrCode: data.qr_code || data.qrcode,
        qrCodeBase64: data.qr_code_base64 || data.qrcode_base64,
        pixCode: data.pix_code || data.copy_paste || data.brcode,
        expiresAt: data.expires_at,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'status') {
      // Check payment status
      const response = await fetch(`https://api.ironpayapp.com.br/v1/pix/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('IronPay status check error:', errorText);
        throw new Error(`IronPay API error: ${response.status}`);
      }

      const data = await response.json();
      
      return new Response(JSON.stringify({
        success: true,
        status: data.status, // pending, paid, expired, cancelled
        paidAt: data.paid_at,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error('Invalid action. Use "create" or "status"');
    }

  } catch (error) {
    console.error('Error in ironpay function:', error);
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
