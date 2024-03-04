import { useFetcher } from "@remix-run/react";

export function Report({ origin }: { origin: string }) {
  const fetcher = useFetcher();
  const pathname = "/resource/report";
  const url = new URL(pathname, origin);

  return (
    <fetcher.Form
      method="post"
      action={pathname}
      className="flex items-center gap-3"
    >
      <input
        className="rounded bg-blue-500 text-white p-2 disabled:opacity-25 transition-opacity duration-100"
        disabled={fetcher.state !== "idle"}
        type="submit"
        value="Request Report"
      />
      <span className="font-mono text-xs text-blue-500">{url.toString()}</span>
    </fetcher.Form>
  );
}
