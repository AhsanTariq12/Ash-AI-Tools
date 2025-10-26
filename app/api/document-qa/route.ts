import { NextResponse } from "next/server";
import {InferenceClient } from "@huggingface/inference";
import { extractText } from "unpdf";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const question = formData.get("question") as string;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    if (!question || question.trim() === "") {
      return NextResponse.json(
        { error: "No question provided" },
        { status: 400 }
      );
    }

    // Check file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB for serverless)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "PDF file too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract text from PDF (in-memory, no storage needed!)
    console.log("Extracting text from PDF...");
    
    let extractedData;
    try {
      extractedData = await extractText(arrayBuffer,{ mergePages: true });
    } catch (pdfError: any) {
      console.error("PDF parsing error:", pdfError);
      return NextResponse.json(
        { error: "Failed to parse PDF. The file might be corrupted or password-protected." },
        { status: 400 }
      );
    }

    const extractedText = extractedData.text;
    const numPages = extractedData.totalPages;

    // Validate extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. The file might be empty or image-based." },
        { status: 400 }
      );
    }

    console.log(`Extracted ${extractedText.length} characters from ${numPages} pages`);

    // Truncate context if too long (HF API has limits)
    // DistilBERT can handle ~512 tokens, keep context reasonable
    const maxContextLength = 3000; // characters
    const context : string = extractedText.length > maxContextLength 
      ? extractedText.substring(0, maxContextLength) + "..."
      : extractedText;

    // Initialize Hugging Face client
    const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    console.log("Sending question to model...");
    
    // Call Question Answering API
    const result = await hf.questionAnswering({
      model: "distilbert-base-cased-distilled-squad",
      inputs: {
        question: question,
        context: context,
      },
    });

    console.log("Answer received:", result);

    // Return the result
    return NextResponse.json({
      answer: result.answer,
      score: result.score,
      documentInfo: {
        pages: numPages,
        textLength: extractedText.length,
        contextUsed: context.length,
        truncated: extractedText.length > maxContextLength,
      },
    });

  } catch (error: any) {
    console.error("Error in document QA:", error);
    
    // Handle specific errors
    if (error.message?.includes("Model") || error.message?.includes("inference")) {
      return NextResponse.json(
        { error: "AI model error. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to process document" },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 10; // 60 seconds for Vercel Pro, 10s for free tier