import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 🔥 FIREBASE AYARLARI:
// Firebase Console (console.firebase.google.com) üzerinden "Web App" ekleyip
// sana verilen firebaseConfig bilgilerini aşağıdaki alanlara yapıştır:
export const firebaseConfig = {
  apiKey: 'BURAYA_API_KEY_GELECEK',
  authDomain: 'BURAYA_AUTH_DOMAIN_GELECEK',
  projectId: 'BURAYA_PROJECT_ID_GELECEK',
  storageBucket: 'BURAYA_STORAGE_BUCKET_GELECEK',
  messagingSenderId: 'BURAYA_MESSAGING_SENDER_ID_GELECEK',
  appId: 'BURAYA_APP_ID_GELECEK',
};

// Firebase ayarlarının doldurulup doldurulmadığını kontrol eder
export const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith('BURAYA_');

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
