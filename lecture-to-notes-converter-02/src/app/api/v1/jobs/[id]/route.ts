import { NextResponse } from 'next/server';

export async function GET(request: Request, context: any) {
  const params = await context.params;
  const { id } = params;

  // For the MVP, we'll simulate the state transition.
  // We'll use a random probability or time-based mock.
  // Let's use a simple probability to simulate waiting for the job to complete.
  const random = Math.random();
  let status = 'queued';
  let progress = 0;

  if (random < 0.2) {
    status = 'queued';
    progress = 0;
  } else if (random < 0.6) {
    status = 'processing';
    progress = Math.floor(Math.random() * 80) + 10;
  } else {
    status = 'completed';
    progress = 100;
  }

  // To make the demo robust, you might pass a ?t= timestamp to mock completion over time.
  const url = new URL(request.url);
  const startedAt = url.searchParams.get('startedAt');
  
  if (startedAt) {
    const elapsed = Date.now() - parseInt(startedAt);
    if (elapsed < 3000) {
      status = 'queued';
      progress = 0;
    } else if (elapsed < 10000) {
      status = 'processing';
      progress = Math.floor((elapsed / 10000) * 100);
    } else {
      status = 'completed';
      progress = 100;
    }
  }

  return NextResponse.json({
    jobId: id,
    status,
    progress
  });
}
