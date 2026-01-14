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

    const systemPrompt = `You are a digital product market research and pricing expert. Your job is to analyze digital product ideas, research the market, and provide strategic pricing recommendations.

CRITICAL: You MUST analyze the user's proposed price against market data and provide a pricing recommendation. Be direct about whether their price is too low, too high, or well-positioned.

When given a product description and price, you should:
1. Research similar successful digital products in that niche
2. Identify the typical price range for similar products
3. Analyze if the user's price is optimal, too low, or too high
4. Provide a specific recommended price with reasoning
5. Calculate earnings at both their price and your recommended price

You MUST respond with valid JSON in this exact format:
{
  "marketOverview": "Brief 2-3 sentence overview of the digital product market in this niche",
  "typicalPriceRange": {
    "low": <number>,
    "high": <number>,
    "sweet_spot": <number>
  },
  "priceAnalysis": {
    "userPrice": <number>,
    "recommendation": "increase" | "decrease" | "optimal",
    "suggestedPrice": <number>,
    "reasoning": "2-3 sentences explaining why this price is recommended",
    "marketPosition": "budget" | "mid-range" | "premium" | "luxury"
  },
  "successStories": [
    {
      "name": "Product or creator name",
      "description": "Brief description",
      "estimatedEarnings": "Estimated earnings range or figure",
      "pricePoint": <number or null if unknown>
    }
  ],
  "projectedEarnings": {
    "atUserPrice": <number>,
    "atSuggestedPrice": <number>,
    "potentialIncrease": <number or 0 if decrease recommended>,
    "potentialSavingsFromHigherConversion": <number or 0 if increase recommended>
  },
  "keyInsights": [
    "Insight 1 about maximizing success",
    "Insight 2",
    "Insight 3",
    "Insight 4"
  ],
  "competitiveAdvantages": [
    "What could make this product stand out 1",
    "What could make this product stand out 2"
  ],
  "riskFactors": [
    "Potential challenge 1",
    "Potential challenge 2"
  ],
  "quickWins": [
    "Easy improvement 1 to boost sales",
    "Easy improvement 2"
  ]
}

Be encouraging but realistic. Use specific numbers. If the price is significantly off (more than 20% from optimal), be direct about the recommendation.`;

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
            content: `Please research this digital product idea and provide comprehensive market analysis with pricing recommendations:

Product Description: ${productDescription}
Proposed Price Point: $${productPrice}
Sales Goal: ${salesGoal} units

Analyze whether $${productPrice} is the right price for this product based on market research. If it's too low, recommend a higher price. If it's too high, recommend a lower price for better conversions. Calculate earnings projections for both scenarios.

Respond with valid JSON only.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const researchResult = data.choices[0].message.content;
    
    let parsedResearch;
    try {
      parsedResearch = JSON.parse(researchResult);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error('Failed to parse research results');
    }

    console.log('Research completed successfully');

    return new Response(JSON.stringify({ 
      research: parsedResearch,
      userInputs: {
        productPrice,
        salesGoal,
        productDescription
      }
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
