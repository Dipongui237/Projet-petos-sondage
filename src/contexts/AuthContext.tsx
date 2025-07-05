import React, { useEffect, useState, createContext, useContext } from 'react';
type User = {
  id: string;
  name: string;
  phone: string;
  isAdmin: boolean;
};
type AuthContextType = {
  currentUser: User | null;
  login: (name: string, phone: string) => void;
  adminLogin: (name: string, phone: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Sample admin list
const ADMINS = [{
  name: 'Admin Un',
  phone: '0600000001'
}, {
  name: 'Admin Deux',
  phone: '0600000002'
}];
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem('surveyUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);
  const login = (name: string, phone: string) => {
    const isAdmin = ADMINS.some(admin => admin.name.toLowerCase() === name.toLowerCase() && admin.phone === phone);
    const user = {
      id: Date.now().toString(),
      name,
      phone,
      isAdmin
    };
    setCurrentUser(user);
    localStorage.setItem('surveyUser', JSON.stringify(user));
  };
  const adminLogin = (name: string, phone: string) => {
    const isAdmin = ADMINS.some(admin => admin.name.toLowerCase() === name.toLowerCase() && admin.phone === phone);
    if (isAdmin) {
      login(name, phone);
      return true;
    }
    return false;
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('surveyUser');
  };
  const value = {
    currentUser,
    login,
    adminLogin,
    logout,
    isAuthenticated: currentUser !== null,
    isAdmin: currentUser?.isAdmin || false
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}                                                                                                                                                                                                     