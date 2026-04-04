import { useState, useEffect } from 'react';
import {
    TicketPercent,
    Plus,
    Trash2,
    Calendar,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
    ArrowRight,
    Percent
} from 'lucide-react';
import api from '../../api/axios';

interface Promotion {
    id: number;
    name: string;
    discountPercentage: number;
    validFrom: string;
    validTo: string;
    active: boolean;
}

export default function AdminPromotions() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const now = new Date().toISOString().slice(0, 16);

    const [formData, setFormData] = useState({
        name: '',
        discountPercentage: '',
        validFrom: '',
        validTo: '',
        active: true
    });

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/promotions');
            setPromotions(response.data);
        } catch (error) {
            console.error("Error al cargar promociones", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        const pct = parseFloat(formData.discountPercentage);

        // Validaciones de Rango
        if (pct < 0 || pct > 100) {
            alert("El porcentaje debe estar entre 0 y 100");
            return;
        }

        // Validación de Fechas
        if (formData.validTo < formData.validFrom) {
            alert("La fecha de término (validTo) no puede ser anterior a la de inicio (validFrom).");
            return;
        }

        try {
            setIsSubmitting(true);
            const dataToSave = {
                ...formData,
                discountPercentage: pct / 100
            };

            await api.post('/api/promotions', dataToSave);

            setFormData({ name: '', discountPercentage: '', validFrom: '', validTo: '', active: true });
            fetchPromotions();
            alert("Promoción creada con éxito");
        } catch (error: any) {
            alert(error.response?.data || "Error al crear la promoción");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await api.patch(`/api/promotions/${id}/status`, { active: !currentStatus });
            fetchPromotions();
        } catch (error) {
            alert("No se pudo cambiar el estado");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Estás seguro de eliminar esta promoción?")) return;

        try {
            await api.delete(`/api/promotions/${id}`);
            fetchPromotions();
            alert("Promoción eliminada");
        } catch (error) {
            alert("Error al eliminar la promoción");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Sincronizando Campañas...</p>
        </div>
    );

    return (
        <div className="space-y-8 font-inter animate-in fade-in duration-500">
            <div className="flex flex-col">
                <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tight">Marketing & Promociones</h1>
                <p className="text-gray-500 font-medium">Configura la vigencia de tus descuentos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Formulario */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-8">
                        <div className="flex items-center gap-2 mb-8 text-orange-600">
                            <div className="bg-orange-100 p-2 rounded-xl"><Plus size={20} /></div>
                            <h2 className="font-bold uppercase tracking-widest text-xs">Nueva Campaña</h2>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Promo Verano"
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 transition-all outline-none text-sm font-medium"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Descuento (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 outline-none text-sm font-black"
                                        value={formData.discountPercentage}
                                        onChange={e => setFormData({ ...formData, discountPercentage: e.target.value })}
                                    />
                                    <Percent size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Válido Desde</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        min={now}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-xs font-medium outline-none"
                                        value={formData.validFrom}
                                        onChange={e => {
                                            const newStart = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                validFrom: newStart,
                                                validTo: prev.validTo && newStart > prev.validTo ? newStart : prev.validTo
                                            }));
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Válido Hasta</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        min={formData.validFrom || now}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-xs font-medium outline-none"
                                        value={formData.validTo}
                                        onChange={e => setFormData({ ...formData, validTo: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Activar Promoción'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tabla */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaña</th>
                                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Vigencia</th>
                                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
                                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {promotions.map((promo) => (
                                    <tr key={promo.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                                                    <TicketPercent size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 tracking-tight">{promo.name}</p>
                                                    <p className="text-orange-600 font-black text-sm">{(promo.discountPercentage * 100).toFixed(0)}% OFF</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 py-2 px-3 rounded-xl">
                                                <Calendar size={12} className="text-gray-300" />
                                                {new Date(promo.validFrom).toLocaleDateString()}
                                                <ArrowRight size={10} className="text-gray-300" />
                                                {new Date(promo.validTo).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <button
                                                onClick={() => toggleStatus(promo.id, promo.active)}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${promo.active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-gray-100 text-gray-400'
                                                    }`}
                                            >
                                                {promo.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                {promo.active ? 'Activa' : 'Inactiva'}
                                            </button>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="text-gray-200 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl">
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {promotions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center opacity-20">
                                            <AlertCircle size={48} className="mx-auto mb-2" />
                                            <p className="font-black uppercase text-xs">Sin registros</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}