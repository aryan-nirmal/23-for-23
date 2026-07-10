"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDashboardData() {
  const defaultBusiness = await getOrCreateDefaultBusiness();

  const invoices = await prisma.invoice.findMany({
    where: { business_id: defaultBusiness.id },
    orderBy: { issue_date: 'desc' },
    include: { client: true }
  });

  const totalReceivables = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const overdueAmount = invoices
    .filter(i => i.status === 'overdue' || (i.status !== 'paid' && new Date(i.due_date) < new Date()))
    .reduce((sum, i) => sum + i.total, 0);

  return {
    invoices,
    totalReceivables,
    overdueAmount,
    business: defaultBusiness
  };
}

export async function getOrCreateDefaultBusiness() {
  let business = await prisma.business.findFirst({
    where: { owner_id: "default-owner" }
  });

  if (!business) {
    business = await prisma.business.create({
      data: {
        owner_id: "default-owner",
        name: "My Kirana Store",
        gstin: "22AAAAA0000A1Z5",
        address: "123 Main St, Local Market, City",
      }
    });

    await prisma.client.create({
      data: {
        business_id: business.id,
        name: "Rahul Sharma",
        phone: "+919876543210",
        address: "45 Colony Road"
      }
    });
  }

  return business;
}

export async function getClients() {
  const business = await getOrCreateDefaultBusiness();
  return prisma.client.findMany({
    where: { business_id: business.id }
  });
}

export async function createInvoice(data: any) {
  const business = await getOrCreateDefaultBusiness();

  const invoice = await prisma.invoice.create({
    data: {
      business_id: business.id,
      client_id: data.clientId,
      invoice_number: `INV-${Date.now().toString().slice(-6)}`,
      issue_date: new Date(data.issueDate),
      due_date: new Date(data.dueDate),
      subtotal: data.subtotal,
      tax_total: data.taxTotal,
      total: data.total,
      status: "unpaid",
      items: {
        create: data.items.map((item: any) => ({
          description: item.description,
          qty: item.qty,
          unit_price: item.unitPrice,
          gst_rate: item.gstRate,
          line_total: item.lineTotal,
        }))
      }
    }
  });

  revalidatePath('/');
  return invoice;
}

export async function getInvoiceDetails(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      items: true,
      client: true,
      business: true,
    }
  });
}

export async function updateInvoiceStatus(id: string, status: string) {
  await prisma.invoice.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/');
  revalidatePath(`/invoices/${id}`);
}
