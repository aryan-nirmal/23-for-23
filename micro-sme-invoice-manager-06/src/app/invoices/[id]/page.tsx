import { getInvoiceDetails } from "@/actions/invoice";
import InvoiceView from "./InvoiceView";

export default async function InvoicePage(context: any) {
  const params = await context.params;
  const invoice = await getInvoiceDetails(params.id);

  if (!invoice) return <div className="text-center p-8">Invoice not found.</div>;

  return (
    <div className="pb-12">
      <InvoiceView invoice={invoice} />
    </div>
  );
}
