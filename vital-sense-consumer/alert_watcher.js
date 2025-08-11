import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });
await client.connect();

async function getThresholds() {
  return (
    (await client.json.get("settings:thresholds")) || { spo2: 92, hr: 100 }
  );
}

console.log("Watching for critical patients…");
while (true) {
  const { spo2, hr } = await getThresholds();
  const q = `@spo2:[-inf ${spo2}] | @heart_rate:[${hr} +inf]`;
  const res = await client.ft.search("idx:snapshots", q);
  for (const doc of res.documents) {
    await client.publish(
      "alerts:critical",
      JSON.stringify({
        id: doc.id,
        snapshot: doc.value,
      })
    );
  }
  await new Promise((r) => setTimeout(r, 5000));
}
