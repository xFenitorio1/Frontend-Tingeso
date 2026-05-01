import { Link, useLocation } from 'react-router-dom';
import { Plane, LogIn, LogOut, LayoutDashboard, User, UserPlus, Briefcase, Settings } from 'lucide-react'; // Importamos Settings
import { useAuth } from '../auth/AuthProvider';

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { isAuthenticated, login, logout, register } = useAuth();

const handleManageAccount = () => {
  const keycloakServer = import.meta.env.VITE_TRAVELAGENCY_KEYCLOAK_SERVER;
  const realm = "Tingeso";
  const accountUrl = `http://${keycloakServer}/realms/${realm}/account`;

  window.open(accountUrl, "_blank");
};

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Plane className="h-8 w-8 text-primary" />
              <span className="font-jakarta font-bold text-xl text-primary">TravelAgency</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <>
                <Link to="/" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium font-inter">
                  Vista Cliente
                </Link>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-full bg-gray-50">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium font-inter text-gray-700">Admin</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/admin" className="text-gray-500 hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium font-inter">
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </Link>
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">

                    {/* Nuevo Botón Gestionar Mi Cuenta */}
                    <button
                      onClick={handleManageAccount}
                      className="text-gray-500 hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium font-inter transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Mi Cuenta
                    </button>

                    <Link
                      to="/my-bookings"
                      className="text-gray-500 hover:text-blue-600 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium font-inter transition-colors"
                    >
                      <Briefcase className="h-4 w-4" />
                      Mis Reservas
                    </Link>

                    <button onClick={() => logout()} className="text-gray-500 hover:text-red-600 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium font-inter transition-colors">
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => register()} className="text-gray-500 hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium font-inter transition-colors">
                      <UserPlus className="h-4 w-4" />
                      Crear Cuenta
                    </button>
                    <button onClick={() => login()} className="bg-primary text-white hover:bg-opacity-90 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium font-inter shadow-sm transition-all duration-200 cursor-pointer">
                      <LogIn className="h-4 w-4" />
                      Iniciar Sesión
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}