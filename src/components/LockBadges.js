import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function LockBadges({ locks, lockType, isUnlocked }) {
  if (isUnlocked) {
    return (
      <View style={styles.unlockedContainer}>
        <Text style={styles.unlockedIcon}>🎉</Text>
        <Text style={styles.unlockedText}>KİLİT AÇILDI • Tüm Anılar Görüntülenebilir</Text>
      </View>
    );
  }

  const { time, location, riddle } = locks;

  // Kilit kombinasyonu başlık etiketi
  const getCombinationLabel = () => {
    const active = [];
    if (time?.enabled) active.push('⏳ Zaman');
    if (location?.enabled) active.push('📍 Mekan');
    if (riddle?.enabled) active.push('🧩 Şifre');
    return active.join(' + ');
  };

  return (
    <View style={styles.container}>
      {/* Kombinasyon Başlık Rozeti */}
      <View style={styles.comboHeader}>
        <Text style={styles.comboPrefix}>🔒 KİLİT ŞARTI:</Text>
        <Text style={styles.comboBadge}>{getCombinationLabel()}</Text>
      </View>

      {/* Aktif Kilit Rozetleri Listesi */}
      <View style={styles.badgesList}>
        {/* 1. ZAMAN KİLİDİ */}
        {time?.enabled && (
          <View style={[styles.badge, styles.timeBadge]}>
            <Text style={styles.badgeIcon}>⏳</Text>
            <View style={styles.badgeContent}>
              <Text style={styles.badgeLabel}>Açılış Zamanı</Text>
              <Text style={styles.badgeValue}>
                {time.remainingDays ? `${time.remainingDays} gün sonra` : time.label}
              </Text>
            </View>
          </View>
        )}

        {/* 2. MEKAN KİLİDİ */}
        {location?.enabled && (
          <View style={[styles.badge, styles.locationBadge]}>
            <Text style={styles.badgeIcon}>📍</Text>
            <View style={styles.badgeContent}>
              <Text style={styles.badgeLabel}>Mekan Şartı</Text>
              <Text style={styles.badgeValue} numberOfLines={1}>
                {location.name}
              </Text>
              <Text style={styles.badgeSubValue}>
                {location.isNearby ? '✨ Mekandasın! (Kilit Açılabilir)' : `Yaklaşık ${location.distanceMeters}m uzakta`}
              </Text>
            </View>
          </View>
        )}

        {/* 3. ŞİFRE / BİLMECE KİLİDİ */}
        {riddle?.enabled && (
          <View style={[styles.badge, styles.riddleBadge]}>
            <Text style={styles.badgeIcon}>🧩</Text>
            <View style={styles.badgeContent}>
              <Text style={styles.badgeLabel}>Gizli Soru / Parola</Text>
              <Text style={styles.badgeValue} numberOfLines={1}>
                "{riddle.question}"
              </Text>
              {riddle.hint && (
                <Text style={styles.badgeSubValue}>İpucu: {riddle.hint}</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  comboHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  comboPrefix: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.burgundyDark,
    marginRight: 6,
    letterSpacing: 0.5,
  },
  comboBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
    backgroundColor: colors.burgundy,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  badgesList: {
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  badgeContent: {
    flex: 1,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeValue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  badgeSubValue: {
    fontSize: 10,
    marginTop: 2,
    fontStyle: 'italic',
  },
  timeBadge: {
    backgroundColor: '#FBF5EB',
    borderColor: '#E6D3B6',
  },
  locationBadge: {
    backgroundColor: '#EEF4F0',
    borderColor: '#C3D8CA',
  },
  riddleBadge: {
    backgroundColor: '#F5ECF0',
    borderColor: '#DCB9C6',
  },
  unlockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EC',
    borderColor: '#B8DFBF',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginVertical: 6,
  },
  unlockedIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  unlockedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#215C32',
  },
});
