import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('papercup_admin');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const cleanUser = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if ((cleanUser === 'gugan@gmail.com' || cleanUser === 'gugan') && cleanPass === 'gugan@123') {
      const adminUser = {
        id: 'admin-1',
        name: 'Gugan',
        username: 'gugan@gmail.com',
        email: 'gugan@gmail.com',
        role: 'admin'
      };
      localStorage.setItem('papercup_admin', JSON.stringify(adminUser));
      setUser(adminUser);
      return adminUser;
    }

    throw new Error('Invalid username or password');
  };

  const logout = () => {
    localStorage.removeItem('papercup_admin');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
