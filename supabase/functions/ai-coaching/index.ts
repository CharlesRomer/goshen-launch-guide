import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, pathwayStage } = await req.json();

    console.log('AI Coaching request:', { sessionId, pathwayStage, message });

    // Get the prompt for this pathway
    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .select('system_prompt_text')
      .eq('stage_label', pathwayStage)
      .single();

    if (promptError) {
      console.error('Error fetching prompt:', promptError);
      throw new Error('Failed to fetch coaching prompt');
    }

    // Get conversation history for context
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('conversation_log')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      throw new Error('Failed to fetch session data');
    }

    const conversationHistory = sessionData.conversation_log || [];

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: promptData.system_prompt_text
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Sending to OpenAI:', { messageCount: messages.length });

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to get AI response');
    }

    const aiData = await openAIResponse.json();
    const aiResponse = aiData.choices[0].message.content;

    console.log('AI response received, length:', aiResponse.length);

    // Update conversation log
    const updatedConversation = [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
    ];

    // Save conversation to database
    const { error: updateError } = await supabase
      .from('sessions')
      .update({ 
        conversation_log: updatedConversation,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
      // Don't throw here, just log - we still want to return the AI response
    }

    console.log('Session updated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: sessionId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI coaching function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});