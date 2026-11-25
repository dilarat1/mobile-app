# ⏳ TimeCapsule (Zaman Kapsülü & Nostalji Albümü) 🎀

**YBS2006 Mobil Uygulama Geliştirme — Final Projesi**  
*İstanbul Üniversitesi / Yönetim Bilişim Sistemleri (MIS)*  
*Öğrenci: Dilara Toraman*  
*Ders Yürütücüsü: Dr. Zeki Özen*  

---

## 📖 1. Proje Özeti & Konsept
**TimeCapsule**, kişilerin ve arkadaş gruplarının anılarını (fotoğraflar, ses kayıtları, post-it notları) geleceğe veya belirli koşullara mühürleyip saklayabildiği, sıcacık bir **vintage scrapbook (anı defteri)** estetiğine sahip hibrit bir mobil uygulamadır.

Instagram tarzı bir **kamusal/topluluk akışı** ile WhatsApp tarzı **ortak grup kapsülleri** konseptini birleştirir.

---

## 🎨 2. Tasarım Dili (Cozy Vintage Scrapbook)
- **Pötikare (Gingham) Kumaş Dokuları:** Bordo (`#731C28`), krem parşömen (`#FAF7F2`) ve vintage lacivert (`#283B4F`) desenler.
- **Fisto & Dantel Detayları:** Üst başlıklarda ve kart kenarlarında nostaljik dantel işlemeleri.
- **Kırmızı Kurdele Fiyonkları (`🎀`) ve Altın Pırıltılar (`✦`):** Sıcak ve samimi bir atmosfer.
- **Scrapbook İçerik Bileşenleri:**
  - 📸 **Instax / Polaroid (`InstaxFrame.js`):** Washi bantlı, hafif eğik açılı fotoğraf kartları.
  - 🎙️ **Retro Kaset Çalar (`CassettePlayer.js`):** Dönen makaralarıyla çalınabilir nostaljik ses kayıtları.
  - 📌 **Post-it Notları (`PostItNote.js`):** Kırmızı iğneli, el yazısı fontlu anı ve itiraf kağıtları.

---

## 🔐 3. Modüler Kilit Sistemi (Flexible Modular Locks)
Bir kapsül oluşturulurken aşağıdaki kilit şartlarından herhangi biri veya hepsi bir arada seçilebilir:

1. **Sadece Zaman Kilidi (`time`):** Belirlenen tarihe kadar açılmaz (Örn: *1 Yıl Sonraki Kendime Mektup*).
2. **Sadece Mekan Kilidi (`location`):** Belirlenen GPS koordinatına ve yarıçapa girilmeden açılmaz (Örn: *Sahaflar Çarşısı Tarihi Kapısı*).
3. **Sadece Şifre / Bilmece Kilidi (`riddle`):** Gizli soruya doğru cevabı verenler anında açabilir (Örn: *Gizli Doğum Günü Mektubu*).
4. **Zaman + Şifre Kombinasyonu:** Zamanı gelse bile şifreyi bilmeyen açamaz.
5. **Zaman + Mekan Kombinasyonu:** Zamanı geldiğinde sadece o mekanda bulunanlar açabilir.
6. **Mekan + Şifre Kombinasyonu:** Belirlenen mekana gidip şifreyi çözenler açabilir.
7. **Zaman + Mekan + Şifre (Üçlü Tam Kilit):** En yüksek güvenlikli mezuniyet kapsülleri (Örn: *YBS 2027 Mezuniyet Kapsülü*).

---

## 📱 4. Ekran Mimarisi & Sayfalar
1. **📜 1. Ekran: Akış (FeedScreen):**
   - Topluluk ve arkadaş kapsüllerinin listelendiği akış.
   - Gerçek zamanlı arama ve filtreleme hapları (*Tümü*, *Grupça*, *Kilitli*, *Açılanlar*).
   - Kart üzerinde hızlı beğeni/kalp ve anı ekleme etkileşimi.
2. **✨ 2. Ekran: Kapsül Oluştur (CreateScreen):**
   - Canlı kilit önizleme bandı (`MÜHÜR TÜRÜ: Zaman + Mekan + Şifre`).
   - WhatsApp tarzı arkadaş grubu seçimi ve katılımcı etiket çipleri.
   - Modüler kilit anahtarları (Tarih butonları, mekan seçici, gizli soru & cevap alanları).
   - İlk anıyı seçme (Polaroid + washi bant rengi, ses kasedi veya post-it).
3. **💌 3. Ekran: Özelim & Grup Kutusu (InboxScreen):**
   - Kullanıcıya ve ait olduğu gruplara özel mühürlü davet kutusu.
   - *Grup Kapsüllerim* ve *Kişisel Mühürlerim* sekmeli görünümü.
4. **🎉 4. Ekran / Modal: Kapsül Açılışı & Scrapbook Detayı (CapsuleDetailModal):**
   - Kilit açma simülasyonu (şifre çözücü, konum kontrolü, geri sayım).
   - Açılan kapsül için altın yıldızlı kutlama başlığı.
   - Polaroid galerisi, çalınabilir kasetler, iliştirilmiş post-it'ler ve yeni anı ekleme formu.

---

## 💾 5. Veri Kalıcılığı (AsyncStorage)
- `@react-native-async-storage/async-storage` entegrasyonu sayesinde:
  - Yeni oluşturulan kapsüller,
  - Çözülen kilitler,
  - Eklenen yeni anılar ve beğeniler  
  cihaz hafızasında kalıcı olarak saklanır, uygulama kapatılıp açılsa bile kaybolmaz.

---

## 🛠️ 6. Kurulum ve Çalıştırma

```bash
# 1. Depoyu klonlayın
git clone https://github.com/dilarat1/mobile-app.git
cd mobile-app

# 2. Bağımlılıkları yükleyin
npm install

# 3. Expo geliştirici sunucusunu başlatın
npx expo start
```

Expo Go mobil uygulaması üzerinden QR kodu taratarak Android veya iOS cihazınızda canlı olarak test edebilirsiniz.
