import { useState } from 'react';
import { mockSales, mockPackages } from '../../mocks/data';
import { Calendar as CalendarIcon, Download } from 'lucide-react';

export default function Reports() {
  const [dateOption, setDateOption] = useState('Este Mes');

  // Calculate top packages
  const salesCountByPackage = mockSales.reduce((acc, sale) => {
    if (sale.paymentStatus === 'Paid') {
      acc[sale.packageId] = (acc[sale.packageId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const maxSales = Math.max(...Object.values(salesCountByPackage), 1);

  const topPackages = Object.entries(salesCountByPackage)
    .sort(([, a], [, b]) => b - a)
    .map(([pkgId, count]) => {
      const pkg = mockPackages.find(p => p.id === pkgId);
      return {
        title: pkg?.title || 'Desconocido',
        count,
        percentage: (count / maxSales) * 100
      };
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-gray-900">Reportes y Analíticas</h1>
          <p className="text-gray-500 mt-1">Monitorea el rendimiento de ventas de la agencia.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={dateOption}
              onChange={(e) => setDateOption(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
            >
              <option>Esta Semana</option>
              <option>Este Mes</option>
              <option>Este Año</option>
            </select>
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Table */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 overflow-hidden">
          <h2 className="text-lg font-jakarta font-bold mb-4">Registro de Ventas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Cliente</th>
                  <th className="px-4 py-3">Paquete (ID)</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3 rounded-r-lg">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockSales.map(sale => (
                  <tr key={sale.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{sale.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">PKG-{sale.packageId}</td>
                    <td className="px-4 py-3 text-gray-500">{sale.date}</td>
                    <td className="px-4 py-3 font-medium">${sale.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        sale.paymentStatus === 'Paid' ? 'bg-success/10 text-success' : 
                        sale.paymentStatus === 'Cancelled' ? 'bg-alert/10 text-alert' : 
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {sale.paymentStatus === 'Paid' ? 'Pagado' : sale.paymentStatus === 'Cancelled' ? 'Cancelado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics (Top Packages) */}
        <div className="col-span-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-jakarta font-bold mb-6">Paquetes Top Ventas</h2>
          <div className="space-y-6">
            {topPackages.map((pkg, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900 line-clamp-1 pr-4">{pkg.title}</span>
                  <span className="text-gray-500 font-medium">{pkg.count} ventas</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${pkg.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {topPackages.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No hay ventas registradas aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
