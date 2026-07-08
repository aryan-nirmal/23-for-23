import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // In a real app, parse multipart form data, validate file duration, type, and size
  // and upload to Supabase Storage.
  const formData = await request.formData();
  const title = formData.get('title') || 'Untitled Lecture';
  const subject = formData.get('subject') || 'General';

  // Mock a new lecture UUID
  const lectureId = `lect_${Math.random().toString(36).substring(2, 15)}`;

  return NextResponse.json({
    lectureId,
    title,
    subject,
    status: 'uploaded',
    durationSeconds: 1800 // Mock duration
  });
}
