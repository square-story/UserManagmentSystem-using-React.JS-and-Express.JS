import { Navigate, Outlet, useLocation } from "react-router-dom";

export const AdminRoute = () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === 'true';
    const location = useLocation();

    if (!token) {
        // If no token, redirect to login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        // If user is logged in but not an admin, redirect to user dashboard or an error page
        return <Navigate to="/userdetails" replace />;
    }

    // If authenticated and isAdmin is true, render the admin content
    return <Outlet />;
};
