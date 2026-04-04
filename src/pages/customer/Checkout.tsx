import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Loader2,
  ArrowLeft,
  Info,
  Tag,
  CheckCircle2,
  Percent,
  Users,
  History,
  CalendarDays,
  TicketPercent,
  AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import type { Package } from '../../types';
import PaymentModal from './PaymentModal';

const MIN_PASSENGERS_GROUP = 4;
const DISCOUNT_PCT_GROUP = 0.10;
const DISCOUNT_PCT_FIDELITY_HIST = 0.05;
const DISCOUNT_PCT_FIDELITY_TIME = 0.05;
const MAX_DISCOUNT_LIMIT = 0.25; // Tope del 25%

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<Package | null>(null);
  const [fidelityData, setFidelityData] = useState({
    hasHistoryDiscount: false,
    hasRecurrenceDiscount: false,
    totalPaidBookings: 0,
    activePromotions: [] as any[]
  });
  const [bookingData, setBookingData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const initCheckout = async () => {
      try {
        setLoading(true);
        const pkgRes = await api.get(`/api/packages/${id}`);
        const p = pkgRes.data;
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

        const fidelityRes = await api.get('/api/bookings/check-fidelity');
        setFidelityData({
          hasHistoryDiscount: fidelityRes.data.hasHistoryDiscount,
          hasRecurrenceDiscount: fidelityRes.data.hasRecurrenceDiscount,
          totalPaidBookings: fidelityRes.data.totalPaidBookings,
          activePromotions: fidelityRes.data.activePromotions || []
        });

      } catch (error) {
        console.error("Error al inicializar checkout:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) initCheckout();
  }, [id]);

  // --- LÓGICA DE SIMULACIÓN INSTANTÁNEA (UX) ---
  const subtotal = pkg ? pkg.basePrice * passengers : 0;
  const simulatedDetails: string[] = [];
  let currentPct = 0;

  if (passengers >= MIN_PASSENGERS_GROUP) {
    currentPct += DISCOUNT_PCT_GROUP;
    simulatedDetails.push(`${DISCOUNT_PCT_GROUP * 100}% - Descuento por grupo (4+ personas)`);
  }

  if (fidelityData.hasHistoryDiscount) {
    currentPct += DISCOUNT_PCT_FIDELITY_HIST;
    simulatedDetails.push(`${DISCOUNT_PCT_FIDELITY_HIST * 100}% - Beneficio Cliente Frecuente (>= 3 viajes)`);
  }

  if (fidelityData.hasRecurrenceDiscount) {
    currentPct += DISCOUNT_PCT_FIDELITY_TIME;
    simulatedDetails.push(`${DISCOUNT_PCT_FIDELITY_TIME * 100}% - Beneficio Viajero Recurrente (< 30 días)`);
  }

  fidelityData.activePromotions?.forEach((promo: any) => {
    // CORRECCIÓN: Dividimos por 100 si el valor viene como 15.0
    const promoValue = promo.discountPercentage > 1 ? promo.discountPercentage / 100 : promo.discountPercentage;
    currentPct += promoValue;
    simulatedDetails.push(`${(promoValue * 100).toFixed(0)}% - ${promo.name}`);
  });

  // DETERMINAR SI SE SUPERÓ EL TOPE
  const reachedLimit = currentPct > MAX_DISCOUNT_LIMIT;
  const appliedPct = reachedLimit ? MAX_DISCOUNT_LIMIT : currentPct;

  const simulatedTotalDiscount = subtotal * appliedPct;
  const simulatedFinalAmount = subtotal - simulatedTotalDiscount;

  const handleCreateBooking = async () => {
    try {
      setIsCreatingBooking(true);
      const response = await api.post('/api/bookings', {
        travelPackage: { id: parseInt(pkg!.id) },
        passengerCount: passengers
      });
      setBookingData(response.data);
      setShowPayment(true);
    } catch (error: any) {
      alert(error.response?.data || "No se pudo procesar la reserva.");
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const handleConfirmPayment = async (paymentInfo: any) => {
    try {
      await api.post('/api/payments', {
        booking: { id: bookingData.id },
        amount: bookingData.finalAmount,
        paymentMethod: 'Credit Card',
        transactionId: paymentInfo.transactionId
      });
      alert("¡Reserva confirmada con éxito!");
      navigate('/my-bookings');
    } catch (error) {
      alert("Error en el pago. Puedes pagar luego en 'Mis Reservas'.");
      navigate('/my-bookings');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  if (!pkg) return <div className="p-20 text-center">Paquete no disponible.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 font-inter">
      <div className="max-w-5xl mx-auto px-4">
        <Link to={`/package/${pkg.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={18} /> Volver al paquete
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 italic tracking-tight">Finalizar Reserva</h1>
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <Users size={16} /> Pasajeros para esta aventura
                  </label>
                  <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-200 w-fit">
                    <button onClick={() => setPassengers(p => Math.max(1, p - 1))} disabled={showPayment} className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl font-bold hover:bg-gray-100 transition-colors">-</button>
                    <span className="text-3xl font-black w-20 text-center text-primary">{passengers}</span>
                    <button onClick={() => setPassengers(p => Math.min(pkg.spotsLeft, p + 1))} disabled={passengers >= pkg.spotsLeft || showPayment} className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl font-bold hover:bg-gray-100 transition-colors">+</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {fidelityData.hasHistoryDiscount && (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in duration-500">
                      <div className="bg-emerald-500 p-2 rounded-xl text-white"><History size={20} /></div>
                      <div>
                        <p className="font-bold text-emerald-900">Beneficio Histórico</p>
                        <p className="text-emerald-700 text-xs tracking-tight">¡Por tus {fidelityData.totalPaidBookings} viajes!</p>
                      </div>
                    </div>
                  )}
                  {fidelityData.hasRecurrenceDiscount && (
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in duration-700">
                      <div className="bg-indigo-500 p-2 rounded-xl text-white"><CalendarDays size={20} /></div>
                      <div>
                        <p className="font-bold text-indigo-900">Viajero Recurrente</p>
                        <p className="text-indigo-700 text-xs tracking-tight">Viaje en los últimos 30 días.</p>
                      </div>
                    </div>
                  )}
                  {fidelityData.activePromotions.map((promo, idx) => (
                    <div key={idx} className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in duration-1000">
                      <div className="bg-orange-500 p-2 rounded-xl text-white"><TicketPercent size={20} /></div>
                      <div>
                        <p className="font-bold text-orange-900">Promo: {promo.name}</p>
                        <p className="text-orange-700 text-xs tracking-tight italic">¡Oferta aplicada!</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-24 border-4 border-white/5">
              <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 italic">Tu Inversión</h2>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-sm opacity-80 font-medium">
                  <span>Subtotal ({passengers} personas)</span>
                  <span className="font-mono">${subtotal.toLocaleString()}</span>
                </div>

                {simulatedDetails.map((detail, index) => (
                  <div key={index} className="flex flex-col border-l-4 border-secondary pl-4 py-2 bg-white/10 rounded-r-xl animate-in slide-in-from-right duration-300">
                    <div className="flex justify-between items-center text-secondary font-black text-[10px] uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Tag size={12} /> Beneficio Activo</span>
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-xs font-medium mt-1 italic leading-tight">{detail}</p>
                  </div>
                ))}

                {/* MENSAJE DE TOPE DE DESCUENTO */}
                {reachedLimit && (
                  <div className="flex items-start gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 text-secondary animate-pulse">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-tight font-medium">
                      Has acumulado un {(currentPct * 100).toFixed(0)}% en beneficios. El tope máximo de descuento permitido es del <strong>{(MAX_DISCOUNT_LIMIT * 100)}%</strong>.
                    </p>
                  </div>
                )}

                {simulatedTotalDiscount > 0 && (
                  <div className="flex justify-between text-secondary font-bold text-sm pt-2 border-t border-white/10">
                    <span className="italic uppercase text-[10px] tracking-widest">Ahorro total aplicado</span>
                    <span className="font-mono">-${simulatedTotalDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t-2 border-white/20 pt-6">
                  <span className="text-lg font-bold italic uppercase tracking-tighter text-white">Total Final</span>
                  <span className="text-4xl font-black text-white font-mono tracking-tighter">
                    ${(bookingData ? bookingData.finalAmount : simulatedFinalAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              {!showPayment ? (
                <button onClick={handleCreateBooking} disabled={isCreatingBooking} className="w-full bg-secondary hover:bg-secondary/90 text-white py-5 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {isCreatingBooking ? <Loader2 className="animate-spin" /> : 'Confirmar Reserva'}
                </button>
              ) : (
                <div className="bg-white/10 p-5 rounded-2xl text-center border border-white/20">
                  <p className="text-xs font-black uppercase tracking-widest text-secondary">Procesando</p>
                </div>
              )}
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-white/40 uppercase font-bold tracking-widest">
                <ShieldCheck size={14} className="text-green-400" /> Seguridad Encriptada SSL
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onConfirm={handleConfirmPayment}
        amount={bookingData ? bookingData.finalAmount : simulatedFinalAmount}
      />
    </div>
  );
}