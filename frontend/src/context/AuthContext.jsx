import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser } from '../services/api';
import {
  MOCK_USERS,
  MOCK_STUDENT_PROFILE,
  MOCK_INDUSTRY_PROFILE,
  MOCK_FACULTY_PROFILE,
  MOCK_INSTITUTE_PROFILE
} from '../services/mockData';

const AuthContext = createContext(null);

const getFallbackRoleFromEmail = (email = '') => {
  const e = email.toLowerCase();
  if (e.includes('industry') || e.includes('dabur') || e.includes('recruiter') || e.includes('company')) {
    return 'industry';
  }
  if (e.includes('faculty') || e.includes('sharma') || e.includes('dr.') || e.includes('dr') || e.includes('prof')) {
    return 'faculty';
  }
  if (e.includes('institute') || e.includes('director') || e.includes('college') || e.includes('dean')) {
    return 'institute';
  }
  if (e.includes('admin') || e.includes('gov') || e.includes('ministry')) {
    return 'admin';
  }
  return 'student';
};

const getFallbackProfileForRole = (role) => {
  switch (role) {
    case 'industry':
      return MOCK_INDUSTRY_PROFILE;
    case 'faculty':
      return MOCK_FACULTY_PROFILE;
    case 'institute':
    case 'admin':
      return MOCK_INSTITUTE_PROFILE;
    case 'student':
    default:
      return MOCK_STUDENT_PROFILE;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skillbridge_demo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('skillbridge_demo_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getMe()
        .then((res) => {
          const payload = res.data?.data || res.data;
          if (payload && payload.user) {
            setUser(payload.user);
            setProfile(payload.profile);
            localStorage.setItem('skillbridge_demo_user', JSON.stringify(payload.user));
            if (payload.profile) {
              localStorage.setItem('skillbridge_demo_profile', JSON.stringify(payload.profile));
            }
          }
        })
        .catch(() => {
          // If offline / demo session, check stored demo user
          const savedDemoUser = localStorage.getItem('skillbridge_demo_user');
          const savedDemoProfile = localStorage.getItem('skillbridge_demo_profile');
          if (savedDemoUser) {
            setUser(JSON.parse(savedDemoUser));
            if (savedDemoProfile) setProfile(JSON.parse(savedDemoProfile));
          } else {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setProfile(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);
      const payload = res.data?.data || res.data;
      if (!payload || !payload.token) {
        throw new Error('No token returned from server');
      }

      const newToken = payload.token;
      const loggedUser = payload.user;

      localStorage.setItem('token', newToken);
      localStorage.setItem('skillbridge_demo_user', JSON.stringify(loggedUser));
      setToken(newToken);
      setUser(loggedUser);

      try {
        const meRes = await getMe();
        const mePayload = meRes.data?.data || meRes.data;
        if (mePayload?.profile) {
          setProfile(mePayload.profile);
          localStorage.setItem('skillbridge_demo_profile', JSON.stringify(mePayload.profile));
        }
      } catch (e) {
        // Non-blocking
      }

      return { user: loggedUser, token: newToken };
    } catch (err) {
      // Offline / Demo Session Fallback (e.g. Vercel deployment when backend is offline)
      console.warn('Backend unavailable, initiating Demo Session:', err);

      const detectedRole = getFallbackRoleFromEmail(credentials.email);
      const baseUser = MOCK_USERS[detectedRole] || MOCK_USERS.student;
      const demoUser = {
        ...baseUser,
        email: credentials.email || baseUser.email,
        name: credentials.email ? credentials.email.split('@')[0] : baseUser.name
      };

      const demoProfile = getFallbackProfileForRole(detectedRole);
      const demoToken = 'demo-session-token-' + Date.now();

      localStorage.setItem('token', demoToken);
      localStorage.setItem('skillbridge_demo_user', JSON.stringify(demoUser));
      localStorage.setItem('skillbridge_demo_profile', JSON.stringify(demoProfile));

      setToken(demoToken);
      setUser(demoUser);
      setProfile(demoProfile);

      return { user: demoUser, token: demoToken };
    }
  };

  const register = async (data) => {
    try {
      const res = await registerUser(data);
      const payload = res.data?.data || res.data;
      if (!payload || !payload.token) {
        throw new Error('Registration failed on server');
      }

      const newToken = payload.token;
      const registeredUser = payload.user;

      localStorage.setItem('token', newToken);
      localStorage.setItem('skillbridge_demo_user', JSON.stringify(registeredUser));
      setToken(newToken);
      setUser(registeredUser);

      try {
        const meRes = await getMe();
        const mePayload = meRes.data?.data || meRes.data;
        if (mePayload?.profile) {
          setProfile(mePayload.profile);
          localStorage.setItem('skillbridge_demo_profile', JSON.stringify(mePayload.profile));
        }
      } catch (e) {
        // Non-blocking
      }

      return { user: registeredUser, token: newToken };
    } catch (err) {
      // Offline registration fallback
      console.warn('Backend unavailable during registration, creating demo session:', err);

      const regRole = data.role || 'student';
      const demoUser = {
        _id: 'reg-demo-' + Date.now(),
        email: data.email,
        name: data.profileData?.fullName || data.profileData?.companyName || data.profileData?.instituteName || data.email.split('@')[0],
        role: regRole,
        isVerified: true
      };

      const baseProfile = getFallbackProfileForRole(regRole);
      const demoProfile = {
        ...baseProfile,
        user: demoUser._id,
        ...(data.profileData || {})
      };

      const demoToken = 'demo-session-token-' + Date.now();
      localStorage.setItem('token', demoToken);
      localStorage.setItem('skillbridge_demo_user', JSON.stringify(demoUser));
      localStorage.setItem('skillbridge_demo_profile', JSON.stringify(demoProfile));

      setToken(demoToken);
      setUser(demoUser);
      setProfile(demoProfile);

      return { user: demoUser, token: demoToken };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('skillbridge_demo_user');
    localStorage.removeItem('skillbridge_demo_profile');
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
