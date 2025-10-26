"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Prediction {
  label: string;
  score: number;
}

const Page = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Prediction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze sentiment");
      }

      console.log("API Response:", data.result);
      setResult(data.result);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to analyze sentiment");
    } finally {
      setLoading(false);
    }
  };

  // Get the dominant sentiment
  const topSentiment = result && result.length > 0 ? result[0] : null;

  // Emoji mapping for sentiments
  const getSentimentEmoji = (label: string) => {
    switch (label) {
      case "Very Positive":
        return "🤩";
      case "Positive":
        return "😊";
      case "Neutral":
        return "😐";
      case "Negative":
        return "😟";
      case "Very Negative":
        return "😢";
      default:
        return "💭";
    }
  };

  // Color mapping for sentiments (using CSS variables for dark mode support)
  const getSentimentColor = (label: string) => {
    switch (label) {
      case "Very Positive":
        return "bg-green-500 dark:bg-green-600";
      case "Positive":
        return "bg-green-400 dark:bg-green-500";
      case "Neutral":
        return "bg-gray-400 dark:bg-gray-500";
      case "Negative":
        return "bg-orange-400 dark:bg-orange-500";
      case "Very Negative":
        return "bg-red-500 dark:bg-red-600";
      default:
        return "bg-gray-300 dark:bg-gray-600";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 min-h-screen">
      <main className="flex flex-col items-center w-full max-w-3xl pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2 text-center">
            Sentiment Analysis
          </h1>
          <h2 className="text-2xl mb-8 text-center text-muted-foreground">
            Discover emotional tone of your text
          </h2>
        </div>

        <div className="w-full space-y-4">
          <textarea
            placeholder="Enter your text here... (e.g., 'I absolutely love this product!')"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full text-lg p-6 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-ring min-h-32 resize-none transition-colors bg-background"
            disabled={loading}
          />

          <Button
            onClick={analyzeSentiment}
            disabled={loading || !text.trim()}
            className="w-full py-6 text-lg rounded-xl"
            size="lg"
          >
            {loading ? "Analyzing..." : "Analyze Sentiment"}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 border-2 rounded-xl w-full bg-destructive/10 border-destructive">
            <p className="text-destructive text-center font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && topSentiment && (
          <div className="mt-12 w-full space-y-6">
            {/* Main Sentiment Card */}
            <div className="p-8 border-2 rounded-2xl">
              <p className="text-sm font-semibold text-muted-foreground mb-3">
                YOUR TEXT
              </p>
              <p className="text-lg mb-6 italic">&quot;{text}&quot;</p>

              <div className="text-center py-8 border-t-2">
                <div className="text-8xl mb-4">
                  {getSentimentEmoji(topSentiment.label)}
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {topSentiment.label}
                </h3>
                <p className="text-xl text-muted-foreground">
                  {(topSentiment.score * 100).toFixed(1)}% Confidence
                </p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="p-8 border-2 rounded-2xl">
              <h4 className="text-xl font-bold mb-6">
                Detailed Breakdown
              </h4>

              <div className="space-y-4">
                {result.map((prediction, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getSentimentEmoji(prediction.label)}
                        </span>
                        <span className="font-semibold">
                          {prediction.label}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">
                        {(prediction.score * 100).toFixed(1)}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${getSentimentColor(
                          prediction.label
                        )} transition-all duration-500 ease-out rounded-full`}
                        style={{
                          width: `${prediction.score * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div className="p-6 border-2 rounded-2xl bg-muted/50">
              <p className="text-center">
                <span className="font-bold">💡 Fun Fact:</span> Sentiment
                analysis can detect emotions in over 100 languages!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;