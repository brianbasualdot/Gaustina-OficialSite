import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Copy, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const TransferenciaPage = () => {
    const { getCartTotal } = useCart();
    const location = useLocation();

    // Priorizamos el total que viene del carrito (incluye el cálculo correcto y envío)
    const total = location.state?.total || (getCartTotal() * 0.85);

    const copiarCBU = () => {
        navigator.clipboard.writeText("0140999803200074125413");
        alert("¡CBU Copiado!");
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pedido Reservado!</h1>
                <p className="text-gray-500 mb-8">
                    Transfiere <span className="font-bold text-black">${total.toLocaleString('es-AR')}</span> a la siguiente cuenta:
                </p>

                <div className="bg-gray-100 p-6 rounded-xl text-left mb-8 relative">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Titular</p>
                    <p className="font-mono font-medium text-lg mb-4">Agustina Berth</p>

                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Alias</p>
                    <p className="font-mono font-medium text-lg mb-4">GAUSTINA.AR</p>

                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">CBU</p>
                    <p className="font-mono font-medium text-lg text-gray-600 break-all">0140999803200074125413</p>

                    <button onClick={copiarCBU} className="absolute top-4 right-4 text-blue-600 hover:text-blue-800">
                        <Copy size={20} />
                    </button>
                </div>

                <div className="flex gap-4">
                    <Link to="/" className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
                        <ArrowLeft size={18} /> Volver
                    </Link>
                    <a
                        href={`https://wa.me/5492215791290?text=Hola!%20Ya%20hice%20la%20transferencia%20de%20$${total}%20por%20mi%20pedido.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-200"
                    >
                        Enviar Comprobante
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TransferenciaPage;

