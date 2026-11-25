import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function GinghamHeader({ title, subtitle, unreadCount }) {
  // Pötikare (Gingham) şeritleri için dizi
  const stripes = Array.from({ length: 18 });

  return (
    <View style={styles.container}>
      {/* Pötikare / Gingham Kumaş Deseni Katmanı */}
      <View style={styles.ginghamCanvas}>
        <View style={styles.verticalStripes}>
          {stripes.map((_, i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.stripeV,
                { backgroundColor: i % 2 === 0 ? colors.burgundyDark : colors.burgundyLight },
              ]}
            />
          ))}
        </View>
        <View style={styles.horizontalStripes}>
          {stripes.map((_, i) => (
            <View
              key={`h-${i}`}
              style={[
                styles.stripeH,
                { backgroundColor: i % 2 === 0 ? 'rgba(0,0,0,0.22)' : 'transparent' },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Ortadaki Vintage Parşömen Başlık Kartı */}
      <View style={styles.titleCard}>
        {/* Sol ve Sağ Küçük Kırmızı Kurdele Fiyonkları */}
        <View style={styles.cornerBowLeft}>
          <Text style={styles.bowEmoji}>🎀</Text>
        </View>
        <View style={styles.cornerBowRight}>
          <Text style={styles.bowEmoji}>🎀</Text>
        </View>

        {/* Altın Yıldız Pırıltıları */}
        <Text style={styles.goldStarLeft}>✦</Text>
        <Text style={styles.goldStarRight}>✦</Text>

        <Text style={styles.titleText}>{title || 'TimeCapsule'}</Text>
        <Text style={styles.subtitleText}>{subtitle || '✨ Anılarını Kilitle, Gelecekte Aç ✨'}</Text>
      </View>

      {/* Dantel / Fisto Kenar Süsü (Scalloped Lace Edge) */}
      <View style={styles.laceContainer}>
        {Array.from({ length: 22 }).map((_, i) => (
          <View key={`lace-${i}`} style={styles.laceScallop} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.burgundy,
    paddingTop: 48,
    paddingBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  ginghamCanvas: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.65,
  },
  verticalStripes: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  stripeV: {
    flex: 1,
    height: '100%',
  },
  horizontalStripes: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  stripeH: {
    flex: 1,
    width: '100%',
  },
  titleCard: {
    marginHorizontal: 20,
    backgroundColor: colors.parchment,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  cornerBowLeft: {
    position: 'absolute',
    top: -12,
    left: -8,
  },
  cornerBowRight: {
    position: 'absolute',
    top: -12,
    right: -8,
  },
  bowEmoji: {
    fontSize: 22,
  },
  goldStarLeft: {
    position: 'absolute',
    top: 6,
    left: 12,
    color: colors.goldStar,
    fontSize: 14,
    fontWeight: 'bold',
  },
  goldStarRight: {
    position: 'absolute',
    top: 6,
    right: 12,
    color: colors.goldStar,
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.burgundyDark,
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  laceContainer: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  laceScallop: {
    width: 20,
    height: 12,
    backgroundColor: colors.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: colors.laceBorder,
    borderBottomWidth: 0,
  },
});
