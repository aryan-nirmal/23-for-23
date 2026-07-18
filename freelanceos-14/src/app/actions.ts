"use server";

import { revalidatePath } from "next/cache";
import { createInvoice, type CreateInvoiceInput } from "@/lib/store";

export async function createInvoiceAction(input: CreateInvoiceInput) {
  createInvoice(input);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
}