import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get current inventory data
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('*');

    if (inventoryError) {
      throw inventoryError;
    }

    // Get sales data for the last 30 days
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (salesError) {
      console.error('Sales error:', salesError);
    }

    // Prepare prompt with inventory and sales data
    const inventorySummary = inventory.map(item => ({
      name: item.name,
      category: item.category,
      current_stock: item.quantity,
      max_quantity: item.max_quantity,
      reorder_point: item.reorder_point,
      expiry_date: item.expiry_date,
      status: item.status
    }));

    const prompt = `You are an AI inventory management assistant. Analyze the following inventory data and provide smart purchase suggestions.

Current Inventory:
${JSON.stringify(inventorySummary, null, 2)}

Recent Sales (last 30 days): ${sales?.length || 0} transactions

Based on this data, provide:
1. Top 5 items to restock (consider current stock, reorder points, and sales trends)
2. Items approaching expiry that need attention
3. Suggested quantities to order for each item

Format your response as a JSON object with these keys:
- restock_suggestions: array of {name, current_stock, suggested_order_quantity, reason}
- expiry_warnings: array of {name, expiry_date, days_until_expiry, recommendation}
- insights: string with overall insights

Be concise and actionable.`;

    console.log('Sending request to AI Gateway...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert inventory management AI. Provide analysis in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    const aiResponse = data.choices[0].message.content;
    
    // Try to parse the AI response as JSON
    let suggestions;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      suggestions = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      suggestions = {
        restock_suggestions: [],
        expiry_warnings: [],
        insights: aiResponse
      };
    }

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in inventory-ai-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
