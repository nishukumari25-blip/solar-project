import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { INITIAL_USERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('solaris_active_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default: Ashok Bhardwaj (Owner / Admin)
  });

  const [activeRole, setActiveRole] = useState(() => {
    return currentUser?.roles?.[0] || 'Owner / Admin';
  });

  const [allUsers, setAllUsers] = useState(INITIAL_USERS);
  const [loading, setLoading] = useState(false);

  // Sync active user to localStorage
  useEffect(() => {
    localStorage.setItem('solaris_active_user', JSON.stringify(currentUser));
    if (currentUser?.roles && !currentUser.roles.includes(activeRole)) {
      setActiveRole(currentUser.roles[0]);
    }
  }, [currentUser]);

  // Initial attempt to fetch users and verify token on backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const usersRes = await api.auth.getUsers();
        if (usersRes.success && usersRes.data.length > 0) {
          setAllUsers(usersRes.data);
        }
      } catch (err) {
        console.log('[AuthContext] Backend offline or starting, using default user roster.');
      }
    };
    initAuth();
  }, []);

  // Real backend login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      if (res.success) {
        localStorage.setItem('solaris_token', res.token);
        setCurrentUser(res.user);
        setActiveRole(res.user.roles[0]);
        return res.user;
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Switch demo persona
  const switchUser = async (userId) => {
    const user = allUsers.find((u) => u.id === userId || u._id === userId);
    if (user) {
      setCurrentUser(user);
      setActiveRole(user.roles[0]);
      try {
        const res = await api.auth.login({ email: user.email, password: 'password123' });
        if (res.token) {
          localStorage.setItem('solaris_token', res.token);
        }
      } catch (err) {
        console.log('[AuthContext] Persona switched locally.');
      }
    }
  };

  // Switch active role (for multi-role users)
  const switchRole = (role) => {
    if (currentUser?.roles?.includes(role) || currentUser?.roles?.includes('Owner / Admin')) {
      setActiveRole(role);
    }
  };

  const logout = () => {
    localStorage.removeItem('solaris_token');
    localStorage.removeItem('solaris_active_user');
    setCurrentUser(INITIAL_USERS[0]);
    setActiveRole('Owner / Admin');
  };

  const hasRole = (roleName) => {
    return currentUser?.roles?.includes(roleName) || currentUser?.roles?.includes('Owner / Admin');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        allUsers,
        loading,
        login,
        logout,
        switchUser,
        switchRole,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
