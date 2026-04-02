import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-secondary"></div>
        
        <div className="flex justify-center mb-6">
          <div className="bg-secondary/10 p-3 rounded-full">
            <UserPlus className="w-8 h-8 text-secondary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-jakarta font-bold text-gray-900 mb-2">Crea tu cuenta</h2>
        <p className="text-gray-500 text-sm mb-8">Únete a TravelAgency y empieza tu aventura</p>

        <form className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" 
                placeholder="Juan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" 
                placeholder="Pérez"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" 
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" 
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-400 mt-2">Debe contener al menos 8 caracteres, números y símbolos.</p>
          </div>
          
          <div className="flex items-start mt-4">
            <input type="checkbox" className="mt-1 mr-2 rounded text-secondary focus:ring-secondary/20 border-gray-300" id="terms" />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Acepto los <a href="#" className="text-secondary hover:underline">Términos de Servicio</a> y la <a href="#" className="text-secondary hover:underline">Política de Privacidad</a>.
            </label>
          </div>

          <button type="button" className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-secondary/90 transition-colors shadow-sm mt-6">
            Registrarse
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-600">
          ¿Ya tienes una cuenta? <Link to="/login" className="font-bold text-secondary hover:underline">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}
