"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";

interface Summary {
  summary_text: string;
}


const Page = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarizeText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/summarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize text");
      }

      console.log("API Response:", data.result);
      setResult(data.result);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to summarize text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 min-h-screen">
      <main className="flex min-h-screen flex-col items-center w-full max-w-4xl">
        <h1 className="text-5xl font-bold mb-2 text-center">
          Text Summarizer
        </h1>
        <h2 className="text-2xl mb-8 text-center text-muted-foreground">
          Understand your long text in short time!
        </h2>

        <div className="w-full space-y-4">
          <textarea
            placeholder="Enter your long text here to get a concise summary..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full text-lg p-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[200px] resize-y bg-background"
            disabled={loading}
          />

          <Button
            onClick={summarizeText}
            disabled={loading || !text.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? "Summarizing..." : "Summarize Text"}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 border rounded-lg w-full bg-destructive/10 border-destructive">
            <p className="text-destructive text-center">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 w-full space-y-6">
            {/* Original Text Card */}
            <div className="p-6 border rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📄</span>
                <h3 className="text-xl font-bold">Original Text</h3>
              </div>
              <div className="leading-relaxed max-h-[300px] overflow-y-auto pr-2 text-muted-foreground">
                {text}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Character count: <span className="font-semibold">{text.length}</span>
                </p>
              </div>
            </div>

            {/* Summary Card */}
            <div className="p-6 border rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <h3 className="text-xl font-bold">Summary</h3>
              </div>
              <div className="leading-relaxed text-lg whitespace-pre-wrap">
                {result.summary_text}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Character count: <span className="font-semibold">{result.summary_text.length}</span>
                  {" • "}
                  Compression: <span className="font-semibold">
                    {((1 - result.summary_text.length / text.length) * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;