import { emitter } from "~/services/emitter";

export const action = async () => {
  emitter.emit("message", `Hello, world! ${new Date().toISOString()}`);

  setTimeout(
    () => {
      emitter.emit("message", `Delayed update! ${new Date().toISOString()}`);
    },
    // random time between 500 and 2500
    Math.floor(Math.random() * 2000) + 500
  );

  return new Response("OK");
};
