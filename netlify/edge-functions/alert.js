export const config = {
    runtime: "edge",
};

import { sendMessage } from "../../utils/sender.js";

const PRODUCER_API_KEY = Deno.env.get("PRODUCER_API_KEY");
const SUBJECT_USER_MANAGEMENT = JSON.parse(
    Deno.env.get("SUBJECT_USER_MANAGEMENT") || "[]",
);

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
    if (req.headers.get("X-Api-Key") !== PRODUCER_API_KEY) {
        return erroResponse(401, "Unauthorized: Invalid API Key");
    }
    if (!body) {
        return erroResponse(400, "No body provided");
    }
    if (!body.subject) {
        return erroResponse(400, "No subject provided");
    }
    if (!body.message) {
        return erroResponse(400, "No message provided");
    }
    sendToUsers(body.subject, body.message)
        .then((result) => console.log("result:", result))
        .catch((err) => console.error(err));

    return successResponse("Message received and will be sent to users");
}


function sendToUsers(subject, message) {
    let users = [];
    if (subject === "user-management") {
        users = SUBJECT_USER_MANAGEMENT;
    }

    
    const promises = users.map((user) => {
        return sendMessage({
            chat_id: user,
            text: message,
        });
    });

    return Promise.all(promises);
}
