process.env.HOSTNAME = process.env.NEXT_HOSTNAME ?? "0.0.0.0";

await import("../.next/standalone/server.js");