import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Ticket, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MyBookings = () => {
    const { keycloak, initialized } = useKeycloak();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocalBookings = async () => {
            // Solo ejecutamos si el token existe (el JIT ya debió ocurrir en el login o primer acceso)
            if (initialized && keycloak.token) {
                try {
                    const response = await fetch('http://localhost:8090/api/bookings/my-bookings', {
                        headers: {
                            'Authorization': `Bearer ${keycloak.token}`,
                            'Content-Type': 'application/json'
                        },
                    });

                    if (!response.ok) throw new Error("No se pudieron cargar las reservas locales.");

                    const data = await response.json();
                    setBookings(data);
                    console.log(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchLocalBookings();
    }, [initialized, keycloak.token]);

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
                <p className="text-gray-500 mt-2">Historial      de viajes registrados en TravelAgency</p>
            </header>

            {bookings.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
                    <p className="text-gray-400 text-lg">No encontramos reservas a tu nombre en nuestro sistema local.</p>
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

                                <div className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm ${booking.status === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                    {booking.status === 'PAID' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                    {booking.status === 'PAID' ? 'PAGADO' : 'PENDIENTE'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;