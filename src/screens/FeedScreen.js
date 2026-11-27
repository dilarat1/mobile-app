import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import GinghamHeader from '../components/GinghamHeader';
import CapsuleCard from '../components/CapsuleCard';

export default function FeedScreen({
  capsules = [],
  currentUser,
  onNavigateToCreate,
  onNavigateToProfile,
  onSelectCapsule,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'group', 'locked', 'unlocked'

  const userName = currentUser?.name?.split(' ')[0] || 'Misafir';
  const userAvatar =
    currentUser?.avatar ||
    'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(userName) +
      '&background=731C28&color=FAF7F2';

  const totalCount = capsules.length;
  const lockedCount = capsules.filter((c) => !c.isUnlocked).length;
  const unlockedCount = capsules.filter((c) => c.isUnlocked).length;
  const groupCount = capsules.filter((c) => c.isGroup).length;

  const filteredCapsules = capsules.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'group') return item.isGroup;
    if (selectedFilter === 'locked') return !item.isUnlocked;
    if (selectedFilter === 'unlocked') return item.isUnlocked;

    return true;
  });

  const filterPills = [
    { id: 'all', label: `Tümü (${totalCount})`, icon: 'layers-outline' },
    { id: 'group', label: `Grupça (${groupCount})`, icon: 'people-outline' },
    { id: 'locked', label: `Kilitli (${lockedCount})`, icon: 'lock-closed-outline' },
    { id: 'unlocked', label: `Açılanlar (${unlockedCount})`, icon: 'lock-open-outline' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.burgundyDark} />

      <GinghamHeader
        title="TimeCapsule"
        subtitle="Anılarını Kilitle, Zamanı Gelince Aç"
      />

      {/* Karşılama & Mini Profil / Özet Şeridi */}
      <View style={styles.welcomeStrip}>
        <View style={styles.welcomeLeft}>
          <Text style={styles.welcomeGreeting}>Merhaba, {userName}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="cube-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.statText}>{totalCount} Kapsül</Text>
            </View>
            <Text style={styles.statDot}>•</Text>
            <View style={styles.statItem}>
              <Ionicons name="lock-closed-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.statText}>{lockedCount} Mühürlü</Text>
            </View>
            <Text style={styles.statDot}>•</Text>
            <View style={styles.statItem}>
              <Ionicons name="lock-open-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.statText}>{unlockedCount} Açık</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileChip}
          onPress={onNavigateToProfile}
          activeOpacity={0.8}
        >
          <Image source={{ uri: userAvatar }} style={styles.profileAvatar} />
        </TouchableOpacity>
      </View>

      {/* Arama ve Filtreleme Bölümü */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={16}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Kapsül, anı veya arkadaş ara..."
            placeholderTextColor="#8C7979"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={17} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsRow}
        >
          {filterPills.map((pill) => {
            const isSelected = selectedFilter === pill.id;
            return (
              <TouchableOpacity
                key={pill.id}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setSelectedFilter(pill.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={pill.icon}
                  size={13}
                  color={isSelected ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextActive,
                  ]}
                >
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Kapsül Akışı Listesi */}
      <FlatList
        data={filteredCapsules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CapsuleCard
            capsule={item}
            onPressCard={() => onSelectCapsule && onSelectCapsule(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyTape} />
            <Ionicons
              name="sparkles"
              size={13}
              color={colors.goldStar}
              style={styles.emptyCornerLeft}
            />
            <Ionicons
              name="sparkles"
              size={13}
              color={colors.goldStar}
              style={styles.emptyCornerRight}
            />

            <View style={styles.emptyIconCircle}>
              <Ionicons
                name={totalCount === 0 ? 'hourglass-outline' : 'search-outline'}
                size={28}
                color={colors.burgundy}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {totalCount === 0
                ? 'İlk Anını Mühürlemeye Hazır Mısın?'
                : 'Sonuç Bulunamadı'}
            </Text>

            <Text style={styles.emptySub}>
              {totalCount === 0
                ? 'Arkadaşlarınla ya da kendine özel sakladığın tüm zaman kapsülleri burada görünecek. Fotoğraf, ses kaydı veya bir not bırakarak başla.'
                : 'Arama kelimeni veya seçili filtreyi değiştirerek tekrar deneyebilirsin.'}
            </Text>

            {totalCount === 0 && onNavigateToCreate && (
              <TouchableOpacity
                style={styles.emptyCtaBtn}
                onPress={onNavigateToCreate}
                activeOpacity={0.85}
              >
                <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
                <Text style={styles.emptyCtaText}>İlk Kapsülü Oluştur</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  welcomeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  welcomeLeft: {
    flex: 1,
  },
  welcomeGreeting: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.burgundyDark,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statDot: {
    fontSize: 10,
    color: colors.textMuted,
    marginHorizontal: 6,
  },
  profileChip: {
    padding: 2,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.burgundy,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  searchFilterContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.parchment,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingRight: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.parchment,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterPillActive: {
    backgroundColor: colors.burgundy,
    borderColor: colors.burgundyDark,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyCard: {
    marginHorizontal: 16,
    marginTop: 22,
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },
  emptyTape: {
    position: 'absolute',
    top: -8,
    width: 66,
    height: 16,
    backgroundColor: colors.washiKraft,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  emptyCornerLeft: {
    position: 'absolute',
    top: 14,
    left: 16,
  },
  emptyCornerRight: {
    position: 'absolute',
    top: 14,
    right: 16,
  },
  emptyIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.parchment,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.burgundyDark,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  emptyCtaBtn: {
    marginTop: 18,
    backgroundColor: colors.burgundy,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.goldStar,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
