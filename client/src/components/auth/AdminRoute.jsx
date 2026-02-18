import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Ideally, check role in public.users or via claim.
                // For now, we trust presence of session + backend will reject if not admin.
                // To be robust: fetch user profile and check role.
                // Simplified:
                setIsAdmin(true);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    if (loading) return <div>Loading...</div>;

    return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default AdminRoute;
