import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { colors } from '../theme/colors';
import LockBadges from './LockBadges';
import InstaxFrame from './InstaxFrame';
import CassettePlayer from './CassettePlayer';
import PostItNote from './PostItNote';

export default function CapsuleCard({ capsule, onUnlockSuccess, onPressCard }) {
  const [isUnlocked, setIsUnlocked] = useState(capsule.isUnlocked);
  const [showRiddleModal, setShowRiddleModal] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(capsule.collaboratorCount * 3 + 2);
  const [isExpanded, setIsExpanded] = useState(capsule.isUnlocked);

  // Kilit açma butonu tıklama mantığı
  const handleUnlockPress = () => {
    // 1. Eğer şifre / bilmece kilidi varsa modal aç
    if (capsule.locks.riddle?.enabled && !capsule.locks.riddle.isSolved) {
      setShowRiddleModal(true);
      return;
    }

    // 2. Eğer sadece mekan kilidi varsa ve yakınsa
    if (capsule.locks.location?.enabled && capsule.locks.location.isNearby) {
      setIsUnlocked(true);
      setIsExpanded(true);
      Alert.alert('🎉 Harika!', `${capsule.locks.location.name} konumundasın! Kapsül açıldı.`);
      return;
    }

    // 3. Eğer sadece zaman kilidi varsa
    if (capsule.locks.time?.enabled && !capsule.locks.location?.enabled && !capsule.locks.riddle?.enabled) {
      Alert.alert('⏳ Sabır...', `Bu kapsül ${capsule.locks.time.label} tarihinde açılacaktır.`);
      return;
    }

    // 4. Genel kilit durumu
    Alert.alert('🔒 Kilit Şartları', 'Bu kapsülü açmak için belirtilen kilit şartlarının tamamlanması gerekiyor.');
  };

  // Bilmece cevabını kontrol etme
  const handleCheckAnswer = () => {
    const correctAnswer = capsule.locks.riddle?.answer?.toLowerCase()?.trim();
    if (riddleAnswer.toLowerCase().trim() === correctAnswer) {
      setShowRiddleModal(false);
      setIsUnlocked(true);
      setIsExpanded(true);
      Alert.alert('✨ Tebrikler!', 'Gizli cevabı doğru bildin, anılar açığa çıktı!');
    } else {
      Alert.alert('❌ Yanlış Cevap', 'Cevap hatalı! İpucunu tekrar oku ve dene.');
    }
  };

  // Beğeni toggle
  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <View style={styles.cardContainer}>
      {/* Kartın Sol Üstündeki Sevimli Washi Bant Efekti */}
      <View style={styles.topTape} />

      {/* 1. ÜST BİLGİ ALANI (Yazar, Grup Bilgisi, Tarih) */}
      <View style={styles.headerRow}>
        <Image source={{ uri: capsule.author.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{capsule.author.name}</Text>
          <Text style={styles.createdDate}>{capsule.createdAt}</Text>
        </View>

        {/* Grup veya Tekil Etiketi */}
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: capsule.isGroup ? colors.groupTagBg : colors.soloTagBg },
          ]}
        >
          <Text style={styles.typeBadgeText}>
            {capsule.isGroup ? `👥 Grup (${capsule.collaboratorCount})` : '🔒 Kişisel'}
          </Text>
        </View>
      </View>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <Text style={styles.titleText}>{capsule.title}</Text>
      <Text style={styles.descText}>{capsule.description}</Text>

      {/* 3. MODÜLER KİLİT ROZETLERİ */}
      <LockBadges
        locks={capsule.locks}
        lockType={capsule.lockType}
        isUnlocked={isUnlocked}
      />

      {/* 4. KİLİTLİ DURUM GÖRSELİ VEYA AÇILMIŞ SCRAPBOOK İÇERİĞİ */}
      {!isUnlocked ? (
        // KİLİTLİ GÖRÜNÜM
        <View style={styles.lockedCoverWrapper}>
          <Image source={{ uri: capsule.previewCover }} style={styles.lockedCoverImage} blurRadius={12} />
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockedLockIcon}>🔐</Text>
            <Text style={styles.lockedTitle}>İçerik Kilitli</Text>
            <Text style={styles.lockedSub}>
              {capsule.memoryCount} Gizli Anı (Polaroidler, Ses Kasetleri & Notlar)
            </Text>

            {/* Kilit Açma Butonu */}
            <TouchableOpacity style={styles.unlockActionBtn} onPress={handleUnlockPress}>
              <Text style={styles.unlockActionBtnText}>
                {capsule.locks.riddle?.enabled
                  ? '🧩 Şifreyi / Soruyu Yanıtla'
                  : capsule.locks.location?.isNearby
                  ? '📍 Mekandasın, Hemen Aç!'
                  : capsule.locks.time?.enabled
                  ? '⏳ Zamanın Gelmesini Bekle'
                  : '🗝️ Kilidi Açmayı Dene'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // KİLİDİ AÇILMIŞ SCRAPBOOK ALBÜMÜ
        <View style={styles.unlockedScrapbookArea}>
          <View style={styles.scrapbookBanner}>
            <Text style={styles.scrapbookBannerText}>🎀 Nostalji Albümü Açıldı 🎀</Text>
          </View>

          {/* Anılar Listesi (Polaroid, Kaset, Post-it) */}
          {capsule.memories && capsule.memories.map((mem) => {
            if (mem.type === 'polaroid') {
              return (
                <InstaxFrame
                  key={mem.id}
                  image={mem.image}
                  caption={mem.caption}
                  date={mem.date}
                  rotation={mem.rotation}
                  tapeColor={mem.tapeColor}
                />
              );
            }
            if (mem.type === 'cassette') {
              return (
                <CassettePlayer
                  key={mem.id}
                  title={mem.title}
                  duration={mem.duration}
                  author={mem.author}
                />
              );
            }
            if (mem.type === 'postit') {
              return (
                <PostItNote
                  key={mem.id}
                  content={mem.content}
                  author={mem.author}
                  color={mem.color}
                  pinColor={mem.pinColor}
                />
              );
            }
            return null;
          })}
        </View>
      )}

      {/* ŞİFRE / BİLMECE GİRİŞ KUTUSU (Gerekliyse açılır) */}
      {showRiddleModal && (
        <View style={styles.riddleBox}>
          <Text style={styles.riddleBoxTitle}>🧩 Gizli Soruyu Cevapla</Text>
          <Text style={styles.riddleBoxQuestion}>"{capsule.locks.riddle?.question}"</Text>
          <Text style={styles.riddleBoxHint}>İpucu: {capsule.locks.riddle?.hint}</Text>

          <TextInput
            style={styles.riddleInput}
            placeholder="Cevabını buraya yaz..."
            placeholderTextColor="#999"
            value={riddleAnswer}
            onChangeText={setRiddleAnswer}
            autoCapitalize="none"
          />

          <View style={styles.riddleBtnRow}>
            <TouchableOpacity
              style={styles.riddleCancelBtn}
              onPress={() => setShowRiddleModal(false)}
            >
              <Text style={styles.riddleCancelText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.riddleSubmitBtn}
              onPress={handleCheckAnswer}
            >
              <Text style={styles.riddleSubmitText}>Kilidi Aç ✨</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 5. ALT ETKİLEŞİM ÇUBUĞU (Kalp/Beğeni, Anı Ekle, Paylaş) */}
      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.likeBtn} onPress={toggleLike} activeOpacity={0.7}>
          <Text style={styles.likeIcon}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.likeCountText}>{likeCount} Nostalji</Text>
        </TouchableOpacity>

        {capsule.isGroup && (
          <TouchableOpacity
            style={styles.addMemoryBtn}
            onPress={onPressCard || (() => Alert.alert('📸 Anı Ekle', 'Kapsül detayında anı ekleme penceresi açılıyor.'))}
          >
            <Text style={styles.addMemoryBtnText}>➕ Anı Ekle</Text>
          </TouchableOpacity>
        )}

        {onPressCard && (
          <TouchableOpacity style={styles.detailBtn} onPress={onPressCard}>
            <Text style={styles.detailBtnText}>Detay & Aç →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  detailBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.burgundy,
  },
  cardContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  topTape: {
    position: 'absolute',
    top: -8,
    left: '40%',
    width: 60,
    height: 16,
    backgroundColor: colors.washiKraft,
    borderRadius: 2,
    opacity: 0.85,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.burgundy,
  },
  authorInfo: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  createdDate: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.burgundyDark,
    marginBottom: 4,
  },
  descText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  lockedCoverWrapper: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E8DBC6',
  },
  lockedCoverImage: {
    width: '100%',
    height: '100%',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(40, 15, 20, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  lockedLockIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  lockedSub: {
    fontSize: 11,
    color: '#F0E2E2',
    textAlign: 'center',
    marginTop: 4,
  },
  unlockActionBtn: {
    backgroundColor: colors.burgundy,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.goldStar,
  },
  unlockActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  unlockedScrapbookArea: {
    backgroundColor: colors.parchment,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2D3BE',
    padding: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  scrapbookBanner: {
    backgroundColor: colors.burgundy,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  scrapbookBannerText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  riddleBox: {
    backgroundColor: '#F9F1EB',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.burgundy,
    padding: 12,
    marginVertical: 8,
  },
  riddleBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.burgundyDark,
  },
  riddleBoxQuestion: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginVertical: 4,
  },
  riddleBoxHint: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  riddleInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    marginBottom: 8,
  },
  riddleBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  riddleCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E0D6CE',
  },
  riddleCancelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555',
  },
  riddleSubmitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.burgundy,
  },
  riddleSubmitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFE6D8',
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likeCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  addMemoryBtn: {
    backgroundColor: colors.parchment,
    borderWidth: 1,
    borderColor: colors.burgundy,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addMemoryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.burgundy,
  },
});
