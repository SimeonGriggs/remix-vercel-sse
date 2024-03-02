import type { MetaFunction } from "@vercel/remix";
import { Log } from "~/components/Log";
import { Report } from "~/components/Report";

export const config = {runtime: 'edge'}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="p-12 grid grid-cols-1 gap-8 max-w-prose mx-auto">
      <div className="prose lg:prose-xl">
        <h1>Remix, Vercel and Server-sent Events</h1>
      </div>
      <Report />
      <Log />
    </div>
  );
}
