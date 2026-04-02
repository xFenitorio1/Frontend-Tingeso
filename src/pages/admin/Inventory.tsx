import { useState } from 'react';
import { mockPackages } from '../../mocks/data';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Inventory() {
  const [packages, setPackages] = useState(mockPackages);

  const toggleStatus = (id: string) => {
    setPackages(packages.map(pkg => {
      if (pkg.id === id) {
        const nextStatus = pkg.status === 'Active' ? 'Draft' : pkg.status === 'Draft' ? 'Sold Out' : 'Active';
        return { ...pkg, status: nextStatus };
      }
      return pkg;
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-gray-900">Inventario de Paquetes</h1>
          <p className="text-gray-500 mt-1">Gesti&oacute;na los paquetes de viaje y su disponibilidad.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo Paquete
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Paquete</th>
                <th className="px-6 py-4">Destino</th>
                <th className="px-6 py-4">Precio Base</th>
                <th className="px-6 py-4">Cupos (Disp/Total)</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.map(pkg => (
                <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{pkg.title}</td>
                  <td className="px-6 py-4 text-gray-600">{pkg.destination}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">${pkg.basePrice}</td>
                  <td className="px-6 py-4">
                    <span className={`${pkg.spotsLeft < 3 ? 'text-alert font-bold' : 'text-gray-600'}`}>
                      {pkg.spotsLeft}
                    </span> / {pkg.spotsTotal}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(pkg.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold inline-block border ${
                        pkg.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 
                        pkg.status === 'Sold Out' ? 'bg-alert/10 text-alert border-alert/20' : 
                        'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {pkg.status === 'Active' ? 'Activo' : pkg.status === 'Sold Out' ? 'Agotado' : 'Borrador'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-alert transition-colors rounded-lg hover:bg-alert/5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
