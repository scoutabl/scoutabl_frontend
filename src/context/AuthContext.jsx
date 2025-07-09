import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_API_URL } from '@/lib/constants';
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Security constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutEnd, setLockoutEnd] = useState(null);

    const navigate = useNavigate();
    const tokenRefreshTimer = useRef(null);
    const idleTimer = useRef(null);
    const lastActivity = useRef(Date.now());

    // Security: Parse JWT token to get expiry time
    const parseJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
    };

    // Security: Check if token is about to expire
    const isTokenExpiringSoon = (token) => {
        const payload = parseJWT(token);
        if (!payload || !payload.exp) return true;

        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        return timeUntilExpiry < TOKEN_REFRESH_BUFFER;
    };

    // Security: Activity tracking for idle timeout
    const updateActivity = useCallback(() => {
        lastActivity.current = Date.now();

        // Reset idle timer
        if (idleTimer.current) {
            clearTimeout(idleTimer.current);
        }

        if (user && accessToken) {
            idleTimer.current = setTimeout(() => {
                logout();
            }, IDLE_TIMEOUT);
        }
    }, [user, accessToken]);

    // Security: Set up activity listeners
    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => updateActivity();

        events.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, [updateActivity]);

    // Security: Automatic token refresh
    const scheduleTokenRefresh = useCallback((token) => {
        if (tokenRefreshTimer.current) {
            clearTimeout(tokenRefreshTimer.current);
        }

        const payload = parseJWT(token);
        if (!payload || !payload.exp) return;

        const expiryTime = payload.exp * 1000;
        const currentTime = Date.now();
        const refreshTime = expiryTime - TOKEN_REFRESH_BUFFER;
        const timeUntilRefresh = refreshTime - currentTime;

        if (timeUntilRefresh > 0) {
            tokenRefreshTimer.current = setTimeout(async () => {
                await refreshAccessToken();
            }, timeUntilRefresh);
        }
    }, []);

    // Security: Rate limiting for login attempts
    const checkRateLimit = () => {
        if (isLocked) {
            const now = Date.now();
            if (now < lockoutEnd) {
                const remainingTime = Math.ceil((lockoutEnd - now) / 1000 / 60);
                throw new Error(`Too many login attempts. Try again in ${remainingTime} minutes.`);
            } else {
                // Lockout period ended
                setIsLocked(false);
                setLockoutEnd(null);
                setLoginAttempts(0);
            }
        }
    };

    const incrementLoginAttempts = () => {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            const lockEnd = Date.now() + LOCKOUT_DURATION;
            setIsLocked(true);
            setLockoutEnd(lockEnd);
            console.warn('🚫 Account locked due to too many failed login attempts');
        }
    };

    const resetLoginAttempts = () => {
        setLoginAttempts(0);
        setIsLocked(false);
        setLockoutEnd(null);
    };

    useEffect(() => {
        checkAuthStatus();

        // Cleanup timers on unmount
        return () => {
            if (tokenRefreshTimer.current) clearTimeout(tokenRefreshTimer.current);
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, []);

    // Security: Check authentication status on mount
    const checkAuthStatus = async () => {
        try {
            const storedAccessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
            const storedRefreshToken = sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');

            if (storedAccessToken && storedRefreshToken) {
                // Security: Check if token is expired or expiring soon
                if (isTokenExpiringSoon(storedAccessToken)) {
                    const newToken = await attemptTokenRefresh(storedRefreshToken);
                    if (newToken) {
                        const userData = await fetchUserData(newToken);
                        if (userData) {
                            setUser(userData);
                            scheduleTokenRefresh(newToken);
                            updateActivity();
                        } else {
                            clearAuthData();
                        }
                        return;
                    }
                } else {
                    const isValid = await verifyToken(storedAccessToken);
                    if (isValid) {
                        setAccessToken(storedAccessToken);
                        setRefreshToken(storedRefreshToken);
                        const userData = await fetchUserData(storedAccessToken);
                        if (userData) {
                            setUser(userData);
                            scheduleTokenRefresh(storedAccessToken);
                            updateActivity();
                        } else {
                            clearAuthData();
                        }
                        return;
                    }
                }
            }

            clearAuthData();
        } catch (error) {
            console.error('Auth status check failed:', error);
            clearAuthData();
        } finally {
            setLoading(false);
        }
    };

    const verifyToken = async (token) => {
        try {
            const response = await fetch(`${BASE_API_URL}/users/me/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.ok;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    };

    const attemptTokenRefresh = async (refreshToken) => {
        try {
            const response = await fetch(`${BASE_API_URL}/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                setAccessToken(data.access);
                const currentStorage = sessionStorage.getItem('refreshToken') ? sessionStorage : localStorage;
                currentStorage.setItem('accessToken', data.access);
                scheduleTokenRefresh(data.access);
                return data.access;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }
        return null;
    };

    const clearAuthData = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);

        // Clear timers
        if (tokenRefreshTimer.current) clearTimeout(tokenRefreshTimer.current);
        if (idleTimer.current) clearTimeout(idleTimer.current);

        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem('accessToken');
            storage.removeItem('refreshToken');
            storage.removeItem('user');
        });
    };

    const storeAuthData = (data, userData, rememberMe = false) => {
        const storage = rememberMe ? localStorage : sessionStorage;

        // Clear both storages first to prevent conflicts
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem('accessToken');
            storage.removeItem('refreshToken');
            storage.removeItem('user');
        });

        // Store in selected storage
        storage.setItem('accessToken', data.access);
        storage.setItem('refreshToken', data.refresh);
        storage.setItem('user', JSON.stringify(userData));
    };

    const fetchUserData = async (token) => {
        try {
            const response = await fetch(`${BASE_API_URL}/users/me/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error('📡 Failed to fetch user data, status:', response.status);
                const errorText = await response.text();
                console.error('📡 Error response:', errorText);
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();

            return userData;
        } catch (error) {
            console.error('📡 Error fetching user data:', error);
            return null;
        }
    };

    const login = async (email, password, rememberMe = false) => {
        try {
            // Security: Check rate limiting
            checkRateLimit();

            const response = await axios.post(
                `${BASE_API_URL}/login/`,
                {
                    email,
                    password
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    timeout: 10000 // 10 second timeout
                }
            );

            const data = response.data;
            // Set tokens in state
            setAccessToken(data.access);
            setRefreshToken(data.refresh);

            // Fetch user data
            const userData = await fetchUserData(data.access);

            if (!userData) {
                throw new Error('Failed to fetch user data after login');
            }

            // Set user in state
            setUser(userData);

            // Store in localStorage/sessionStorage
            storeAuthData(data, userData, rememberMe);

            // Security: Reset login attempts on successful login
            resetLoginAttempts();

            // Security: Schedule automatic token refresh
            scheduleTokenRefresh(data.access);

            // Security: Start activity tracking
            updateActivity();

            return userData;

        } catch (error) {
            console.error('🔐 Login error:', error);

            // Security: Increment failed login attempts
            incrementLoginAttempts();

            if (error.response) {
                console.error('Login error response:', error.response.data);
                throw new Error(error.response.data.detail || 'Login failed');
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Login request timed out. Please try again.');
            } else {
                console.error('Login error:', error);
                throw new Error('Network error or server is unreachable');
            }
        }
    };

    const logout = useCallback(() => {

        // Security: Clear all timers
        if (tokenRefreshTimer.current) clearTimeout(tokenRefreshTimer.current);
        if (idleTimer.current) clearTimeout(idleTimer.current);

        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);

        // Clear both storages on logout
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem('accessToken');
            storage.removeItem('refreshToken');
            storage.removeItem('user');
        });

        // Security: Reset login attempts on manual logout
        resetLoginAttempts();

        navigate('/login');
    }, [navigate]);

    const refreshAccessToken = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}/token/refresh/`, {
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
            const currentStorage = sessionStorage.getItem('refreshToken') ? sessionStorage : localStorage;
            currentStorage.setItem('accessToken', data.access);

            // Security: Schedule next refresh
            scheduleTokenRefresh(data.access);

            return data.access;
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
            return null;
        }
    };

    // Enhanced authFetch with better error handling and retry logic
    const authFetch = async (url, options = {}, retryCount = 0) => {
        try {
            const requestOptions = {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
                timeout: options.timeout || 10000 // Default 10s timeout
            };

            let response = await fetch(url, requestOptions);

            // If token is expired, try to refresh it
            if (response.status === 401 && refreshToken && retryCount < 2) {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // Retry the original request with new token
                    requestOptions.headers.Authorization = `Bearer ${newAccessToken}`;
                    return authFetch(url, options, retryCount + 1);
                }
            }

            // Security: Update activity on successful API calls
            if (response.ok) {
                updateActivity();
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
        loading,
        isAuthenticated: !!user && !!accessToken,
        // Security: Expose lockout info for UI
        isLocked,
        loginAttempts,
        maxLoginAttempts: MAX_LOGIN_ATTEMPTS
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};