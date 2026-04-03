import { useState } from 'react';
import { Search, DollarSign } from 'lucide-react';
import PackageCard from '../../components/customer/PackageCard';
import { mockPackages } from '../../mocks/data';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Simple filter simulation
  const filteredPackages = mockPackages.filter(pkg => {
    if (pkg.status === 'Draft') return false; // Don't show drafts to customers
    const matchSearch = pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase());

    let matchPrice = true;
    if (priceRange === 'low') matchPrice = pkg.basePrice < 1000;
    if (priceRange === 'high') matchPrice = pkg.basePrice >= 1000;

    return matchSearch && matchPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Search & Discovery Header */}
      <div className="bg-primary py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Pattern or image background could go here */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,50 70,50 100,0 L100,100 Z" fill="white" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h1 className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-6">
            Descubre tu próxima aventura
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Explora nuestros hola paquetes exclusivos y reserva tu viaje soñado con los mejores precios garantizados.
          </p>

          {/* Multi-criteria filters */}
          <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Destino o palabra clave"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full md:w-48 relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Cualquier Precio</option>
                <option value="low">Menos de $1000</option>
                <option value="high">$1000 o más</option>
              </select>
            </div>

            <button className="w-full md:w-auto bg-secondary text-white font-bold py-3 px-8 rounded-lg hover:bg-secondary/90 transition-colors shadow-sm">
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="font-jakarta text-2xl font-bold text-gray-900 mb-8">Paquetes Destacados</h2>

        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-jakarta text-xl font-bold text-gray-900 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-500 mb-6">No pudimos encontrar ningún paquete que coincida con tu búsqueda. Intenta ajustar los filtros.</p>
            <button
              onClick={() => { setSearchTerm(''); setPriceRange(''); }}
              className="px-6 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
