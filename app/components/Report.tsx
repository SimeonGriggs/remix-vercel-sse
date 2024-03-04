import { useFetcher } from "@remix-run/react";

export function Report({origin}: {origin: string}) {
  const fetcher = useFetcher();
  const pathname = "/resource/report";
  const url = new URL(pathname, origin);

  return (
    <fetcher.Form method="post" action={pathname}>
      {url.toString()}<br/>
      <input
        className="rounded bg-blue-500 text-white p-2 disabled:opacity-25 transition-opacity duration-100"
        disabled={fetcher.state !== 'idle'}
        type="submit"
        value="Request Report"
      />
    </fetcher.Form>
  );
}
