import handler from "./netlify/edge-functions/index.js";

Deno.serve({}, handler)