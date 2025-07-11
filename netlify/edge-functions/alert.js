export const config = {
    runtime: "edge"
};

import { sendMessage } from "../../utils/sender.js";

const PRODUCER_SECRET_TOKEN = Deno.env.get("PRODUCER_SECRET_TOKEN");


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
    if (req.headers.get("X-Producer-Secret-Token") !== PRODUCER_SECRET_TOKEN) {
        console.error("Unauthorized access attempt with invalid API key");
        return erroResponse(401, "Unauthorized: Invalid API Key");
    }
    if (!body) {
        console.error("No body provided in the request");
        return erroResponse(400, "No body provided");
    }
    if (!body.subject) {
        console.error("No subject provided in the request body");
        return erroResponse(400, "No subject provided");
    }
    if (!body.message) {
        console.error("No message provided in the request body");
        return erroResponse(400, "No message provided");
    }
    sendToUsers(body.subject, body.message)
        .then((result) => console.log("result:", result))
        .catch((err) => console.error(err));

    return successResponse("Message received and will be sent to users");
}


function sendToUsers(subject, message) {
    let users = [];
    if (subject === "UserManagement") {
        users = JSON.parse(Deno.env.get("SUBJECT_USER_MANAGEMENT") || "[]");;
    } else if (subject === "LoyaltyManagement") {
        users = JSON.parse(Deno.env.get("SUBJECT_LOYALTY_MANAGEMENT") || "[]");
    } else {
        return Promise.reject(new Error("Unknown subject"));
    }

    
    const promises = users.map((user) => {
        return sendMessage({
            chat_id: user,
            text: `#${subject}\n ${message}`
        });
    });

    return Promise.all(promises);
}
