import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 🔥 FIREBASE AYARLARI:
// Firebase Console (console.firebase.google.com) üzerinden "Web App" ekleyip
// sana verilen firebaseConfig bilgilerini aşağıdaki alanlara yapıştır:
export const firebaseConfig = {
  apiKey: 'AIzaSyC78IOFnvgQAy-WZLizI_IGrmdXaAp-nys',
  authDomain: 'timecapsule-a11ba.firebaseapp.com',
  projectId: 'timecapsule-a11ba',
  storageBucket: 'timecapsule-a11ba.firebasestorage.app',
  messagingSenderId: '663309062749',
  appId: '1:663309062749:web:dd084889bb75d5c72af3b4',
  measurementId: 'G-BZHB9DXSVF',
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
