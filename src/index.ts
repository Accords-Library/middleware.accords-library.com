import { Hono } from "hono";
import { getResponse, purgeCache } from "./cache";

const app = new Hono();

app.on("PURGE", "*", async ({ req }) => {
  if (req.headers.get("Authorization") !== `Bearer ${Bun.env.PURGE_TOKEN}`) {
    console.log("🛑 Purge request rejected for", req.url);
    return new Response(null, { status: 403 });
  }
  console.log("🔥 Purge request accepted for", req.url);
  await purgeCache(req.raw);
  return new Response(null, { status: 200 });
});

app.get(async ({ req }) => await getResponse(req.raw));

const server = Bun.serve({
  port: Bun.env.OUTGOING_PORT,
  fetch: app.fetch,
});
console.log(`👂 Listening on http://${server.hostname}:${server.port}`);
