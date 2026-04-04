import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Loader2 } from 'lucide-react';
import api from '../../api/axios'; // Importamos tu axios configurado
import type { Package } from '../../types';

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setLoading(true);
        // Llamamos al endpoint de un solo paquete por ID
        const response = await api.get(`/api/packages/${id}`);
        const p = response.data;

        // Mapeamos el formato del backend al formato que espera tu componente
        const formattedPackage: Package = {
          id: p.id.toString(),
          title: p.name,
          destination: p.destination,
          description: p.description,
          basePrice: p.price,
          spotsTotal: p.totalCapacity,
          spotsLeft: p.availableSpots,
          imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80',
          includes: ['Vuelo aéreo', 'Alojamiento', 'Desayuno'],
          status: p.status === 'AVAILABLE' ? 'Active' : p.status === 'SOLD_OUT' ? 'Sold Out' : 'Draft',
        };

        setPkg(formattedPackage);
      } catch (error) {
        console.error("Error fetching package details:", error);
        setPkg(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPackageDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-gray-500 font-medium">Cargando detalles del viaje...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen pt-20 text-center">
        <h2 className="text-2xl font-bold font-jakarta text-gray-900">Paquete no encontrado</h2>
        <p className="text-gray-500 mt-2">El paquete que buscas no existe en nuestra base de datos.</p>
        <Link to="/" className="text-primary mt-4 inline-block hover:underline font-semibold">
          &larr; Volver al inicio
        </Link>
      </div>
    );
  }

  const isSoldOut = pkg.spotsLeft === 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {/* ... El resto de tu JSX se mantiene exactamente igual ... */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary text-sm font-medium">
            &larr; Volver a resultados
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 space-y-8">
            <h1 className="text-3xl md:text-4xl font-jakarta font-bold text-gray-900">{pkg.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{pkg.destination}</span>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm h-80 md:h-[400px]">
              <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-jakarta font-bold mb-4">Acerca de este viaje</h2>
              <p className="text-gray-600 leading-relaxed mb-8">{pkg.description}</p>

              <h3 className="text-xl font-jakarta font-bold mb-4">¿Qué incluye?</h3>
              <ul className="space-y-3">
                {pkg.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-24 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Precio por persona desde</p>
                  <p className="text-4xl font-jakarta font-bold text-primary">${pkg.basePrice.toLocaleString()}</p>
                </div>
                {isSoldOut ? (
                  <span className="bg-alert/10 text-alert px-3 py-1 rounded-full text-sm font-bold">Agotado</span>
                ) : (
                  <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-bold">Disponible</span>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm py-3 border-b border-gray-100">
                  <span className="text-gray-600">Cupos totales</span>
                  <span className="font-semibold text-gray-900">{pkg.spotsTotal}</span>
                </div>
                <div className="flex justify-between text-sm py-3 border-b border-gray-100">
                  <span className="text-gray-600">Cupos restantes</span>
                  <span className={`font-bold ${pkg.spotsLeft < 3 ? 'text-alert' : 'text-success'}`}>
                    {pkg.spotsLeft}
                  </span>
                </div>
              </div>

              <Link
                to={isSoldOut ? "#" : `/checkout/${pkg.id}`}
                className={`block w-full py-4 text-center rounded-xl font-bold text-lg transition-all ${isSoldOut
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-secondary text-white hover:bg-secondary/90 shadow-md hover:shadow-lg'
                  }`}
              >
                {isSoldOut ? 'Sin Disponibilidad' : 'Reservar Ahora'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}