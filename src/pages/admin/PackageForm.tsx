import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Calendar } from 'lucide-react';
import api from '../../api/axios';

interface PackageFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export default function PackageForm({ isOpen, onClose, onSuccess, initialData }: PackageFormProps) {
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                name: initialData.title || '',
                destination: initialData.destination || '',
                description: initialData.description || '',
                price: initialData.basePrice || 0,
                totalCapacity: initialData.spotsTotal || 0,
                startDate: initialData.startDate || '',
                endDate: initialData.endDate || '',
                status: initialData.status === 'Active' ? 'AVAILABLE' :
                    initialData.status === 'Sold Out' ? 'SOLD_OUT' : 'DRAFT'
            });
        } else if (isOpen) {
            setFormData({
                name: '', destination: '', description: '', price: 0,
                totalCapacity: 0, startDate: '', endDate: '', status: 'AVAILABLE'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            availableSpots: initialData ? initialData.spotsLeft : formData.totalCapacity
        };

        try {
            if (initialData) {
                await api.put(`/api/packages/${initialData.id}`, payload);
            } else {
                await api.post('/api/packages', payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al procesar paquete:", error);
            alert("Error al guardar los cambios.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Editar Paquete' : 'Nuevo Paquete'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="max-h-[60vh] overflow-y-auto px-1 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Nombre del Paquete</label>
                            <input
                                type="text" required value={formData.name}
                                className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Destino</label>
                                <input
                                    type="text" required value={formData.destination}
                                    className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Precio ($)</label>
                                <input
                                    type="number" required value={formData.price}
                                    className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Inicio
                                </label>
                                <input
                                    type="date" required min={today} value={formData.startDate}
                                    className="block w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Fin
                                </label>
                                <input
                                    type="date" required min={formData.startDate || today} value={formData.endDate}
                                    className="block w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Capacidad Total</label>
                            <input
                                type="number" required value={formData.totalCapacity}
                                className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 outline-none"
                                onChange={(e) => setFormData({ ...formData, totalCapacity: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                            <textarea
                                rows={3} value={formData.description}
                                className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 outline-none"
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button
                            type="submit" disabled={loading}
                            className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {initialData ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}