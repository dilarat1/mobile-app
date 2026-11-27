import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialCapsules } from '../data/mockCapsules';

const CAPSULES_STORAGE_KEY = '@timecapsule_real_v2';
const USER_PROFILE_KEY = '@timecapsule_active_user_v2';
const REGISTERED_USERS_KEY = '@timecapsule_users_db_v1';

export const storageService = {
  // Kayıtlı tüm kullanıcıları getir
  async getRegisteredUsers() {
    try {
      const data = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Users DB read error:', e);
      return [];
    }
  },

  // Yeni kullanıcı kaydı (E-posta veya Telefon + Şifre)
  async registerUser({ fullName, method, identifier, password }) {
    const users = await this.getRegisteredUsers();
    const normalizedId = identifier.trim().toLowerCase();

    const exists = users.find((u) => u.identifier.toLowerCase() === normalizedId);
    if (exists) {
      return { ok: false, error: 'Bu bilgiyle zaten bir hesap mevcut. Giriş yapmayı dene.' };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: fullName.trim(),
      method, // 'email' | 'phone' | 'google'
      identifier: normalizedId,
      password,
      avatar:
        'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(fullName.trim()) +
        '&background=731C28&color=FAF7F2',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newUser));
    return { ok: true, user: newUser };
  },

  // Giriş yap (Kayıtsız kullanıcı giremez)
  async loginUser({ identifier, password }) {
    const users = await this.getRegisteredUsers();
    const normalizedId = identifier.trim().toLowerCase();

    const found = users.find((u) => u.identifier.toLowerCase() === normalizedId);
    if (!found) {
      return {
        ok: false,
        error: 'Bu e-posta veya telefon ile kayıtlı hesap bulunamadı. Lütfen önce Kayıt Ol.',
      };
    }

    if (found.method === 'google') {
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

  // Google hesabı ile bağlan (Kayıtlıysa giriş yapar, değilse Google hesabıyla kaydedip giriş yapar)
  async loginWithGoogle({ email, fullName }) {
    const users = await this.getRegisteredUsers();
    const normalizedEmail = email.trim().toLowerCase();

    let user = users.find((u) => u.identifier.toLowerCase() === normalizedEmail);
    if (!user) {
      user = {
        id: `usr_g_${Date.now()}`,
        name: fullName.trim() || normalizedEmail.split('@')[0],
        method: 'google',
        identifier: normalizedEmail,
        password: null,
        avatar:
          'https://ui-avatars.com/api/?name=' +
          encodeURIComponent(fullName.trim() || normalizedEmail.split('@')[0]) +
          '&background=731C28&color=FAF7F2',
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...users, user]));
    }

    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
    return { ok: true, user };
  },

  // Şifre sıfırlama
  async resetPassword({ identifier, newPassword }) {
    const users = await this.getRegisteredUsers();
    const normalizedId = identifier.trim().toLowerCase();
    const index = users.findIndex((u) => u.identifier.toLowerCase() === normalizedId);

    if (index === -1) {
      return { ok: false, error: 'Bu bilgiyle kayıtlı bir kullanıcı bulunamadı.' };
    }

    if (users[index].method === 'google') {
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
      console.warn('User profile read error:', e);
      return null;
    }
  },

  // Çıkış yap
  async logoutUser() {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
    } catch (e) {
      console.warn('Logout error:', e);
    }
  },

  // Kapsülleri yükle
  async loadCapsules() {
    try {
      const stored = await AsyncStorage.getItem(CAPSULES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return initialCapsules;
    } catch (e) {
      console.warn('Storage read error:', e);
      return initialCapsules;
    }
  },

  // Kapsül listesini kaydet
  async saveCapsules(capsules) {
    try {
      await AsyncStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify(capsules));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },
};
