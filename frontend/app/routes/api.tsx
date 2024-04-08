import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const data = context.remixService.getHello();
  console.log(data);
  return json({ status: "It is working 👍", data });
};

export default function Page() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>👋 Hello c&apos;est nico</h1>
      <p>{data.data}</p>
    </main>
  );
}
