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
                            <span className="text-white font-bold uppercase text-xs tracking-widest mb-1">WhatsApp</span>
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
                    </ul>
                </div>
            </div>

            {/* Medios de Pago & Seguridad */}
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4 text-center md:text-left">Medios de Pago</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                            {/* Visa */}
                            <div className="bg-white/5 p-2 rounded flex items-center justify-center w-10 h-6">
                                <svg viewBox="0 0 48 48" className="w-full h-full"><path fill="#ffffff" d="M18.5 31.5H15l2.2-13.8h3.5l-2.2 13.8zM28.4 18.2c-.7-.4-1.9-.8-3.3-.8-3.6 0-6.1 1.9-6.2 4.7-.1 2.1 1.8 3.2 3.3 3.9 1.5.7 2 1.2 2 1.8 0 .9-1.1 1.4-2.2 1.4-1.5 0-2.3-.2-3.5-.8l-.5-.2-.5 3.3c.9.4 2.6.8 4.3.8 3.8 0 6.3-1.9 6.4-4.8 0-1.6-1-2.8-3.1-3.8-1.3-.7-2.1-1.1-2.1-1.8 0-.6.7-1.3 2.1-1.3 1.1-.1 1.9.3 2.6.6l.3.1.4-3.3zM40.2 17.7h-2.7c-.8 0-1.5.5-1.9 1.3l-5.3 12.5H34s.6-1.7.7-2.1h4.1c.1.4.4 2.1.4 2.1h3.1l-2.1-13.8zm-5.3 9h2.3l-1.1-3.2-1.2 3.2zM12.9 17.7H7.3L7 19.3c3.4.8 5.7 3 6.6 5.4l1.1-5.7c.3-1-.3-1.3-1.8-1.3z" /></svg>
                            </div>
                            {/* Mastercard */}
                            <div className="bg-white/5 p-2 rounded flex items-center justify-center w-10 h-6">
                                <svg viewBox="0 0 48 48" className="w-full h-full"><circle cx="18" cy="24" r="14" fill="#ffffff" fillOpacity=".2"/><circle cx="30" cy="24" r="14" fill="#ffffff" fillOpacity=".2"/><path fill="#ffffff" d="M24 13.6c-2.8 2.8-4.5 6.6-4.5 10.4s1.7 7.6 4.5 10.4c2.8-2.8 4.5-6.6 4.5-10.4s-1.7-7.6-4.5-10.4z"/></svg>
                            </div>
                            {/* Mercado Pago */}
                            <div className="bg-white/5 p-2 rounded flex items-center justify-center h-6 px-2">
                                <span className="text-[8px] font-bold text-white tracking-tighter">MERCADO PAGO</span>
                            </div>
                            {/* Transferencia */}
                            <div className="bg-white/5 p-2 rounded flex items-center justify-center w-10 h-6">
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white"><path d="M2 17h20v2H2v-2zm1.15-2L2 15V5l1.15-2h17.7L22 5v10l-1.15 2H3.15zM7 7v6h10V7H7z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-green-500/70 py-2 px-4 border border-green-500/20 rounded-full bg-green-500/5">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Sitio Seguro SSL</span>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Gaustina. Todos los derechos reservados.
                <p className="mt-2 text-xs opacity-50 italic font-medium">
                    Hecho con ♡ en La Plata, Argentina.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest font-bold opacity-40">
                    <a href="/politica-de-privacidad" className="hover:text-white transition-colors">Privacidad</a>
                    <a href="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos</a>
                    <a href="/informacion-envios" className="hover:text-white transition-colors">Envíos</a>
                    <a href="/politica-devoluciones" className="hover:text-white transition-colors">Devoluciones</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
