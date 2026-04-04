import { NavLink, Outlet } from 'react-router-dom';
import { Package, BarChart3, Settings, TicketPercent } from 'lucide-react'; // Agregamos TicketPercent

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 font-jakarta">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <h2 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-4 italic">Administración</h2>
          <nav className="space-y-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Package className="w-5 h-5" /> Inventario
            </NavLink>

            {/* --- NUEVA OPCIÓN DE PROMOCIONES --- */}
            <NavLink
              to="/admin/promotions"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <TicketPercent className="w-5 h-5" /> Gestionar Promos
            </NavLink>
            {/* ----------------------------------- */}

            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <BarChart3 className="w-5 h-5" /> Reportes & Ventas
            </NavLink>

            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5" /> Configuración
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}