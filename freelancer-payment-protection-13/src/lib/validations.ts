import { z } from "zod";

export const milestoneInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  amount: z.coerce.number().positive("Amount must be positive"),
  dueDate: z.string().min(1, "Due date is required"),
});

export const createProjectSchema = z
  .object({
    clientName: z.string().min(1, "Client name is required").max(100),
    milestones: z
      .array(milestoneInputSchema)
      .min(1, "At least one milestone is required"),
  })
  .superRefine((data, ctx) => {
    const total = data.milestones.reduce((sum, m) => sum + m.amount, 0);
    if (total <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total project amount must be greater than zero",
        path: ["milestones"],
      });
    }
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type MilestoneInput = z.infer<typeof milestoneInputSchema>;