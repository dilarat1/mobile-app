import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function CassettePlayer({ title, duration, author }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      {/* Kaset Gövdesi */}
      <View style={styles.cassetteBody}>
        {/* Üst Başlık & Yazar Etiketi */}
        <View style={styles.labelSticker}>
          <Text style={styles.cassetteSide}>SIDE A • 90 MIN</Text>
          <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
          <Text style={styles.authorText}>Kaydeden: {author}</Text>
        </View>

        {/* Kaset Makaraları & Şeffaf Pencere */}
        <View style={styles.tapeWindow}>
          {/* Sol Makara */}
          <View style={[styles.spool, isPlaying && styles.spoolRotating]}>
            <View style={styles.spoolCenter} />
            <View style={styles.spoolTeeth1} />
            <View style={styles.spoolTeeth2} />
          </View>

          {/* Kaset Manyetik Bandı Çizgisi */}
          <View style={styles.tapeBridge}>
            <Text style={styles.playStateText}>
              {isPlaying ? '▶ ÇALIYOR...' : '⏸ DURAKLATILDI'}
            </Text>
            <Text style={styles.durationText}>{duration}</Text>
          </View>

          {/* Sağ Makara */}
          <View style={[styles.spool, isPlaying && styles.spoolRotating]}>
            <View style={styles.spoolCenter} />
            <View style={styles.spoolTeeth1} />
            <View style={styles.spoolTeeth2} />
          </View>
        </View>

        {/* Alt Çalma Kontrolü */}
        <TouchableOpacity style={styles.playButton} onPress={togglePlay} activeOpacity={0.8}>
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸ Sesi Duraklat' : '▶ Ses Kaydını Dinle'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  cassetteBody: {
    width: 250,
    backgroundColor: '#353535',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#222222',
    padding: 10,
    position: 'relative',
  },
  labelSticker: {
    backgroundColor: '#FDFBF5',
    borderRadius: 6,
    padding: 8,
    borderBottomWidth: 3,
    borderBottomColor: colors.burgundy,
    marginBottom: 8,
  },
  cassetteSide: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.burgundyDark,
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A1C1C',
    marginTop: 2,
  },
  authorText: {
    fontSize: 10,
    color: '#776565',
    fontStyle: 'italic',
    marginTop: 1,
  },
  tapeWindow: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#4A4A4A',
  },
  spool: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#999999',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  spoolRotating: {
    borderColor: colors.goldStar,
  },
  spoolCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2A2A2A',
  },
  spoolTeeth1: {
    position: 'absolute',
    width: 22,
    height: 2,
    backgroundColor: '#666666',
  },
  spoolTeeth2: {
    position: 'absolute',
    width: 2,
    height: 22,
    backgroundColor: '#666666',
  },
  tapeBridge: {
    alignItems: 'center',
  },
  playStateText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.goldStar,
    letterSpacing: 0.5,
  },
  durationText: {
    fontSize: 10,
    color: '#CCCCCC',
    marginTop: 2,
  },
  playButton: {
    backgroundColor: colors.burgundy,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
