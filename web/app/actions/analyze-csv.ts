"use server";

import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { parse } from "papaparse";
import { ChatEntry } from "../page";

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
    prompt += `
    Perform a structured and detailed analysis, starting with a **clear and concise summary of key insights first**, followed by a deeper breakdown into these sections:

  ### **Key Insights (Start with this)**
  - Summarize the most critical findings in **2-3 sentences** before diving into details.
  
  ## 1. **Dataset Overview**
  - Provide a summary of the dataset, including:
    - Number of rows/columns
    - Key financial attributes (e.g., revenue, expenses, transactions, balances)
    - Date range and frequency of records (daily, monthly, yearly)
    - Missing, duplicate, or inconsistent values that require cleaning
    - Any detected data types (numeric, categorical, datetime, etc.)
  
  ## 2. **Descriptive Statistics & Metrics**
  - Compute and present key financial metrics:
    - Total revenue, average transaction value, and median expense
    - Standard deviation, variance, and percentiles for financial figures
    - Min, max, and distribution of numerical columns
    - Correlations between key variables (e.g., revenue vs. expenses)
    - Volatility analysis (e.g., standard deviation over time)
  
  ## 3. **Key Trends & Insights**
  - Identify patterns and trends, such as:
    - Revenue or expense growth/decline over time
    - Seasonality (recurring patterns in financial activity)
    - Peak transaction periods (days/weeks/months with highest activity)
    - Any strong correlations (e.g., increase in marketing spend leading to revenue growth)
    - Comparison of different time periods (YoY, MoM analysis)
  
  ## 4. **Anomaly & Risk Detection**
  - Identify and explain any outliers or anomalies, including:
    - Sudden spikes or drops in revenue or expenses
    - Unusual transaction patterns or inconsistencies
    - Potential fraudulent activities or financial risks
  
  ## 5. **Forecasting & Predictive Insights**
  - Based on past data, predict:
    - Expected revenue or expenses for the next period
    - Future trends based on historical patterns
    - Potential risks or opportunities for financial decision-making
  
  ## 6. **Actionable Recommendations**
  - Provide business-oriented recommendations, including:
    - Suggestions for optimizing revenue streams
    - Cost-cutting measures based on spending analysis
    - Key financial KPIs to track
    - Data quality improvements for better decision-making
  
  ## 7. **Suggested Visualizations**
  - Recommend visualizations to enhance understanding, such as:
    - Line charts for revenue/expense trends
    - Box plots for outlier detection
    - Correlation heatmaps for variable relationships
    - Histograms for distribution analysis
    - Forecasting charts (if predictive insights are feasible)
  
  Ensure your analysis is **detailed, insightful, and actionable**, helping businesses or investors make **data-driven financial decisions**.`;
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
