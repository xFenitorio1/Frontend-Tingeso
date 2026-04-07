import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Ticket, MapPin, CheckCircle, Clock, AlertCircle, XCircle, CreditCard } from 'lucide-react';
import PaymentModal from './PaymentModal';
import api from '../../api/axios';


const MyBookings = () => {
    const { keycloak, initialized } = useKeycloak();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchLocalBookings = async () => {
        if (initialized && keycloak.token) {
            setLoading(true);
            try {
                const response = await api.get('/api/bookings/my-bookings');
                setBookings(response.data);

            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "No se pudieron cargar las reservas.";
                setError(errorMessage);
                console.error("Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchLocalBookings();
    }, [initialized, keycloak.token]);

    // Función para abrir el modal con la reserva seleccionada
    const handleOpenPayment = (booking) => {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
    };

    // Función que procesa el pago (PASO B del backend)
    const handleConfirmPayment = async (paymentInfo: any) => {
        try {
            const response = await fetch('http://localhost:8090/api/payments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    booking: { id: selectedBooking.id },
                    amount: selectedBooking.finalAmount,
                    paymentMethod: 'Credit Card',
                    transactionId: paymentInfo.transactionId
                })
            });

            if (!response.ok) throw new Error("Error al procesar el pago.");

            alert("¡Pago realizado con éxito!");
            setShowPaymentModal(false);
            fetchLocalBookings();
        } catch (err: any) {
            alert(err.message);
            throw err;
        }
    };

    if (!initialized || loading) return <div className="text-center p-10 font-inter">Consultando base de datos local...</div>;

    if (error) return (
        <div className="flex items-center justify-center p-10 text-red-500 gap-2">
            <AlertCircle /> {error}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 font-inter">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Ticket className="h-8 w-8 text-blue-600" />
                    Mis Reservas
                </h1>
                <p className="text-gray-500 mt-2">Historial de viajes registrados en TravelAgency</p>
            </header>

            {bookings.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
                    <p className="text-gray-400 text-lg">No encontramos reservas a tu nombre.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center hover:border-blue-200 transition-all">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">#{booking.id}</span>
                                    <h3 className="text-xl font-bold text-gray-900">{booking.travelPackage?.name}</h3>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {booking.travelPackage?.destination}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {booking.travelPackage?.startDate}</span>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0">
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total</p>
                                    <p className="text-xl font-black text-blue-600">${booking.finalAmount.toLocaleString()}</p>
                                </div>

                                <div className="flex flex-col gap-2 items-end">
                                    <div className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm ${booking.status === 'PAID'
                                        ? 'bg-green-50 text-green-600'
                                        : booking.status === 'CANCELLED'
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-orange-50 text-orange-600'
                                        }`}>
                                        {booking.status === 'PAID' && <><CheckCircle className="h-5 w-5" /> <span>PAGADO</span></>}
                                        {booking.status === 'CANCELLED' && <><XCircle className="h-5 w-5" /> <span>CANCELADO</span></>}
                                        {booking.status === 'PENDING_PAYMENT' && <><Clock className="h-5 w-5" /> <span>PENDIENTE</span></>}
                                    </div>

                                    {/* BOTÓN DE PAGO DINÁMICO */}
                                    {booking.status === 'PENDING_PAYMENT' && (
                                        <button
                                            onClick={() => handleOpenPayment(booking)}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            Pagar Ahora
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE PAGO REUTILIZADO */}
            {selectedBooking && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    amount={selectedBooking.finalAmount}
                    onConfirm={handleConfirmPayment}
                />
            )}
        </div>
    );
};

export default MyBookings;