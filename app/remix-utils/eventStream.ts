// https://github.com/sergiodxa/remix-utils/blob/main/src/server/event-stream.ts
export interface SendFunctionArgs {
  /**
   * @default "message"
   */
  event?: string;
  data: string;
}

export interface SendFunction {
  (args: SendFunctionArgs): void;
}

export interface CleanupFunction {
  (): void;
}

export interface AbortFunction {
  (): void;
}

export interface InitFunction {
  (send: SendFunction, abort: AbortFunction): CleanupFunction;
}

/**
 * A response helper to use Server Sent Events server-side
 * @param signal The AbortSignal used to close the stream
 * @param init The function that will be called to initialize the stream, here you can subscribe to your events
 * @returns A Response object that can be returned from a loader
 */
export function eventStream(
  signal: AbortSignal,
  init: InitFunction,
  options: ResponseInit = {}
) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      function send({ event = "message", data }: SendFunctionArgs) {
        console.log({ event, data });
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));

        // log the message to the console
        console.log(`Sending message: ${data}`, controller.desiredSize);
      }

      const cleanup = init(send, close);

      let closed = false;

      function close() {
        if (closed) return;
        cleanup();
        closed = true;
        signal.removeEventListener("abort", close);
        controller.close();
      }

      signal.addEventListener("abort", close);

      if (signal.aborted) return close();
    },
  });

  const headers = new Headers(options.headers);

  if (headers.has("Content-Type")) {
    console.warn("Overriding Content-Type header to `text/event-stream`");
  }

  if (headers.has("Cache-Control")) {
    console.warn("Overriding Cache-Control header to `no-cache`");
  }

  if (headers.has("Connection")) {
    console.warn("Overriding Connection header to `keep-alive`");
  }

  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");

  return new Response(stream, { headers });
}
