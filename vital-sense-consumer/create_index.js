// create_index.js
import { createClient } from "redis";

(async () => {
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();

  // 1. Drop any existing index so we start fresh
  try {
    await client.sendCommand(["FT.DROPINDEX", "idx:snapshots", "DD"]);
    console.log("Dropped existing idx:snapshots");
  } catch (err) {
    // ignore if it didn't exist
  }

  // 2. Create a new numeric index on your snapshot hashes
  try {
    await client.ft.create(
      "idx:snapshots",
      {
        hr: { type: "NUMERIC", SORTABLE: true },
        spo2: { type: "NUMERIC", SORTABLE: true },
        sys: { type: "NUMERIC", SORTABLE: true },
        dia: { type: "NUMERIC", SORTABLE: true },
        timestamp: { type: "TAG" },
      },
      {
        ON: "HASH",
        // Index any key that starts with "patient:"
        PREFIX: ["patient:"],
      }
    );
    console.log("✅ Index idx:snapshots created");
  } catch (err) {
    if (err.message.includes("Index already exists")) {
      console.log("⚠️  idx:snapshots already exists");
    } else {
      console.error("❌ Error creating index:", err);
    }
  }

  await client.quit();
})();
