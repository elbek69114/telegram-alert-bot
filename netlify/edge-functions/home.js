import { sendMessage } from "../../utils/sender.js";

export const config = {
  runtime: "edge"
};

function erroResponse(status, error) {
    return new Response(JSON.stringify({ error }), {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

function successResponse(message) {
    return new Response(JSON.stringify({ message }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export default async function handler(req) {
  const body = await req.json().catch(() => ({}));
  console.log("Method:", req.method, "URL:", req.url, "body:", body);
  if (!body) {
    return badRequest(400, "No body provided");
  }
  if (!body.message) {
    return badRequest(400, "No message provided");
  }
  if (!body.message.chat) {
    return badRequest(400, "No chat provided");
  }

  let text = body.message.text || "";
  if (text === "/chatid") {
    text = `Your chat ID is: ${body.message.chat.id}`;
  } else if (text === "/start") {
    text = `Welcome! Your chat ID is: ${body.message.chat.id}`;
  } else if (text === "/help") {
    text = "Available commands:\n/chatid - Get your chat ID\n/start - Start the bot\n/help - Show this help message";
  } else {
    text = `You said: ${text}`;
  }
  
  sendMessage({ chat_id: body.message.chat.id, text: body.message.text })
    .then((result) => console.log("result:", result))
    .catch((err) => console.error(err));

  return successResponse(text);
}
