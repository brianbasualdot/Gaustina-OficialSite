// client/src/hooks/useCart.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios'; // Asumiendo axios configurado
// import toast from 'react-hot-toast'; // Asumiendo librería de toasts

const fetchCart = async () => {
    // const { data } = await axios.get('/api/cart');
    // return data;
    return []; // Mock inicial
};

const addToCartApi = async (item) => {
    // await axios.post('/api/cart', item);
};

const removeFromCartApi = async (itemId) => {
    // await axios.delete(`/api/cart/${itemId}`);
};

/**
 * Custom Hook for Cart Management with Optimistic UI.
 * Provides instant feedback to the user while syncing with the server in the background.
 */
export const useCart = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Cart Data
    const { data: cart = [], isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCart,
    });

    // 2. Add Item Mutation (Optimistic)
    const addToCartMutation = useMutation({
        mutationFn: addToCartApi,
        // onMutate: Se ejecuta ANTES de la petición al server
        onMutate: async (newItem) => {
            // Cancelar refetches salientes para que no sobrescriban nuestro update optimista
            await queryClient.cancelQueries({ queryKey: ['cart'] });

            // Guardar snapshot del estado anterior (para rollback si falla)
            const previousCart = queryClient.getQueryData(['cart']);

            // Actualizar el cache OPTIMISTAMENTE
            queryClient.setQueryData(['cart'], (old) => {
                // Lógica simple: si existe, incrementar cantidad, sino agregar.
                const exists = old.find(i => i.id === newItem.id);
                if (exists) {
                    return old.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
                }
                return [...old, { ...newItem, quantity: 1 }];
            });

            // Retornar contexto para onError
            return { previousCart };
        },
        onError: (err, newItem, context) => {
            // Si falla, hacemos Rollback usando el snapshot
            queryClient.setQueryData(['cart'], context.previousCart);
            // toast.error("Error adding item to cart");
            console.error("Optimistic update failed", err);
        },
        onSettled: () => {
            // Siempre invalidar para asegurar consistencia final con el server
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    // 3. Remove Item Mutation (Optimistic)
    const removeFromCartMutation = useMutation({
        mutationFn: removeFromCartApi,
        onMutate: async (itemId) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const previousCart = queryClient.getQueryData(['cart']);

            queryClient.setQueryData(['cart'], (old) => old.filter(i => i.id !== itemId));

            return { previousCart };
        },
        onError: (err, itemId, context) => {
            queryClient.setQueryData(['cart'], context.previousCart);
            // toast.error("Error removing item");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    return {
        cart,
        isLoading,
        addToCart: addToCartMutation.mutate,
        removeFromCart: removeFromCartMutation.mutate,
    };
};
