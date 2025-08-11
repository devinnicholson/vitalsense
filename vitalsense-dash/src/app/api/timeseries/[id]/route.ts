// src/app/api/timeseries/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "redis";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // e.g. "P19"
  const client = createClient({ url: process.env.REDIS_URL });
  try {
    await client.connect();

    const nowMs = Date.now();
    const fromMs = nowMs - 24 * 60 * 60 * 1000; // 24 h ago

    // TS.RANGE <key> <from> <to>
    const series = await client.sendCommand([
      "TS.RANGE",
      `ts:patient:${id}:spo2`,
      fromMs.toString(),
      nowMs.toString(),
    ]);

    await client.quit();
    return NextResponse.json({ spo2: series });
  } catch (err: any) {
    console.error("Error in /api/timeseries/[id]:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
