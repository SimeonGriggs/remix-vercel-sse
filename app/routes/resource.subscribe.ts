import type { LoaderFunctionArgs } from "@vercel/remix";

import { eventStream } from "~/remix-utils/eventStream";
import { emitter } from "~/services/emitter.server";

type Message = string;

export const config = { runtime: "edge" };

export async function loader({ request }: LoaderFunctionArgs) {
  const stream = eventStream(request.signal, function setup(send) {
    function handle(message: Message) {
      console.log(`Handling message: ${message}`);
      send({ event: "message", data: message });
    }

    console.log(`Opening stream: ${new Date().toISOString()}`);
    emitter.on("message", handle);

    return function clear() {
      console.log(`Closing stream: ${new Date().toISOString()}`);
      emitter.off("message", handle);
    };
  });

  // emitter.emit('message', `Let's get started! ${new Date().toISOString()}`)
  request.signal.addEventListener("abort", () => {
    console.log("Request Aborted");
    emitter.emit("message", `Request Aborted! ${new Date().toISOString()}`);
  });

  emitter.on("error", (error) => {
    console.error("Emitter Error:", error);
    // send({event: 'error', data: error.message})
  });
  emitter.on("close", () => {
    console.log("Emitter Closed");
    // send({event: 'close', data: 'Emitter Closed'})
  });
  emitter.on("open", () => {
    console.log("Emitter Open");
    // send({event: 'open', data: 'Emitter Open'})
  });
  emitter.on("ping", () => {
    console.log("Emitter Ping");
    // send({event: 'ping', data: 'Emitter Ping'})
  });
  emitter.on("pong", () => {
    console.log("Emitter Pong");
    // send({event: 'pong', data: 'Emitter Pong'})
  });
  console.log("content-type", stream.headers.get("content-type"));

  stream.headers.set(
    "Access-Control-Allow-Origin",
    request.headers.get("origin") ?? "*"
  );

  // Required on Vercel?
  // https://github.com/vercel/next.js/discussions/48427#discussioncomment-5624579
  stream.headers.set("Connection", "keep-alive");
  stream.headers.set("Content-Encoding", "none");
  stream.headers.set("Cache-Control", "no-cache, no-transform");
  stream.headers.set("Content-Type", "text/event-stream");

  return stream;
}
