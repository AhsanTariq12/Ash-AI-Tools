"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import React, { useState } from "react";

interface Prediction {
  label: string;
  score: number;
}

const Page = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Prediction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkGrammar = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check grammar");
      }

      console.log("API Response:", data.result);
      setResult(data.result);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to check grammar");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Determine result correctly
  let isCorrect = false;
  let confidence = 0;

  if (result && result.length > 0) {
    const correctLabel = result.find((r) => r.label === "LABEL_1");
    const incorrectLabel = result.find((r) => r.label === "LABEL_0");

    if (correctLabel && incorrectLabel) {
      isCorrect = correctLabel.score > incorrectLabel.score;
      confidence = Math.max(correctLabel.score, incorrectLabel.score) * 100;
    } 
  }

  return (
    <div className="flex flex-col items-center gap-4  p-8">
      <main className="flex min-h-screen flex-col items-center  w-full max-w-2xl">
        <h1 className="text-5xl font-bold mb-2 text-center">Grammar Checker</h1>
        <h2 className="text-2xl mb-8 text-center text-gray-600">
          Check your english sentence grammer.
        </h2>

        <div className="w-full space-y-4">
          <Input
            placeholder="Enter a sentence to check..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                checkGrammar();
              }
            }}
            className="w-full text-lg p-6"
            disabled={loading}
          />

          <Button
            onClick={checkGrammar}
            disabled={loading || !text.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? "Checking..." : "Check Grammar"}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg w-full">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 w-full space-y-4">
           
            <Item variant="outline">
        <ItemContent>
          <ItemTitle> Your Sentence:</ItemTitle>
          <ItemDescription>
          {text}
          </ItemDescription>
        </ItemContent>
        
      </Item>
          
            <Item variant="muted">
        <ItemContent>
          <ItemTitle>{isCorrect ? "✅" : "❌"} :  {isCorrect
                  ? "Grammatically Correct!"
                  : "Grammar Error Detected"}</ItemTitle>
          <ItemDescription>
         
                  <br/>
                  Confidence: {confidence.toFixed(1)}%
          </ItemDescription>
        </ItemContent>
      
      </Item>
          </div>
        )}

       
      </main>
    </div>
  );
};

export default Page;
