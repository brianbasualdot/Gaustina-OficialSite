import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Gaustina</h3>
                    <ul className="space-y-2">
                        <li><a href="/productos" className="hover:text-white transition-colors uppercase tracking-wider text-xs">Ver Colección</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Ayuda</h3>
                    <ul className="space-y-2">
                        <li><a href="/informacion-envios" className="hover:text-white transition-colors">Envíos</a></li>
                        <li><a href="/politica-devoluciones" className="hover:text-white transition-colors">Devoluciones</a></li>
                        <li><a href="/politica-de-privacidad" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                        <li><a href="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                        <li><a href="/preguntas-frecuentes" className="hover:text-white transition-colors">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
                    <ul className="space-y-4 text-sm">
                        <li className="flex flex-col">
                            <span className="text-white font-bold uppercase text-xs tracking-widest mb-1">Email</span>
                            <a href="mailto:bgaustina@gmail.com" className="hover:text-white transition-colors">bgaustina@gmail.com</a>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-white font-bold uppercase text-xs tracking-widest mb-1">Teléfono / WhatsApp</span>
                            <a href="https://wa.me/5492215791290" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+54 9 221 579-1290</a>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-white font-bold uppercase text-xs tracking-widest mb-1">Taller</span>
                            <address className="not-italic">
                                Calle 4 1325<br />
                                La Plata, Buenos Aires<br />
                                CP B1900, Argentina
                            </address>
                        </li>
                        <li>
                            <a href="/contacto" className="text-white font-bold hover:underline decoration-brand-primary underline-offset-4">Página de Contacto</a>
                        </li>
                        <li>
                            <a href="/quienes-somos" className="text-white font-bold hover:underline decoration-brand-primary underline-offset-4">Quiénes Somos</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Gaustina. Todos los derechos reservados.
                <p className="mt-2 text-xs opacity-50 italic">
                    Hecho con ♡ en nuestro taller de bordado.
                </p>
                <div className="mt-4 flex justify-center gap-4 text-xs">
                    <a href="/politica-de-privacidad" className="hover:text-white">Privacidad</a>
                    <span>•</span>
                    <a href="/terminos-y-condiciones" className="hover:text-white">Términos</a>
                    <span>•</span>
                    <a href="/informacion-envios" className="hover:text-white">Envíos</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
