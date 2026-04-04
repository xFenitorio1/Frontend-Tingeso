import { useState, useEffect } from 'react';
import {
    Search,
    Calendar,
    Tag,
    CheckCircle2,
    Clock,
    XCircle,
    Loader2,
    DollarSign,
    Users,
    Mail,
    Trash2
} from 'lucide-react';
import api from '../../api/axios';

interface BookingDTO {
    id: number;
    customerFullName: string;
    customerEmail: string;
    packageName: string;
    passengerCount: number;
    basePrice: number;
    totalDiscount: number;
    finalAmount: number;
    status: 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED';
    createdAt: string;
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<BookingDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/bookings/admin/all');
            setBookings(response.data);
        } catch (error) {
            console.error("Error al cargar reservas:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- FUNCIÓN PARA MANEJAR EL CAMBIO DE ESTADO ---
    const handleUpdateStatus = async (id: number, newStatus: string) => {
        if (!window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return;

        try {
            setLoading(true);
            // Enviamos el PATCH al endpoint que definimos en el Service
            await api.patch(`/api/bookings/${id}/status`, { status: newStatus });
            await fetchBookings(); // Recargamos la lista
        } catch (error) {
            alert("No se pudo actualizar el estado de la reserva.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- FUNCIÓN PARA ELIMINAR ---
    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Eliminar esta reserva permanentemente? Esto devolverá los cupos al paquete.")) return;

        try {
            setLoading(true);
            await api.delete(`/api/bookings/${id}`);
            await fetchBookings();
        } catch (error) {
            alert("Error al eliminar la reserva.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tight">
                        <CheckCircle2 size={12} /> Pagado
                    </span>
                );
            case 'PENDING_PAYMENT':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-tight">
                        <Clock size={12} /> Pendiente
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-tight">
                        <XCircle size={12} /> Cancelado
                    </span>
                );
            default:
                return <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase">{status}</span>;
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.customerFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Actualizando registros...</p>
        </div>
    );

    return (
        <div className="space-y-8 font-inter animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tight">Gestión de Reservas</h1>
                    <p className="text-gray-500 font-medium text-sm">Administra estados y disponibilidad</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/10 w-full md:w-80 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reserva</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Paquete</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-xs font-bold text-blue-600">#{booking.id}</span>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-bold">
                                                <Calendar size={10} /> {new Date(booking.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-sm">{booking.customerFullName}</span>
                                            <span className="text-[11px] text-gray-400 font-medium">{booking.customerEmail}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-700 text-sm">{booking.packageName}</span>
                                            <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">
                                                {booking.passengerCount} Pasajeros
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-center">
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-end gap-2">
                                            {/* Acción: Marcar como Pagado */}
                                            {booking.status === 'PENDING_PAYMENT' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, 'PAID')}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="Confirmar Pago"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}

                                            {/* Acción: Cancelar */}
                                            {booking.status !== 'CANCELLED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                                                    title="Cancelar Reserva"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}

                                            {/* Acción: Eliminar */}
                                            <button
                                                onClick={() => handleDelete(booking.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Eliminar registro"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Widgets de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><DollarSign size={24} /></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recaudación</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 font-mono">
                        ${bookings.filter(b => b.status === 'PAID').reduce((acc, curr) => acc + curr.finalAmount, 0).toLocaleString()}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Users size={24} /></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pasajeros</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 font-mono">
                        {bookings.filter(b => b.status !== 'CANCELLED').reduce((acc, curr) => acc + curr.passengerCount, 0)}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl text-red-600"><XCircle size={24} /></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancelaciones</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 font-mono">
                        {bookings.filter(b => b.status === 'CANCELLED').length}
                    </p>
                </div>
            </div>
        </div>
    );
}