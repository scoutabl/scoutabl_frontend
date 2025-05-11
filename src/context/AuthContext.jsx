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
        // Check for tokens in storage on mount
        const storedAccessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
        const storedRefreshToken = sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');
        const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');

        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setUser(storedUser ? JSON.parse(storedUser) : null);
        }

        setLoading(false);
    }, []);

    const storeAuthData = (data, userData, rememberMe = false) => {
        const storage = rememberMe ? localStorage : sessionStorage;

        // Clear both storages first to prevent conflicts
        [localStorage, sessionStorage].forEach(s => {
            s.removeItem('accessToken');
            s.removeItem('refreshToken');
            s.removeItem('user');
        });

        // Store in selected storage
        storage.setItem('accessToken', data.access);
        storage.setItem('refreshToken', data.refresh);
        storage.setItem('user', JSON.stringify(userData));
    };

    const login = async (email, password, rememberMe = false) => {
        try {
            console.log('Attempting login with:', { email, password }); // Debug log

            const response = await fetch('https://dev.scoutabl.com/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: 'include'
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Login error response:', errorData);
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();
            console.log('Login success data:', data);

            // Set tokens in state
            setAccessToken(data.access);
            setRefreshToken(data.refresh);

            // Fetch user data
            const userData = await fetchUserData(data.access);

            // Store auth data in selected storage
            storeAuthData(data, userData, rememberMe);

            navigate('/dashboard');
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
            return userData;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        // Clear both storages on logout
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem('accessToken');
            storage.removeItem('refreshToken');
            storage.removeItem('user');
        });
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
            // localStorage.setItem('accessToken', data.access);
            const currentStorage = sessionStorage.getItem('refreshToken') ? sessionStorage : localStorage;
            currentStorage.setItem('accessToken', data.access);
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