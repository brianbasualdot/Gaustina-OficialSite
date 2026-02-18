import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-yellow-100"
                    >
                        {/* Header (Soft Yellow Warning) */}
                        <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100 flex items-center gap-3">
                            <span className="text-2xl">⚠️</span>
                            <h3 className="text-lg font-bold text-yellow-800 font-heading tracking-wide">
                                {title || 'Advertencia'}
                            </h3>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <p className="text-gray-600 font-medium leading-relaxed">
                                {message || '¿Estás seguro de que deseas realizar esta acción?'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-sm shadow-sm transition-transform active:scale-95"
                            >
                                Confirmar Eliminación
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
