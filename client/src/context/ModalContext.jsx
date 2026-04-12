import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/ui/Modal';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'alert',
        variant: 'info',
        onConfirm: () => { },
        confirmText: 'Aceptar',
        cancelText: 'Cancelar'
    });

    const showModal = useCallback(({
        title,
        message,
        variant = 'info',
        confirmText = 'Aceptar'
    }) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type: 'alert',
            variant,
            confirmText,
            onConfirm: () => { }
        });
    }, []);

    const showConfirm = useCallback(({
        title,
        message,
        variant = 'warning',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        onConfirm
    }) => {
        return new Promise((resolve) => {
            setModalConfig({
                isOpen: true,
                title,
                message,
                type: 'confirm',
                variant,
                confirmText,
                cancelText,
                onConfirm: () => {
                    if (onConfirm) onConfirm();
                    resolve(true);
                },
                onClose: () => {
                    resolve(false);
                }
            });
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <ModalContext.Provider value={{ showModal, showConfirm, closeModal }}>
            {children}
            <Modal
                {...modalConfig}
                onClose={closeModal}
            />
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
