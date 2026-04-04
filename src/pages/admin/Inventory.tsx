import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import type { Package } from '../../types';
import PackageForm from './PackageForm'; // Asegúrate de que la ruta sea correcta

export default function Inventory() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Este estado sirve para disparar el useEffect cada vez que algo cambie
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/packages');
      const fetchedPackages: Package[] = response.data.map((pkg: any) => ({
        id: pkg.id.toString(),
        title: pkg.name,
        destination: pkg.destination,
        basePrice: pkg.price,
        spotsTotal: pkg.totalCapacity,
        spotsLeft: pkg.availableSpots,
        status: pkg.status === 'AVAILABLE' ? 'Active' : pkg.status === 'SOLD_OUT' ? 'Sold Out' : 'Draft',
      }));
      setPackages(fetchedPackages);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al montar Y cada vez que refreshKey cambie
  useEffect(() => {
    fetchPackages();
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este paquete?')) {
      try {
        await api.delete(`/api/packages/${id}`);
        setPackages(packages.filter(pkg => pkg.id !== id));
      } catch (error) {
        alert("No se pudo eliminar: El paquete puede tener reservas activas.");
      }
    }
  };

  if (loading && packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
        <p className="text-gray-500 font-medium">Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-gray-900">Inventario de Paquetes</h1>
          <p className="text-gray-500 mt-1">Gestión directa de la base de datos de TravelAgency.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" /> Nuevo Paquete
        </button>
      </div>

      {/* COMPONENTE FORMULARIO SEPARADO */}
      <PackageForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Paquete</th>
                <th className="px-6 py-4">Destino</th>
                <th className="px-6 py-4">Precio Base</th>
                <th className="px-6 py-4">Cupos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.map(pkg => (
                <tr key={pkg.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-gray-900">{pkg.title}</td>
                  <td className="px-6 py-4 text-gray-600">{pkg.destination}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">${pkg.basePrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${pkg.spotsLeft < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                        {pkg.spotsLeft}
                      </span>
                      <span className="text-gray-400">/ {pkg.spotsTotal}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${pkg.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' :
                        pkg.status === 'Sold Out' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                      {pkg.status === 'Active' ? 'Activo' : pkg.status === 'Sold Out' ? 'Agotado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
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