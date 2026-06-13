import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('astronet_token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('astronet_token');
      localStorage.removeItem('astronet_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token, user } = res.data;
      localStorage.setItem('astronet_token', token);
      localStorage.setItem('astronet_user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('astronet_token');
    localStorage.removeItem('astronet_user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const isAdmin = user?.role === 'admin';
  const isController = user?.role === 'controller' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, isAdmin, isController, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
