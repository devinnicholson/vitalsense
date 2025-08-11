# VitalSense Hackathon Project

A real-time health data pipeline using Redis Streams, RedisJSON, RediSearch,
Pub/Sub, and a beautiful Tailwind/Next.js dashboard.

---

## Prerequisites

- **Node.js** v16+
- **Python 3** (for the static dashboard, optional)
- **Redis 8** instance with modules:

  - RedisJSON
  - Redis Streams
  - RediSearch
  - (Optional) RedisAI

- **Environment variable**

  ```bash
  export REDIS_URL="redis://default:<PASSWORD>@<HOST>:<PORT>"
  ```

---

## 1. Vitals Generator

Emits synthetic patient vitals into `patients:stream`.

```bash
cd vital-sense-generator
npm install
npm start
```

You’ll see logs like:

```
Emitted <streamId> { patientId: 'P01', hr: 82, spo2: 95, sys: 120, dia: 80 }
```

---

## 2. Stream Consumer

Reads from `patients:stream`, writes snapshots to `patient:<ID>:snapshot`, and
acknowledges.

```bash
cd vital-sense-consumer
npm install
npm start
```

You’ll see:

```
✔ Consumer group "consumer-group" created on "patients:stream"
▶ Listening for new entries…
🗂 Got 1 msg(s) from stream "patients:stream"
✅ Processed <streamId> → patient:P01:snapshot { hr: '82', spo2: '95', sys: '120', dia: '80' }
```

---

## 3. Index Creation (RediSearch)

Drop & recreate the snapshots index to cover all `patient:*:snapshot` keys.

```bash
# in vital-sense-consumer/
npm run create-index
```

Expected output:

```
Dropped existing idx:snapshots
✅ Index idx:snapshots created
```

---

## 4. Alert Watcher (Pub/Sub)

Polls the index and publishes critical alerts to `alerts:critical`.

```bash
# in vital-sense-consumer/
npm run watch-alerts
```

Logs every 5 s:

```
Watching for critical patients (SpO₂ <= 92)…
🚨 Alert published for patient:P02
```

---

## 5. WebSocket Proxy

Forwards `alerts:critical` messages to browser WebSockets on port 8080.

```bash
# in vital-sense-consumer/
npm run ws-proxy
```

You’ll see:

```
WebSocket proxy listening on ws://localhost:8080
Subscribed to alerts:critical
Proxy received: {"id":"P02","snapshot":{…}}
```

---

## 6a. Static Dashboard (HTML/JS)

Serves `dashboard/index.html` + `dashboard/app.js` over HTTP:

```bash
cd dashboard
python3 -m http.server 8001
```

Open [http://localhost:8001](http://localhost:8001) and check DevTools ▶ Console
for:

```
Dashboard starting…
✅ WS open
📬 WS message {...}
```

---

## 6b. React/Next.js Dashboard

Fully featured, dark/light-toggleable, animated dashboard.

```bash
cd vitalsense-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and in the browser console
you should see:

```
Opening WS…
✅ Vitals WS open
📬 WS message {...}
```

---

## 7. Troubleshooting Checklist

1. **Stream key mismatch**

   - Generator writes to `patients:stream`.
   - Consumer and index use the same key.

2. **Consumer logs**

   - Look for “🗂 Got …” and “✅ Processed …”.

3. **Index data**

   ```bash
   redis-cli -u "$REDIS_URL" FT.SEARCH idx:snapshots '*'
   ```

4. **Alerts published**

   - Watch `npm run watch-alerts` for “🚨 Alert published”.

5. **WebSocket connectivity**

   - Proxy logs “Proxy received”.
   - Dashboard console logs “WS open” + “WS message”.

---

With all of these services running together, VitalSense streams vitals →
snapshots → search → alerts → live dashboard. Good luck in the hackathon!
