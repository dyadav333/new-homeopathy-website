import { NextResponse } from "next/server";

// Consistent {success, data} / {success:false, error} shape across every
// API route, per the API response standard — and never leak stack traces.
export function ok<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function fail(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );
}
