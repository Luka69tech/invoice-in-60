const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface TelegramMessage {
  text: string;
  parse_mode?: "HTML" | "Markdown";
}

export async function sendTelegram(message: string, parse_mode: "HTML" | "Markdown" = "Markdown"): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("[telegram] Bot token or chat ID not configured");
    return false;
  }

  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode,
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error(`[telegram] Send failed: ${data.description}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[telegram] Error:", err);
    return false;
  }
}

export async function sendTelegramHTML(html: string): Promise<boolean> {
  return sendTelegram(html, "HTML");
}

export function formatStatusEmoji(status: "UP" | "DOWN"): string {
  return status === "UP" ? "🟢" : "🔴";
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}