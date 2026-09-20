import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getMe()
        .then((res) => {
          const payload = res.data?.data || res.data;
          setUser(payload.user);
          setProfile(payload.profile);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setProfile(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const payload = res.data?.data || res.data;
    const newToken = payload.token;
    const loggedUser = payload.user;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(loggedUser);

    // Fetch full profile
    try {
      const meRes = await getMe();
      const mePayload = meRes.data?.data || meRes.data;
      setProfile(mePayload.profile);
    } catch (e) {
      // Non-blocking
    }

    return { user: loggedUser, token: newToken };
  };

  const register = async (data) => {
    const res = await registerUser(data);
    const payload = res.data?.data || res.data;
    const newToken = payload.token;
    const registeredUser = payload.user;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(registeredUser);

    try {
      const meRes = await getMe();
      const mePayload = meRes.data?.data || meRes.data;
      setProfile(mePayload.profile);
    } catch (e) {
      // Non-blocking
    }

    return { user: registeredUser, token: newToken };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const userRole = (user?.role || '').toLowerCase();
  const value = {
    user,
    profile,
    token,
    loading,
    login,
    register,
    logout,
    isStudent: userRole === 'student',
    isFaculty: userRole === 'faculty',
    isIndustry: userRole === 'industry',
    isInstitute: userRole === 'institute',
    isAdmin: userRole === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
