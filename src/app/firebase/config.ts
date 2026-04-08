// 1. Все импорты в одном месте
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 2. Ваша конфигурация (проверьте, что данные верны)
const firebaseConfig = {
  apiKey: "AIzaSyCTnxM5evTA5iCFbRuLLE8jTz7HyIu-gUQ",
  authDomain: "insurance-quest-7c08b.firebaseapp.com",
  projectId: "insurance-quest-7c08b",
  storageBucket: "insurance-quest-7c08b.firebasestorage.app",
  messagingSenderId: "473515084876",
  appId: "1:473515084876:web:5d485463ae353fe79478e9"
};

// 3. Инициализация Firebase (ТОЛЬКО ОДИН РАЗ)
const app = initializeApp(firebaseConfig);

// 4. Экспорт сервисов для использования в других компонентах
export const auth = getAuth(app);
export const db = getFirestore(app);