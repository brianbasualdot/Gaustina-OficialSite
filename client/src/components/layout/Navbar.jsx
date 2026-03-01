import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const { cartItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartCount = cartItems.length;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { path: '/', label: 'Inicio' },
        { path: '/productos', label: 'Productos' },
        { path: '/contacto', label: 'Contacto' },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20 md:h-28">

                    {/* --- Logo (Left) --- */}
                    <Link
                        to="/"
                        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
                    >
                        <img
                            src="https://tamyyvryopjvppkjauqa.supabase.co/storage/v1/object/public/products/logoinicio.png"
                            alt="Gaustina"
                            className="h-12 md:h-16 w-auto object-contain"
                        />
                    </Link>

                    {/* --- Desktop Navigation (Center) --- */}
                    <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `font-heading text-sm uppercase tracking-widest hover:text-brand-accent transition-colors duration-300 ease-in-out border-b-2 border-transparent pb-1 ${isActive ? "text-black border-black" : "text-brand-primary hover:border-brand-accent"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* --- Actions (Right) --- */}
                    <div className="flex items-center space-x-5">
                        <Link
                            to="/carrito"
                            className="relative group hover:text-brand-accent transition-colors text-brand-primary"
                            title="Ver Carrito"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-900 hover:text-black focus:outline-none"
                            onClick={toggleMenu}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Mobile Menu Overlay --- */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={toggleMenu}
                    />

                    {/* Drawer */}
                    <div className="relative bg-white w-[80%] max-w-xs h-full shadow-xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
                        <button
                            onClick={toggleMenu}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-8 mt-4 flex justify-center border-b pb-6">
                            <img
                                src="https://tamyyvryopjvppkjauqa.supabase.co/storage/v1/object/public/products/logoinicio.png"
                                alt="Gaustina"
                                className="h-12 w-auto object-contain"
                            />
                        </div>

                        <ul className="flex flex-col space-y-6 text-lg font-heading text-gray-700 items-center">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <NavLink
                                        to={link.path}
                                        onClick={toggleMenu}
                                        className={({ isActive }) =>
                                            isActive ? "text-black underline underline-offset-4" : "hover:text-black transition-colors"
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
