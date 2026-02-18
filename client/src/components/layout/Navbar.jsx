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
        <nav className="bg-white py-6 border-b border-gray-100 sticky top-0 z-40">
            <div className="container mx-auto px-6 flex flex-col items-center">

                {/* --- ROW 1: Mobile Button | Logo | Cart --- */}
                <div className="w-full flex justify-between items-center mb-0 md:mb-6 relative">

                    {/* Mobile Menu Button (Left) */}
                    <div className="w-20 flex justify-start">
                        <button
                            className="md:hidden text-gray-900 hover:text-black focus:outline-none"
                            onClick={toggleMenu}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Logo (Center) */}
                    <Link to="/" className="text-4xl md:text-6xl font-script text-brand-primary tracking-wide text-center">
                        Gaustina
                    </Link>

                    {/* Cart Icon (Right) */}
                    <div className="w-20 flex justify-end">
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
                    </div>
                </div>

                {/* --- ROW 2: Desktop Navigation (Centered) --- */}
                <div className="hidden md:flex items-center space-x-12">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `font-heading text-sm uppercase tracking-widest hover:text-brand-accent transition-colors duration-300 ease-in-out border-b border-transparent pb-1 ${isActive ? "text-black border-black" : "text-brand-primary hover:border-brand-accent"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
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

                        <div className="mb-8 mt-4 text-center">
                            <span className="text-3xl font-script text-brand-primary">Gaustina</span>
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
