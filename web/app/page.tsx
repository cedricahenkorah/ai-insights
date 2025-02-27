"use client";

import FileUpload from "@/components/chat/file-upload";
import { Card } from "@/components/ui/card";
import { useChat } from "@ai-sdk/react";
import { Bot } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function Chat() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat();
  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      {/* {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form> */}

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex items-center mb-4">
          <div className="bg-white rounded-full p-2 mr-2 flex gap-x-2">
            <Bot className="h-6 w-6 text-black" />{" "}
            <span className="font-semibold">AI INSIGHTS</span>
          </div>
        </div>

        <div className="text-center max-w-2xl mb-8">
          <p className="mb-4">
            Upload CSV files to extract AI-powered financial insights. Analyze
            market trends, assess investment performance, and uncover key data
            patterns effortlessly.
          </p>
        </div>

        {/* Example prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
          <Card className="border-neutral-800 p-4 transition-colors cursor-pointer">
            <p>Analyze revenue trends from my financial data.</p>
          </Card>
          <Card className="border-neutral-800 p-4 transition-colors cursor-pointer">
            <p>Identify key spending patterns in my CSV file.</p>
          </Card>
          <Card className="border-neutral-800 p-4 transition-colors cursor-pointer">
            <p>Predict future cash flow based on historical data.</p>
          </Card>
          <Card className="border-neutral-800 p-4 transition-colors cursor-pointer">
            <p>Summarize my investment portfolio performance.</p>
          </Card>
        </div>

        <FileUpload />
      </div>
    </div>
  );
}
