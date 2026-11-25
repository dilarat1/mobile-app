import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function InstaxFrame({ image, caption, date, rotation = '-2deg', tapeColor = '#E2CA9E' }) {
  return (
    <View style={[styles.outerContainer, { transform: [{ rotate: rotation }] }]}>
      {/* Üst Kısımdaki Washi Bant Sticker */}
      <View style={[styles.washiTape, { backgroundColor: tapeColor }]} />

      {/* Polaroid / Instax Çerçevesi */}
      <View style={styles.frame}>
        <Image source={{ uri: image }} style={styles.photo} resizeMode="cover" />
        
        {/* Fotoğraf Altı Yazı Alanı */}
        <View style={styles.captionArea}>
          <Text style={styles.captionText}>{caption}</Text>
          {date && <Text style={styles.dateText}>{date}</Text>}
        </View>

        {/* Küçük Altın Yıldız Detayı */}
        <Text style={styles.starAccent}>✦</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },
  washiTape: {
    width: 70,
    height: 16,
    borderRadius: 2,
    opacity: 0.85,
    marginBottom: -8,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  frame: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingBottom: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ECE5DB',
    width: 240,
    alignItems: 'center',
    position: 'relative',
  },
  photo: {
    width: 220,
    height: 180,
    borderRadius: 3,
    backgroundColor: '#EAD9C0',
  },
  captionArea: {
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  captionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3A2828',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 10,
    color: '#8C7777',
    marginTop: 2,
  },
  starAccent: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    fontSize: 10,
    color: colors.goldStar,
  },
});
