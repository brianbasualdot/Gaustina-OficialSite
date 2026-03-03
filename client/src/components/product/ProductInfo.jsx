import React, { useState } from 'react';

const ProductInfo = () => {
    const [activeTab, setActiveTab] = useState('materiales');

    const tabs = [
        { id: 'materiales', label: 'Materiales' },
        { id: 'envios', label: 'Envíos' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'materiales':
                return (
                    <div className="text-gray-600 font-body leading-relaxed">
                        <p>Trabajamos exclusivamente con <strong>Tusor Premium</strong>, un textil 100% algodón de excelente caída y suavidad.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Tejido pre-lavado (no achica).</li>
                            <li>Textura arrugada natural que no necesita planchado.</li>
                            <li>Hilos de alta resistencia para el bordado.</li>
                        </ul>
                    </div>
                );
            case 'envios':
                return (
                    <div className="text-gray-600 font-body leading-relaxed">
                        <p>Nosotros nos hacemos cargo del costo. Tu pedido viaja asegurado y sin cargo extra por <strong>Correo Argentino</strong>.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Envíos a todo el país.</li>
                            <li>Tiempo estimado de entrega: 3 a 6 días hábiles una vez despachado.</li>
                            <li>Recibirás un código de seguimiento por email.</li>
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="mt-12">
            <div className="flex border-b border-gray-200 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 pr-8 font-heading font-semibold text-lg transition-colors ${activeTab === tab.id
                            ? 'text-brand-primary border-b-2 border-brand-primary'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="animate-fade-in">
                {renderContent()}
            </div>
        </div>
    );
};

export default ProductInfo;
