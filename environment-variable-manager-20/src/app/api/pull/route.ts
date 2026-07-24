import { validatePullToken } from "@/lib/auth";
import { getEnvVars, getTokens, logPull } from "@/lib/store";
import type { Environment } from "@/lib/types";
import { ENVIRONMENTS } from "@/lib/types";
import { formatEnvFile } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const project = searchParams.get("project");
  const env = searchParams.get("env") as Environment | null;
  const token = searchParams.get("token");

  if (!project || !env || !token) {
    return NextResponse.json(
      { error: "Missing required parameters: project, env, token" },
      { status: 400 }
    );
  }

  if (!ENVIRONMENTS.includes(env)) {
    return NextResponse.json(
      { error: "Invalid environment. Must be dev, staging, or production" },
      { status: 400 }
    );
  }

  const tokens = getTokens();
  if (!validatePullToken(token, project, env, tokens)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const vars = getEnvVars(project, env);
  logPull(project, env);

  const body = formatEnvFile(vars);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}