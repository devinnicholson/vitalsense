// ws_proxy.js
import { createClient } from "redis";
import { WebSocketServer } from "ws";

(async () => {
  const redis = createClient({ url: process.env.REDIS_URL });
  await redis.connect();
  const sub = redis.duplicate();
  await sub.connect();
  await sub.subscribe("alerts:critical", (msg) => {
    wss.clients.forEach((ws) => ws.send(msg));
  });

  const wss = new WebSocketServer({ port: 8080 });
  console.log("WebSocket proxy listening on ws://localhost:8080");
})();
