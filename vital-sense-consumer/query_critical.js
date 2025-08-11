// query_critical.js
import { createClient } from "redis";

(async () => {
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();

  // Find all patients with SpO₂ below 92
  const res = await client.ft.search("idx:snapshots", "@spo2:[-inf 92]");

  console.log(`Found ${res.total} critical patients:`);
  for (const doc of res.documents) {
    console.log(` - ${doc.id}`, doc.value);
  }

  await client.quit();
})();
