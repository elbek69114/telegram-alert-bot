const TELEGRAM_API_URL = Deno.env.get("TELEGRAM_API_URL");
const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
const URI = `${TELEGRAM_API_URL}/${TELEGRAM_API_KEY}/sendMessage`

export async function sendMessage(message) {
    
  try {
    const response = await fetch(URI, {
      method: "POST",
      body: JSON.stringify(message),
      headers: { "Content-Type": "application/json" },
    });
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    throw new Error(`HTTP request failed: ${error.message}`);
  }
}


export function getResponse(status, message) {
    return new Response(JSON.stringify({ message }), {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export function getSubjectTag(subject) {
  return subject
    .split('-') // Split by hyphens
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase rest
    .join(''); // Join without separators
}
