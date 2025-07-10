import handler from "./netlify/edge-functions/alert.js";

Deno.serve({}, handler)