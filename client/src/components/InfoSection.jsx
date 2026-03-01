import React from 'react';
import { Truck, Sparkles, Award } from 'lucide-react';

const InfoCard = ({ icon: Icon, title, description }) => (
    <div className="bg-transparent p-6 flex flex-col items-center text-center">
        <div className="p-4 rounded-full mb-4">
            <Icon className="w-8 h-8 text-brand-primary opacity-80" strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-body font-bold text-gray-900 uppercase tracking-widest mb-1">
            {title}
        </h3>
        <p className="text-brand-primary font-script text-2xl leading-tight max-w-xs">
            {description}
        </p>
    </div>
);

const InfoSection = () => {
    const infos = [
        {
            icon: Truck,
            title: "Envíos Gratis",
            description: "A Sucursal De Correo Argentino"
        },
        {
            icon: Sparkles,
            title: "Descuento Por Transferencia",
            description: "15% OFF en toda tu compra"
        },
        {
            icon: Award,
            title: "Hecho a Mano",
            description: "Industria Argentina"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-gray-100 pt-16">
            {infos.map((info, index) => (
                <InfoCard key={index} {...info} />
            ))}
        </div>
    );
};

export default InfoSection;
