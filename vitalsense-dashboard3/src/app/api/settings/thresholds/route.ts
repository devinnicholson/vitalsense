// src/app/api/settings/thresholds/route.ts
import { NextResponse } from "next/server";
import { createClient } from "redis";

const SETTINGS_KEY = "settings:thresholds";

export async function GET() {
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();
  const settings = await client.json.get(SETTINGS_KEY);
  await client.quit();
  return NextResponse.json(settings ?? { spo2: 92, hr: 100 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { spo2, hr } = body;
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();
  // Upsert JSON at SETTINGS_KEY
  await client.json.set(SETTINGS_KEY, ".", { spo2, hr });
  await client.quit();
  return NextResponse.json({ spo2, hr });
}
