import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });
await client.connect();

const STREAM = "patients:stream";
const GROUP = "consumer-group";
const CONSUMER = "consumer1";
// Same codes as generator
const patientCodes = Array.from(
  { length: 20 },
  (_, i) => `P${String(i + 1).padStart(2, "0")}`
);

// 1) Create consumer group + TimeSeries series
try {
  await client.xGroupCreate(STREAM, GROUP, "0", { MKSTREAM: true });
  console.log("✔ Created stream group");
} catch (e) {
  if (!e.message.includes("BUSYGROUP")) throw e;
}

// Create one TS for each patient’s SpO₂ (24 h retention)
for (const code of patientCodes) {
  const key = `ts:patient:${code}:spo2`;
  try {
    await client.sendCommand([
      "TS.CREATE",
      key,
      "RETENTION",
      "86400000", // 24h in ms
      "LABELS",
      "patient",
      code,
    ]);
  } catch (e) {
    // ignore if exists
  }
}

console.log("▶ Listening for new entries…");

while (true) {
  const res = await client.xReadGroup(
    GROUP,
    CONSUMER,
    { key: STREAM, id: ">" },
    { COUNT: 10, BLOCK: 5000 }
  );
  if (!res) continue;

  for (const { messages } of res) {
    for (const { id, message: f } of messages) {
      const pid = f.id;
      const hr = f.heart_rate;
      const spo2 = f.spo2;
      const sys = f.bp_systolic;
      const dia = f.bp_diastolic;
      const ts = Date.now().toString();

      // 2) Snapshot hash
      await client.hSet(`patient:${pid}:snapshot`, {
        hr,
        spo2,
        sys,
        dia,
        timestamp: new Date(parseInt(ts)).toISOString(),
      });

      // 3) TimeSeries add
      await client.sendCommand(["TS.ADD", `ts:patient:${pid}:spo2`, ts, spo2]);

      // 4) Ack
      await client.xAck(STREAM, GROUP, id);

      console.log(`✅ Processed ${id} → ${pid}`);
    }
  }
}
