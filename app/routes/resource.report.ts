import { emitter } from "~/services/emitter.server";

export const config = {runtime: 'edge'}

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

  return new Response("OK");
};
