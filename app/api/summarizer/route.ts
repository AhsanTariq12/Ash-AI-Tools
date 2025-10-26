import { NextResponse } from "next/server";
import { InferenceClient } from '@huggingface/inference';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Invalid input text" },
        { status: 400 }
      );
    }

    // Initialize HF client
    const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    // Call the text classification API
    const output = await hf.summarization({
    
      model: "cnicu/t5-small-booksum",
      inputs: text,

    });

    return NextResponse.json({ result: output });
  } catch (error: any) {
    console.error("Error in grammar API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check grammar" },
      { status: 500 }
    );
  }
}