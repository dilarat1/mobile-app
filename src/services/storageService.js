import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockCapsules } from '../data/mockCapsules';

const CAPSULES_STORAGE_KEY = '@timecapsule_data_v1';

export const storageService = {
  // Kapsülleri yükle (Eğer ilk açılışsa mock veriyi kaydet ve getir)
  async loadCapsules() {
    try {
      const stored = await AsyncStorage.getItem(CAPSULES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // İlk açılışta mockCapsules'u kaydet
      await AsyncStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify(mockCapsules));
      return mockCapsules;
    } catch (e) {
      console.warn('Storage read error, using fallback:', e);
      return mockCapsules;
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

  // Yeni kapsül ekle
  async addCapsule(newCapsule) {
    try {
      const existing = await this.loadCapsules();
      const updated = [newCapsule, ...existing];
      await this.saveCapsules(updated);
      return updated;
    } catch (e) {
      console.warn('Add capsule error:', e);
      return null;
    }
  },

  // Kapsül kilidini aç
  async unlockCapsule(capsuleId) {
    try {
      const existing = await this.loadCapsules();
      const updated = existing.map((c) => {
        if (c.id === capsuleId) {
          return { ...c, isUnlocked: true };
        }
        return c;
      });
      await this.saveCapsules(updated);
      return updated;
    } catch (e) {
      console.warn('Unlock capsule error:', e);
      return null;
    }
  },

  // Kapsüle anı ekle (Grup katkısı)
  async addMemoryToCapsule(capsuleId, newMemory) {
    try {
      const existing = await this.loadCapsules();
      const updated = existing.map((c) => {
        if (c.id === capsuleId) {
          const memories = c.memories ? [...c.memories, newMemory] : [newMemory];
          return {
            ...c,
            memoryCount: memories.length,
            memories: memories,
          };
        }
        return c;
      });
      await this.saveCapsules(updated);
      return updated;
    } catch (e) {
      console.warn('Add memory error:', e);
      return null;
    }
  },
};
