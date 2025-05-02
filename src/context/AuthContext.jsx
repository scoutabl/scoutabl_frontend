import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for tokens in localStorage on mount
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setUser(storedUser ? JSON.parse(storedUser) : null);
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login with:', { email, password }); // Debug log

            const response = await fetch('https://dev.scoutabl.com/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: 'include' // Include cookies if your backend uses them
            });

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Login error response:', errorData); // Debug log
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();
            console.log('Login success data:', data); // Debug log

            // Store tokens and user data
            setAccessToken(data.access);
            setRefreshToken(data.refresh);
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            // Fetch user data with the new access token
            await fetchUserData(data.access);

            navigate('/dashboard'); // Redirect to dashboard after login
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('https://dev.scoutabl.com/api/users/me/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const refreshAccessToken = async () => {
        try {
            const response = await fetch('https://dev.scoutabl.com/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            setAccessToken(data.access);
            localStorage.setItem('accessToken', data.access);
            return data.access;
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
            return null;
        }
    };

    // Create an axios instance with interceptors for automatic token refresh
    const authFetch = async (url, options = {}) => {
        try {
            // Add access token to request header
            const requestOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            let response = await fetch(url, requestOptions);

            // If token is expired, try to refresh it
            if (response.status === 401 && refreshToken) {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // Retry the original request with new token
                    requestOptions.headers.Authorization = `Bearer ${newAccessToken}`;
                    response = await fetch(url, requestOptions);
                }
            }

            return response;
        } catch (error) {
            console.error('Request error:', error);
            throw error;
        }
    };

    const value = {
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        authFetch,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 