export const config = {
    runtime: "edge",
};

import {
    getResponse,
    getSubjectTag,
    getUsers,
    sendMessage,
} from "../../utils/sender.js";

const PRODUCER_SECRET_TOKEN = Deno.env.get("PRODUCER_SECRET_TOKEN");

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

    let users = getUsers(body.subject);
    if (!users || users.length === 0 || !Array.isArray(users)) {
        console.error(`No users found for the subject: ${body.subject}`);
        return getResponse(
            404,
            `No users found for the subject: ${body.subject}`,
        );
    }

    sendToUsers(users, body.subject, body.message)
        .then((result) => console.log("result:", result))
        .catch((err) => console.error(err));

    console.log("Users:", users, body.subject, body.message);
    return getResponse(200, "Message will be sent to users: " + users);
}

function sendToUsers(users, subject, message) {
    let subjectTag = getSubjectTag(subject);
    const promises = users.map((user) => {
        return sendMessage({
            chat_id: user,
            text: `#${subjectTag}\n${message}`,
        });
    });

    return Promise.all(promises);
}
