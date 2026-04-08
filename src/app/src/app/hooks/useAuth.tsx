import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types/user';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('insurance_quest_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const createUser = (email: string, displayName: string): User => ({
    id: Date.now().toString(),
    email,
    displayName,
    avatar: 'default',
    xp: 0,
    level: 1,
    coins: 100,
    achievements: [],
    inventory: [],
    equipped: { avatar: 'default', outfit: 'none', accessory: 'none' },
    progress: { completedCards: [], theoryScreenCompleted: false },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  });

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('insurance_quest_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) throw new Error('Неверный email или пароль');
    
    const userData: User = { ...foundUser, lastLogin: new Date().toISOString() };
    setUser(userData);
    localStorage.setItem('insurance_quest_user', JSON.stringify(userData));
  };

  const register = async (email: string, password: string, displayName: string) => {
    const users = JSON.parse(localStorage.getItem('insurance_quest_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = { ...createUser(email, displayName), password };
    users.push(newUser);
    
    localStorage.setItem('insurance_quest_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('insurance_quest_user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('insurance_quest_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('insurance_quest_user', JSON.stringify(updated));
    
    const users = JSON.parse(localStorage.getItem('insurance_quest_users') || '[]');
    const updatedUsers = users.map((u: any) => u.id === user.id ? { ...u, ...updates } : u);
    localStorage.setItem('insurance_quest_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ВОТ ЭТА ФУНКЦИЯ ДОЛЖНА БЫТЬ ЭКСПОРТИРОВАНА!
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}