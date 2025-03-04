"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-6">
      <Card className="max-w-2xl shadow-xl border border-purple-500/30 bg-gray-950/70 rounded-2xl text-white text-center">
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold text-purple-400">Resume Analyzer</h1>
          <p className="text-lg text-gray-300 mt-4">
            Upload your resume and get instant insights with AI-powered analysis.
          </p>
          <p className="text-md text-gray-400 mt-2">
            Our tool extracts key details from your resume and provides a detailed breakdown to help you improve your job applications.
          </p>
          <Button className="mt-6 px-6 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition" asChild>
            <a href="/upload">Upload Your Resume</a>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}