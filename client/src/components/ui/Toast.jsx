import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60]">
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`
              flex items-center gap-3 px-6 py-3 rounded-full shadow-lg border backdrop-blur-md
              ${type === 'success'
                                ? 'bg-zinc-900/90 border-zinc-700 text-white'  // Softened Black
                                : 'bg-red-50 border-red-100 text-red-800'
                            }
            `}
                    >
                        {type === 'success' ? (
                            <CheckCircle size={18} className="text-green-400" />
                        ) : (
                            <XCircle size={18} className="text-red-500" />
                        )}

                        <span className="text-sm font-medium tracking-wide">
                            {message}
                        </span>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
