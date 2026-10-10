import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const serverUrl =
    process.env.GRAPHQL_SERVER_URL ?? "http://localhost:4000/graphql";
  const upstream = await fetch(serverUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
    cache: "no-store",
  });

  return new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
