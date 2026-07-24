import { getAllEnvVarsForProject, getProject, getTokensForProject } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({
    project,
    envVars: getAllEnvVarsForProject(id),
    tokens: getTokensForProject(id),
  });
}