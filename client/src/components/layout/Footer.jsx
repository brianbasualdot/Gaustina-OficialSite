import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Categorías</h3>
                    <ul className="space-y-2">
                        <li><a href="/productos" className="hover:text-white transition-colors">Colecciones</a></li>
                        <li><a href="/mas-vendidos" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Más Vendidos</a></li>
                        <li><a href="/ofertas" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Ofertas</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Ayuda</h3>
                    <ul className="space-y-2">
                        <li><a href="/informacion-envios" className="hover:text-white transition-colors">Envíos</a></li>
                        <li><a href="/politica-devoluciones" className="hover:text-white transition-colors">Devoluciones</a></li>
                        <li>
                            <a
                                href="/preguntas-frecuentes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                            >
                                Preguntas Frecuentes
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
                    <ul className="space-y-2">
                        <li>bgaustina@gmail.com</li>
                        <li>Taller en La Plata, Buenos Aires.</li>
                        <li>Envíos a todo el país.</li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Gaustina. Todos los derechos reservados.
                <p>Desarrollado por <a href="https://github.com/brianbasualdot">brianbasualdot</a> | © 2026</p>
            </div>
        </footer>
    );
};

export default Footer;
