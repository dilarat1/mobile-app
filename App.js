import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import { mockCapsules } from './src/data/mockCapsules';
import FeedScreen from './src/screens/FeedScreen';
import CreateScreen from './src/screens/CreateScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed', 'create', 'inbox'
  const [capsulesList, setCapsulesList] = useState(mockCapsules);

  // Yeni kapsül eklendiğinde listenin en başına koy ve Akış'a geç
  const handleCapsuleCreated = (newCapsule) => {
    setCapsulesList([newCapsule, ...capsulesList]);
    setCurrentTab('feed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Ana Ekran Alanı */}
      <View style={styles.contentArea}>
        {currentTab === 'feed' && (
          <FeedScreen
            capsules={capsulesList}
            onNavigateToCreate={() => setCurrentTab('create')}
          />
        )}
        
        {currentTab === 'create' && (
          <CreateScreen onCapsuleCreated={handleCapsuleCreated} />
        )}

        {currentTab === 'inbox' && (
          <View style={styles.placeholderScreen}>
            <Text style={styles.placeholderIcon}>💌</Text>
            <Text style={styles.placeholderTitle}>Özelim & Grup Kutusu</Text>
            <Text style={styles.placeholderDesc}>
              3. Adımda sana ve ait olduğun arkadaş gruplarına gelen kilitli davetleri ve mühürlü anıları burada listeleyeceğiz!
            </Text>
          </View>
        )}
      </View>

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
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.background,
  },
  placeholderIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.burgundyDark,
    marginBottom: 8,
  },
  placeholderDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
