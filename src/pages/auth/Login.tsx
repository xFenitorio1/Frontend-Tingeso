import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
        {/* Decorative Top Banner */}
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <Plane className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-jakarta font-bold text-gray-900 mb-2">Bienvenido de nuevo</h2>
        <p className="text-gray-500 text-sm mb-8">Inicia sesión en tu cuenta de TravelAgency</p>

        {/* Social Logins Placeholder */}
        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 px-4 bg-white hover:bg-gray-50 font-medium text-sm transition-colors text-gray-700">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-5 h-5" />
            Continuar con Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 px-4 bg-white hover:bg-gray-50 font-medium text-sm transition-colors text-gray-700">
            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>
            Continuar con Facebook
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">O con tu correo</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">¿Olvidaste tu contraseña?</a>
            </div>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
              placeholder="••••••••"
            />
          </div>
          <button type="button" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm mt-2 flex items-center justify-center gap-2">
            Iniciar Sesión <Plane className="w-4 h-4 ml-1" />
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-600">
          ¿No tienes una cuenta? <Link to="/register" className="font-bold text-primary hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
