export const config = { runtime: "edge" };

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Example: https://vercel.com/docs/functions/streaming/streaming-examples#processing-data-chunks
export async function loader() {
  const readableStream = new ReadableStream({
    start(controller) {
      const text = "Stream me!";
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });

  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const text = decoder.decode(chunk);
      controller.enqueue(encoder.encode(text.toUpperCase()));
    },
  });
  
  return new Response(readableStream.pipeThrough(transformStream), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
