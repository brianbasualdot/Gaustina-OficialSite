import React from 'react';
import { ShieldCheck, Award, Lock } from 'lucide-react';

const TrustBar = () => {
    return (
        <section className="bg-gray-50 py-12 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {/* Security Pillar */}
                    <div className="flex flex-col items-center p-4">
                        <Lock className="w-12 h-12 text-indigo-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Pago 100% Seguro</h3>
                        <p className="text-sm text-gray-500">
                            Procesamos tus pagos con la tecnología más segura del mercado.
                        </p>
                    </div>

                    {/* Quality Pillar */}
                    <div className="flex flex-col items-center p-4 md:border-l md:border-r border-gray-200">
                        <Award className="w-12 h-12 text-indigo-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Calidad Garantizada</h3>
                        <p className="text-sm text-gray-500">
                            Materiales premium seleccionados para durar.
                        </p>
                    </div>

                    {/* Privacy Pillar */}
                    <div className="flex flex-col items-center p-4">
                        <ShieldCheck className="w-12 h-12 text-indigo-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Datos Protegidos</h3>
                        <p className="text-sm text-gray-500">
                            Tu información personal viaja siempre encriptada.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustBar;
