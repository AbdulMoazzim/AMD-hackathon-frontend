import { NextResponse } from "next/server";
 
export const maxDuration = 300;
 
const MAX_BYTES = 4 * 1024 * 1024; 
const ALLOWED_FILES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
 
const ROUTES: { method: "GET" | "POST"; pattern: RegExp }[] = [
  { method: "POST", pattern: /^session$/ },
  { method: "POST", pattern: /^consult\/[\w-]+\/(start|answer)$/ },
  { method: "GET", pattern: /^consult\/[\w-]+\/summary$/ },
  { method: "POST", pattern: /^docs$/ },
  { method: "GET", pattern: /^docs\/[\w-]+\/explanation$/ },
  { method: "POST", pattern: /^docs\/[\w-]+\/chat$/ },
];
 
const fail = (code: string, status: number) => NextResponse.json({ code }, { status });
 
async function handle(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const base = process.env.WELLABROAD_API_URL;
  if (!base) return fail("not_configured", 500);
 
  const path = (await ctx.params).path.join("/");
  if (!ROUTES.some((r) => r.method === req.method && r.pattern.test(path))) return fail("not_found", 404);
 
  const init: RequestInit = { method: req.method, signal: AbortSignal.timeout(55_000), cache: "no-store" };
 
  if (req.method === "POST") {
    if (path === "docs") {
      // multipart upload: check the file here so obvious problems never reach the backend
      let form: FormData;
      try {
        form = await req.formData();
      } catch {
        return fail("invalid_upload", 400);
      }
      const file = form.get("file");
      if (!(file instanceof File)) return fail("no_file", 400);
      if (!ALLOWED_FILES.includes(file.type)) return fail("unsupported_type", 415);
      if (file.size > MAX_BYTES) return fail("too_large", 413);
      init.body = form; // fetch sets the multipart boundary itself
    } else {
      init.headers = { "Content-Type": "application/json" };
      init.body = await req.text();
    }
  }
 
  const search = req.method === "GET" ? new URL(req.url).search : ""; // e.g. ?session_id=...
  try {
    const upstream = await fetch(`${base.replace(/\/$/, "")}/${path}${search}`, init);
    return new Response(await upstream.text(), {
      status: upstream.status, // errors pass through, so the client can read FastAPI's { detail }
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return fail("timeout", 504);
  }
}
 
export const GET = handle;
export const POST = handle;