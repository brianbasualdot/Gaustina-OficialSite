import React, { useState, useEffect } from 'react';

const CheckoutForm = ({ onDataChange, hideZip = false, shippingType = null }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        shippingPhone: '',
        shippingAddress: '',
        shippingCity: '',
        shippingZip: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Validar cada vez que cambian los datos y notificar al padre
        const isValid = validateChange();
        onDataChange(formData, isValid);
    }, [formData, shippingType]); // Re-validar si cambia el tipo de envío

    const validateChange = () => {
        // Retorna true si todos los campos requeridos están llenos de acuerdo al contexto
        return Object.entries(formData).every(([key, val]) => {
            // Campos opcionales: siempre retornan true
            if (key === 'shippingFloor' || key === 'shippingApartment') return true;

            if (hideZip && key === 'shippingZip') return true;

            // Si es sucursal, la dirección y ciudad no son obligatorias aquí (vienen del calculador)
            // NOTA: En el nuevo modelo manual, SIEMPRE pedimos dirección aunque sea para sucursal
            // como campo de referencia, pero mantenemos la lógica si el usuario decide lo contrario.

            return val.toString().trim() !== '';
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📍</span> Datos de {shippingType === 'sucursal' ? 'Contacto' : 'Envio'}
            </h3>

            <div className="space-y-4">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Ej: Juan Pérez"
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Email & Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            placeholder="mail@ejemplo.com"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            name="shippingPhone"
                            value={formData.shippingPhone}
                            onChange={handleChange}
                            placeholder="11 1234 5678"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Dirección y Código Postal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega / Calle y Altura</label>
                        <input
                            type="text"
                            name="shippingAddress"
                            value={formData.shippingAddress}
                            onChange={handleChange}
                            placeholder="Ej: Av. Santa Fe 1234"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Piso (Opcional)</label>
                        <input
                            type="text"
                            name="shippingFloor"
                            value={formData.shippingFloor || ''}
                            onChange={handleChange}
                            placeholder="Piso"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento (Opcional)</label>
                        <input
                            type="text"
                            name="shippingApartment"
                            value={formData.shippingApartment || ''}
                            onChange={handleChange}
                            placeholder="Depto"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                        <input
                            type="text"
                            name="shippingCity"
                            value={formData.shippingCity}
                            onChange={handleChange}
                            placeholder="Ciudad"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                        <input
                            type="text"
                            name="shippingZip"
                            value={formData.shippingZip}
                            onChange={handleChange}
                            placeholder="CP (Ej: 1428)"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;
