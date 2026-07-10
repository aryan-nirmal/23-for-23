import { getDashboardData } from "@/actions/invoice";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, ArrowRight, TrendingUp, AlertCircle, FileText } from "lucide-react";

export default async function Home() {
  const { invoices, totalReceivables, overdueAmount } = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Link href="/invoices/new" className="btn-primary flex items-center gap-2 text-sm hidden md:flex">
          <Plus size={16} /> Create Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 border-l-4 border-l-primary-500">
          <p className="text-sm font-medium text-muted flex items-center gap-1"><TrendingUp size={14} /> Total Receivables</p>
          <p className="text-2xl font-bold mt-2">₹ {totalReceivables.toLocaleString()}</p>
        </div>
        <div className="card p-5 border-l-4 border-l-danger">
          <p className="text-sm font-medium text-muted flex items-center gap-1"><AlertCircle size={14} /> Overdue</p>
          <p className="text-2xl font-bold mt-2 text-danger">₹ {overdueAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Invoices</h3>
          <Link href="/invoices" className="text-sm text-primary-600 font-medium hover:underline">View all</Link>
        </div>
        
        {invoices.length === 0 ? (
          <div className="card p-8 text-center flex flex-col items-center">
            <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center text-primary-500 mb-4">
              <FileText size={32} />
            </div>
            <h4 className="font-semibold text-lg">No invoices yet</h4>
            <p className="text-gray-500 text-sm mt-1 max-w-xs mb-6">Create your first invoice to start tracking your receivables.</p>
            <Link href="/invoices/new" className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Create Invoice
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="divide-y divide-card-border">
              {invoices.slice(0, 5).map((invoice) => (
                <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors block">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-sm">
                      {invoice.client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{invoice.client.name}</p>
                      <p className="text-xs text-muted flex items-center gap-2">
                        <span>{invoice.invoice_number}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{format(new Date(invoice.issue_date), 'dd MMM yyyy')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹ {invoice.total.toLocaleString()}</p>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                      invoice.status === 'paid' ? 'bg-success/10 text-success' :
                      invoice.status === 'overdue' ? 'bg-danger/10 text-danger' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
