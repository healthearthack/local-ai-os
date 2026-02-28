import { invoke } from "@tauri-apps/api/core";

// Elements
const bouncer = document.getElementById("bouncer");
const amountEl = document.getElementById("amount");
const chatContainer = document.getElementById("chat-container");
const chatClose = document.getElementById("chat-close");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

// Bouncing logic
let vx = 2.5;
let vy = 2.0;

function updateAmount() {
  const now = new Date();
  const base = 12345.67;
  const delta = (now.getSeconds() + now.getMilliseconds() / 1000) * 1.23;
  const value = base + delta;
  amountEl.textContent = `$${value.toFixed(2)}`;
}
setInterval(updateAmount, 200);

function animate() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const rect = bouncer.getBoundingClientRect();

  let x = rect.left + vx;
  let y = rect.top + vy;

  if (x <= 0 || x + rect.width >= w) vx = -vx;
  if (y <= 0 || y + rect.height >= h) vy = -vy;

  bouncer.style.left = `${x}px`;
  bouncer.style.top = `${y}px`;

  requestAnimationFrame(animate);
}

bouncer.style.left = "50px";
bouncer.style.top = "50px";
requestAnimationFrame(animate);

// Chat UI
function addMessage(sender, text) {
  const div = document.createElement("div");
  div.textContent = `${sender}: ${text}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function fakeBotReply(userText) {
  setTimeout(() => {
    addMessage("Bot", `You said: "${userText}"`);
  }, 400);
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage("You", text);
  chatInput.value = "";
  fakeBotReply(text);
}

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function openChat() {
  chatContainer.classList.remove("hidden");
  chatInput.focus();
}

function closeChat() {
  chatContainer.classList.add("hidden");
}

bouncer.addEventListener("click", () => {
  if (chatContainer.classList.contains("hidden")) {
    openChat();
  } else {
    closeChat();
  }
});

// Optional: ask Rust side to toggle OS-level click-through if you want
// full pass-through outside the visible UI (Windows only).
// Example:
// invoke("set_click_through", { enable: true });


