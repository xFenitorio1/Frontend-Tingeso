import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, Loader2, ArrowLeft, Info } from 'lucide-react';
import api from '../../api/axios';
import type { Package } from '../../types';
import PaymentModal from './PaymentModal';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/packages/${id}`);
        const p = response.data;

        setPkg({
          id: p.id.toString(),
          title: p.name,
          destination: p.destination,
          basePrice: p.price,
          spotsLeft: p.availableSpots,
          spotsTotal: p.totalCapacity,
          imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80',
          description: p.description,
          status: p.status,
          includes: []
        });
      } catch (error) {
        console.error("Error cargando paquete:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPackage();
  }, [id]);

  const subtotal = pkg ? pkg.basePrice * passengers : 0;
  const isGroup = passengers >= 4;
  const groupDiscount = isGroup ? subtotal * 0.10 : 0;
  const total = subtotal - groupDiscount;

  const handleProcessOrder = async (paymentInfo: any) => {
    try {
      // PASO A: Crear la Reserva (El backend asigna al Customer por JWT)
      const bookingResponse = await api.post('/api/bookings', {
        travelPackage: { id: parseInt(pkg!.id) },
        passengerCount: passengers
      });

      const newBooking = bookingResponse.data;

      // PASO B: Procesar el Pago vinculado a la reserva recién creada
      await api.post('/api/payments', {
        booking: { id: newBooking.id },
        amount: newBooking.finalAmount, // Usamos el monto oficial calculado por el servidor
        paymentMethod: 'Credit Card',
        transactionId: paymentInfo.transactionId,
        status: 'COMPLETED'
      });

      alert("¡Reserva y Pago realizados con éxito!");
      navigate('/my-bookings');
    } catch (error: any) {
      console.error("Error en el checkout:", error);
      alert(error.response?.data?.message || "Ocurrió un error al procesar tu reserva.");
      throw error;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!pkg) return <div className="text-center p-20">Paquete no encontrado.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <Link to={`/package/${pkg.id}`} className="flex items-center gap-2 text-gray-500 hover:text-primary font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver a detalles
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Configura tus cupos</h1>
              <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-200 w-fit">
                <button onClick={() => setPassengers(p => Math.max(1, p - 1))} className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl font-bold">-</button>
                <span className="text-2xl font-black w-16 text-center">{passengers}</span>
                <button
                  onClick={() => setPassengers(p => Math.min(pkg.spotsLeft, p + 1))}
                  disabled={passengers >= pkg.spotsLeft}
                  className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl font-bold disabled:opacity-30"
                >+</button>
              </div>
              <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" /> Quedan {pkg.spotsLeft} cupos disponibles.
              </p>
              {isGroup && (
                <div className="mt-6 bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-700 animate-in slide-in-from-left">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <p className="text-sm font-semibold italic">¡Descuento de grupo del 10% aplicado!</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-primary text-white p-8 rounded-3xl shadow-xl sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Resumen</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm"><span className="opacity-70">Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
                {isGroup && <div className="flex justify-between text-yellow-300 font-bold"><span>Descuento Grupo</span><span>-${groupDiscount.toLocaleString()}</span></div>}
                <div className="flex justify-between items-center border-t border-white/10 pt-4"><span className="text-lg font-bold">Total Final</span><span className="text-3xl font-black">${total.toLocaleString()}</span></div>
              </div>
              <button onClick={() => setShowPayment(true)} className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all">Continuar al Pago</button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onConfirm={handleProcessOrder}
        amount={total}
      />
    </div>
  );
}