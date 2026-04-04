import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentData: any) => Promise<void>;
    amount: number;
}

export default function PaymentModal({ isOpen, onClose, onConfirm, amount }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [holderName, setHolderName] = useState('');

    if (!isOpen) return null;

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo números
        const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
        setCardNumber(formatted.substring(0, 19));
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Solo números
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        setExpiry(value.substring(0, 5));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            await onConfirm({ transactionId });
        } catch (error) {
            // Error manejado en Checkout.tsx
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in duration-200">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-jakarta font-bold text-gray-900 italic">Pago Seguro</h2>
                    <p className="text-sm text-gray-500">Monto final: <span className="font-black text-primary text-lg">${amount.toLocaleString()}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre del Titular</label>
                        <input required type="text" placeholder="JUAN PEREZ" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 uppercase" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Número de Tarjeta</label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input required type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-mono text-lg" value={cardNumber} onChange={handleCardChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Expiración</label>
                            <input required type="text" placeholder="MM/AA" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-center" value={expiry} onChange={handleExpiryChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CVV</label>
                            <input required type="password" maxLength={4} placeholder="***" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-center" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} />
                        </div>
                    </div>

                    <button disabled={isProcessing} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50">
                        {isProcessing ? <Loader2 className="animate-spin h-6 w-6" /> : `PAGAR AHORA`}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase font-black tracking-widest pt-4">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> Transacción Protegida
                    </div>
                </form>
            </div>
        </div>
    );
}