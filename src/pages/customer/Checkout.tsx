import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockPackages } from '../../mocks/data';
import { CreditCard, Users, ShieldCheck, X } from 'lucide-react';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = mockPackages.find(p => p.id === id);
  
  const [passengers, setPassengers] = useState(1);
  const [showModal, setShowModal] = useState(false);

  if (!pkg) {
    return <div className="text-center mt-20">Paquete no encontrado</div>;
  }

  // Business Logic
  const subtotal = pkg.basePrice * passengers;
  const isGroup = passengers >= 4;
  const groupDiscount = isGroup ? subtotal * 0.10 : 0; // 10% discount for groups 4+
  const total = subtotal - groupDiscount;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Pago simulado con éxito! Serás redirigido.');
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to={`/package/${pkg.id}`} className="text-gray-500 hover:text-primary font-medium text-sm">
            &larr; Volver a detalles
          </Link>
          <h1 className="text-3xl font-jakarta font-bold mt-4">Finaliza tu reserva</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reservation Details Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold font-jakarta border-b border-gray-100 pb-4 mb-6">Detalles de Pasajeros</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de Pasajeros</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setPassengers(p => Math.max(1, p - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                >
                  -
                </button>
                <span className="text-xl font-bold w-4 text-center">{passengers}</span>
                <button 
                  // Cannot select more than spots left
                  onClick={() => setPassengers(p => Math.min(pkg.spotsLeft, p + 1))}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                    passengers >= pkg.spotsLeft 
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                  disabled={passengers >= pkg.spotsLeft}
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Users className="w-3 h-3" /> Max {pkg.spotsLeft} cupos disponibles
              </p>
            </div>

            {isGroup && (
              <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm font-medium border border-green-200 mb-4">
                ¡Felicidades! Aplica un descuento de grupo del 10%.
              </div>
            )}
          </div>

          {/* Dynamic Price Summary */}
          <div className="bg-primary text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold font-jakarta border-b border-white/20 pb-4 mb-6">Resumen de Compra</h2>
            
            <div className="mb-4">
              <h3 className="font-bold text-lg">{pkg.title}</h3>
              <p className="text-white/80 text-sm">{pkg.destination}</p>
            </div>

            <div className="space-y-4 my-6 py-6 border-t border-b border-white/20">
              <div className="flex justify-between items-center">
                <span>Subtotal ({passengers} persona{passengers > 1 && 's'})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {isGroup && (
                <div className="flex justify-between items-center text-alert font-bold">
                  <span>Descuento Grupo (4+)</span>
                  <span>-${groupDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-2xl font-bold font-jakarta mb-8">
              <span>Total a Pagar</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary/90 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Pagar en línea
            </button>
            <div className="mt-4 flex items-center justify-center gap-1 text-xs text-white/70">
              <ShieldCheck className="w-4 h-4" /> Pago 100% Seguro
            </div>
          </div>
        </div>

      </div>

      {/* Simulated Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-jakarta font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">Pago Seguro</h2>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Juan Pérez" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input required type="text" maxLength={19} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="0000 0000 0000 0000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                  <input required type="text" placeholder="MM/AA" maxLength={5} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input required type="password" placeholder="123" maxLength={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-success text-white py-3 rounded-lg font-bold text-lg hover:bg-success/90 transition-colors mt-6">
                Confirmar Pago de ${total.toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
