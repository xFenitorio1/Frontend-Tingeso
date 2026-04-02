import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Package } from '../../types';

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const isSoldOut = pkg.spotsLeft === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={pkg.imageUrl} 
          alt={pkg.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {isSoldOut ? (
          <div className="absolute top-4 right-4 bg-alert text-white text-xs font-bold px-3 py-1 rounded-full">
            Agotado
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-white/90 text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {pkg.spotsLeft} cupos restantes
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{pkg.destination}</span>
        </div>
        
        <h3 className="font-jakarta text-lg font-bold text-gray-900 mb-2 line-clamp-1">{pkg.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">{pkg.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 font-medium">Precio Base</p>
            <p className="font-jakarta text-xl font-bold text-success">${pkg.basePrice}</p>
          </div>
          
          <Link 
            to={isSoldOut ? "#" : `/package/${pkg.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isSoldOut 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-opacity-90'
            }`}
          >
            {isSoldOut ? 'Sin cupos' : 'Ver Detalles'}
          </Link>
        </div>
      </div>
    </div>
  );
}
