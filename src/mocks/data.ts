import type { Package, Sale } from '../types';

export const mockPackages: Package[] = [
  {
    id: '1',
    title: 'Escapada Todo Incluido a Cancún',
    destination: 'Cancún, México',
    description: 'Disfruta de 5 días de sol, playa y bebidas ilimitadas en nuestro resort premium.',
    basePrice: 899,
    spotsTotal: 20,
    spotsLeft: 5,
    imageUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=800&auto=format&fit=crop',
    includes: ['Vuelos', '5 Noches Hotel', 'Todas las comidas', 'Traslado Aeropuerto', 'Seguro de Viaje'],
    status: 'Active',
  },
  {
    id: '2',
    title: 'Aventura a Machu Picchu',
    destination: 'Cusco, Perú',
    description: 'Caminata guiada de 7 días por los Andes que termina en las majestuosas ruinas de Machu Picchu.',
    basePrice: 1250,
    spotsTotal: 12,
    spotsLeft: 0,
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop',
    includes: ['Tours Guiados', 'Alojamiento en Hostal', 'Boletos de Tren', 'Pases de entrada'],
    status: 'Sold Out',
  },
  {
    id: '3',
    title: 'Fin de Semana Romántico París',
    destination: 'París, Francia',
    description: 'Una escapada rápida de 3 días en la ciudad del amor.',
    basePrice: 650,
    spotsTotal: 10,
    spotsLeft: 10,
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop',
    includes: ['Hotel Boutique', 'Crucero por el Río Sena', 'Entradas Torre Eiffel', 'Desayuno'],
    status: 'Draft',
  },
  {
    id: '4',
    title: 'Explorador Tokio',
    destination: 'Tokio, Japón',
    description: 'Experimenta la mezcla perfecta de lo tradicional y lo ultramoderno en Tokio durante 10 días.',
    basePrice: 2100,
    spotsTotal: 15,
    spotsLeft: 8,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
    includes: ['Vuelos', '10 Noches Hotel', 'Pase JR (7 días)', 'Tour por la ciudad'],
    status: 'Active',
  }
];

export const mockSales: Sale[] = [
  { id: 'S001', customerName: 'Juan Pérez', packageId: '1', date: '2026-04-01', totalAmount: 1798, paymentStatus: 'Paid' },
  { id: 'S002', customerName: 'Ana Gómez', packageId: '1', date: '2026-04-02', totalAmount: 899, paymentStatus: 'Pending' },
  { id: 'S003', customerName: 'Roberto Gómez', packageId: '2', date: '2026-03-28', totalAmount: 2500, paymentStatus: 'Cancelled' },
  { id: 'S004', customerName: 'Elena Díaz', packageId: '4', date: '2026-03-30', totalAmount: 4200, paymentStatus: 'Paid' },
];
