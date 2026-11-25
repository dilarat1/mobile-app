# ⏳ TimeCapsule (Zaman Kapsülü & Nostalji Albümü) 🎀

**YBS2006 Mobil Uygulama Geliştirme — Final Projesi**  
*İstanbul Üniversitesi / Yönetim Bilişim Sistemleri (MIS)*  
*Öğrenci: Dilara Toraman*  
*Ders Yürütücüsü: Dr. Zeki Özen*  

---

## 📖 Proje Hakkında
**TimeCapsule**, kişilerin ve arkadaş gruplarının anılarını (fotoğraflar, ses kayıtları, notlar) geleceğe veya belirli koşullara mühürleyip saklayabildiği, sıcacık bir **vintage scrapbook (anı defteri)** estetiğine sahip hibrit bir mobil uygulamadır.

Instagram tarzı bir **kamusal/topluluk akışı** ile WhatsApp tarzı **ortak grup kapsülleri** konseptini birleştirir.

---

## 🎨 Tasarım Estetiği (Cozy Vintage Scrapbook)
- **Pötikare (Gingham) Kumaş Dokuları:** Bordo, parşömen kremi ve vintage lacivert desenler.
- **Fisto & Dantel Detayları:** Üst başlıklarda ve kart kenarlarında nostaljik dantel işlemeleri.
- **Kırmızı Kurdele Fiyonkları (`🎀`) ve Altın Pırıltılar (`✦`):** Sıcak ve samimi bir atmosfer.
- **Scrapbook İçerik Bileşenleri:**
  - 📸 **Instax / Polaroid:** Washi bantlı, hafif eğik açılı fotoğraf kartları.
  - 🎙️ **Retro Kaset Çalar:** Dönen makaralarıyla çalınabilir nostaljik ses kayıtları.
  - 📌 **Post-it Notları:** Kırmızı iğneli, el yazısı fontlu anı ve itiraf kağıtları.

---

## 🔐 Modüler Kilit Sistemi (Flexible Modular Locks)
Bir kapsül oluşturulurken aşağıdaki kilit şartlarından herhangi biri veya hepsi bir arada seçilebilir:

1. **Sadece Zaman Kilidi (`time`):** Belirlenen tarihe kadar açılmaz (Örn: *1 Yıl Sonraki Kendime Mektup*).
2. **Sadece Mekan Kilidi (`location`):** Belirlenen GPS koordinatına ve yarıçapa girilmeden açılmaz (Örn: *Sahaflar Çarşısı Tarihi Kapısı*).
3. **Sadece Şifre / Bilmece Kilidi (`riddle`):** Gizli soruya doğru cevabı verenler anında açabilir (Örn: *Gizli Doğum Günü Mektubu*).
4. **Zaman + Şifre Kombinasyonu:** Zamanı gelse bile şifreyi bilmeyen açamaz.
5. **Zaman + Mekan Kombinasyonu:** Zamanı geldiğinde sadece o mekanda bulunanlar açabilir.
6. **Mekan + Şifre Kombinasyonu:** Belirlenen mekana gidip şifreyi çözenler açabilir.
7. **Zaman + Mekan + Şifre (Üçlü Tam Kilit):** En yüksek güvenlikli mezuniyet kapsülleri (Örn: *YBS 2027 Mezuniyet Kapsülü*).

---

## 👥 Grupça Kapsül Oluşturma (WhatsApp Mantığı)
- Kapsüller tekil olarak oluşturulabildiği gibi arkadaş gruplarıyla ortak (`isGroup: true`) olarak da başlatılabilir.
- Kapsülün kilit açılış zamanına kadar davet edilen tüm arkadaşlar kapsüle **"➕ Anı Ekle"** butonuyla fotoğraf, ses kaydı veya post-it ekleyebilir.

---

## 📱 Ekran Mimarisi
1. **📜 Akış (Feed):** Topluluk ve arkadaş kapsüllerinin listelendiği, arama ve filtreleme yapılabilen ana akış.
2. **✨ Kapsül Yap (Create):** Modüler kilitlerin, grup arkadaşlarının ve anıların seçildiği form ekranı.
3. **💌 Özelim (Inbox):** Kullanıcıya ve ait olduğu gruplara özel mühürlü davet kutusu.

---

## 🛠️ Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Expo geliştirici sunucusunu başlatın
npx expo start
```

Expo Go mobil uygulaması üzerinden QR kodu taratarak veya Android / iOS emülatöründe anında test edebilirsiniz.
