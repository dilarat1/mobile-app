import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function GinghamHeader({ title, subtitle }) {
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
        <Ionicons
          name="sparkles"
          size={13}
          color={colors.goldStar}
          style={styles.goldStarLeft}
        />
        <Ionicons
          name="sparkles"
          size={13}
          color={colors.goldStar}
          style={styles.goldStarRight}
        />

        <Text style={styles.titleText}>{title || 'TimeCapsule'}</Text>
        <Text style={styles.subtitleText}>
          {subtitle || 'Anılarını Kilitle, Zamanı Gelince Aç'}
        </Text>
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
    paddingTop: 44,
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
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  goldStarLeft: {
    position: 'absolute',
    top: 10,
    left: 14,
  },
  goldStarRight: {
    position: 'absolute',
    top: 10,
    right: 14,
  },
  titleText: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.burgundyDark,
    letterSpacing: 0.6,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.2,
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
