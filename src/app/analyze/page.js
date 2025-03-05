"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function AnalyzeResume() {
  const [resumeData, setResumeData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load extracted resume data from local storage
    const storedData = localStorage.getItem("resumeData");
    if (storedData) {
      setResumeData(JSON.parse(storedData));
    }
  }, []);

  const getAIInsights = async () => {
    if (!resumeData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: JSON.stringify(resumeData) }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to get AI insights");

      setAiInsights(result.insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <Card className="max-w-2xl w-full p-6 shadow-lg border border-blue-500/30 bg-gray-950/70 rounded-2xl text-white text-center">
        <h2 className="text-2xl font-bold text-blue-400">Resume Analysis</h2>

        {resumeData ? (
          <div className="mt-4 text-left">
            <h3 className="text-lg font-semibold text-blue-300">Extracted Details</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-300">
              {Object.entries(resumeData).map(([key, value]) => (
                <li key={key}>
                  <strong className="text-blue-300">{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400 mt-4">No resume data found. Please upload a resume first.</p>
        )}

        <Button className="mt-6 bg-blue-600 hover:bg-blue-700" onClick={getAIInsights} disabled={loading}>
          {loading ? "Analyzing..." : "Get AI Insights"}
        </Button>

        {loading && (
          <div className="mt-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-400 flex items-center">
            <AlertCircle className="mr-2" /> {error}
          </div>
        )}

        {aiInsights && (
          <div className="mt-4 p-4 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg text-left">
            <h3 className="text-lg font-semibold text-green-300 flex items-center">
              <CheckCircle className="mr-2" /> AI Insights
            </h3>
            <p className="mt-2 text-sm">{aiInsights}</p>
          </div>
        )}
      </Card>
    </main>
  );
}
