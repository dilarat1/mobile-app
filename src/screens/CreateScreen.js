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
} from 'react-native';
import { colors } from '../theme/colors';
import GinghamHeader from '../components/GinghamHeader';

export default function CreateScreen({ onCapsuleCreated }) {
  // 1. Temel Bilgiler
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGroup, setIsGroup] = useState(true);
  const [friendName, setFriendName] = useState('');
  const [collaborators, setCollaborators] = useState(['Dilara T. (Sen)', 'Melis K.', 'Emre B.']);

  // 2. Modüler Kilit State'leri
  const [timeLockEnabled, setTimeLockEnabled] = useState(true);
  const [selectedTimePreset, setSelectedTimePreset] = useState('mezuniyet'); // '1hafta', 'final', '1yil', 'mezuniyet'
  
  const [locationLockEnabled, setLocationLockEnabled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('İÜ Beyazıt Kampüsü / Rektörlük Bahçesi');

  const [riddleLockEnabled, setRiddleLockEnabled] = useState(false);
  const [riddleQuestion, setRiddleQuestion] = useState('');
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleHint, setRiddleHint] = useState('');

  // 3. İlk Anı / Scrapbook Öğesi
  const [memoryType, setMemoryType] = useState('polaroid'); // 'polaroid', 'cassette', 'postit'
  const [polaroidCaption, setPolaroidCaption] = useState('');
  const [tapeColor, setTapeColor] = useState(colors.washiKraft);
  const [cassetteTitle, setCassetteTitle] = useState('');
  const [postItContent, setPostItContent] = useState('');
  const [postItColor, setPostItColor] = useState('#FFF6D1');

  // Arkadaş ekleme
  const handleAddFriend = () => {
    if (!friendName.trim()) return;
    if (collaborators.includes(friendName.trim())) {
      Alert.alert('Uyarı', 'Bu arkadaş zaten ekli!');
      return;
    }
    setCollaborators([...collaborators, friendName.trim()]);
    setFriendName('');
  };

  // Arkadaş silme
  const handleRemoveFriend = (name) => {
    if (name.includes('(Sen)')) return;
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

  // Kapsülü Mühürle & Kaydet
  const handleSealCapsule = () => {
    if (!title.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen kapsülüne bir başlık ver!');
      return;
    }

    if (!timeLockEnabled && !locationLockEnabled && !riddleLockEnabled) {
      Alert.alert('Kilit Seçimi', 'Lütfen en az bir kilit türü (Zaman, Mekan veya Şifre) seç!');
      return;
    }

    if (riddleLockEnabled && (!riddleQuestion.trim() || !riddleAnswer.trim())) {
      Alert.alert('Eksik Bilgi', 'Şifre kilidi için hem gizli soruyu hem de doğru cevabı girmelisin.');
      return;
    }

    // Seçilen zaman etiketini belirleme
    const timeLabels = {
      '1hafta': '7 Gün Sonra',
      'final': 'Final Sınavları Sonu (15 Ocak 2025)',
      '1yil': '1 Yıl Sonra (1 Ocak 2026)',
      'mezuniyet': 'Mezuniyet Günü (20 Haziran 2027)',
    };

    // İlk anıyı hazırla
    const initialMemories = [];
    if (memoryType === 'polaroid') {
      initialMemories.push({
        id: `mem_${Date.now()}_1`,
        type: 'polaroid',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
        caption: polaroidCaption || 'Kapsülün ilk polaroid karesi ✨',
        date: 'Bugün',
        rotation: '-2deg',
        tapeColor: tapeColor,
      });
    } else if (memoryType === 'cassette') {
      initialMemories.push({
        id: `mem_${Date.now()}_1`,
        type: 'cassette',
        title: cassetteTitle || 'Geleceğe İlk Ses Mesajı 🎙️',
        duration: '01:15',
        author: 'Dilara T.',
      });
    } else if (memoryType === 'postit') {
      initialMemories.push({
        id: `mem_${Date.now()}_1`,
        type: 'postit',
        content: postItContent || 'Bu kapsülü açtığımız gün umarım hepimiz çok mutluyuzdur! ✨',
        author: 'Dilara T.',
        color: postItColor,
        pinColor: colors.pinRed,
      });
    }

    const newCapsule = {
      id: `cap_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Bu kapsülde dostluklar ve geleceğe saklanan anılar var...',
      author: {
        name: 'Dilara T.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      createdAt: 'Bugün',
      isPublic: true,
      isGroup: isGroup,
      collaborators: isGroup ? collaborators : ['Dilara T.'],
      collaboratorCount: isGroup ? collaborators.length : 1,
      lockType: 'custom',
      locks: {
        time: {
          enabled: timeLockEnabled,
          label: timeLabels[selectedTimePreset] || 'İleri bir tarih',
          remainingDays: selectedTimePreset === '1hafta' ? 7 : selectedTimePreset === 'final' ? 51 : selectedTimePreset === '1yil' ? 365 : 572,
        },
        location: {
          enabled: locationLockEnabled,
          name: selectedLocation,
          distanceMeters: 350,
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
      isUnlocked: false,
      memoryCount: initialMemories.length,
      previewCover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
      tag: isGroup ? 'Grup Kapsülü • 👥 Ortak' : 'Özel Kapsül • 🔒 Kişisel',
      memories: initialMemories,
    };

    if (onCapsuleCreated) {
      onCapsuleCreated(newCapsule);
    }

    Alert.alert(
      '🎀 Kapsül Mühürlendi!',
      `"${newCapsule.title}" başarıyla kilitlendi ve Akış'a eklendi!`,
      [{ text: 'Akışa Git', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      <GinghamHeader
        title="Yeni Kapsül Oluştur"
        subtitle="✨ Geleceğe mühürlenecek anını tasarla ✨"
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
            placeholder="Örn: 🎓 YBS 2027 Mezuniyet Hatırası"
            placeholderTextColor="#998"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.inputLabel}>Açıklama / Mesaj</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Bu kapsülde neler var? Geleceğe veya arkadaşlarına bir not bırak..."
            placeholderTextColor="#998"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* Kapsül Türü Seçimi: Grup vs Tekil */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>👥 Arkadaş Grubu Kapsülü (WhatsApp Tarzı)</Text>
              <Text style={styles.switchSub}>
                {isGroup
                  ? 'Arkadaşların kilit açılana kadar bu kapsüle kendi anılarını ekleyebilir.'
                  : 'Sadece sana özel, tek kişilik kişisel bir zaman kapsülü.'}
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
              <Text style={styles.inputLabel}>Grup Arkadaşlarını Dahil Et</Text>
              <View style={styles.addFriendRow}>
                <TextInput
                  style={[styles.textInput, styles.friendInput]}
                  placeholder="Arkadaşının adı (Örn: Zeki Hoca)..."
                  placeholderTextColor="#998"
                  value={friendName}
                  onChangeText={setFriendName}
                />
                <TouchableOpacity style={styles.addFriendBtn} onPress={handleAddFriend}>
                  <Text style={styles.addFriendBtnText}>＋ Ekle</Text>
                </TouchableOpacity>
              </View>

              {/* Ekli Arkadaşlar Çipleri */}
              <View style={styles.friendChipsWrap}>
                {collaborators.map((c) => (
                  <View key={c} style={styles.friendChip}>
                    <Text style={styles.friendChipText}>{c}</Text>
                    {!c.includes('(Sen)') && (
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
          <Text style={styles.sectionTitle}>2. Modüler Kilit Seçimi</Text>
          <Text style={styles.sectionSubtitle}>
            İster sadece birini, ister ikisini, istersen üçünü birden seçebilirsin!
          </Text>

          {/* KİLİT 1: ZAMAN KİLİDİ */}
          <View style={styles.lockBox}>
            <View style={styles.lockHeaderRow}>
              <View style={styles.lockTitleRow}>
                <Text style={styles.lockIcon}>⏳</Text>
                <Text style={styles.lockTitle}>Zaman Kilidi (Geri Sayım)</Text>
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
                <Text style={styles.presetLabel}>Açılış Tarihi Seç:</Text>
                <View style={styles.presetPillsRow}>
                  {[
                    { id: '1hafta', label: '1 Hafta Sonra' },
                    { id: 'final', label: 'Final Sonu 🎓' },
                    { id: '1yil', label: '1 Yıl Sonra 📅' },
                    { id: 'mezuniyet', label: 'Mezuniyet 2027 🌟' },
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
              </View>
            )}
          </View>

          {/* KİLİT 2: MEKAN KİLİDİ */}
          <View style={styles.lockBox}>
            <View style={styles.lockHeaderRow}>
              <View style={styles.lockTitleRow}>
                <Text style={styles.lockIcon}>📍</Text>
                <Text style={styles.lockTitle}>Mekan Kilidi (Konum Şartı)</Text>
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
                <Text style={styles.presetLabel}>Açılacağı Konumu Seç:</Text>
                {[
                  'İÜ Beyazıt Kampüsü / Rektörlük Bahçesi',
                  'YBS Bölümü / Amfi 2',
                  'Beyazıt Sahaflar Çarşısı Tarihi Kapısı',
                  'Kadıköy Rıhtım / Çay Bahçeleri',
                ].map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[
                      styles.locationOption,
                      selectedLocation === loc && styles.locationOptionActive,
                    ]}
                    onPress={() => setSelectedLocation(loc)}
                  >
                    <Text style={styles.locDot}>
                      {selectedLocation === loc ? '◉' : '○'}
                    </Text>
                    <Text
                      style={[
                        styles.locationOptionText,
                        selectedLocation === loc && styles.locationOptionTextActive,
                      ]}
                    >
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* KİLİT 3: ŞİFRE / BİLMECE KİLİDİ */}
          <View style={styles.lockBox}>
            <View style={styles.lockHeaderRow}>
              <View style={styles.lockTitleRow}>
                <Text style={styles.lockIcon}>🧩</Text>
                <Text style={styles.lockTitle}>Şifre / Bilmece Kilidi</Text>
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
                <Text style={styles.inputLabel}>Gizli Soru / Bilmece *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Örn: İlk kahvemizi nerede içtik?"
                  placeholderTextColor="#998"
                  value={riddleQuestion}
                  onChangeText={setRiddleQuestion}
                />

                <Text style={styles.inputLabel}>Doğru Cevap (Kilidi Açan Şifre) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Örn: Kadıköy Moda"
                  placeholderTextColor="#998"
                  value={riddleAnswer}
                  onChangeText={setRiddleAnswer}
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>İpucu (Opsiyonel)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Örn: Deniz kenarındaki o eski çay bahçesi..."
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
          <Text style={styles.sectionTitle}>3. İlk Scrapbook Anısı (Taslak)</Text>
          <Text style={styles.sectionSubtitle}>
            Kapsülün içine koyacağın ilk anıyı seç:
          </Text>

          {/* Anı Türü Seçimi */}
          <View style={styles.memoryTypeRow}>
            {[
              { id: 'polaroid', label: '📸 Polaroid', icon: '📸' },
              { id: 'cassette', label: '🎙️ Ses Kasedi', icon: '🎙️' },
              { id: 'postit', label: '📌 Post-it Not', icon: '📌' },
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

          {/* Polaroid Formu */}
          {memoryType === 'polaroid' && (
            <View style={styles.memoryFormBox}>
              <Text style={styles.inputLabel}>Polaroid Altı El Yazısı Açıklaması</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Örn: Kampüs bahçesinde ilk günümüz... 🌿"
                placeholderTextColor="#998"
                value={polaroidCaption}
                onChangeText={setPolaroidCaption}
              />

              <Text style={styles.inputLabel}>Washi Bant Rengi Seç:</Text>
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

          {/* Ses Kasedi Formu */}
          {memoryType === 'cassette' && (
            <View style={styles.memoryFormBox}>
              <Text style={styles.inputLabel}>Ses Kaydı Başlığı</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Örn: Ders Çıkışı Kahkaha Krizimiz 🎙️"
                placeholderTextColor="#998"
                value={cassetteTitle}
                onChangeText={setCassetteTitle}
              />
              <Text style={styles.mockVoiceTip}>
                🎙️ Mikrofon izniyle ses kaydı kapsüle iliştirilecek.
              </Text>
            </View>
          )}

          {/* Post-it Formu */}
          {memoryType === 'postit' && (
            <View style={styles.memoryFormBox}>
              <Text style={styles.inputLabel}>Post-it Üzerine Yazılacak Not</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Örn: Bu sınav da bitti ya, mezuniyet garanti artık! ✨"
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
          <Text style={styles.sealButtonText}>Kapsülü Mühürle & Kilitle 🎀</Text>
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
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  locationOptionActive: {
    backgroundColor: 'rgba(115, 28, 40, 0.06)',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  locDot: {
    fontSize: 14,
    color: colors.burgundy,
    marginRight: 6,
  },
  locationOptionText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  locationOptionTextActive: {
    fontWeight: '700',
    color: colors.burgundy,
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
  mockVoiceTip: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 6,
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
