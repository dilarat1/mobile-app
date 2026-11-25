import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import { mockCapsules } from './src/data/mockCapsules';
import { storageService } from './src/services/storageService';
import FeedScreen from './src/screens/FeedScreen';
import CreateScreen from './src/screens/CreateScreen';
import InboxScreen from './src/screens/InboxScreen';
import CapsuleDetailModal from './src/screens/CapsuleDetailModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed', 'create', 'inbox'
  const [capsulesList, setCapsulesList] = useState(mockCapsules);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCapsule, setSelectedCapsule] = useState(null);

  // Uygulama açılışında AsyncStorage'dan kayıtlı verileri yükle
  useEffect(() => {
    async function initStorage() {
      try {
        const stored = await storageService.loadCapsules();
        if (stored && stored.length > 0) {
          setCapsulesList(stored);
        }
      } catch (err) {
        console.warn('Storage init failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initStorage();
  }, []);

  // Yeni kapsül eklendiğinde
  const handleCapsuleCreated = async (newCapsule) => {
    const updated = [newCapsule, ...capsulesList];
    setCapsulesList(updated);
    await storageService.saveCapsules(updated);
    setCurrentTab('feed');
  };

  // Kapsül mührü açıldığında
  const handleUnlockCapsule = async (capsuleId) => {
    const updated = capsulesList.map((c) => {
      if (c.id === capsuleId) {
        return { ...c, isUnlocked: true };
      }
      return c;
    });
    setCapsulesList(updated);
    if (selectedCapsule && selectedCapsule.id === capsuleId) {
      setSelectedCapsule({ ...selectedCapsule, isUnlocked: true });
    }
    await storageService.saveCapsules(updated);
  };

  // Kapsüle anı eklendiğinde
  const handleAddMemory = async (capsuleId, newMemory) => {
    const updated = capsulesList.map((c) => {
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
    setCapsulesList(updated);
    if (selectedCapsule && selectedCapsule.id === capsuleId) {
      const memories = selectedCapsule.memories ? [...selectedCapsule.memories, newMemory] : [newMemory];
      setSelectedCapsule({
        ...selectedCapsule,
        memoryCount: memories.length,
        memories: memories,
      });
    }
    await storageService.saveCapsules(updated);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.burgundy} />
        <Text style={styles.loadingText}>✨ TimeCapsule Yükleniyor... ✨</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Ana Ekran Alanı */}
      <View style={styles.contentArea}>
        {/* 1. SEKME: AKIŞ */}
        {currentTab === 'feed' && (
          <FeedScreen
            capsules={capsulesList}
            onNavigateToCreate={() => setCurrentTab('create')}
            onSelectCapsule={(cap) => setSelectedCapsule(cap)}
          />
        )}
        
        {/* 2. SEKME: OLUŞTUR */}
        {currentTab === 'create' && (
          <CreateScreen onCapsuleCreated={handleCapsuleCreated} />
        )}

        {/* 3. SEKME: ÖZELİM & GRUP KUTUSU */}
        {currentTab === 'inbox' && (
          <InboxScreen
            capsules={capsulesList}
            onSelectCapsule={(cap) => setSelectedCapsule(cap)}
          />
        )}
      </View>

      {/* DETAY VE SCRAPBOOK AÇILIŞ MODALI */}
      {selectedCapsule && (
        <CapsuleDetailModal
          visible={!!selectedCapsule}
          capsule={selectedCapsule}
          onClose={() => setSelectedCapsule(null)}
          onUnlock={handleUnlockCapsule}
          onAddMemory={handleAddMemory}
        />
      )}

      {/* Scrapbook Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Üst İnce Dantel Kenar Süsü */}
        <View style={styles.navLace}>
          {Array.from({ length: 24 }).map((_, i) => (
            <View key={`b-lace-${i}`} style={styles.laceDot} />
          ))}
        </View>

        <View style={styles.tabsRow}>
          {/* 1. SEKME: AKIŞ */}
          <TouchableOpacity
            style={[styles.tabButton, currentTab === 'feed' && styles.tabButtonActive]}
            onPress={() => setCurrentTab('feed')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>📜</Text>
            <Text style={[styles.tabLabel, currentTab === 'feed' && styles.tabLabelActive]}>
              Akış
            </Text>
            {currentTab === 'feed' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          {/* 2. SEKME: OLUŞTUR (Vurgulu Buton) */}
          <TouchableOpacity
            style={styles.createButtonWrapper}
            onPress={() => setCurrentTab('create')}
            activeOpacity={0.8}
          >
            <View style={styles.createButton}>
              <Text style={styles.createButtonIcon}>＋</Text>
            </View>
            <Text style={[styles.tabLabel, currentTab === 'create' && styles.tabLabelActive]}>
              Kapsül Yap
            </Text>
          </TouchableOpacity>

          {/* 3. SEKME: ÖZELİM & GRUP KUTUSU */}
          <TouchableOpacity
            style={[styles.tabButton, currentTab === 'inbox' && styles.tabButtonActive]}
            onPress={() => setCurrentTab('inbox')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>💌</Text>
            <Text style={[styles.tabLabel, currentTab === 'inbox' && styles.tabLabelActive]}>
              Özelim
            </Text>
            {currentTab === 'inbox' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.burgundyDark,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  contentArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.burgundyDark,
  },
  bottomNav: {
    backgroundColor: colors.parchment,
    borderTopWidth: 2,
    borderTopColor: colors.cardBorder,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navLace: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
  },
  laceDot: {
    width: 6,
    height: 4,
    backgroundColor: colors.cardBorder,
    borderRadius: 3,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.burgundy,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.burgundy,
    marginTop: 3,
  },
  createButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: -16,
  },
  createButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.burgundy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.parchment,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 2,
  },
  createButtonIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: -2,
  },
});
