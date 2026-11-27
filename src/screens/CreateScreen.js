import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import GinghamHeader from '../components/GinghamHeader';

export default function CreateScreen({ currentUser, onCapsuleCreated }) {
  const userName = currentUser?.name || 'Kullanıcı';
  const userAvatar = currentUser?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=731C28&color=FAF7F2';

  // 1. Temel Bilgiler
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [collaborators, setCollaborators] = useState([userName]);

  // 2. Modüler Kilit State'leri
  const [timeLockEnabled, setTimeLockEnabled] = useState(true);
  const [selectedTimePreset, setSelectedTimePreset] = useState('1hafta');
  const [customTimeLabel, setCustomTimeLabel] = useState('');

  const [locationLockEnabled, setLocationLockEnabled] = useState(false);
  const [locationName, setLocationName] = useState('');

  const [riddleLockEnabled, setRiddleLockEnabled] = useState(false);
  const [riddleQuestion, setRiddleQuestion] = useState('');
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleHint, setRiddleHint] = useState('');

  // 3. İlk Anı / Scrapbook Öğesi
  const [memoryType, setMemoryType] = useState('polaroid'); // 'polaroid', 'cassette', 'postit'
  const [pickedImageUri, setPickedImageUri] = useState(null);
  const [polaroidCaption, setPolaroidCaption] = useState('');
  const [tapeColor, setTapeColor] = useState(colors.washiKraft);
  const [cassetteTitle, setCassetteTitle] = useState('');
  const [postItContent, setPostItContent] = useState('');
  const [postItColor, setPostItColor] = useState('#FFF6D1');

  // Galeriden/Bilgisayardan gerçek fotoğraf seçme
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPickedImageUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Hata', 'Fotoğraf seçilirken bir sorun oluştu.');
    }
  };

  // Arkadaş ekleme
  const handleAddFriend = () => {
    const trimmed = friendName.trim();
    if (!trimmed) return;
    if (collaborators.includes(trimmed)) {
      Alert.alert('Uyarı', 'Bu kişi zaten ekli!');
      return;
    }
    setCollaborators([...collaborators, trimmed]);
    setFriendName('');
  };

  // Arkadaş silme
  const handleRemoveFriend = (name) => {
    if (name === userName) return;
    setCollaborators(collaborators.filter((c) => c !== name));
  };

  // Dinamik Kilit Kombinasyonu Etiketi
  const getLockCombinationLabel = () => {
    const list = [];
    if (timeLockEnabled) list.push('⏳ Zaman');
    if (locationLockEnabled) list.push('📍 Mekan');
    if (riddleLockEnabled) list.push('🧩 Şifre');
    if (list.length === 0) return 'Kilitsiz (Hemen Açık)';
    return list.join(' + ');
  };

  // Formu sıfırla
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFriendName('');
    setCollaborators([userName]);
    setCustomTimeLabel('');
    setLocationName('');
    setRiddleQuestion('');
    setRiddleAnswer('');
    setRiddleHint('');
    setPickedImageUri(null);
    setPolaroidCaption('');
    setCassetteTitle('');
    setPostItContent('');
  };

  // Kapsülü Mühürle & Kaydet
  const handleSealCapsule = () => {
    if (!title.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen kapsülüne bir başlık yaz!');
      return;
    }

    if (locationLockEnabled && !locationName.trim()) {
      Alert.alert('Eksik Bilgi', 'Mekan kilidi seçtiysen lütfen açılacağı yeri yaz.');
      return;
    }

    if (riddleLockEnabled && (!riddleQuestion.trim() || !riddleAnswer.trim())) {
      Alert.alert('Eksik Bilgi', 'Şifre kilidi için hem gizli soruyu hem de doğru cevabı girmelisin.');
      return;
    }

    const timeLabels = {
      '1gun': '1 Gün Sonra',
      '1hafta': '1 Hafta Sonra',
      '1ay': '1 Ay Sonra',
      '1yil': '1 Yıl Sonra',
    };

    const resolvedTimeLabel =
      selectedTimePreset === 'ozel'
        ? customTimeLabel.trim() || 'Belirlenen Tarih'
        : timeLabels[selectedTimePreset];

    const todayStr = new Date().toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // İlk anıyı hazırla
    const initialMemories = [];
    if (memoryType === 'polaroid' && (pickedImageUri || polaroidCaption.trim())) {
      initialMemories.push({
        id: `mem_${Date.now()}_1`,
        type: 'polaroid',
        image: pickedImageUri || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600',
        caption: polaroidCaption.trim() || 'Anı karesi ✨',
        date: todayStr,
        rotation: '-2deg',
        tapeColor: tapeColor,
      });
    } else if (memoryType === 'cassette' && cassetteTitle.trim()) {
      initialMemories.push({
        id: `mem_${Date.now()}_1`,
        type: 'cassette',
        title: cassetteTitle.trim(),
        duration: '00:45',
        author: userName,
      });
    } else if (memoryType === 'postit' && postItContent.trim()) {
      initialMemories.push({
        id: `mem_${Date.now()}_1`,
        type: 'postit',
        content: postItContent.trim(),
        author: userName,
        color: postItColor,
        pinColor: colors.pinRed,
      });
    }

    const isInitiallyUnlocked = !timeLockEnabled && !locationLockEnabled && !riddleLockEnabled;

    const newCapsule = {
      id: `cap_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Geleceğe bırakılan özel bir kapsül.',
      author: {
        name: userName,
        avatar: userAvatar,
      },
      createdAt: todayStr,
      isPublic: true,
      isGroup: isGroup,
      collaborators: isGroup ? collaborators : [userName],
      collaboratorCount: isGroup ? collaborators.length : 1,
      lockType: 'custom',
      locks: {
        time: {
          enabled: timeLockEnabled,
          label: resolvedTimeLabel,
          remainingDays:
            selectedTimePreset === '1gun'
              ? 1
              : selectedTimePreset === '1hafta'
              ? 7
              : selectedTimePreset === '1ay'
              ? 30
              : selectedTimePreset === '1yil'
              ? 365
              : null,
        },
        location: {
          enabled: locationLockEnabled,
          name: locationName.trim(),
          distanceMeters: 0,
          isNearby: false,
        },
        riddle: {
          enabled: riddleLockEnabled,
          question: riddleQuestion.trim(),
          answer: riddleAnswer.trim(),
          hint: riddleHint.trim(),
          isSolved: false,
        },
      },
      isUnlocked: isInitiallyUnlocked,
      memoryCount: initialMemories.length,
      previewCover:
        pickedImageUri ||
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600',
      tag: isGroup ? 'Grup Kapsülü • 👥 Ortak' : 'Kişisel Kapsül • 🔒 Özel',
      memories: initialMemories,
    };

    resetForm();
    if (onCapsuleCreated) {
      onCapsuleCreated(newCapsule);
    }

    Alert.alert(
      isInitiallyUnlocked ? '✨ Kapsül Paylaşıldı!' : '🎀 Kapsül Mühürlendi!',
      `"${newCapsule.title}" Akış'a eklendi.`
    );
  };

  return (
    <View style={styles.container}>
      <GinghamHeader
        title="Yeni Kapsül Oluştur"
        subtitle={`✨ ${userName}, anını mühürle ✨`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Canlı Kilit Kombinasyonu Önizleme Kartı */}
        <View style={styles.previewBanner}>
          <Text style={styles.previewLabel}>MÜHÜR TÜRÜ:</Text>
          <Text style={styles.previewBadge}>{getLockCombinationLabel()}</Text>
        </View>

        {/* 1. BÖLÜM: TEMEL KAPSÜL BİLGİLERİ */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>1. Kapsül Bilgileri</Text>

          <Text style={styles.inputLabel}>Kapsül Başlığı *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Kapsülüne bir isim ver..."
            placeholderTextColor="#998"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.inputLabel}>Açıklama / Mesaj</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Geleceğe veya arkadaşlarına kısa bir not yaz..."
            placeholderTextColor="#998"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* Kapsül Türü Seçimi: Grup vs Tekil */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>👥 Arkadaş Grubu Kapsülü</Text>
              <Text style={styles.switchSub}>
                {isGroup
                  ? 'Eklediğin arkadaşların da bu kapsüle anı bırakabilir.'
                  : 'Sadece senin oluşturduğun tekil kapsül.'}
              </Text>
            </View>
            <Switch
              value={isGroup}
              onValueChange={setIsGroup}
              trackColor={{ false: '#D4C6B6', true: colors.burgundy }}
              thumbColor={isGroup ? colors.parchment : '#F4F3F4'}
            />
          </View>

          {/* Arkadaş Ekleme Alanı (Grup Seçildiyse) */}
          {isGroup && (
            <View style={styles.groupAddArea}>
              <Text style={styles.inputLabel}>Arkadaşlarını Ekle</Text>
              <View style={styles.addFriendRow}>
                <TextInput
                  style={[styles.textInput, styles.friendInput]}
                  placeholder="Arkadaşının adını yaz..."
                  placeholderTextColor="#998"
                  value={friendName}
                  onChangeText={setFriendName}
                />
                <TouchableOpacity style={styles.addFriendBtn} onPress={handleAddFriend}>
                  <Text style={styles.addFriendBtnText}>＋ Ekle</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.friendChipsWrap}>
                {collaborators.map((c) => (
                  <View key={c} style={styles.friendChip}>
                    <Text style={styles.friendChipText}>
                      {c === userName ? `${c} (Sen)` : c}
                    </Text>
                    {c !== userName && (
                      <TouchableOpacity onPress={() => handleRemoveFriend(c)}>
                        <Text style={styles.removeChipText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 2. BÖLÜM: MODÜLER KİLİT ŞARTLARI */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>2. Kilit Seçenekleri</Text>
          <Text style={styles.sectionSubtitle}>
            İstediğin kilitleri açıp kapatabilir, hepsini bir arada kullanabilirsin.
          </Text>

          {/* KİLİT 1: ZAMAN KİLİDİ */}
          <View style={styles.lockBox}>
            <View style={styles.lockHeaderRow}>
              <View style={styles.lockTitleRow}>
                <Text style={styles.lockIcon}>⏳</Text>
                <Text style={styles.lockTitle}>Zaman Kilidi</Text>
              </View>
              <Switch
                value={timeLockEnabled}
                onValueChange={setTimeLockEnabled}
                trackColor={{ false: '#D4C6B6', true: colors.burgundy }}
                thumbColor={timeLockEnabled ? colors.parchment : '#F4F3F4'}
              />
            </View>

            {timeLockEnabled && (
              <View style={styles.lockDetails}>
                <Text style={styles.presetLabel}>Ne zaman açılsın?</Text>
                <View style={styles.presetPillsRow}>
                  {[
                    { id: '1gun', label: '1 Gün Sonra' },
                    { id: '1hafta', label: '1 Hafta Sonra' },
                    { id: '1ay', label: '1 Ay Sonra' },
                    { id: '1yil', label: '1 Yıl Sonra' },
                    { id: 'ozel', label: 'Özel Tarih' },
                  ].map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.presetPill,
                        selectedTimePreset === p.id && styles.presetPillActive,
                      ]}
                      onPress={() => setSelectedTimePreset(p.id)}
                    >
                      <Text
                        style={[
                          styles.presetPillText,
                          selectedTimePreset === p.id && styles.presetPillTextActive,
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedTimePreset === 'ozel' && (
                  <TextInput
                    style={[styles.textInput, { marginTop: 8 }]}
                    placeholder="Örn: 15 Haziran 2027, 18:00"
                    placeholderTextColor="#998"
                    value={customTimeLabel}
                    onChangeText={setCustomTimeLabel}
                  />
                )}
              </View>
            )}
          </View>

          {/* KİLİT 2: MEKAN KİLİDİ */}
          <View style={styles.lockBox}>
            <View style={styles.lockHeaderRow}>
              <View style={styles.lockTitleRow}>
                <Text style={styles.lockIcon}>📍</Text>
                <Text style={styles.lockTitle}>Mekan Kilidi</Text>
              </View>
              <Switch
                value={locationLockEnabled}
                onValueChange={setLocationLockEnabled}
                trackColor={{ false: '#D4C6B6', true: colors.burgundy }}
                thumbColor={locationLockEnabled ? colors.parchment : '#F4F3F4'}
              />
            </View>

            {locationLockEnabled && (
              <View style={styles.lockDetails}>
                <Text style={styles.inputLabel}>Açılacağı Mekan / Konum *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Örn: Moda Sahil, Okul Bahçesi..."
                  placeholderTextColor="#998"
                  value={locationName}
                  onChangeText={setLocationName}
                />
              </View>
            )}
          </View>

          {/* KİLİT 3: ŞİFRE / BİLMECE KİLİDİ */}
          <View style={styles.lockBox}>
            <View style={styles.lockHeaderRow}>
              <View style={styles.lockTitleRow}>
                <Text style={styles.lockIcon}>🧩</Text>
                <Text style={styles.lockTitle}>Şifre / Gizli Soru Kilidi</Text>
              </View>
              <Switch
                value={riddleLockEnabled}
                onValueChange={setRiddleLockEnabled}
                trackColor={{ false: '#D4C6B6', true: colors.burgundy }}
                thumbColor={riddleLockEnabled ? colors.parchment : '#F4F3F4'}
              />
            </View>

            {riddleLockEnabled && (
              <View style={styles.lockDetails}>
                <Text style={styles.inputLabel}>Gizli Soru *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Arkadaşlarının bileceği bir soru sor..."
                  placeholderTextColor="#998"
                  value={riddleQuestion}
                  onChangeText={setRiddleQuestion}
                />

                <Text style={styles.inputLabel}>Doğru Cevap (Şifre) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Kilidi açacak cevabı yaz..."
                  placeholderTextColor="#998"
                  value={riddleAnswer}
                  onChangeText={setRiddleAnswer}
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>İpucu (İsteğe bağlı)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Küçük bir ipucu..."
                  placeholderTextColor="#998"
                  value={riddleHint}
                  onChangeText={setRiddleHint}
                />
              </View>
            )}
          </View>
        </View>

        {/* 3. BÖLÜM: İLK SCRAPBOOK ANISINI EKLE */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>3. Anı Ekle</Text>
          <Text style={styles.sectionSubtitle}>
            Kapsülünün içine koyacağın ilk parçayı hazırla:
          </Text>

          <View style={styles.memoryTypeRow}>
            {[
              { id: 'polaroid', label: '📸 Polaroid' },
              { id: 'cassette', label: '🎙️ Ses Kasedi' },
              { id: 'postit', label: '📌 Post-it Not' },
            ].map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.memoryTypeBtn,
                  memoryType === m.id && styles.memoryTypeBtnActive,
                ]}
                onPress={() => setMemoryType(m.id)}
              >
                <Text
                  style={[
                    styles.memoryTypeBtnText,
                    memoryType === m.id && styles.memoryTypeBtnTextActive,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {memoryType === 'polaroid' && (
            <View style={styles.memoryFormBox}>
              <TouchableOpacity style={styles.pickPhotoBtn} onPress={handlePickImage}>
                <Text style={styles.pickPhotoBtnText}>
                  {pickedImageUri ? '📷 Fotoğrafı Değiştir' : '📷 Galeriden Fotoğraf Seç'}
                </Text>
              </TouchableOpacity>

              {pickedImageUri && (
                <View style={styles.pickedPreviewWrap}>
                  <Image source={{ uri: pickedImageUri }} style={styles.pickedPreviewImg} />
                </View>
              )}

              <Text style={styles.inputLabel}>Fotoğraf Altı Yazısı</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Bu kareye bir not düş..."
                placeholderTextColor="#998"
                value={polaroidCaption}
                onChangeText={setPolaroidCaption}
              />

              <Text style={styles.inputLabel}>Washi Bant Rengi:</Text>
              <View style={styles.tapeColorsRow}>
                {[
                  { name: 'Kraft', color: colors.washiKraft },
                  { name: 'Gül', color: colors.washiRose },
                  { name: 'Adaçayı', color: colors.washiSage },
                  { name: 'Ekose', color: colors.washiCheck },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.name}
                    style={[
                      styles.tapeColorItem,
                      { backgroundColor: t.color },
                      tapeColor === t.color && styles.tapeColorItemActive,
                    ]}
                    onPress={() => setTapeColor(t.color)}
                  >
                    <Text style={styles.tapeItemText}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {memoryType === 'cassette' && (
            <View style={styles.memoryFormBox}>
              <Text style={styles.inputLabel}>Kaset Başlığı</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ses kaydına bir isim ver..."
                placeholderTextColor="#998"
                value={cassetteTitle}
                onChangeText={setCassetteTitle}
              />
            </View>
          )}

          {memoryType === 'postit' && (
            <View style={styles.memoryFormBox}>
              <Text style={styles.inputLabel}>Post-it Notun</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Notunu buraya yaz..."
                placeholderTextColor="#998"
                value={postItContent}
                onChangeText={setPostItContent}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.inputLabel}>Kağıt Rengi:</Text>
              <View style={styles.tapeColorsRow}>
                {[
                  { name: 'Sarı', color: '#FFF6D1' },
                  { name: 'Pembe', color: '#FCE4EC' },
                  { name: 'Mavi', color: '#E1F5FE' },
                  { name: 'Yeşil', color: '#E8F5E9' },
                ].map((c) => (
                  <TouchableOpacity
                    key={c.name}
                    style={[
                      styles.tapeColorItem,
                      { backgroundColor: c.color },
                      postItColor === c.color && styles.tapeColorItemActive,
                    ]}
                    onPress={() => setPostItColor(c.color)}
                  >
                    <Text style={styles.tapeItemText}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 4. MÜHÜRLE BUTONU */}
        <TouchableOpacity style={styles.sealButton} onPress={handleSealCapsule} activeOpacity={0.85}>
          <Text style={styles.sealButtonStar}>✦</Text>
          <Text style={styles.sealButtonText}>Kapsülü Mühürle & Oluştur 🎀</Text>
          <Text style={styles.sealButtonStar}>✦</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  previewBanner: {
    backgroundColor: colors.burgundyDark,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.goldStar,
  },
  previewLabel: {
    color: colors.parchment,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  previewBadge: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: colors.burgundy,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardSection: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.burgundyDark,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: colors.parchment,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFE7DA',
  },
  switchTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  switchTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  switchSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  groupAddArea: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFE7DA',
  },
  addFriendRow: {
    flexDirection: 'row',
    gap: 8,
  },
  friendInput: {
    flex: 1,
  },
  addFriendBtn: {
    backgroundColor: colors.burgundy,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  friendChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  friendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBE2D4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  friendChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 6,
  },
  removeChipText: {
    fontSize: 12,
    color: colors.burgundy,
    fontWeight: '800',
  },
  lockBox: {
    backgroundColor: colors.parchment,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
    marginTop: 10,
  },
  lockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  lockTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  lockDetails: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E6D9C6',
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  presetPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  presetPillActive: {
    backgroundColor: colors.burgundy,
    borderColor: colors.burgundyDark,
  },
  presetPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  presetPillTextActive: {
    color: '#FFF',
  },
  memoryTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  memoryTypeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.parchment,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  memoryTypeBtnActive: {
    backgroundColor: colors.burgundy,
    borderColor: colors.burgundyDark,
  },
  memoryTypeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  memoryTypeBtnTextActive: {
    color: '#FFF',
  },
  memoryFormBox: {
    marginTop: 6,
  },
  pickPhotoBtn: {
    backgroundColor: colors.parchment,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.burgundy,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  pickPhotoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.burgundy,
  },
  pickedPreviewWrap: {
    alignItems: 'center',
    marginVertical: 8,
  },
  pickedPreviewImg: {
    width: 180,
    height: 135,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  tapeColorsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  tapeColorItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  tapeColorItemActive: {
    borderWidth: 2,
    borderColor: colors.burgundy,
  },
  tapeItemText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
  sealButton: {
    backgroundColor: colors.burgundy,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.goldStar,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 8,
  },
  sealButtonStar: {
    color: colors.goldStar,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sealButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
