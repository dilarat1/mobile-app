import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import LockBadges from '../components/LockBadges';
import InstaxFrame from '../components/InstaxFrame';
import CassettePlayer from '../components/CassettePlayer';
import PostItNote from '../components/PostItNote';

export default function CapsuleDetailModal({
  visible,
  capsule,
  onClose,
  onUnlock,
  onAddMemory,
}) {
  const [isUnlocked, setIsUnlocked] = useState(capsule?.isUnlocked || false);
  const [showRiddleInput, setShowRiddleInput] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [newPostItText, setNewPostItText] = useState('');

  if (!capsule) return null;

  // Kilit açma işlemi
  const handleTryUnlock = () => {
    // Şifre kilidi varsa
    if (capsule.locks.riddle?.enabled && !capsule.locks.riddle.isSolved) {
      setShowRiddleInput(true);
      return;
    }

    // Mekan kilidi varsa ve yakınsa
    if (capsule.locks.location?.enabled && capsule.locks.location.isNearby) {
      setIsUnlocked(true);
      if (onUnlock) onUnlock(capsule.id);
      Alert.alert('🎉 Harika!', 'Belirtilen konumdasın, kapsülün mührü söküldü!');
      return;
    }

    // Sadece zaman kilidi varsa
    if (capsule.locks.time?.enabled && !capsule.locks.location?.enabled && !capsule.locks.riddle?.enabled) {
      Alert.alert('⏳ Zamanı Gelmedi', `Bu kapsülün açılmasına daha ${capsule.locks.time.remainingDays || 'birkaç'} gün var.`);
      return;
    }

    Alert.alert('🔒 Kilit Şartları', 'Bu kapsülü açabilmek için tüm kilit koşullarının sağlanması gerekir.');
  };

  // Bilmece cevabı kontrolü
  const handleCheckRiddle = () => {
    const correct = capsule.locks.riddle?.answer?.toLowerCase()?.trim();
    if (riddleAnswer.toLowerCase().trim() === correct) {
      setShowRiddleInput(false);
      setIsUnlocked(true);
      if (onUnlock) onUnlock(capsule.id);
      Alert.alert('✨ Doğru Cevap!', 'Tebrikler! Mühür kırıldı ve tüm anılar açıldı!');
    } else {
      Alert.alert('❌ Hatalı', 'Yanlış cevap! İpucuna tekrar bakarak dene.');
    }
  };

  // Yeni anı ekleme (Post-it olarak)
  const handleSaveMemory = () => {
    if (!newPostItText.trim()) return;
    const newMem = {
      id: `mem_${Date.now()}`,
      type: 'postit',
      content: newPostItText.trim(),
      author: 'Dilara T.',
      color: '#FFF6D1',
      pinColor: colors.pinRed,
    };
    if (onAddMemory) onAddMemory(capsule.id, newMem);
    setNewPostItText('');
    setShowAddMemoryModal(false);
    Alert.alert('📸 Anı Eklendi', 'Yeni notun kapsüle iliştirildi!');
  };

  const content = (
      <View style={styles.container}>
        {/* Üst Bar: Geri Dön Butonu ve Başlık */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>← Geri Dön</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {capsule.title}
          </Text>
          <View style={{ width: 70 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Üst Başlık Kartı */}
          <View style={styles.headerCard}>
            <View style={styles.topTape} />
            <Text style={styles.titleText}>{capsule.title}</Text>
            <Text style={styles.descText}>{capsule.description}</Text>

            {/* Yazar & Grup Bilgisi */}
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Oluşturan: {capsule.author?.name}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{capsule.createdAt}</Text>
            </View>

            {/* Grup Ortakları Çipleri */}
            {capsule.isGroup && (
              <View style={styles.collaboratorsSection}>
                <Text style={styles.collabTitle}>👥 Grup Ortakları ({capsule.collaboratorCount} kişi):</Text>
                <View style={styles.chipsRow}>
                  {capsule.collaborators ? (
                    capsule.collaborators.map((c) => (
                      <View key={c} style={styles.chip}>
                        <Text style={styles.chipText}>{c}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.metaText}>Ortak üyeler mevcut</Text>
                  )}
                </View>
              </View>
            )}

            {/* Kilit Rozetleri */}
            <LockBadges
              locks={capsule.locks}
              lockType={capsule.lockType}
              isUnlocked={isUnlocked}
            />
          </View>

          {/* EĞER KİLİTLİYSE: KİLİT AÇMA VE ŞART ALANI */}
          {!isUnlocked ? (
            <View style={styles.lockedArea}>
              <Image
                source={{ uri: capsule.previewCover }}
                style={styles.lockedCover}
                blurRadius={15}
              />
              <View style={styles.lockedOverlay}>
                <Text style={styles.lockedBigIcon}>🔐</Text>
                <Text style={styles.lockedHeading}>Bu Kapsül Henüz Mühürlü</Text>
                <Text style={styles.lockedDesc}>
                  İçinde saklanan {capsule.memoryCount || 3} nostaljik anıyı görmek için şartları sağla.
                </Text>

                <TouchableOpacity style={styles.unlockBtn} onPress={handleTryUnlock}>
                  <Text style={styles.unlockBtnText}>
                    {capsule.locks.riddle?.enabled
                      ? '🧩 Gizli Soruyu Cevapla & Aç'
                      : capsule.locks.location?.isNearby
                      ? '📍 Mekandasın, Hemen Aç!'
                      : capsule.locks.time?.enabled
                      ? '⏳ Zamanın Gelmesini Bekle'
                      : '🗝️ Kilidi Açmayı Dene'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Şifre Giriş Kutusu */}
              {showRiddleInput && (
                <View style={styles.riddleBox}>
                  <Text style={styles.riddleQuestion}>"{capsule.locks.riddle?.question}"</Text>
                  {capsule.locks.riddle?.hint && (
                    <Text style={styles.riddleHint}>İpucu: {capsule.locks.riddle?.hint}</Text>
                  )}
                  <TextInput
                    style={styles.riddleInput}
                    placeholder="Şifreyi / cevabı yaz..."
                    placeholderTextColor="#999"
                    value={riddleAnswer}
                    onChangeText={setRiddleAnswer}
                    autoCapitalize="none"
                  />
                  <View style={styles.riddleBtnRow}>
                    <TouchableOpacity
                      style={styles.riddleCancel}
                      onPress={() => setShowRiddleInput(false)}
                    >
                      <Text style={styles.riddleCancelText}>Vazgeç</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.riddleSubmit}
                      onPress={handleCheckRiddle}
                    >
                      <Text style={styles.riddleSubmitText}>Mührü Aç ✨</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            // EĞER KİLİDİ AÇILDIYSA: KUTLAMA VE FULL SCRAPBOOK GALERİSİ
            <View style={styles.unlockedGalleryArea}>
              <View style={styles.celebrationBanner}>
                <Text style={styles.celebrationStar}>✦</Text>
                <Text style={styles.celebrationText}>
                  🎉 MÜHÜR AÇILDI! BÜTÜN ANILAR BURADA 🎉
                </Text>
                <Text style={styles.celebrationStar}>✦</Text>
              </View>

              {/* Anılar Listesi (Polaroid, Kaset, Post-it) */}
              {capsule.memories && capsule.memories.length > 0 ? (
                capsule.memories.map((mem) => {
                  if (mem.type === 'polaroid') {
                    return (
                      <InstaxFrame
                        key={mem.id}
                        image={mem.image}
                        caption={mem.caption}
                        date={mem.date}
                        rotation={mem.rotation || '-2deg'}
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
                })
              ) : (
                <View style={styles.emptyMemories}>
                  <Text style={styles.emptyMemoriesText}>
                    Bu kapsüle henüz eklenmiş anı yok. İlk anıyı sen ekle!
                  </Text>
                </View>
              )}

              {/* Kapsüle Yeni Anı Ekle Butonu */}
              <TouchableOpacity
                style={styles.addMemoryFullBtn}
                onPress={() => setShowAddMemoryModal(true)}
              >
                <Text style={styles.addMemoryFullBtnText}>➕ Bu Kapsüle Yeni Anı Ekle</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Yeni Anı Ekleme Modalı */}
        {showAddMemoryModal && (
          <View style={styles.newMemoryModalOverlay}>
            <View style={styles.newMemoryModalCard}>
              <Text style={styles.newMemoryModalTitle}>📌 Kapsüle Yeni Post-it Ekle</Text>
              <TextInput
                style={styles.newMemoryInput}
                placeholder="Bu anı için geleceğe ne yazmak istersin?..."
                placeholderTextColor="#999"
                value={newPostItText}
                onChangeText={setNewPostItText}
                multiline
                numberOfLines={4}
              />
              <View style={styles.newMemoryBtnRow}>
                <TouchableOpacity
                  style={styles.newMemoryCancelBtn}
                  onPress={() => setShowAddMemoryModal(false)}
                >
                  <Text style={styles.newMemoryCancelText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.newMemorySaveBtn}
                  onPress={handleSaveMemory}
                >
                  <Text style={styles.newMemorySaveText}>İliştir ✨</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
  );

  if (Platform.OS === 'web') {
    if (!visible) return null;
    return <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>{content}</View>;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    backgroundColor: colors.burgundyDark,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: colors.parchment,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.burgundyDark,
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: 16,
    position: 'relative',
    marginBottom: 16,
  },
  topTape: {
    position: 'absolute',
    top: -8,
    left: '42%',
    width: 60,
    height: 16,
    backgroundColor: colors.washiKraft,
    borderRadius: 2,
    opacity: 0.85,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.burgundyDark,
    marginTop: 6,
    marginBottom: 6,
  },
  descText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  metaDot: {
    fontSize: 11,
    color: colors.textMuted,
    marginHorizontal: 6,
  },
  collaboratorsSection: {
    marginTop: 6,
    marginBottom: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFE7DA',
  },
  collabTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.burgundyDark,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#EBE2D4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  lockedArea: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    position: 'relative',
  },
  lockedCover: {
    width: '100%',
    height: 320,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(40, 15, 20, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockedBigIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  lockedHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  lockedDesc: {
    fontSize: 12,
    color: '#F4ECE1',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
  },
  unlockBtn: {
    backgroundColor: colors.burgundy,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.goldStar,
  },
  unlockBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  riddleBox: {
    backgroundColor: '#FAF5EE',
    padding: 16,
    borderRadius: 12,
    margin: 12,
    borderWidth: 1.5,
    borderColor: colors.burgundy,
  },
  riddleQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.burgundyDark,
    marginBottom: 4,
  },
  riddleHint: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  riddleInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  riddleBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  riddleCancel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E0D6CE',
  },
  riddleCancelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555',
  },
  riddleSubmit: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.burgundy,
  },
  riddleSubmitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  unlockedGalleryArea: {
    backgroundColor: colors.parchment,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: 14,
    alignItems: 'center',
  },
  celebrationBanner: {
    backgroundColor: colors.burgundy,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  celebrationStar: {
    color: colors.goldStar,
    fontSize: 14,
    fontWeight: 'bold',
  },
  celebrationText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyMemories: {
    padding: 20,
    alignItems: 'center',
  },
  emptyMemoriesText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  addMemoryFullBtn: {
    backgroundColor: colors.burgundy,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 12,
  },
  addMemoryFullBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  newMemoryModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  newMemoryModalCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 18,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  newMemoryModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.burgundyDark,
    marginBottom: 10,
  },
  newMemoryInput: {
    backgroundColor: '#FFF6D1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6D5A8',
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 13,
    marginBottom: 12,
  },
  newMemoryBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  newMemoryCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E0D6CE',
  },
  newMemoryCancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  newMemorySaveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.burgundy,
  },
  newMemorySaveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
});
