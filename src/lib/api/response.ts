import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export function apiError(error: string, status = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}
