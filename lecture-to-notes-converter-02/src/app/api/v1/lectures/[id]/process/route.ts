import { NextResponse } from 'next/server';

export async function POST(request: Request, context: any) {
  const params = await context.params;
  const { id } = params;
  
  // Create a mock job Id
  const jobId = `job_${Math.random().toString(36).substring(2, 15)}`;

  // In a real app, this would insert a job record into Supabase and trigger a Celery/Inngest background task.
  return NextResponse.json({
    jobId,
    status: 'queued'
  });
}
