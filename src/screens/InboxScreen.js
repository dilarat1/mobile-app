import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';
import GinghamHeader from '../components/GinghamHeader';

export default function InboxScreen({ capsules, currentUser, onSelectCapsule, onLogout }) {
  const [activeTab, setActiveTab] = useState('group'); // 'group' or 'solo'

  // Kullanıcının grupları ve kişisel kapsülleri
  const groupCapsules = (capsules || []).filter((c) => c.isGroup);
  const soloCapsules = (capsules || []).filter((c) => !c.isGroup);

  const displayedCapsules = activeTab === 'group' ? groupCapsules : soloCapsules;

  return (
    <View style={styles.container}>
      <GinghamHeader
        title="Özelim & Grup Kutusu"
        subtitle="💌 Sana ve gruplarına mühürlenen hatıralar 💌"
      />

      {/* Aktif Kullanıcı & Çıkış Çubuğu */}
      {currentUser && (
        <View style={styles.accountBar}>
          <View style={styles.accountInfo}>
            <Image source={{ uri: currentUser.avatar }} style={styles.accountAvatar} />
            <View>
              <Text style={styles.accountName}>{currentUser.name}</Text>
              <Text style={styles.accountId}>
                {currentUser.email || currentUser.identifier}
                {currentUser.phoneDisplay ? ` • ${currentUser.phoneDisplay}` : ''}
              </Text>
            </View>
          </View>
          {onLogout && (
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.logoutBtnText}>Çıkış Yap</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* İki Sekmeli Seçici (Grup vs Kişisel) */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'group' && styles.tabItemActive]}
          onPress={() => setActiveTab('group')}
        >
          <Text
            style={[
              styles.tabItemText,
              activeTab === 'group' && styles.tabItemTextActive,
            ]}
          >
            👥 Grup Kapsüllerim ({groupCapsules.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'solo' && styles.tabItemActive]}
          onPress={() => setActiveTab('solo')}
        >
          <Text
            style={[
              styles.tabItemText,
              activeTab === 'solo' && styles.tabItemTextActive,
            ]}
          >
            💌 Kişisel Mühürlerim ({soloCapsules.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Kapsül Kartları Listesi */}
      <FlatList
        data={displayedCapsules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.inboxCard}
            onPress={() => onSelectCapsule && onSelectCapsule(item)}
            activeOpacity={0.8}
          >
            {/* Üst Washi Bant */}
            <View style={styles.washiTop} />

            <View style={styles.cardHeader}>
              <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
              <View style={styles.authorCol}>
                <Text style={styles.authorName}>{item.author.name}</Text>
                <Text style={styles.createdDate}>{item.createdAt} oluşturuldu</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  item.isUnlocked ? styles.unlockedBadge : styles.lockedBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    item.isUnlocked ? styles.unlockedBadgeText : styles.lockedBadgeText,
                  ]}
                >
                  {item.isUnlocked ? '🎉 Açıldı' : '🔒 Mühürlü'}
                </Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>
              {item.description}
            </Text>

            {/* Grup Ortakları veya Kilit İpucu Bilgisi */}
            {item.isGroup ? (
              <View style={styles.groupInfoRow}>
                <Text style={styles.groupMembersLabel}>
                  👥 Katılımcılar ({item.collaboratorCount} kişi):
                </Text>
                <Text style={styles.groupMembersText} numberOfLines={1}>
                  {item.collaborators ? item.collaborators.join(', ') : 'Grup üyeleri'}
                </Text>
              </View>
            ) : (
              <View style={styles.groupInfoRow}>
                <Text style={styles.groupMembersLabel}>🔒 Gizlilik:</Text>
                <Text style={styles.groupMembersText}>Sadece sana özel gizli mektup</Text>
              </View>
            )}

            {/* Alt Kilit Özeti ve Aç/İncele Butonu */}
            <View style={styles.cardFooter}>
              <Text style={styles.footerLockText}>
                {item.locks.time?.enabled && `⏳ ${item.locks.time.label}`}
                {item.locks.location?.enabled && ` • 📍 ${item.locks.location.name.split('/')[0]}`}
                {item.locks.riddle?.enabled && ' • 🧩 Şifreli'}
              </Text>
              <Text style={styles.examineText}>Detay & Aç →</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>Henüz Kapsülün Yok</Text>
            <Text style={styles.emptySub}>
              "Kapsül Yap" sekmesinden yeni bir hatıra oluşturabilir veya arkadaşlarını davet edebilirsin.
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
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: colors.parchment,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: colors.burgundy,
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabItemTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  inboxCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: 14,
    marginBottom: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  washiTop: {
    position: 'absolute',
    top: -7,
    left: 20,
    width: 48,
    height: 14,
    backgroundColor: colors.washiCheck,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.burgundy,
  },
  authorCol: {
    marginLeft: 8,
    flex: 1,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  createdDate: {
    fontSize: 10,
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  lockedBadge: {
    backgroundColor: '#F7EDEE',
    borderColor: '#E6C4C8',
  },
  lockedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.burgundy,
  },
  unlockedBadge: {
    backgroundColor: '#EDF7EE',
    borderColor: '#BFE4C3',
  },
  unlockedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#246132',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.burgundyDark,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 8,
  },
  groupInfoRow: {
    backgroundColor: colors.parchment,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  groupMembersLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.burgundyDark,
  },
  groupMembersText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFE7DA',
  },
  footerLockText: {
    fontSize: 10,
    color: colors.textMuted,
    flex: 1,
  },
  examineText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.burgundy,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
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
    paddingHorizontal: 30,
    marginTop: 4,
  },
  accountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accountAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.burgundy,
  },
  accountName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.burgundyDark,
  },
  accountId: {
    fontSize: 10,
    color: colors.textMuted,
  },
  logoutBtn: {
    backgroundColor: '#F7EDEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5B8BE',
  },
  logoutBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.burgundy,
  },
});
