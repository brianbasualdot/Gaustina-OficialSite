import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../utils/supabase'; // <--- OJO: Ruta correcta a utils

const ProtectedRoute = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verifica la sesión al cargar
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Escucha cambios (ej: si cierra sesión en otra pestaña)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

    // Si hay sesión, muestra el contenido (Outlet). Si no, manda al Login.
    return session ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;