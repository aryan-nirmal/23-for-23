"use server";

import { revalidatePath } from "next/cache";
import {
  addProject,
  addTransaction,
  generateId,
  generatePaymentId,
  getProject,
  updateMilestone,
} from "@/lib/store";
import { createProjectSchema } from "@/lib/validations";
import type { Milestone, Project } from "@/lib/types";

function revalidateProjectPaths(projectId: string) {
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/ledger");
}

export async function createProject(formData: FormData) {
  const rawMilestones = JSON.parse(
    (formData.get("milestones") as string) || "[]"
  );

  const parsed = createProjectSchema.safeParse({
    clientName: formData.get("clientName"),
    milestones: rawMilestones,
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const totalAmount = parsed.data.milestones.reduce(
    (sum, m) => sum + m.amount,
    0
  );

  const milestones: Milestone[] = parsed.data.milestones.map((m) => ({
    id: generateId("ms"),
    title: m.title,
    amount: m.amount,
    dueDate: m.dueDate,
    status: "draft",
  }));

  const project: Project = {
    id: generateId("proj"),
    clientName: parsed.data.clientName,
    totalAmount,
    milestones,
    createdAt: new Date().toISOString(),
  };

  addProject(project);
  revalidatePath("/projects");

  return { success: true as const, projectId: project.id };
}

export async function fundMilestone(projectId: string, milestoneId: string) {
  const project = getProject(projectId);
  if (!project) return { success: false as const, error: "Project not found" };

  const milestone = project.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return { success: false as const, error: "Milestone not found" };
  if (milestone.status !== "draft") {
    return { success: false as const, error: "Milestone must be in draft status" };
  }

  const paymentId = generatePaymentId("fund");

  updateMilestone(projectId, milestoneId, (m) => {
    m.status = "funded";
  });

  addTransaction({
    id: generateId("txn"),
    projectId,
    clientName: project.clientName,
    milestoneId,
    milestoneTitle: milestone.title,
    type: "fund",
    amount: milestone.amount,
    timestamp: new Date().toISOString(),
    paymentId,
    status: "success",
  });

  revalidateProjectPaths(projectId);
  return { success: true as const, paymentId };
}

export async function startMilestone(projectId: string, milestoneId: string) {
  const milestone = getProject(projectId)?.milestones.find(
    (m) => m.id === milestoneId
  );
  if (!milestone) return { success: false as const, error: "Milestone not found" };
  if (milestone.status !== "funded") {
    return {
      success: false as const,
      error: "Milestone must be funded before starting work",
    };
  }

  updateMilestone(projectId, milestoneId, (m) => {
    m.status = "in_progress";
  });

  revalidateProjectPaths(projectId);
  return { success: true as const };
}

export async function submitMilestone(projectId: string, milestoneId: string) {
  const milestone = getProject(projectId)?.milestones.find(
    (m) => m.id === milestoneId
  );
  if (!milestone) return { success: false as const, error: "Milestone not found" };
  if (milestone.status !== "in_progress") {
    return {
      success: false as const,
      error: "Milestone must be in progress to submit work",
    };
  }

  updateMilestone(projectId, milestoneId, (m) => {
    m.status = "submitted";
  });

  revalidateProjectPaths(projectId);
  return { success: true as const };
}

export async function approveMilestone(projectId: string, milestoneId: string) {
  const milestone = getProject(projectId)?.milestones.find(
    (m) => m.id === milestoneId
  );
  if (!milestone) return { success: false as const, error: "Milestone not found" };
  if (milestone.status !== "submitted") {
    return {
      success: false as const,
      error: "Milestone must be submitted before approval",
    };
  }

  updateMilestone(projectId, milestoneId, (m) => {
    m.status = "approved";
  });

  revalidateProjectPaths(projectId);
  return { success: true as const };
}

export async function releaseMilestone(projectId: string, milestoneId: string) {
  const project = getProject(projectId);
  if (!project) return { success: false as const, error: "Project not found" };

  const milestone = project.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return { success: false as const, error: "Milestone not found" };
  if (milestone.status !== "approved") {
    return {
      success: false as const,
      error: "Milestone must be approved before releasing payment",
    };
  }

  const paymentId = generatePaymentId("release");

  updateMilestone(projectId, milestoneId, (m) => {
    m.status = "released";
  });

  addTransaction({
    id: generateId("txn"),
    projectId,
    clientName: project.clientName,
    milestoneId,
    milestoneTitle: milestone.title,
    type: "release",
    amount: milestone.amount,
    timestamp: new Date().toISOString(),
    paymentId,
    status: "success",
  });

  revalidateProjectPaths(projectId);
  return { success: true as const, paymentId };
}