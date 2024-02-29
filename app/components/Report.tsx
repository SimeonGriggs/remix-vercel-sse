import { useFetcher } from "@remix-run/react";

export function Report() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action="/resource/report">
      <input
        className="rounded bg-blue-500 text-white p-2"
        type="submit"
        value="Send Report"
      />
    </fetcher.Form>
  );
}
