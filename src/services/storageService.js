import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { initialCapsules } from '../data/mockCapsules';

const CAPSULES_STORAGE_KEY = '@timecapsule_real_v3';
const USER_PROFILE_KEY = '@timecapsule_active_user_v3';
const REGISTERED_USERS_KEY = '@timecapsule_users_db_v3';

// Telefon numarasını standartlaştır (örn: "0532 111 22 33" -> "5321112233")
export const normalizePhone = (phone) => {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('90') && digits.length === 12) {
    digits = digits.slice(2);
  }
  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }
  return digits;
};

export const storageService = {
  // Kayıtlı tüm kullanıcıları getir (Yerel fallback)
  async getRegisteredUsers() {
    try {
      const data = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // E-posta veya Telefon zaten kayıtlı mı kontrol et (Ayrı hesap açılmasını engeller!)
  async checkAccountExists({ email, phone }) {
    const normEmail = email.trim().toLowerCase();
    const normPhone = normalizePhone(phone);

    if (isFirebaseConfigured && db) {
      const usersRef = collection(db, 'users');
      const emailSnap = await getDocs(query(usersRef, where('email', '==', normEmail)));
      if (!emailSnap.empty) {
        return { exists: true, reason: 'Bu e-posta adresi zaten bir hesaba bağlı.' };
      }
      if (normPhone) {
        const phoneSnap = await getDocs(query(usersRef, where('phone', '==', normPhone)));
        if (!phoneSnap.empty) {
          return { exists: true, reason: 'Bu telefon numarası zaten bir hesaba bağlı.' };
        }
      }
      return { exists: false };
    }

    const users = await this.getRegisteredUsers();
    const emailMatch = users.find((u) => u.email === normEmail);
    if (emailMatch) {
      return { exists: true, reason: 'Bu e-posta adresi zaten bir hesaba bağlı.' };
    }
    if (normPhone) {
      const phoneMatch = users.find((u) => u.phone === normPhone);
      if (phoneMatch) {
        return { exists: true, reason: 'Bu telefon numarası zaten bir hesaba bağlı.' };
      }
    }
    return { exists: false };
  },

  // Birleşik Kayıt: E-posta + Telefon tek hesapta bağlanır
  async registerUser({ fullName, email, phone, password }) {
    const normEmail = email.trim().toLowerCase();
    const normPhone = normalizePhone(phone);

    const dup = await this.checkAccountExists({ email: normEmail, phone: normPhone });
    if (dup.exists) {
      return { ok: false, error: dup.reason };
    }

    const avatarUrl =
      'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(fullName.trim()) +
      '&background=731C28&color=FAF7F2';

    if (isFirebaseConfigured && auth && db) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, normEmail, password);
        const userObj = {
          id: cred.user.uid,
          name: fullName.trim(),
          email: normEmail,
          phone: normPhone,
          phoneDisplay: phone.trim(),
          method: 'unified',
          avatar: avatarUrl,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', cred.user.uid), userObj);
        await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userObj));
        return { ok: true, user: userObj };
      } catch (err) {
        return { ok: false, error: err.message || 'Firebase kayıt hatası.' };
      }
    }

    const users = await this.getRegisteredUsers();
    const newUser = {
      id: `usr_${Date.now()}`,
      name: fullName.trim(),
      email: normEmail,
      phone: normPhone,
      phoneDisplay: phone.trim(),
      method: 'unified',
      password,
      avatar: avatarUrl,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...users, newUser]));
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newUser));
    return { ok: true, user: newUser };
  },

  // Giriş yap: E-posta VEYA Telefon No ile aynı tek hesaba girer
  async loginUser({ identifier, password }) {
    const raw = identifier.trim();
    const isEmail = raw.includes('@');
    const normEmail = raw.toLowerCase();
    const normPhone = normalizePhone(raw);

    if (isFirebaseConfigured && auth && db) {
      try {
        let targetEmail = normEmail;
        if (!isEmail) {
          // Telefon numarasından bağlı e-postayı bul
          const usersRef = collection(db, 'users');
          const snap = await getDocs(query(usersRef, where('phone', '==', normPhone)));
          if (snap.empty) {
            return { ok: false, error: 'Bu telefon numarasıyla kayıtlı hesap bulunamadı.' };
          }
          targetEmail = snap.docs[0].data().email;
        }

        const cred = await signInWithEmailAndPassword(auth, targetEmail, password);
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        const userData = userDoc.exists()
          ? userDoc.data()
          : { id: cred.user.uid, name: targetEmail.split('@')[0], email: targetEmail };

        await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userData));
        return { ok: true, user: userData };
      } catch (err) {
        return { ok: false, error: 'E-posta/telefon veya şifre hatalı!' };
      }
    }

    const users = await this.getRegisteredUsers();
    const found = users.find((u) =>
      isEmail ? u.email === normEmail : u.phone === normPhone
    );

    if (!found) {
      return {
        ok: false,
        error: 'Bu e-posta veya telefon numarasıyla kayıtlı hesap bulunamadı. Lütfen önce Kayıt Ol.',
      };
    }

    if (found.method === 'google' && !found.password) {
      return {
        ok: false,
        error: 'Bu hesap Google ile oluşturulmuş. Lütfen "Google ile Bağlan" butonunu kullan.',
      };
    }

    if (found.password !== password) {
      return { ok: false, error: 'Şifre hatalı! Lütfen tekrar dene.' };
    }

    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(found));
    return { ok: true, user: found };
  },

  // Google hesabı ile bağlan
  async loginWithGoogle({ email, fullName }) {
    const normEmail = email.trim().toLowerCase();
    const displayName = fullName.trim() || normEmail.split('@')[0];
    const avatarUrl =
      'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(displayName) +
      '&background=731C28&color=FAF7F2';

    const users = await this.getRegisteredUsers();
    let user = users.find((u) => u.email === normEmail);
    if (!user) {
      user = {
        id: `usr_g_${Date.now()}`,
        name: displayName,
        email: normEmail,
        phone: '',
        method: 'google',
        password: null,
        avatar: avatarUrl,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...users, user]));
    }

    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
    return { ok: true, user };
  },

  // Şifre sıfırlama
  async resetPassword({ identifier, newPassword }) {
    const raw = identifier.trim();
    const isEmail = raw.includes('@');
    const normEmail = raw.toLowerCase();
    const normPhone = normalizePhone(raw);

    if (isFirebaseConfigured && auth && isEmail) {
      try {
        await sendPasswordResetEmail(auth, normEmail);
        return { ok: true, firebaseEmailSent: true };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    }

    const users = await this.getRegisteredUsers();
    const index = users.findIndex((u) =>
      isEmail ? u.email === normEmail : u.phone === normPhone
    );

    if (index === -1) {
      return { ok: false, error: 'Bu bilgiyle kayıtlı bir kullanıcı bulunamadı.' };
    }

    if (users[index].method === 'google' && !users[index].password) {
      return { ok: false, error: 'Google hesaplarının şifresi Google üzerinden yönetilir.' };
    }

    users[index].password = newPassword;
    await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    return { ok: true };
  },

  // Aktif oturumu yükle
  async loadUserProfile() {
    try {
      const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  // Çıkış yap
  async logoutUser() {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
    } catch (e) {
      console.warn('Logout error:', e);
    }
  },

  // Kapsülleri canlı dinle (Firebase varsa gerçek zamanlı, yoksa yerel)
  subscribeToCapsules(onUpdate) {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'capsules'), orderBy('createdAtMs', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => d.data());
        onUpdate(list);
      });
    }
    return () => {};
  },

  // Kapsülleri yükle (Yerel başlangıç)
  async loadCapsules() {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'capsules'), orderBy('createdAtMs', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map((d) => d.data());
      } catch (e) {
        console.warn('Firestore load error:', e);
      }
    }
    try {
      const stored = await AsyncStorage.getItem(CAPSULES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialCapsules;
    } catch (e) {
      return initialCapsules;
    }
  },

  // Yeni kapsül kaydet
  async addCapsule(newCapsule, currentList) {
    const capsuleWithTs = {
      ...newCapsule,
      createdAtMs: Date.now(),
    };
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'capsules', capsuleWithTs.id), capsuleWithTs);
    }
    const updated = [capsuleWithTs, ...(currentList || [])];
    await AsyncStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Kapsül güncelle (kilit açma / yeni anı ekleme)
  async updateCapsule(capsuleId, updates, currentList) {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'capsules', capsuleId), updates);
    }
    const updated = (currentList || []).map((c) =>
      c.id === capsuleId ? { ...c, ...updates } : c
    );
    await AsyncStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
