import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
    localStorage.setItem("loginStatus", true)
    const loggedIn = localStorage.getItem("loginStatus") === "true";
    const defaultNavigatePage = "/login";
    return loggedIn ? <Outlet /> : <Navigate to={defaultNavigatePage} />;
};

export default PrivateRoutes;
