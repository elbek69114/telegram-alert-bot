const url = Deno.env.get("API_URL");
const key = Deno.env.get("API_KEY");

export async function sendMessage(message) {
    
  try {
    const fullUrl = `${url}/${key}/sendMessage`
    console.log(fullUrl)
    const response = await fetch(fullUrl, {
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
