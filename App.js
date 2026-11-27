import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import { storageService } from './src/services/storageService';
import FeedScreen from './src/screens/FeedScreen';
import CreateScreen from './src/screens/CreateScreen';
import InboxScreen from './src/screens/InboxScreen';
import CapsuleDetailModal from './src/screens/CapsuleDetailModal';
import GinghamHeader from './src/components/GinghamHeader';

export default function App() {
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed', 'create', 'inbox'
  const [capsulesList, setCapsulesList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCapsule, setSelectedCapsule] = useState(null);

  // Uygulama açılışında kullanıcı profilini ve gerçek kapsülleri yükle
  useEffect(() => {
    async function initStorage() {
      try {
        const [storedUser, storedCapsules] = await Promise.all([
          storageService.loadUserProfile(),
          storageService.loadCapsules(),
        ]);
        if (storedUser) setCurrentUser(storedUser);
        if (storedCapsules) setCapsulesList(storedCapsules);
      } catch (err) {
        console.warn('Storage init failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initStorage();
  }, []);

  // Kullanıcı adını kaydet
  const handleSaveUser = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    const profile = {
      name: trimmed,
      avatar:
        'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(trimmed) +
        '&background=731C28&color=FAF7F2',
    };
    setCurrentUser(profile);
    await storageService.saveUserProfile(profile);
  };

  // Yeni kapsül eklendiğinde
  const handleCapsuleCreated = async (newCapsule) => {
    const updated = [newCapsule, ...capsulesList];
    setCapsulesList(updated);
    await storageService.saveCapsules(updated);
    setCurrentTab('feed');
  };

  // Kapsül mührü açıldığında
  const handleUnlockCapsule = async (capsuleId) => {
    const updated = capsulesList.map((c) =>
      c.id === capsuleId ? { ...c, isUnlocked: true } : c
    );
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
      const memories = selectedCapsule.memories
        ? [...selectedCapsule.memories, newMemory]
        : [newMemory];
      setSelectedCapsule({
        ...selectedCapsule,
        memoryCount: memories.length,
        memories: memories,
      });
    }
    await storageService.saveCapsules(updated);
  };

  const wrapForWeb = (node) => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webBackdrop}>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneDynamicIsland} />
            <View style={styles.phoneScreen}>{node}</View>
            <View style={styles.phoneHomeBar} />
          </View>
        </View>
      );
    }
    return node;
  };

  if (isLoading) {
    return wrapForWeb(
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.burgundy} />
        <Text style={styles.loadingText}>✨ TimeCapsule Yükleniyor... ✨</Text>
      </View>
    );
  }

  // İlk girişte gerçek kullanıcı adını sor (Sahte profil yok)
  if (!currentUser) {
    return wrapForWeb(
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.contentArea}>
          <GinghamHeader
            title="TimeCapsule"
            subtitle="✨ Gerçek Anılar • Gerçek Dostluklar ✨"
          />
          <View style={styles.onboardingCard}>
            <Text style={styles.onboardingIcon}>🎀</Text>
            <Text style={styles.onboardingTitle}>Hoş Geldin!</Text>
            <Text style={styles.onboardingSub}>
              Kapsüllerde ve grup anılarında görünecek adını yazarak başla:
            </Text>
            <TextInput
              style={styles.onboardingInput}
              placeholder="Adın (Örn: Dilara)"
              placeholderTextColor="#998"
              value={nameInput}
              onChangeText={setNameInput}
            />
            <TouchableOpacity
              style={[
                styles.onboardingBtn,
                !nameInput.trim() && { opacity: 0.5 },
              ]}
              onPress={handleSaveUser}
              disabled={!nameInput.trim()}
            >
              <Text style={styles.onboardingBtnText}>Başla ✨</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const appBody = (
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
          <CreateScreen
            currentUser={currentUser}
            onCapsuleCreated={handleCapsuleCreated}
          />
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
          currentUser={currentUser}
          onClose={() => setSelectedCapsule(null)}
          onUnlock={handleUnlockCapsule}
          onAddMemory={handleAddMemory}
        />
      )}

      {/* Scrapbook Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navLace}>
          {Array.from({ length: 24 }).map((_, i) => (
            <View key={`b-lace-${i}`} style={styles.laceDot} />
          ))}
        </View>

        <View style={styles.tabsRow}>
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

  return wrapForWeb(appBody);
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
  onboardingCard: {
    margin: 24,
    marginTop: 40,
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  onboardingIcon: {
    fontSize: 42,
    marginBottom: 8,
  },
  onboardingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.burgundyDark,
    marginBottom: 6,
  },
  onboardingSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  onboardingInput: {
    width: '100%',
    backgroundColor: colors.parchment,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 14,
    textAlign: 'center',
  },
  onboardingBtn: {
    backgroundColor: colors.burgundy,
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: colors.goldStar,
  },
  onboardingBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
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
  webBackdrop: {
    flex: 1,
    backgroundColor: '#E8DFD3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  phoneFrame: {
    width: 390,
    height: '100%',
    maxHeight: 830,
    backgroundColor: '#1E1A1A',
    borderRadius: 44,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 16,
    position: 'relative',
    alignItems: 'center',
  },
  phoneDynamicIsland: {
    position: 'absolute',
    top: 18,
    width: 108,
    height: 24,
    backgroundColor: '#111111',
    borderRadius: 12,
    zIndex: 1000,
  },
  phoneScreen: {
    flex: 1,
    width: '100%',
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: colors.burgundyDark,
  },
  phoneHomeBar: {
    position: 'absolute',
    bottom: 16,
    width: 120,
    height: 4,
    backgroundColor: 'rgba(60, 40, 40, 0.35)',
    borderRadius: 2,
    zIndex: 1000,
  },
});
