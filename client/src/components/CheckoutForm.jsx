import React, { useState, useEffect } from 'react';

const CheckoutForm = ({ onDataChange }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        shippingPhone: '',
        street: '',
        number: '',
        floor: '',
        apartment: '',
        shippingCity: '',
        shippingZip: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const isValid = validateChange();
        onDataChange(formData, isValid);
    }, [formData]);

    const validateChange = () => {
        // Requeridos: Nombre, Email, Teléfono, Calle, Altura, Ciudad, CP
        const requiredFields = ['customerName', 'customerEmail', 'shippingPhone', 'street', 'number', 'shippingCity', 'shippingZip'];
        return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
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
                <span>📍</span> Datos de Envío
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

                {/* Dirección - Calle y Altura */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Ej: Av. Santa Fe"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Altura</label>
                        <input
                            type="text"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            placeholder="1234"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Piso y Depto (Opcionales) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Piso (Opcional)</label>
                        <input
                            type="text"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            placeholder="Piso"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Depto / Letra (Opcional)</label>
                        <input
                            type="text"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleChange}
                            placeholder="A"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Ciudad y CP */}
                <div className="grid grid-cols-2 gap-4">
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
                            placeholder="CP"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;
