// app.js
console.log("Dashboard starting…");
const body = document.getElementById("table-body");
const patients = {};

// open WebSocket to proxy
const ws = new WebSocket("ws://localhost:8080");
ws.onopen = () => console.log("✅ WS open");
ws.onerror = (e) => console.error("❌ WS error", e);
ws.onclose = () => console.log("⏹️ WS closed");
ws.onmessage = (msg) => {
  console.log("📬 WS message", msg.data);
  const { id, snapshot } = JSON.parse(msg.data);
  patients[id] = snapshot;
  render();
};

function render() {
  body.innerHTML = "";
  for (const [id, s] of Object.entries(patients)) {
    const tr = document.createElement("tr");
    if (Number(s.spo2) <= 92) tr.classList.add("alert");

    tr.innerHTML = `
      <td>${id}</td>
      <td>${s.hr}</td>
      <td>${s.spo2}</td>
      <td>${s.sys}/${s.dia}</td>
      <td>${s.timestamp}</td>
      <td><button data-id="${id}">Clear</button></td>
    `;
    body.appendChild(tr);
  }
  // attach click handlers
  body.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.onclick = () => {
      const pid = btn.getAttribute("data-id");
      delete patients[pid];
      render();
    };
  });
}
