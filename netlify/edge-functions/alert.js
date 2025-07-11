export const config = {
    runtime: "edge",
};

import { sendMessage, getResponse } from "../../utils/sender.js";

const PRODUCER_SECRET_TOKEN = Deno.env.get("PRODUCER_SECRET_TOKEN");

function kebabToUpperCaseWithUnderscore(kebabCase){
    return kebabCase.replace(/-/g, "_").toUpperCase();
}

function kebabToPascalCase(kebabCase) {
  return kebabCase
    .split('-') // Split by hyphens
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase rest
    .join(''); // Join without separators
}

export default async function handler(req) {
    const body = await req.json().catch(() => ({}));
    console.log("Method:", req.method, "URL:", req.url, "body:", body);
    if (req.headers.get("X-Producer-Secret-Token") !== PRODUCER_SECRET_TOKEN) {
        console.error("Unauthorized access attempt with invalid API key");
        return getResponse(401, "Unauthorized: Invalid API Key");
    }
    if (!body) {
        console.error("No body provided in the request");
        return getResponse(400, "No body provided");
    }
    if (!body.subject) {
        console.error("No subject provided in the request body");
        return getResponse(400, "No subject provided");
    }
    if (!body.message) {
        console.error("No message provided in the request body");
        return getResponse(400, "No message provided");
    }
    
    let subjectPascalCase = kebabToPascalCase(body.subject);
    let users = JSON.parse(Deno.env.get(subjectPascalCase) || "[]");
    if (!users || users.length === 0 || !Array.isArray(users)) {
        console.error("No users found for the subject:", subjectPascalCase);
        return getResponse(404, "No users found for the subject");
    }
    
    sendToUsers(users, subjectPascalCase, body.message)
        .then((result) => console.log("result:", result))
        .catch((err) => console.error(err));

    return getResponse(200, "Message received and will be sent to users: " + users.join(", "));
}

function sendToUsers(users, subjectPascalCase, message) {
    const promises = users.map((user) => {
        return sendMessage({
            chat_id: user,
            text: `#${subjectPascalCase}\n ${message}`,
        });
    });

    return Promise.all(promises);
}
