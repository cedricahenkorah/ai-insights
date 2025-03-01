import { NextResponse } from "next/server";
import { analyzeCSV } from "../../actions/analyze-csv";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const question = formData.get("question") as string | undefined;
  const history = JSON.parse((formData.get("history") as string) || "[]");

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const result = await analyzeCSV(file, question, history);
  return new Response(result);
}
