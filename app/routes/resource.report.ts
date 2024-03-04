import { emitter } from "~/services/emitter.server";

export const config = { runtime: "edge" };

export const headers = {
  Connection: "keep-alive",
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  "Content-Encoding": "none",
};

export const action = async () => {
  emitter.emit("message", `Hello, world! ${new Date().toISOString()}`);

  setTimeout(
    () => {
      emitter.emit("message", `Delayed update! ${new Date().toISOString()}`);
    },
    // random time between 1000 and 2500
    Math.floor(Math.random() * 2000) + 1000
  );

  await new Promise((resolve) => setTimeout(resolve, 500));

  const headers = new Headers()

  // headers.set("Connection", "keep-alive");
  headers.set("Content-Encoding", "none");
  headers.set("Cache-Control", "no-cache, no-transform");
  // headers.set("Content-Type", "text/event-stream");

  return new Response("OK", {headers});
};
