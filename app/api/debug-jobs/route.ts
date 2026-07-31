import { getJobs } from "@/lib/wp-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await getJobs();
    return Response.json({ jobs });
  } catch (err: unknown) {
    return Response.json({ error: String(err), jobs: [] }, { status: 500 });
  }
}
