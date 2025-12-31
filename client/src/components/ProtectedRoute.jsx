import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Verificamos si existe la "llave" en el navegador
    const isAuthenticated = localStorage.getItem('admin_token') === 'true';

    if (!isAuthenticated) {
        // Si no tiene llave, lo mandamos al Login
        return <Navigate to="/login" replace />;
    }

    // Si tiene llave, lo dejamos pasar (renderizamos el hijo, o sea, el Admin)
    return children;
};

export default ProtectedRoute;