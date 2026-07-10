"use client";

import { useState } from "react";
import { updateInvoiceStatus } from "@/actions/invoice";
import { format } from "date-fns";
import jsPDF from "jspdf";
import { Download, Share2, CheckCircle, Clock } from "lucide-react";

export default function InvoiceView({ invoice }: { invoice: any }) {
  const [status, setStatus] = useState(invoice.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: any) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    await updateInvoiceStatus(invoice.id, newStatus);
    setStatus(newStatus);
    setIsUpdating(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    
    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 150, y);
    
    doc.setFontSize(16);
    doc.text(invoice.business.name, 20, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`GSTIN: ${invoice.business.gstin || "N/A"}`, 20, y);
    y += 6;
    doc.text(invoice.business.address || "", 20, y);
    
    y += 15;
    
    // Invoice Info
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, y);
    doc.text(`Invoice #: ${invoice.invoice_number}`, 140, y);
    y += 6;
    
    doc.setFont("helvetica", "normal");
    doc.text(invoice.client.name, 20, y);
    doc.text(`Date: ${format(new Date(invoice.issue_date), 'dd MMM yyyy')}`, 140, y);
    y += 6;
    
    doc.text(`Phone: ${invoice.client.phone}`, 20, y);
    doc.text(`Due: ${format(new Date(invoice.due_date), 'dd MMM yyyy')}`, 140, y);
    y += 6;
    
    if (invoice.client.gstin) {
      doc.text(`GSTIN: ${invoice.client.gstin}`, 20, y);
    }
    
    y += 15;

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 5, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Description", 22, y);
    doc.text("Qty", 100, y);
    doc.text("Price", 120, y);
    doc.text("GST", 145, y);
    doc.text("Total", 170, y);
    y += 10;
    
    // Table Rows
    doc.setFont("helvetica", "normal");
    invoice.items.forEach((item: any) => {
      doc.text(item.description.substring(0, 30), 22, y);
      doc.text(item.qty.toString(), 100, y);
      doc.text(`Rs ${item.unit_price.toFixed(2)}`, 120, y);
      doc.text(`${item.gst_rate}%`, 145, y);
      doc.text(`Rs ${item.line_total.toFixed(2)}`, 170, y);
      y += 8;
    });

    y += 10;
    
    // Totals
    doc.line(120, y, 190, y);
    y += 6;
    doc.text("Subtotal:", 130, y);
    doc.text(`Rs ${invoice.subtotal.toFixed(2)}`, 160, y);
    y += 6;
    doc.text("Tax (GST):", 130, y);
    doc.text(`Rs ${invoice.tax_total.toFixed(2)}`, 160, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 130, y);
    doc.text(`Rs ${invoice.total.toFixed(2)}`, 160, y);

    doc.save(`Invoice_${invoice.invoice_number}.pdf`);
  };

  const shareWhatsApp = () => {
    const text = `Hello ${invoice.client.name},%0A%0AThis is an invoice from ${invoice.business.name}.%0AInvoice No: ${invoice.invoice_number}%0ADue Date: ${format(new Date(invoice.due_date), 'dd MMM yyyy')}%0AAmount Due: Rs ${invoice.total.toFixed(2)}%0A%0APlease process the payment at your earliest convenience.%0AThank you!`;
    const url = `https://wa.me/${invoice.client.phone.replace(/[^0-9]/g, '')}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {invoice.invoice_number}
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
              status === 'paid' ? 'bg-success/10 text-success' :
              status === 'overdue' ? 'bg-danger/10 text-danger' :
              'bg-warning/10 text-warning'
            }`}>
              {status}
            </span>
          </h2>
          <p className="text-sm text-muted mt-1">Due {format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={shareWhatsApp}
            className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
            title="Share via WhatsApp"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={exportPDF}
            className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center hover:bg-primary-200 transition-colors"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-card-border pb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Payment Status
            {isUpdating && <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />}
          </h3>
          <select 
            className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
            value={status}
            onChange={handleStatusChange}
            disabled={isUpdating}
          >
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial Payment</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm pt-2">
          <div>
            <p className="text-muted mb-1">Billed To</p>
            <p className="font-medium">{invoice.client.name}</p>
            <p className="text-gray-500">{invoice.client.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-muted mb-1">Amount</p>
            <p className="font-bold text-xl text-primary-600">₹ {invoice.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-card-border flex justify-between font-semibold text-sm">
          <span>Item</span>
          <span>Amount</span>
        </div>
        <div className="divide-y divide-card-border">
          {invoice.items.map((item: any) => (
            <div key={item.id} className="p-4 flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-xs text-muted mt-1">{item.qty} × ₹{item.unit_price} (+{item.gst_rate}% GST)</p>
              </div>
              <p className="font-medium">₹ {(item.line_total * (1 + item.gst_rate / 100)).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-4 space-y-2 text-sm border-t border-card-border">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>₹ {invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>GST Amount</span>
            <span>₹ {invoice.tax_total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>₹ {invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
