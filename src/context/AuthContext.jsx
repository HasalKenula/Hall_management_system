

import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    jwtToken: null,
    loading: true,
    login: () => { },
    logout: () => { }
});

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [jwtToken, setJwtToken] = useState(null);
    const [loading, setLoading] = useState(true);
   
    function login(responseData) {
        // Extract token from response object
        const token = responseData.token || responseData;
        
        console.log("Extracted token:", token);
        
        setIsAuthenticated(true);
        setJwtToken(token);
        localStorage.setItem("token", token);
    }

    function logout() {
        setIsAuthenticated(false);
        setJwtToken(null);
        localStorage.removeItem("token");
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
       
        if (token) {
            setIsAuthenticated(true);
            setJwtToken(token);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, jwtToken, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}