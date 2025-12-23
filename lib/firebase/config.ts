// Configuração do Firebase para o Geração Emprego
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD-FKggoc4mJmWxgDVlhRrmyYcglWv_ri8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "geracao-emprego-ro.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "geracao-emprego-ro",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "geracao-emprego-ro.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "717234115924",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:717234115924:web:f398ce1262535145d364c1",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-4T47NLW2V2"
};

// Inicializar Firebase (evitar múltiplas inicializações)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializar Auth
const auth = getAuth(app);

// Configurar idioma para português do Brasil
auth.languageCode = 'pt-BR';

// Inicializar Analytics (apenas no cliente)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics };
export default app;
