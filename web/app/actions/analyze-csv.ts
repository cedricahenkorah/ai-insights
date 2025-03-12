"use server";

import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { parse } from "papaparse";
import { ChatEntry } from "../(chat)/page";

export async function analyzeCSV(
  file: File,
  question?: string,
  history: ChatEntry[] = []
) {
  const textData = await file.text();
  const parsedData = parse(textData, { header: true }).data;

  const conversationHistory = history
    .map((entry) => `Q: ${entry.question}\nA: ${entry.answer}`)
    .join("\n\n");

  let prompt = `You are a financial data analyst expert specializing in CSV-based financial data analysis. Analyze the following dataset:\n\n${JSON.stringify(
    parsedData
  )}\n\n`;

  if (conversationHistory) {
    prompt += `Here is the previous conversation for context:\n${conversationHistory}\n\n Answer this specific follow-up question based on the context and data: "${question}"\n`;
  }

  if (question && !conversationHistory) {
    prompt += `\n\nAnswer this specific question based on the data: "${question}". Ensure the response is **direct, data-driven, and actionable**. Start with the answer first, then briefly support it with key insights.\n\n`;
  } else if (!question && !conversationHistory) {
    prompt += `Perform a structured and detailed analysis, starting with **Key Insights**, followed by:
      - Dataset Overview
      - Descriptive Statistics & Metrics
      - Trends & Insights
      - Anomalies & Risks
      - Predictive Insights
      - Recommendations
      - Suggested Visualizations
      Ensure your analysis is **thorough and actionable**.`;
  }

  const { text } = await generateText({
    // model: openai("gpt-4o"),
    model: google("gemini-2.0-flash-001"),
    prompt,
    system:
      "You are a financial data analyst expert specializing in analyzing financial CSV data. Your task is to provide clear, concise, and actionable insights based on the ENTIRE dataset's statistics. Ensure your analysis is thorough, data-driven, and structured for easy interpretation. Answer any additional user question with relevant data-backed reasoning.",
  });

  return text;
}
