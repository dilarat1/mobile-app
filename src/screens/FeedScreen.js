import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';
import { mockCapsules } from '../data/mockCapsules';
import GinghamHeader from '../components/GinghamHeader';
import CapsuleCard from '../components/CapsuleCard';

export default function FeedScreen() {
  const [capsules, setCapsules] = useState(mockCapsules);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'group', 'locked', 'unlocked'

  // Filtreleme mantığı
  const filteredCapsules = capsules.filter((item) => {
    // Arama filtrelemesi
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Kategori filtrelemesi
    if (selectedFilter === 'group') return item.isGroup;
    if (selectedFilter === 'locked') return !item.isUnlocked;
    if (selectedFilter === 'unlocked') return item.isUnlocked;

    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.burgundyDark} />

      {/* Pötikare & Fiyonklu Vintage Header */}
      <GinghamHeader
        title="TimeCapsule"
        subtitle="✨ Nostalji Akışı • Ortak Anılar & Kapsüller ✨"
      />

      {/* Arama ve Filtreleme Bölümü */}
      <View style={styles.searchFilterContainer}>
        {/* Arama Çubuğu */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Kapsül, anı veya arkadaş ara..."
            placeholderTextColor="#8C7979"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filtreleme Hapları (Filter Pills) */}
        <View style={styles.filterPillsRow}>
          {[
            { id: 'all', label: `Tümü (${capsules.length})` },
            { id: 'group', label: '👥 Grupça' },
            { id: 'locked', label: '🔒 Kilitli' },
            { id: 'unlocked', label: '🎉 Açılanlar' },
          ].map((pill) => {
            const isSelected = selectedFilter === pill.id;
            return (
              <TouchableOpacity
                key={pill.id}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                ]}
                onPress={() => setSelectedFilter(pill.id)}
              >
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
        </View>
      </View>

      {/* Kapsül Akışı Listesi */}
      <FlatList
        data={filteredCapsules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CapsuleCard capsule={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📜</Text>
            <Text style={styles.emptyTitle}>Henüz Kapsül Bulunamadı</Text>
            <Text style={styles.emptySub}>
              Filtrelerinizi değiştirebilir veya yeni bir kapsül oluşturabilirsiniz.
            </Text>
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
  searchFilterContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: colors.background,
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
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  clearSearchIcon: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 4,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  filterPill: {
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.burgundyDark,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
});
