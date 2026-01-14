import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productDescription, productPrice, salesGoal } = await req.json();

    console.log('Product research request:', { productDescription, productPrice, salesGoal });

    const systemPrompt = `You are a digital product market research expert. Your job is to analyze digital product ideas and provide encouraging, realistic market insights.

When given a product description, you should:
1. Research similar successful digital products in that niche
2. Identify potential target audiences
3. Find examples of successful creators/sellers in this space
4. Estimate realistic earning potential based on the price point and market data
5. Provide actionable insights to inspire the user

Format your response in clear sections:
- Market Overview (brief summary of the digital product market in this niche)
- Success Stories (2-3 examples of similar products that have done well, with estimated earnings if available)
- Your Earning Potential (based on their price of $${productPrice} and goal of ${salesGoal} sales)
- Total Projected Revenue: $${(productPrice * salesGoal).toLocaleString()}
- Key Insights (3-4 bullet points on how to maximize success)

Be encouraging but realistic. Use specific numbers and examples where possible. Keep the tone professional yet inspiring.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Please research this digital product idea and provide market insights:

Product Description: ${productDescription}
Price Point: $${productPrice}
Sales Goal: ${salesGoal} units

Provide encouraging market research and realistic earning projections based on similar products in the market.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const researchResult = data.choices[0].message.content;

    console.log('Research completed successfully');

    return new Response(JSON.stringify({ 
      research: researchResult,
      projectedRevenue: productPrice * salesGoal
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in product research function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
