"use client";

import { useState, useEffect } from "react";
import { getClients, createInvoice } from "@/actions/invoice";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, FileText } from "lucide-react";

export default function NewInvoice() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  
  const [items, setItems] = useState([
    { description: "", qty: 1, unitPrice: 0, gstRate: 18 }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getClients().then(data => {
      setClients(data);
      if (data.length > 0) setClientId(data[0].id);
    });
  }, []);

  const addItem = () => setItems([...items, { description: "", qty: 1, unitPrice: 0, gstRate: 18 }]);
  
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach(item => {
      const lineTotal = item.qty * item.unitPrice;
      const tax = lineTotal * (item.gstRate / 100);
      subtotal += lineTotal;
      taxTotal += tax;
    });

    return { subtotal, taxTotal, total: subtotal + taxTotal };
  };

  const totals = calculateTotals();

  const handleSave = async () => {
    if (!clientId) return alert("Please select a client.");
    if (items.some(i => !i.description)) return alert("Please fill item descriptions.");

    setIsSubmitting(true);
    try {
      const data = {
        clientId,
        issueDate,
        dueDate,
        subtotal: totals.subtotal,
        taxTotal: totals.taxTotal,
        total: totals.total,
        items: items.map(i => ({
          ...i,
          lineTotal: i.qty * i.unitPrice
        }))
      };

      const invoice = await createInvoice(data);
      router.push(`/invoices/${invoice.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to create invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-100 text-primary-600 p-2 rounded-lg">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">New Invoice</h2>
          <p className="text-sm text-muted">Create a GST invoice in seconds</p>
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-semibold text-lg border-b border-card-border pb-2">Client Details</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Select Client</label>
          <select 
            className="input-field" 
            value={clientId} 
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="" disabled>Select a client...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Issue Date</label>
            <input 
              type="date" 
              className="input-field" 
              value={issueDate} 
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input 
              type="date" 
              className="input-field" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-card-border pb-2">
          <h3 className="font-semibold text-lg">Items</h3>
          <button onClick={addItem} className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:underline">
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 relative">
              {items.length > 1 && (
                <button 
                  onClick={() => removeItem(i)} 
                  className="absolute top-3 right-3 text-gray-400 hover:text-danger"
                >
                  <Trash2 size={18} />
                </button>
              )}
              
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Description</label>
                <input 
                  type="text" 
                  placeholder="Item description" 
                  className="input-field" 
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Qty</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="input-field" 
                    value={item.qty}
                    onChange={(e) => updateItem(i, 'qty', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    min="0" 
                    className="input-field" 
                    value={item.unitPrice}
                    onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">GST (%)</label>
                  <select 
                    className="input-field" 
                    value={item.gstRate}
                    onChange={(e) => updateItem(i, 'gstRate', parseFloat(e.target.value))}
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-card-border pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-sm text-muted">
            <span>Subtotal:</span>
            <span>₹ {totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>Tax (GST):</span>
            <span>₹ {totals.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-card-border">
            <span>Total:</span>
            <span>₹ {totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave} 
        disabled={isSubmitting}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary-600/20 disabled:opacity-70"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Save size={20} />
        )}
        {isSubmitting ? "Saving..." : "Save & Generate Invoice"}
      </button>
    </div>
  );
}
