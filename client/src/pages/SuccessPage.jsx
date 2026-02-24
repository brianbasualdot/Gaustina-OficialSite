import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const SuccessPage = () => {
    const location = useLocation();
    const { clearCart } = useCart();
    const [orderData, setOrderData] = useState(null);

    // Intentar recuperar ID de orden de Mercado Pago/URL
    const query = new URLSearchParams(location.search);
    const orderId = query.get('external_reference');

    useEffect(() => {
        // Al llegar aquí con éxito, limpiamos el carrito
        clearCart();

        // Simulación: En un caso real, podríamos fetch la orden del backend con el external_reference
        // Por ahora, como es frontend, mostramos un mensaje general o datos del localstorage si persistieran
        if (orderId) {
            setOrderData({ id: orderId });
        }
    }, [orderId]);

    return (
        <div className="pt-24 min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20">
            <div className="max-w-md w-full text-center space-y-8">

                {/* Checkmark Animado */}
                <div className="relative flex justify-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-bounce-short">
                        <CheckCircle size={48} className="text-green-500 transition-transform duration-500 scale-110" />
                    </div>
                    {/* Partículas de celebración (opcional) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                        <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-75"></div>
                        <div className="absolute bottom-0 right-10 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-150"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-script text-brand-primary">¡Pago Exitoso!</h1>
                    <p className="text-gray-500 font-body">Tu pedido ha sido recibido correctamente.</p>
                </div>

                {/* Package Animation Section */}
                <div className="bg-brand-light/20 p-8 rounded-3xl border border-brand-light/30 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500">
                            <Package size={36} className="text-brand-primary animate-pulse" />
                        </div>
                        <h3 className="font-heading text-lg text-gray-800 mb-2">Estamos preparando tu pedido</h3>
                        <p className="text-sm text-gray-600 leading-relaxed font-body">
                            En cuanto el taller termine tu pieza, te notificaremos por email.
                            Cualquier duda o imprevisto nos comunicaremos con vos.
                        </p>
                    </div>
                    {/* Fondo decorativo animado */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl"></div>
                </div>

                {/* Detalles del Pedido (Placeholder) */}
                <div className="border-t border-gray-100 pt-8 text-left">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Resumen</span>
                        {orderId && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Orden #{orderId}</span>}
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 italic">
                            Revisa tu correo electrónico para ver el detalle completo de la transacción y confirmación.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Link
                        to="/productos"
                        className="w-full bg-black text-white font-heading uppercase tracking-widest text-xs py-4 hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        Continuar Comprando <ShoppingBag size={14} />
                    </Link>
                    <Link
                        to="/"
                        className="text-gray-400 text-xs font-heading underline hover:text-black transition-colors"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </div>

            {/* Inyectamos estilos extra para las animaciones específicas si no están en tailwind */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-short {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-short {
                    animation: bounce-short 2s ease-in-out infinite;
                }
            `}} />
        </div>
    );
};

export default SuccessPage;
