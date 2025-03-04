"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShineBorder } from "@/components/magicui/ShineBorder";
import { Meteors } from "@/components/magicui/Meteors";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Meteor Effect */}
      <Meteors />

      <ShineBorder className="max-w-2xl">
        <Card className="shadow-xl border border-purple-500/30 bg-gray-950/70 rounded-2xl text-white text-center p-1">
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
      </ShineBorder>
    </main>
  );
}
