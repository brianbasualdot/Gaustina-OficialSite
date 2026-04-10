import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const CHACHING_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

    const playSound = useCallback(() => {
        const audio = new Audio(CHACHING_SOUND);
        audio.play().catch(err => console.error("Error playing sound:", err));
    }, []);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('new-order', (order) => {
            console.log('New order received:', order);
            playSound();
            setNotifications((prev) => [order, ...prev]);
            
            // Trigger a browser notification if permitted
            if (Notification.permission === "granted") {
                new Notification("💰 Nueva Venta en Gaustina", {
                    body: `Cliente: ${order.customer}\nTotal: $${order.total}`,
                    icon: '/GaustinaLogo.webp'
                });
            }
        });

        return () => newSocket.close();
    }, [playSound]);

    const requestPermission = () => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    };

    return { notifications, requestPermission };
};
