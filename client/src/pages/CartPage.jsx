import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Trash2, ArrowRight, Plus, CreditCard, Banknote, Truck, Percent } from 'lucide-react';
import CheckoutForm from '../components/CheckoutForm';
import { getDisplayPrice } from '../utils/productUtils';

// URL para buscar sugerencias
import { API_URL } from '../config/api';

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart, clearCart } = useCart();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // --- HELPERS ---
    const getMultiplier = (p) => {
        if (p === 'x2') return 2;
        if (p === 'x4') return 4;
        if (p === 'x6') return 6;
        return 1;
    };

    // --- ESTADOS ---
    const [suggestedProduct, setSuggestedProduct] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('mercadopago'); // 'mercadopago' | 'transferencia'
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    // Guest Checkout State
    const [customerData, setCustomerData] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    // Configuración de Envío
    const [selectedShipping, setSelectedShipping] = useState(null);

    // Cupones
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [appliedCoupons, setAppliedCoupons] = useState([]); // Ahora es un ARRAY
    const [couponError, setCouponError] = useState(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // --- CALCULOS ---
    const baseSubtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

    let couponDiscountAmount = 0;
    let isFreeShippingCoupon = false;

    // Calcular beneficios acumulados de todos los cupones
    appliedCoupons.forEach(coupon => {
        if (coupon.type === 'PERCENTAGE') {
            couponDiscountAmount += baseSubtotal * (coupon.value / 100);
        } else if (coupon.type === 'FIXED') {
            couponDiscountAmount += coupon.value;
        } else if (coupon.type === 'FREE_SHIPPING') {
            isFreeShippingCoupon = true;
        }
    });

    // El descuento de cupones no puede superar el subtotal
    if (couponDiscountAmount > baseSubtotal) couponDiscountAmount = baseSubtotal;

    const subtotalAfterCoupon = baseSubtotal - couponDiscountAmount;

    // Si es transferencia, aplicamos 10% de descuento AL SUBTOTAL DESPUÉS DEL CUPÓN
    const transferDiscountAmount = paymentMethod === 'transferencia' ? subtotalAfterCoupon * 0.10 : 0;
    
    // Envío (Si hay cupón Envío Gratis, costo 0)
    let shippingCost = selectedShipping ? selectedShipping.price : 0;
    if (isFreeShippingCoupon) shippingCost = 0;

    const finalTotal = subtotalAfterCoupon - transferDiscountAmount + shippingCost;

    /**
     * CALCULOS DE UNIDADES FÍSICAS (Packs)
     */
    const totalPhysicalUnits = cartItems.reduce((acc, item) => {
        return acc + ((item.quantity || 1) * getMultiplier(item.pack));
    }, 0);

    // Validar cupón
    const handleApplyCoupon = async () => {
        const code = couponCodeInput.trim().toUpperCase();
        if (!code) return;

        // Evitar duplicados
        if (appliedCoupons.some(c => c.code === code)) {
            setCouponError('Este cupón ya ha sido aplicado');
            return;
        }

        setIsApplyingCoupon(true);
        setCouponError(null);
        
        try {
            const res = await fetch(`${API_URL}/api/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    totalPhysicalUnits: totalPhysicalUnits
                })
            });
            const data = await res.json();
            
            if (!res.ok) {
                setCouponError(data.error || 'Cupón inválido');
            } else {
                setAppliedCoupons(prev => [...prev, data]);
                setCouponError(null);
                setCouponCodeInput('');
                showToast(`Cupón ${code} aplicado`, 'success');
            }
        } catch (error) {
            setCouponError('Error al conectar con el servidor');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = (code) => {
        setAppliedCoupons(prev => prev.filter(c => c.code !== code));
        setCouponError(null);
    };

    // EFECTO: Buscar producto sugerido al azar
    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(products => {
                // Filtramos productos que NO estén ya en el carrito
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

    // MANEJADOR DE COMPRA
    const handleCheckout = async () => {
        if (!isFormValid) {
            showToast("Por favor completa todos los datos de envío.", "info");
            return;
        }

        setLoadingCheckout(true);

        try {
            const finalCustomerData = {
                ...customerData,
                shippingCost: shippingCost,
                shippingMethod: selectedShipping ? selectedShipping.name : 'Envío a convenir',
                shippingType: selectedShipping ? selectedShipping.type : 'N/A',
                // Construir dirección completa para el backend/admin
                shippingAddress: `${customerData?.shippingAddress || ''}${customerData?.shippingFloor ? `, Piso ${customerData.shippingFloor}` : ''}${customerData?.shippingApartment ? `, Depto ${customerData.shippingApartment}` : ''}`,
                shippingZip: customerData?.shippingZip || ''
            };

            const response = await fetch(`${API_URL}/api/payment/create_preference`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    method: paymentMethod,
                    customerData: finalCustomerData,
                    couponCodes: appliedCoupons.map(c => c.code),
                    totalPhysicalUnits: totalPhysicalUnits
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al procesar el pedido");
            }

            if (paymentMethod === 'transferencia') {
                if (data.orderId) {
                    clearCart();
                    navigate('/checkout/transferencia', { 
                        state: { 
                            orderId: data.orderId, 
                            total: finalTotal 
                        } 
                    });
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
        <div className="bg-background-warm min-h-screen py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8">
                    Tu Carrito de Compras
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* COLUMNA IZQUIERDA: Productos y Formulario */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Lista de Items */}
                        <div className="space-y-4">
                            {cartItems.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={(item.images && item.images.length > 0) ? item.images[0] : "https://via.placeholder.com/150?text=Sin+Foto"}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-gray-900 font-heading mb-1">{item.name}</h3>
                                        <p className="text-brand-primary font-bold inline-flex items-center gap-3">
                                            ${item.price.toLocaleString('es-AR')}
                                            {item.freeShipping && (
                                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                                    <Truck size={10} /> Envío Gratis
                                                </span>
                                            )}
                                        </p>

                                        {/* CUSTOMIZATIONS DISPLAY */}
                                        {item.selectedCustomizations && (
                                            <div className="text-sm text-gray-500 mt-1 space-y-1">
                                                {item.selectedCustomizations.fabricColor && (
                                                    <p>Color Tela: <span className="font-medium text-gray-700">{item.selectedCustomizations.fabricColor}</span></p>
                                                )}
                                                {item.selectedCustomizations.embroideryColor && (
                                                    <p>Color Bordado: <span className="font-medium text-gray-700">{item.selectedCustomizations.embroideryColor}</span></p>
                                                )}
                                                {item.selectedCustomizations.measurement && (
                                                    <p>Medida: <span className="font-medium text-gray-700">{item.selectedCustomizations.measurement}</span></p>
                                                )}
                                                {item.selectedCustomizations.fabricType && (
                                                    <p>Tela: <span className="font-medium text-gray-700">{item.selectedCustomizations.fabricType}</span></p>
                                                )}
                                                {item.selectedCustomizations.letters && (
                                                    <p>Iniciales: <span className="font-medium text-gray-700">{item.selectedCustomizations.letters}</span></p>
                                                )}
                                            </div>
                                        )}

                                        {/* TOTAL UNITS INDICATOR */}
                                        {item.pack && (
                                            <div className="mt-2 bg-brand-light/20 border border-brand-light/30 px-2.5 py-1 rounded-md inline-flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase text-brand-dark tracking-wider">
                                                    {item.pack} — {getMultiplier(item.pack)} unidades físicas
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._cartId)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label="Eliminar producto"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Formulario de Checkout */}
                        <CheckoutForm
                            shippingType={selectedShipping?.type}
                            onDataChange={(data, isValid) => {
                                setCustomerData(data);
                                // Validamos que form sea válido Y hayan elegido un envío
                                const isShippingValid = selectedShipping !== null;
                                setIsFormValid(isValid && isShippingValid);
                            }}
                        />

                        {/* --- SUGERENCIA --- */}
                        {suggestedProduct && (() => {
                            const { price, label, pack } = getDisplayPrice(suggestedProduct);
                            return (
                                <div className="mt-8 border border-yellow-200 bg-yellow-50/50 rounded-xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-br-lg">
                                        TE PUEDE GUSTAR
                                    </div>
                                    <div className="flex items-center justify-between gap-4 mt-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-yellow-200 shadow-sm">
                                                <img
                                                    src={(suggestedProduct.images && suggestedProduct.images.length > 0) ? suggestedProduct.images[0] : "https://via.placeholder.com/150"}
                                                    alt={suggestedProduct.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{suggestedProduct.name}</h4>
                                                <p className="text-sm text-gray-600">
                                                    ${price.toLocaleString('es-AR')} {label && <span className="font-bold text-yellow-700">{label}</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (pack) {
                                                    // Si es un producto de pack, lo añadimos con el pack y precio detectado
                                                    addToCart({
                                                        ...suggestedProduct,
                                                        price: price,
                                                        pack: pack
                                                    });
                                                } else {
                                                    addToCart(suggestedProduct);
                                                }
                                                showToast("¡Sugerencia agregada!", "success");
                                            }}
                                            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                                            title="Agregar al pedido"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* COLUMNA DERECHA: Resumen y Pago */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

                            {/* --- Sección de Cupón --- */}
                            <div className="mb-6">
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Código de descuento"
                                        value={couponCodeInput}
                                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase font-bold focus:ring-brand-primary focus:border-brand-primary"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={isApplyingCoupon || !couponCodeInput.trim()}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                    >
                                        {isApplyingCoupon ? '...' : 'Aplicar'}
                                    </button>
                                </div>

                                {/* LISTA DE CUPONES APLICADOS */}
                                <div className="space-y-2">
                                    {appliedCoupons.map((coupon) => (
                                        <div key={coupon.id} className="bg-green-50 border border-green-200 rounded-lg p-2 flex justify-between items-center animate-in fade-in slide-in-from-top-1">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-green-600 text-white p-1 rounded">
                                                    <Percent size={12} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-green-700 font-bold leading-none uppercase">Cupón Aplicado</p>
                                                    <p className="text-xs font-black text-green-900 tracking-wider">
                                                        {coupon.code}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveCoupon(coupon.code)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Quitar cupón"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                {couponError && (
                                    <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>
                                )}
                            </div>

                            <div className="space-y-4 mb-6 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${baseSubtotal.toLocaleString('es-AR')}</span>
                                </div>

                                {appliedCoupons.length > 0 && (
                                    <div className="flex justify-between items-center text-green-700">
                                        <span>Descuento Cupones</span>
                                        <span className="font-bold">
                                            - ${couponDiscountAmount.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                )}

                                {isFreeShippingCoupon && selectedShipping?.type === 'domicilio' && (
                                    <div className="text-[10px] text-green-600 font-bold uppercase tracking-tight text-right -mt-3">
                                        Envío bonificado por cupón
                                    </div>
                                )}

                                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                    <span>Envío</span>
                                    <span className="font-bold">
                                        {selectedShipping
                                            ? (shippingCost === 0 ? <span className="text-green-600">¡GRATIS!</span> : `$${shippingCost.toLocaleString('es-AR')}`)
                                            : <span className="text-gray-400 text-xs">A calcular</span>}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6 space-y-3">
                                <p className="text-sm font-bold text-gray-900 border-b pb-2">Método de Envío (Correo Argentino)</p>
                                <div className="space-y-2">
                                    <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedShipping?.id === 'ca_sucursal_flat' ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                                                checked={selectedShipping?.id === 'ca_sucursal_flat'}
                                                onChange={() => setSelectedShipping({ id: 'ca_sucursal_flat', name: 'Envío a Sucursal Correo Argentino', price: 0, type: 'sucursal' })}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">Retiro en Sucursal</span>
                                                <span className="text-[10px] text-gray-500 uppercase">3 a 6 días hábiles</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-green-600">¡GRATIS!</span>
                                    </label>

                                    <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedShipping?.id === 'ca_domicilio_flat' ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                                                checked={selectedShipping?.id === 'ca_domicilio_flat'}
                                                onChange={() => setSelectedShipping({ id: 'ca_domicilio_flat', name: 'Envío a domicilio Correo Argentino', price: 4490, type: 'domicilio' })}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">Envío a Domicilio</span>
                                                <span className="text-[10px] text-gray-500 uppercase">3 a 7 días hábiles</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">
                                            $4.490
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Descuento condicional */}
                            {paymentMethod === 'transferencia' && (
                                <div className="flex justify-between items-center text-green-700">
                                    <span>Descuento (Transferencia)</span>
                                    <span className="font-bold">- ${transferDiscountAmount.toLocaleString('es-AR')}</span>
                                </div>
                            )}

                            {/* --- SELECTOR DE PAGO --- */}
                            <div className="mt-6 mb-6 space-y-3">
                                <p className="text-sm font-bold text-gray-900">Método de Pago</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentMethod('mercadopago')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${paymentMethod === 'mercadopago'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                            : 'border-gray-200 hover:border-blue-200 text-gray-500'
                                            }`}
                                    >
                                        <CreditCard size={24} className="mb-2" />
                                        <span className="text-xs font-bold">Tarjetas / MP</span>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod('transferencia')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${paymentMethod === 'transferencia'
                                            ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500'
                                            : 'border-gray-200 hover:border-green-200 text-gray-500'
                                            }`}
                                    >
                                        <Banknote size={24} className="mb-2" />
                                        <span className="text-xs font-bold">Transferencia</span>
                                        <span className="text-[10px] bg-green-100 px-1 rounded mt-1 text-green-800 font-medium">10% OFF</span>
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6 mb-8">
                                <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${finalTotal.toLocaleString('es-AR')}</span>
                                </div>
                                {paymentMethod !== 'transferencia' && (
                                    <p className="text-right text-sm text-green-600 mt-2 font-medium">
                                        ¡Ahorrá ${(subtotalAfterCoupon * 0.10).toLocaleString('es-AR')} pagando por Transferencia!
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loadingCheckout || !isFormValid}
                                className={`w-full text-white font-bold py-4 rounded-lg transition-all shadow-lg text-sm md:text-base ${(!isFormValid || loadingCheckout)
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : (paymentMethod === 'mercadopago' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700')
                                    }`}
                            >
                                {loadingCheckout ? 'Procesando...' : (
                                    !isFormValid ? 'Completa formulario y calcula el envío' : (
                                        paymentMethod === 'mercadopago' ? 'Pagar con Mercado Pago' : 'Finalizar Pedido'
                                    )
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                <span className="flex items-center justify-center gap-1">
                                    Compra protegida <CreditCard size={12} />
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
