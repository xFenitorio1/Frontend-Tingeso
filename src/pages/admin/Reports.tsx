import { useState } from 'react';
import {
  TrendingUp,
  Table as TableIcon,
  AlertTriangle,
  Calendar as CalendarIcon,
  Search,
  DollarSign,
  Users,
  Loader2
} from 'lucide-react';
import api from '../../api/axios';

interface Sale {
  id: number;
  customerFullName: string;
  packageName: string;
  createdAt: string;
  totalAmount: number;
  status: string;
}

interface PackageRanking {
  packageName: string;
  reservationCount: number;
  totalPassengers: number;
  totalRevenue: number;
}

export default function Reports() {
  // Filtros de fecha
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Datos de reportes
  const [sales, setSales] = useState<Sale[]>([]);
  const [ranking, setRanking] = useState<PackageRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    // 1. Validación de campos vacíos
    if (!startDate || !endDate) {
      setError('Por favor, selecciona ambas fechas para generar los reportes.');
      return;
    }

    // 2. Validación: Fecha término no puede ser menor a inicio
    if (new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio no puede ser posterior a la fecha de término.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Formateamos las fechas para que el Backend las reciba correctamente como LocalDateTime
      // Enviamos el rango completo del día: desde las 00:00 del inicio hasta las 23:59 del término
      const startISO = `${startDate}T00:00:00`;
      const endISO = `${endDate}T23:59:59`;

      const [salesRes, rankingRes] = await Promise.all([
        api.get(`/api/reports/sales?start=${startISO}&end=${endISO}`),
        api.get(`/api/reports/ranking?start=${startISO}&end=${endISO}`)
      ]);

      setSales(salesRes.data);
      setRanking(rankingRes.data);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor. Verifica los parámetros.');
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para el estilo visual de los estados
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tight border border-emerald-100">
            Pagado
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-tight border border-amber-100">
            Pendiente
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-tight">
            {status || 'S/E'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-inter">
      {/* Header y Filtros */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tight">Reportes de Gestión</h1>
          <p className="text-gray-500 font-medium text-sm">Análisis de rendimiento y ventas por período</p>
        </div>

        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <CalendarIcon size={12} /> Fecha Inicio
            </label>
            <input
              type="date"
              className="block w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <CalendarIcon size={12} /> Fecha Término
            </label>
            <input
              type="date"
              min={startDate} // Validación visual nativa
              className="block w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button
            onClick={fetchReports}
            disabled={loading}
            className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 flex items-center gap-3 shadow-lg active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            {loading ? 'Consultando...' : 'Generar Reportes'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-in slide-in-from-top-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reporte 1: Listado de Ventas Detallado */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 italic uppercase">
              <TableIcon className="text-blue-600" /> Detalle de Ventas
            </h2>
            {sales.length > 0 && (
              <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">
                {sales.length} Registros
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-4">Fecha</th>
                  <th className="px-4 py-4">Cliente</th>
                  <th className="px-4 py-4">Paquete</th>
                  <th className="px-4 py-4">Estado</th>
                  <th className="px-4 py-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sales.length > 0 ? (
                  sales.map((sale, i) => (
                    <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-4 py-5 font-mono text-[11px] text-gray-400">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-5 font-bold text-gray-900">
                        {sale.customerFullName}
                      </td>
                      <td className="px-4 py-5 text-gray-600 font-medium">
                        {sale.packageName}
                      </td>
                      <td className="px-4 py-5">
                        {getStatusBadge(sale.status)}
                      </td>
                      <td className="px-4 py-5 text-right font-black text-emerald-600">
                        ${sale.totalAmount?.toLocaleString() || '0'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-gray-400 text-xs italic font-medium">
                      {loading ? 'Cargando datos...' : 'No se encontraron ventas en este período'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reporte 2: Ranking de Paquetes Vendidos */}
        <div className="col-span-1 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 italic uppercase mb-10">
            <TrendingUp className="text-blue-600" /> Ranking Destinos
          </h2>

          <div className="space-y-10">
            {ranking.length > 0 ? (
              ranking.map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Posición #{idx + 1}</span>
                      <span className="font-bold text-gray-900 line-clamp-1 text-sm">{item.packageName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-blue-600 leading-none">{item.reservationCount}</span>
                      <span className="text-[8px] block font-black text-gray-400 uppercase tracking-widest">Ventas</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(item.reservationCount / (ranking[0]?.reservationCount || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Users size={10} /> {item.totalPassengers || 0} Pasajeros
                    </span>
                    <span className="text-emerald-500 flex items-center gap-1">
                      <DollarSign size={10} /> ${item.totalRevenue?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-50 rounded-[2rem]">
                <p className="text-gray-300 text-[10px] font-black uppercase tracking-widest italic">
                  {loading ? 'Calculando...' : 'Sin datos de ranking'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}