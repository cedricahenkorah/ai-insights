"use client";

import FileUpload from "@/components/chat/file-upload";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type ChatEntry = {
  question: string;
  answer: string;
};

export default function Chat() {
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const latestMessageRef = useRef<HTMLDivElement | null>(null);

  function handleAnalysisResponse(response: ChatEntry) {
    setChatHistory((prevHistory) => [...prevHistory, response]);
  }

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [chatHistory]);

  return (
    <div
      className={`flex flex-col w-full max-w-6xl mx-auto ${
        chatHistory?.length > 0 ? "h-screen" : ""
      }`}
    >
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {chatHistory.length > 0 ? (
          chatHistory.map((entry, index) => (
            <div
              key={index}
              className="space-y-3"
              ref={index === chatHistory.length - 1 ? latestMessageRef : null}
            >
              {entry.question && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-lg p-4 bg-indigo-600 text-white rounded-tr-none">
                    <div className="whitespace-pre-wrap text-sm">
                      {entry.question}
                    </div>
                  </div>
                </div>
              )}

              <Card className="p-4 bg-muted">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">CSV Analysis Result</p>

                  {/* <Button className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 font-medium" variant="ghost">
                    <Download className="h-4 w-4" /> Download
                  </Button> */}
                </div>

                <div className="text-sm prose prose-lg space-y-6 overflow-x-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ children }) => (
                        <table className="table-auto border-collapse border border-gray-300 w-full">
                          {children}
                        </table>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-300 bg-gray-200 px-4 py-2 text-left">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-300 px-4 py-2">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {entry.answer}
                  </ReactMarkdown>
                </div>
              </Card>
            </div>
          ))
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

            <div className="text-center max-w-2xl mb-8 text-gray-600">
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
        <FileUpload
          onAnalysisComplete={handleAnalysisResponse}
          csvAnalysis={chatHistory}
        />
      </div>
    </div>
  );
}
