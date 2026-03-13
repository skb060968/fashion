// app/api/warmup/route.ts
import { prisma } from "@/lib/prisma";

export async function POST() {
  let retries = 1; // try up to 1 times
  while (retries > 0) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return new Response("Warm-up successful", { status: 200 });
    } catch (err) {
      retries--;
      if (retries === 0) {
        console.error("Warm-up failed after retries:", err);
        return new Response("Warm-up failed", { status: 500 });
      }
      // wait 1000 ms before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}