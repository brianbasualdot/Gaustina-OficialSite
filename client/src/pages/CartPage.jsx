import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Plus, CreditCard, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CheckoutForm from '../components/CheckoutForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [suggestedProduct, setSuggestedProduct] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('mercadopago');
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
    const shippingCost = customerData?.shippingMethod === 'domicilio' ? 6473 : 0;
    const totalWithShipping = subtotal + shippingCost;
    const finalTotal = paymentMethod === 'transferencia' ? (subtotal * 0.85) + shippingCost : totalWithShipping;
    const discountAmount = paymentMethod === 'transferencia' ? subtotal * 0.15 : 0;

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(products => {
                const available = products.filter(p => !cartItems.some(c => c.id === p.id));
                if (available.length > 0) {
                    const random = available[Math.floor(Math.random() * available.length)];
                    setSuggestedProduct(random);
                } else {
                    setSuggestedProduct(null);
                }
            })
            .catch(err => console.error("Error buscando sugerencia:", err));
    }, [cartItems.length]);

    const handleCheckout = async () => {
        if (!isFormValid) {
            showToast("Por favor completa todos los datos de envío.", "error");
            return;
        }

        setLoadingCheckout(true);

        // Consolidar dirección para el backend (que espera 'shippingAddress')
        const consolidatedAddress = `${customerData.street} ${customerData.number}${customerData.floor ? `, Piso ${customerData.floor}` : ''}${customerData.apartment ? `, Depto ${customerData.apartment}` : ''}`;

        const finalCustomerData = {
            ...customerData,
            shippingAddress: consolidatedAddress
        };

        try {
            const response = await fetch(`${API_URL}/api/payment/create_preference`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    method: paymentMethod,
                    customerData: finalCustomerData,
                    shippingCost: shippingCost
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Detalles del error del servidor:", data);
                throw new Error(data.error || "Error al procesar el pedido");
            }

            if (paymentMethod === 'transferencia') {
                if (data.orderId) {
                    navigate('/checkout/transferencia', { state: { total: finalTotal } });
                }
            } else {
                if (data.init_point) {
                    window.location.href = data.init_point;
                }
            }

        } catch (error) {
            console.error("Error en checkout:", error);
            showToast(error.message || "Hubo un error al procesar tu pedido.", "error");
        } finally {
            setLoadingCheckout(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="mb-6">
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
                    <p className="text-gray-600 mb-8">Parece que aún no has agregado nada.</p>
                </div>
                <Link
                    to="/productos"
                    className="inline-flex items-center bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
                >
                    Explorar Colección
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-heading text-brand-primary mb-8 text-center">
                    Tu Carrito de Compras
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4 text-left">
                            {cartItems.map((item, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={`${item.id}-${index}`}
                                    className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 border-b border-gray-100"
                                >
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 overflow-hidden">
                                        <img
                                            src={(item.images && item.images.length > 0) ? item.images[0] : "https://via.placeholder.com/150?text=Sin+Foto"}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="text-lg text-gray-900 font-heading mb-1">{item.name}</h3>
                                        <p className="text-brand-primary font-body">${item.price.toLocaleString('es-AR')}</p>
                                        {item.selectedCustomizations && (
                                            <div className="text-sm text-gray-500 mt-1 space-y-1 font-body">
                                                {item.selectedCustomizations.fabricColor && (
                                                    <p>Tela: <span className="font-medium text-gray-700">{item.selectedCustomizations.fabricColor}</span></p>
                                                )}
                                                {item.selectedCustomizations.embroideryColor && (
                                                    <p>Bordado: <span className="font-medium text-gray-700">{item.selectedCustomizations.embroideryColor}</span></p>
                                                )}
                                                {item.selectedCustomizations.initials && (
                                                    <p>Iniciales: <span className="font-medium text-gray-700">{item.selectedCustomizations.initials} ({item.selectedCustomizations.initialsColor})</span></p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._cartId)}
                                        className="p-2 text-gray-400 hover:text-black transition-colors"
                                        aria-label="Eliminar producto"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <CheckoutForm onDataChange={(data, isValid) => {
                            setCustomerData(data);
                            setIsFormValid(isValid);
                        }} />

                        {suggestedProduct && (
                            <div className="mt-8 border border-gray-100 bg-gray-50 p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 bg-black text-white text-xs font-bold px-3 py-1">
                                    TE PUEDE GUSTAR
                                </div>
                                <div className="flex items-center justify-between gap-4 mt-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white overflow-hidden border border-gray-200">
                                            <img
                                                src={(suggestedProduct.images && suggestedProduct.images.length > 0) ? suggestedProduct.images[0] : "https://via.placeholder.com/150"}
                                                alt={suggestedProduct.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-heading text-gray-900">{suggestedProduct.name}</h4>
                                            <p className="text-sm text-gray-600 font-body">${suggestedProduct.price.toLocaleString('es-AR')}</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            addToCart(suggestedProduct);
                                            showToast("Producto agregado");
                                        }}
                                        className="bg-transparent border border-black text-black p-2 hover:bg-black hover:text-white transition-colors"
                                        title="Agregar al pedido"
                                    >
                                        <Plus size={20} />
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-8 sticky top-24 rounded-2xl border border-gray-50">
                            <h2 className="text-xl font-heading text-gray-900 mb-6 border-b border-gray-200 pb-4">Resumen</h2>

                            <div className="space-y-4 mb-6 text-gray-700 font-body text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${subtotal.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Envío</span>
                                    {shippingCost > 0 ? (
                                        <span className="font-medium">${shippingCost.toLocaleString('es-AR')}</span>
                                    ) : (
                                        <span className="text-black font-bold text-xs bg-white border border-gray-200 px-2 py-1">GRATIS</span>
                                    )}
                                </div>
                                <AnimatePresence>
                                    {paymentMethod === 'transferencia' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex justify-between items-center text-green-800 overflow-hidden"
                                        >
                                            <span>Descuento (Transferencia)</span>
                                            <span className="font-bold">- ${discountAmount.toLocaleString('es-AR')}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="mb-6 space-y-3">
                                <p className="text-sm font-bold text-gray-900 font-heading uppercase tracking-wide text-left">Método de Pago</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod('mercadopago')}
                                        className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all relative overflow-hidden ${paymentMethod === 'mercadopago'
                                            ? 'border-black bg-white text-black shadow-md ring-1 ring-black'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-400 bg-white'
                                            }`}
                                    >
                                        <CreditCard size={20} className="mb-2" />
                                        <span className="text-xs font-heading font-medium">Mercado Pago</span>
                                        {paymentMethod === 'mercadopago' && (
                                            <motion.div layoutId="selection" className="absolute inset-0 border-2 border-black rounded-xl pointer-events-none" />
                                        )}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod('transferencia')}
                                        className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all relative overflow-hidden ${paymentMethod === 'transferencia'
                                            ? 'border-black bg-white text-black shadow-md ring-1 ring-black'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-400 bg-white'
                                            }`}
                                    >
                                        <Banknote size={20} className="mb-2" />
                                        <span className="text-xs font-heading font-medium">Transferencia</span>
                                        <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full mt-1 font-bold">-15%</span>
                                        {paymentMethod === 'transferencia' && (
                                            <motion.div layoutId="selection" className="absolute inset-0 border-2 border-black rounded-xl pointer-events-none" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6 mb-8">
                                <div className="flex justify-between items-center text-xl font-heading text-gray-900">
                                    <span>Total</span>
                                    <motion.span
                                        key={finalTotal}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        ${finalTotal.toLocaleString('es-AR')}
                                    </motion.span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={(!isFormValid || loadingCheckout) ? {} : { scale: 1.02 }}
                                whileTap={(!isFormValid || loadingCheckout) ? {} : { scale: 0.98 }}
                                onClick={handleCheckout}
                                disabled={loadingCheckout || !isFormValid}
                                className={`w-full text-white font-heading uppercase tracking-widest text-xs py-5 rounded-xl transition-all shadow-lg ${(!isFormValid || loadingCheckout)
                                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                    : 'bg-black hover:bg-gray-900 shadow-black/10'
                                    }`}
                            >
                                {loadingCheckout ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Procesando</span>
                                    </div>
                                ) : (
                                    !isFormValid ? 'Completa el envío' : 'Finalizar Compra'
                                )}
                            </motion.button>

                            <p className="text-center text-xs text-gray-400 mt-6 font-body">
                                <span className="flex items-center justify-center gap-1">
                                    Compra 100% segura <CreditCard size={12} />
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
