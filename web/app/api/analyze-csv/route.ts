import { NextResponse } from "next/server";
import { analyzeCSV } from "../../actions/analyze-csv";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const result = await analyzeCSV(file);
  return new Response(result);
}
