import { useState, useEffect, useRef } from 'react'; // Se agregó useRef
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Loader2,
  ArrowLeft,
  Tag,
  CheckCircle2,
  Users,
  History,
  TicketPercent,
  AlertCircle,
  Printer,
  FileText,
  Plane,
  Download // Se agregó Download
} from 'lucide-react';
import { toPng } from 'html-to-image'; // Importación html-to-image
import jsPDF from 'jspdf'; // Importación jspdf
import api from '../../api/axios';
import type { Package } from '../../types';
import PaymentModal from './PaymentModal';

const MIN_PASSENGERS_GROUP = 4;
const DISCOUNT_PCT_GROUP = 0.10;
const DISCOUNT_PCT_FIDELITY_HIST = 0.05;
const DISCOUNT_PCT_FIDELITY_TIME = 0.05;
const MAX_DISCOUNT_LIMIT = 0.25;

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null); // Referencia para capturar

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
  const [isFinished, setIsFinished] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Estado para el feedback de descarga

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

  // --- LÓGICA DE SIMULACIÓN ---
  const subtotal = pkg ? pkg.basePrice * passengers : 0;
  const simulatedDetails: string[] = [];
  let currentPct = 0;

  if (passengers >= MIN_PASSENGERS_GROUP) {
    currentPct += DISCOUNT_PCT_GROUP;
    simulatedDetails.push(`${DISCOUNT_PCT_GROUP * 100}% - Descuento por grupo (4+ personas)`);
  }
  if (fidelityData.hasHistoryDiscount) {
    currentPct += DISCOUNT_PCT_FIDELITY_HIST;
    simulatedDetails.push(`${DISCOUNT_PCT_FIDELITY_HIST * 100}% - Beneficio Cliente Frecuente`);
  }
  if (fidelityData.hasRecurrenceDiscount) {
    currentPct += DISCOUNT_PCT_FIDELITY_TIME;
    simulatedDetails.push(`${DISCOUNT_PCT_FIDELITY_TIME * 100}% - Beneficio Viajero Recurrente`);
  }
  fidelityData.activePromotions?.forEach((promo: any) => {
    const promoValue = promo.discountPercentage > 1 ? promo.discountPercentage / 100 : promo.discountPercentage;
    currentPct += promoValue;
    simulatedDetails.push(`${(promoValue * 100).toFixed(0)}% - ${promo.name}`);
  });

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
      setIsFinished(true);
      setShowPayment(false);
    } catch (error) {
      alert("Error en el pago. Reintenta desde 'Mis Reservas'.");
      navigate('/my-bookings');
    }
  };

  // NUEVA FUNCIÓN: Generación de PDF con html-to-image
  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(receiptRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Comprobante_Reserva_${bookingData.id}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("No se pudo generar el archivo. Intenta nuevamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  // --- VISTA DE ÉXITO (COMPROBANTE) ---
  if (isFinished) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 font-inter">
        <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-500">
          {/* Este es el contenedor que se captura */}
          <div
            ref={receiptRef}
            className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center"
            style={{ backgroundColor: '#ffffff' }} // Asegura fondo blanco en la captura
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 text-primary font-black italic text-2xl mb-2">
                <Plane className="rotate-45" /> TravelAgency
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Constancia de Reserva</h1>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Documento Válidamente Emitido</p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-left border-y border-gray-100 py-8 mb-8">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">ID Reserva</p>
                <p className="font-mono font-bold text-primary text-lg">#{bookingData.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Fecha Emisión</p>
                <p className="font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Paquete Adquirido</p>
                <p className="font-black text-gray-900 text-xl italic">{pkg?.title}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Pasajeros</p>
                <p className="font-bold text-gray-800">{passengers} persona(s)</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Monto Pagado</p>
                <p className="font-black text-emerald-600 text-xl">${bookingData.finalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-[9px] text-gray-300 font-bold uppercase tracking-widest">
              <ShieldCheck size={12} /> Verificación de Integridad Digital Activa
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDownloadReceipt}
              disabled={isDownloading}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Download size={20} />
              )}
              {isDownloading ? 'Generando PDF...' : 'Descargar Comprobante PDF'}
            </button>
            <Link
              to="/my-bookings"
              className="w-full bg-gray-100 text-gray-600 py-5 rounded-2xl font-black text-sm block text-center hover:bg-gray-200 transition-all uppercase tracking-widest"
            >
              Ver Mis Reservas
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-900 mb-6 italic tracking-tight uppercase">Finalizar Reserva</h1>
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
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in">
                      <div className="bg-emerald-500 p-2 rounded-xl text-white"><History size={20} /></div>
                      <div>
                        <p className="font-bold text-emerald-900 text-sm">Beneficio Histórico</p>
                        <p className="text-emerald-700 text-[10px] uppercase font-black tracking-widest">¡Fidelidad Premiada!</p>
                      </div>
                    </div>
                  )}
                  {fidelityData.activePromotions.map((promo, idx) => (
                    <div key={idx} className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in">
                      <div className="bg-orange-500 p-2 rounded-xl text-white"><TicketPercent size={20} /></div>
                      <div>
                        <p className="font-bold text-orange-900 text-sm">Promo: {promo.name}</p>
                        <p className="text-orange-700 text-[10px] uppercase font-black tracking-widest italic">Descuento Especial</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-24 border-4 border-white/5">
              <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 italic tracking-widest uppercase text-xs opacity-60">Resumen de Inversión</h2>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-sm opacity-80 font-medium">
                  <span>Subtotal ({passengers} personas)</span>
                  <span className="font-mono">${subtotal.toLocaleString()}</span>
                </div>

                {simulatedDetails.map((detail, index) => (
                  <div key={index} className="flex flex-col border-l-4 border-secondary pl-4 py-2 bg-white/10 rounded-r-xl">
                    <div className="flex justify-between items-center text-secondary font-black text-[9px] uppercase tracking-widest">
                      <span>Beneficio Aplicado</span>
                      <CheckCircle2 size={10} />
                    </div>
                    <p className="text-[11px] font-medium mt-0.5 italic">{detail}</p>
                  </div>
                ))}

                {reachedLimit && (
                  <div className="flex items-start gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 text-secondary">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <p className="text-[10px] leading-tight font-medium uppercase tracking-tighter">
                      Tope máximo del {(MAX_DISCOUNT_LIMIT * 100)}% alcanzado.
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center border-t-2 border-white/20 pt-6">
                  <span className="text-lg font-bold italic uppercase tracking-tighter">Total Final</span>
                  <span className="text-4xl font-black font-mono tracking-tighter">
                    ${(bookingData ? bookingData.finalAmount : simulatedFinalAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              {!showPayment ? (
                <button onClick={handleCreateBooking} disabled={isCreatingBooking} className="w-full bg-secondary hover:bg-secondary/90 text-white py-5 rounded-2xl font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3">
                  {isCreatingBooking ? <Loader2 className="animate-spin" /> : 'CONFIRMAR VIAJE'}
                </button>
              ) : (
                <div className="bg-white/10 p-5 rounded-2xl text-center border border-white/20 uppercase font-black text-[10px] tracking-widest">
                  Procesando Seguridad...
                </div>
              )}
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