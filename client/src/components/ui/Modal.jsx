import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, HelpCircle, CheckCircle } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    type = 'alert', // 'alert' or 'confirm'
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    variant = 'info' // 'info', 'warning', 'danger', 'success'
}) => {
    const icons = {
        info: <HelpCircle className="text-blue-500" size={32} />,
        warning: <AlertCircle className="text-amber-500" size={32} />,
        danger: <AlertCircle className="text-red-500" size={32} />,
        success: <CheckCircle className="text-green-500" size={32} />
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={type === 'alert' ? onClose : undefined}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-white/90 backdrop-blur-xl w-full max-w-sm rounded-[28px] shadow-2xl overflow-hidden border border-white/20 p-8"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                                {icons[variant]}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">
                                {title}
                            </h3>

                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {message}
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                                {type === 'confirm' ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                onConfirm();
                                                onClose();
                                            }}
                                            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' :
                                                    variant === 'success' ? 'bg-green-500 hover:bg-green-600 shadow-green-200' :
                                                        'bg-black hover:bg-gray-800'
                                                }`}
                                        >
                                            {confirmText}
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="w-full py-3.5 px-6 rounded-2xl font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all font-medium"
                                        >
                                            {cancelText}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="w-full py-3.5 px-6 rounded-2xl font-bold bg-black text-white hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                                    >
                                        {confirmText}
                                    </button>
                                )}
                            </div>
                        </div>

                        {type === 'alert' && (
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
