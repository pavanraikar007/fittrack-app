import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash";

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable.");
}

export async function POST(request: Request) {
  console.log('🔍 AI Coach API called');
  
  if (!GEMINI_API_KEY) {
    console.error('❌ Missing GEMINI_API_KEY');
    return NextResponse.json(
      { error: "AI service is not configured correctly. Missing API key." },
      { status: 500 }
    );
  }

  try {
    const { message, history } = await request.json();
    console.log('📝 Received message:', message);
    console.log('📚 History length:', history?.length || 0);

    if (!message) {
      console.error('❌ No message provided');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('🤖 Initializing Gemini AI...');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    console.log('🚀 Sending simple message to Gemini...');
    
    // Simplified approach - just send the message without chat history for now
    const prompt = `You are FitTrack AI Coach, a friendly fitness assistant. Please respond to this user message in a helpful, encouraging way: "${message}"`;
    
    const result = await model.generateContent(prompt);

    console.log('✅ Received response from Gemini');
    if (result.response) {
      const text = result.response.text();
      console.log('📤 Sending reply:', text.substring(0, 100) + '...');
      return NextResponse.json({ reply: text });
    } else {
      console.error("❌ Gemini API call successful but no response content, potentially blocked.");
      return NextResponse.json({ 
        error: "AI could not generate a response, possibly due to safety filters." 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Error calling Gemini API:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    let errorMessage = "An error occurred while communicating with the AI coach.";
    if (error.message && error.message.includes('API key not valid')) {
      errorMessage = "AI service is not configured correctly. Invalid API key.";
    } else if (error.message && error.message.includes('quota')) {
      errorMessage = "AI service quota exceeded. Please try again later.";
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 