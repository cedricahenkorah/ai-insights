"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { parse } from "papaparse";

export async function analyzeCSV(file: File) {
  const textData = await file.text();
  const parsedData = parse(textData, { header: true }).data;

  const prompt = `You are a financial data analyst expert specializing in analyzing financial CSV data. Analyze the following financial dataset:\n\n${JSON.stringify(
    parsedData
  )}\n\n
Provide a structured, in-depth analysis with the following sections:

## 1. **Summary**
- Describe the overall structure of the dataset, including the number of records and key columns..
- Explain the dataset’s potential purpose and significance.
- Identify any missing, duplicate, or inconsistent values that may require cleaning.

## 2. **Key Insights**
- Identify patterns, trends, and correlations within the data.
- Highlight significant outliers or anomalies and explain their potential financial impact.
- Provide statistical summaries where relevant (e.g., averages, medians, standard deviations).
- Detect any seasonality or recurring trends.

## 3. **Actionable Recommendations**
- Suggest additional analyses or visualizations that could enhance understanding.
- Recommend any necessary data cleaning or preprocessing steps.
- Offer insights on how this data could be leveraged for financial decision-making, risk assessment, or forecasting.

Ensure that your analysis is data-driven, clear, concise, well-structured and actionable.`;

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    system:
      "You are a financial data analyst expert specializing in analyzing financial CSV data. Your task is to provide clear, concise, and actionable insights based on the ENTIRE dataset's statistics. Ensure your analysis is thorough, data-driven, and structured for easy interpretation.",
  });

  return text;
}
