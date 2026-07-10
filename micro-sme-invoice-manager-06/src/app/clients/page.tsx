import { getClients } from "@/actions/invoice";
import { Users, Phone, MapPin } from "lucide-react";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clients</h2>
        <button className="btn-primary text-sm">Add Client</button>
      </div>

      {clients.length === 0 ? (
        <div className="card p-8 text-center text-muted">No clients found. Add one to get started.</div>
      ) : (
        <div className="grid gap-4">
          {clients.map(client => (
            <div key={client.id} className="card p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{client.name}</h3>
                  {client.gstin && <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">GST: {client.gstin}</span>}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary-500" />
                  {client.phone}
                </div>
                {client.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary-500" />
                    {client.address}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
