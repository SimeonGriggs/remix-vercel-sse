import { useEffect, useMemo, useState } from "react";

import { useEventSource } from "~/remix-utils/useEventSource";

const pathname = `/resource/subscribe`;

export function Log({ origin }: { origin: string }) {
  const url = useMemo(() => new URL(pathname, origin), [origin]);

  const latestMessage = useEventSource(url, {
    event: "message",
    // Prevents error on Vercel's protected preview builds?
    init: { withCredentials: true },
  });
  const [messageLog, setMessageLog] = useState<string[]>([]);
  console.log({latestMessage})
  useEffect(() => {
    if (latestMessage && !messageLog.includes(latestMessage)) {
      const updatedLog = [latestMessage, ...messageLog];
      setMessageLog(updatedLog);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestMessage, messageLog]);

  useEffect(() => {
    const source = new EventSource(url, { withCredentials: true });

    if (source) {
      source.onopen = (e) => {
        console.log(`open`, e);
      };
      source.onmessage = (e) => {
        console.log("onmessage", e);
      };
      source.addEventListener("ping", (e) => {
        console.log(`ping`, e);
      });
      source.onerror = (e) => {
        console.log(`error`, e);
      };
    }

    return () => {
      source.close();
    };
  }, [url]);

  return (
    <div className="rounded bg-slate-950 p-8 font-mono text-xs leading-paragraph text-white">
      {url.toString()}
      {messageLog.length > 0 ? (
        <div className="grid-col-1 grid gap-1">
          {messageLog.map((message, i) => (
            <div key={i}>{message}</div>
          ))}
        </div>
      ) : (
        <div className="animate-pulse opacity-50">
          Message log will appear here
        </div>
      )}
    </div>
  );
}
