import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';

const FailurePage = () => {
    return (
        <div className="pt-24 min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20">
            <div className="max-w-md w-full text-center space-y-8">

                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                    <XCircle size={48} className="text-red-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-heading text-gray-900">Ups, hubo un problema</h1>
                    <p className="text-gray-500 font-body">
                        No pudimos procesar tu pago. Puede deberse a fondos insuficientes,
                        un error de conexión o cancelación de la operación.
                    </p>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                    <Link
                        to="/carrito"
                        className="w-full bg-black text-white font-heading uppercase tracking-widest text-xs py-4 hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        Reintentar Pago <RefreshCw size={14} />
                    </Link>
                    <a
                        href="https://wa.me/5492215791290"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full border border-gray-200 text-gray-700 font-heading uppercase tracking-widest text-xs py-4 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                        Contactar Soporte | Gaustina <MessageCircle size={14} />
                    </a>
                </div>

                <Link
                    to="/"
                    className="text-gray-400 text-xs font-heading underline hover:text-black transition-colors"
                >
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default FailurePage;
