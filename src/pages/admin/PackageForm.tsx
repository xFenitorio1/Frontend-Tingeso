import React, { useState } from 'react';
import { X, Save, Loader2, Calendar, DollarSign, Users, MapPin } from 'lucide-react';
import api from '../../api/axios';

interface PackageFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PackageForm({ isOpen, onClose, onSuccess }: PackageFormProps) {
    const [loading, setLoading] = useState(false);

    // Obtener fecha de hoy en formato YYYY-MM-DD para el atributo 'min'
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        name: '',
        destination: '',
        description: '',
        price: 0,
        totalCapacity: 0,
        startDate: '',
        endDate: '',
        status: 'AVAILABLE'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación de seguridad por si el navegador no soporta 'min'
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            alert("Error: La fecha de regreso debe ser posterior a la de salida.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/packages', {
                ...formData,
                availableSpots: formData.totalCapacity // Al crear, todos los cupos están disponibles
            });

            onSuccess(); // Notifica al padre para recargar la tabla
            onClose();   // Cierra el modal
            // Resetear formulario
            setFormData({ name: '', destination: '', description: '', price: 0, totalCapacity: 0, startDate: '', endDate: '', status: 'AVAILABLE' });
        } catch (error) {
            console.error("Error al guardar paquete:", error);
            alert("Hubo un error al guardar el paquete. Revisa la conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Nuevo Paquete Turístico</h2>
                        <p className="text-xs text-gray-500">Completa los datos para publicar en el catálogo.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="max-h-[70vh] overflow-y-auto px-1 space-y-4">

                        {/* Nombre del Paquete */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                Nombre del Paquete
                            </label>
                            <input
                                type="text" required
                                placeholder="Ej: Escapada Romántica a París"
                                className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Destino */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-gray-400" /> Destino
                                </label>
                                <input
                                    type="text" required
                                    placeholder="Ciudad, País"
                                    className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                />
                            </div>
                            {/* Precio */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                                    <DollarSign className="w-3 h-3 text-gray-400" /> Precio Base
                                </label>
                                <input
                                    type="number" required min="1"
                                    placeholder="0.00"
                                    className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.price || ''}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* SECCIÓN DE FECHAS (BLOQUEO DE PASADO) */}
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1 mb-1">
                                    <Calendar className="w-3 h-3" /> Fecha Inicio
                                </label>
                                <input
                                    type="date" required
                                    min={today} // Bloquea fechas anteriores a hoy
                                    className="block w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1 mb-1">
                                    <Calendar className="w-3 h-3" /> Fecha Fin
                                </label>
                                <input
                                    type="date" required
                                    min={formData.startDate || today} // Bloquea fechas anteriores a la de inicio
                                    className="block w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Capacidad */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" /> Capacidad Total (Cupos)
                            </label>
                            <input
                                type="number" required min="1"
                                placeholder="Ej: 20"
                                className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.totalCapacity || ''}
                                onChange={(e) => setFormData({ ...formData, totalCapacity: Number(e.target.value) })}
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Descripción detallada</label>
                            <textarea
                                rows={3}
                                placeholder="Incluye itinerario, hoteles, etc..."
                                className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Footer del Modal */}
                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/25 active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Publicar Paquete
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}