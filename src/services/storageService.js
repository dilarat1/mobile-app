import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialCapsules } from '../data/mockCapsules';

const CAPSULES_STORAGE_KEY = '@timecapsule_real_v2';
const USER_PROFILE_KEY = '@timecapsule_user_v1';

export const storageService = {
  // Kullanıcı profilini yükle
  async loadUserProfile() {
    try {
      const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('User profile read error:', e);
      return null;
    }
  },

  // Kullanıcı profilini kaydet
  async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('User profile save error:', e);
    }
  },

  // Kapsülleri yükle (İlk açılışta boş liste döner)
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
