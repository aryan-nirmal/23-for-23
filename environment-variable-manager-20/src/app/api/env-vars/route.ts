import { addEnvVar, deleteEnvVar, updateEnvVar } from "@/lib/store";
import type { Environment } from "@/lib/types";
import { ENVIRONMENTS } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { projectId, env, key, value } = body;

  if (!projectId || !env || !key || value === undefined) {
    return NextResponse.json(
      { error: "projectId, env, key, and value are required" },
      { status: 400 }
    );
  }

  if (!ENVIRONMENTS.includes(env as Environment)) {
    return NextResponse.json({ error: "Invalid environment" }, { status: 400 });
  }

  const envVar = addEnvVar(projectId, env as Environment, key, value);
  if (!envVar) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(envVar, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { projectId, env, id, key, value } = body;

  if (!projectId || !env || !id || !key || value === undefined) {
    return NextResponse.json(
      { error: "projectId, env, id, key, and value are required" },
      { status: 400 }
    );
  }

  if (!ENVIRONMENTS.includes(env as Environment)) {
    return NextResponse.json({ error: "Invalid environment" }, { status: 400 });
  }

  const envVar = updateEnvVar(projectId, env as Environment, id, key, value);
  if (!envVar) {
    return NextResponse.json({ error: "Env var not found" }, { status: 404 });
  }

  return NextResponse.json(envVar);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { projectId, env, id } = body;

  if (!projectId || !env || !id) {
    return NextResponse.json(
      { error: "projectId, env, and id are required" },
      { status: 400 }
    );
  }

  if (!ENVIRONMENTS.includes(env as Environment)) {
    return NextResponse.json({ error: "Invalid environment" }, { status: 400 });
  }

  const deleted = deleteEnvVar(projectId, env as Environment, id);
  if (!deleted) {
    return NextResponse.json({ error: "Env var not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}