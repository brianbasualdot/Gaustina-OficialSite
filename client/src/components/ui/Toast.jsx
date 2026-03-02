import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const variants = {
        initial: { opacity: 0, y: -50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    const icon = type === 'success'
        ? <CheckCircle className="text-green-500 w-5 h-5" />
        : <XCircle className="text-red-500 w-5 h-5" />;

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
        >
            <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 flex items-center gap-4">
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </motion.div>
    );
};

export default Toast;
