import React from 'react';
import FAQSection from '../components/home/FAQSection';
import SeoHead from '../components/common/SeoHead';

const FAQPage = () => {
    return (
        <div className="pt-20">
            <SeoHead
                title="Preguntas Frecuentes | Gaustina"
                description="Resuelve tus dudas sobre formatos de bordado, descargas digitales, pagos y licencias."
            />
            <div className="bg-[#fefefc] min-h-screen py-12">
                <FAQSection />
            </div>
        </div>
    );
};

export default FAQPage;
