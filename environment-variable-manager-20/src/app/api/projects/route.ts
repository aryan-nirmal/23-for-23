import { createProject, getProjects } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const projects = getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const project = createProject(name, description ?? "");
  return NextResponse.json(project, { status: 201 });
}