"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QAResult {
  answer: string;
  score: number;
  documentInfo: {
    pages: number;
    textLength: number;
    contextUsed: number;
    truncated: boolean;
  };
}

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<QAResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file");
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File too large. Maximum size is 5MB");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
      setResult(null);
    }
  };

  const handleAskQuestion = async () => {
    if (!file || !question.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", question);

      const response = await fetch("/api/document-qa", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get answer");
      }

      console.log("API Response:", data);
      setResult(data);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to process document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 min-h-screen">
      <main className="flex flex-col items-center w-full max-w-4xl pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2 text-center">
            Document Q&A
          </h1>
          <p className="text-2xl mb-8 text-center text-muted-foreground">
            Upload a PDF and ask questions about it
          </p>
        </div>

        <div className="w-full space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
              disabled={loading}
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="text-6xl">📄</div>
              <div>
                <p className="text-lg font-semibold">
                  {file ? file.name : "Click to upload PDF"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum file size: 5MB
                </p>
              </div>
              {file && (
                <div className="text-sm text-muted-foreground">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </div>
              )}
            </label>
          </div>

          {/* Question Input */}
          {file && (
            <div className="space-y-4">
              <Input
                placeholder="Ask a question about your document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleAskQuestion();
                  }
                }}
                className="w-full text-lg p-6"
                disabled={loading}
              />

              <Button
                onClick={handleAskQuestion}
                disabled={loading || !question.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? "Processing..." : "Ask Question"}
              </Button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 border rounded-xl w-full bg-destructive/10 border-destructive">
            <p className="text-destructive text-center font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 w-full space-y-6">
            {/* Document Info */}
            <div className="p-6 border rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl font-bold">Document Info</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Pages</p>
                  <p className="font-bold text-lg">{result.documentInfo.pages}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Characters</p>
                  <p className="font-bold text-lg">
                    {result.documentInfo.textLength.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Context Used</p>
                  <p className="font-bold text-lg">
                    {result.documentInfo.contextUsed.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-bold text-lg">
                    {result.documentInfo.truncated ? "Truncated" : "Full"}
                  </p>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="p-6 border rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">❓</span>
                <h3 className="text-xl font-bold">Your Question</h3>
              </div>
              <p className="text-lg">{question}</p>
            </div>

            {/* Answer */}
            <div className="p-8 border-2 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">💡</span>
                <h3 className="text-2xl font-bold">Answer</h3>
              </div>
              <p className="text-xl leading-relaxed mb-4">{result.answer}</p>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Confidence Score:{" "}
                  <span className="font-bold">
                    {(result.score * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            </div>

            {/* Truncation Warning */}
            {result.documentInfo.truncated && (
              <div className="p-4 border rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                  ⚠️ Document was truncated due to size. Only the first 3000 characters were analyzed.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;