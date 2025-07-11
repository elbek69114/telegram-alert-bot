export const config = {
  runtime: "edge",
};

import { sendMessage, getResponse } from "../../utils/sender.js";

const TELEGRAM_SECRET_TOKEN = Deno.env.get("TELEGRAM_SECRET_TOKEN");


export default async function handler(req) {
  const body = await req.json().catch(() => ({}));
  console.log("Method:", req.method, "URL:", req.url, "body:", body);
  if (
    req.headers.get("X-Telegram-Bot-Api-Secret-Token") !== TELEGRAM_SECRET_TOKEN
  ) {
    console.error("Unauthorized access attempt with invalid API key");
    return getResponse(401, "Unauthorized: Invalid API Key");
  }
  if (!body) {
    console.error("No body provided in the request");
    return getResponse(400, "No body provided");
  }
  if (!body.message) {
    console.error("No message provided in the request body");
    return getResponse(400, "No message provided");
  }
  if (!body.message.chat) {
    console.error("No chat provided in the request body");
    return getResponse(400, "No chat provided");
  }

  let text = body.message.text || "";
  if (text === "/chatid") {
    text = `Your chat ID is: ${body.message.chat.id}`;
  } else if (text === "/start") {
    text = `Welcome! Your chat ID is: ${body.message.chat.id}`;
  } else if (text === "/help") {
    text =
      "Available commands:\n/chatid - Get your chat ID\n/start - Start the bot\n/help - Show this help message";
  } else {
    text = `You said: ${text}`;
  }

  sendMessage({ chat_id: body.message.chat.id, text: text })
    .then((result) => console.log("result:", result))
    .catch((err) => console.error(err));

  return getResponse(200, text);
}
