import { NextResponse } from "next/server";

export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function POST(req: Request) {
  const url = process.env.TRANSLATE_API_URL;
  if (!url) {
    return NextResponse.json({ message: "The translation service is not configured." }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file was uploaded." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ message: "Unsupported file type." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "That file is too large." }, { status: 413 });
  }

  try {
    const upstream = await fetch(url, {
      method: "POST",
      body: form, // forwards `file` and `target_language`
      headers: process.env.TRANSLATE_API_KEY
        ? { Authorization: `Bearer ${process.env.TRANSLATE_API_KEY}` }
        : undefined,
      signal: AbortSignal.timeout(55_000),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { message: "The translation service couldn't process this document. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json(await upstream.json());
  } catch {
    return NextResponse.json(
      { message: "The translation service didn't respond in time. Please try again." },
      { status: 504 },
    );
  }
}