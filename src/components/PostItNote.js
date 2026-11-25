import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function PostItNote({ content, author, color = '#FFF5CC', pinColor = '#B82633' }) {
  return (
    <View style={styles.container}>
      {/* Kırmızı/Altın İğne (Pin) */}
      <View style={styles.pinWrapper}>
        <View style={[styles.pinHead, { backgroundColor: pinColor }]} />
        <View style={styles.pinShadow} />
      </View>

      {/* Post-It Kağıdı */}
      <View style={[styles.notePaper, { backgroundColor: color }]}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={styles.contentText}>{content}</Text>
        {author && <Text style={styles.authorText}>— {author}</Text>}

        {/* Kıvrılmış köşe efekti */}
        <View style={styles.foldedCorner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 3,
  },
  pinWrapper: {
    zIndex: 10,
    marginBottom: -8,
    alignItems: 'center',
  },
  pinHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#73141F',
  },
  pinShadow: {
    width: 6,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    marginTop: -2,
  },
  notePaper: {
    width: 240,
    padding: 14,
    paddingTop: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E8DCB8',
    position: 'relative',
  },
  quoteMark: {
    position: 'absolute',
    top: 4,
    left: 8,
    fontSize: 24,
    color: '#D8C696',
    fontWeight: '800',
  },
  contentText: {
    fontSize: 12,
    color: '#3B3024',
    lineHeight: 18,
    fontStyle: 'italic',
    fontWeight: '500',
    marginTop: 4,
  },
  authorText: {
    fontSize: 10,
    color: '#8A775C',
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '700',
  },
  foldedCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 16,
    borderTopWidth: 16,
    borderRightColor: '#E2D3A7',
    borderTopColor: 'transparent',
  },
});
