import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    
    let role = null;
    try {
        role = JSON.parse(localStorage.getItem("role"));
    } catch {
        role = localStorage.getItem("role");
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/cat" replace />; 
    }
    
    return children;
}

export default ProtectedRoutes;