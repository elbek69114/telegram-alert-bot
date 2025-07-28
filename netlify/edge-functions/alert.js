export const config = {
    runtime: "edge",
};

import {
    getResponse,
    getSubjectTag,
    sendMessage,
} from "../../utils/sender.js";

const PRODUCER_SECRET_TOKEN = Deno.env.get("PRODUCER_SECRET_TOKEN");
const CONSUMER_CHAT_ID = Deno.env.get("CONSUMER_CHAT_ID");

export default async function handler(req) {
    const body = await req.json().catch(() => ({}));
    const apiKey = req.headers.get("X-Producer-Secret-Token");

    if (apiKey !== PRODUCER_SECRET_TOKEN) {
        console.error("Unauthorized: invalid API key:", apiKey);
        return getResponse(401, "Invalid API Key");
    }
    if (!body) {
        console.error("No body provided in the request bod:", body);
        return getResponse(400, "No body provided");
    }
    if (!body.subject) {
        console.error("No subject provided in the request body:", body);
        return getResponse(400, "No subject provided");
    }
    if (!body.message) {
        console.error("No message provided in the request body:", body);
        return getResponse(400, "No message provided");
    }

    const chat_id = body.chatId || CONSUMER_CHAT_ID;

    sendToChat(chat_id, body.subject, body.message)
        .then((result) => console.log("seneded message ok:", result.ok))
        .catch((err) => console.error(err));

    console.log("chat:", chat_id, body.subject);
    return getResponse(200, "Message will be sent to chat: " + chat_id);
}

function sendToChat(chat_id, subject, message) {
    const subjectTag = getSubjectTag(subject);
    const text = `#${subjectTag}\n${message}`;
    return sendMessage({ chat_id, text });
}
