import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { User } from '../types/user';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Слушаем изменения авторизации в реальном времени
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Загружаем данные пользователя из Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Создаем документ пользователя в Firestore
    const newUser: User = {
      id: userCredential.user.uid,
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
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // Данные загрузятся автоматически через onAuthStateChanged
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    // Обновляем локально
    const updated = { ...user, ...updates };
    setUser(updated);
    
    // Сохраняем в Firestore
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, updates);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}