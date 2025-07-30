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

    let chats;
    if(body.chats && Array.isArray(body.chats)) {
        chats = body.chats;
    } else if (body.chatId) {
        chats = [body.chatId];
    } else {
        chats = [CONSUMER_CHAT_ID];
    }

    sendToChat(chats, body.subject, body.message)
        .then((results) => console.log("Alert message sent successfully:", results.map(r => r.ok)))
        .catch((err) => console.error(err));

    console.log("chats:", chats, body.subject);
    return getResponse(200, "Message will be sent to chats: " + chats);
}

function sendToChat(chats, subject, message) {
    const subjectTag = getSubjectTag(subject);
    const text = `#${subjectTag}\n${message}`;
    return Promise.all(chats.map(chat_id => sendMessage({ chat_id, text })));
}
