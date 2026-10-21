const version = process.env.BUILD_SHA || "development";

export const dynamic = "force-static";

export function GET() {
  return Response.json(
    { status: "ok", version },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
