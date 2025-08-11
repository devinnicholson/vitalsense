import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });
await client.connect();

// Anonymized patient codes P01–P20
const patientCodes = Array.from(
  { length: 20 },
  (_, i) => `P${String(i + 1).padStart(2, "0")}`
);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function emitVitals() {
  const patientId =
    patientCodes[Math.floor(Math.random() * patientCodes.length)];
  const hr = randomInt(60, 100);
  const spo2 = randomInt(85, 100);
  const sys = randomInt(110, 130);
  const dia = randomInt(70, 85);

  client
    .xAdd("patients:stream", "*", {
      id: patientId,
      heart_rate: hr.toString(),
      spo2: spo2.toString(),
      bp_systolic: sys.toString(),
      bp_diastolic: dia.toString(),
    })
    .then((id) =>
      console.log(`Emitted ${id}`, { patientId, hr, spo2, sys, dia })
    )
    .catch(console.error);
}

setInterval(emitVitals, 1000);
