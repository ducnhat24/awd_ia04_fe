import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshApi } from '../api/authApi';
import { setAuthToken } from '../api/apiClient';
import { getMeApi } from '../api/userApi';
import { setUser as persistUser, clearUser as clearPersistedUser } from '../utils/authLocalStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleLogoutEvent = () => {
            console.log("AuthContext: Đã nhận sự kiện logout từ Axios, đang đăng xuất...");
            logout();
        };

        const handleTokenRefreshedEvent = (event) => {
            const newAccessToken = event.detail;
            console.log("AuthContext: Đã nhận sự kiện tokenRefreshed, đang cập nhật state...");
            setAccessToken(newAccessToken);
        };

        const attemptRefreshLogin = async () => {
            try {
                const data = await refreshApi();
                const newAccessToken = data.accessToken;
                setAccessToken(newAccessToken);
                setAuthToken(newAccessToken);
                try {
                    const me = await getMeApi();
                    setUser(me);
                    persistUser(me);
                } catch (err) {
                    console.log('Không thể lấy profile sau khi refresh', err.message);
                }

                console.log("AuthContext: Tự động đăng nhập thành công!");
            } catch (error) {
                console.log("AuthContext: Không thể tự động đăng nhập.", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        window.addEventListener('logout', handleLogoutEvent);
        window.addEventListener('tokenRefreshed', handleTokenRefreshedEvent);
        attemptRefreshLogin();

        return () => {
            window.removeEventListener('logout', handleLogoutEvent);
        };
    }, []);

    const login = (newAccessToken, newRefreshToken) => {
        setAccessToken(newAccessToken);
        setAuthToken(newAccessToken);

        localStorage.setItem('refreshToken', newRefreshToken);
        (async () => {
            try {
                const me = await getMeApi();
                setUser(me);
                persistUser(me);
            } catch (err) {
                console.log('Không thể lấy profile sau khi login', err.message);
            }
        })();

        console.log("AuthContext: Đã lưu tokens!");
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem('refreshToken');
        clearPersistedUser();
        console.log("AuthContext: Đã đăng xuất và xóa tokens!");
    };

    const authValue = {
        accessToken,
        user,
        isAuthenticated: !!accessToken,
        isLoading,
        login,
        logout,
    };

    if (isLoading) {
        return <div>Đang tải ứng dụng...</div>;
    }

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
