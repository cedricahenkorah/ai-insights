"use client";

import FileUpload from "@/components/chat/file-upload";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [csvAnalysis, setCsvAnalysis] = useState<string | null>(null);

  return (
    <div
      className={`flex flex-col w-full max-w-6xl mx-auto ${
        csvAnalysis ? "h-screen" : ""
      }`}
    >
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {csvAnalysis ? (
          <Card className="p-4 bg-muted">
            <p className="font-semibold">CSV Analysis:</p>
            <div className="text-sm prose prose-lg space-y-6">
              <ReactMarkdown>{csvAnalysis}</ReactMarkdown>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-4">
              <div className="bg-white rounded-full p-2 mr-2 flex gap-x-2 items-center">
                <Bot className="h-8 w-8 text-indigo-600" />
                <span className="font-bold text-base lg:text-2xl text-indigo-600">
                  AI INSIGHTS
                </span>
              </div>
            </div>

            <div className="text-center max-w-2xl mb-8">
              <p className="mb-4">
                Upload CSV files to extract AI-powered financial insights.
                Analyze market trends, assess investment performance, and
                uncover key data patterns effortlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
              <Card className="border-indigo-200 p-4 transition-colors cursor-pointer hover:bg-indigo-100">
                <p>Analyze revenue trends from my financial data.</p>
              </Card>
              <Card className="border-indigo-200 p-4 transition-colors cursor-pointer hover:bg-indigo-100">
                <p>Identify key spending patterns in my CSV file.</p>
              </Card>
              <Card className="border-indigo-200 p-4 transition-colors cursor-pointer hover:bg-indigo-100">
                <p>Predict future cash flow based on historical data.</p>
              </Card>
              <Card className="border-indigo-200 p-4 transition-colors cursor-pointer hover:bg-indigo-100">
                <p>Summarize my investment portfolio performance.</p>
              </Card>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 p-4 flex justify-center">
        <FileUpload onAnalysisComplete={setCsvAnalysis} />
      </div>
    </div>
  );
}
