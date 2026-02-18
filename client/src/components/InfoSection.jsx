import React from 'react';
import { Truck, Sparkles, Award } from 'lucide-react';

const InfoCard = ({ icon: Icon, title, description }) => (
    <div className="bg-transparent p-6 flex flex-col items-center text-center">
        <div className="p-4 rounded-full mb-4">
            <Icon className="w-8 h-8 text-brand-primary opacity-80" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-script text-brand-primary mb-3">
            {title}
        </h3>
        <p className="text-gray-600 font-heading text-sm uppercase tracking-wider leading-relaxed max-w-xs">
            {description}
        </p>
    </div>
);

const InfoSection = () => {
    const infos = [
        {
            icon: Truck,
            title: "Envíos Seguros",
            description: "A todo el país con seguimiento detallado"
        },
        {
            icon: Sparkles,
            title: "Telas Premium",
            description: "Algodón 100% y lino de la mejor calidad"
        },
        {
            icon: Award,
            title: "Hecho a Mano",
            description: "Cada pieza es única y artesanal"
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
