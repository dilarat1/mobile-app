// Zaman Kapsülü Veri Modeli
// Kullanıcının belirttiği tüm modüler kilit kombinasyonlarını ve grup kapsüllerini içerir.

export const mockCapsules = [
  {
    id: 'cap_1',
    title: '🎓 YBS 2027 Büyük Mezuniyet Kapsülü',
    description: '4 koca senenin tüm kahkahaları, uykusuz vize geceleri ve anıları burada toplanıyor!',
    author: {
      name: 'Dilara & Melis',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    createdAt: '15 Ekim 2024',
    isPublic: true,
    isGroup: true,
    collaborators: ['Dilara T.', 'Melis K.', 'Zeki Hoca', 'Emre B.', 'Selin A.', 'Can Y.'],
    collaboratorCount: 6,
    
    // KİLİT KOMBİNASYONU: Zaman + Mekan + Şifre (Üçlü Tam Kilit)
    lockType: 'time_location_riddle',
    locks: {
      time: {
        enabled: true,
        targetDate: '2027-06-20T17:00:00',
        label: '20 Haziran 2027, 17:00',
        remainingDays: 572,
      },
      location: {
        enabled: true,
        name: 'İÜ Beyazıt Ana Kampüs / Rektörlük Bahçesi 🏛️',
        distanceMeters: 450,
        isNearby: false,
      },
      riddle: {
        enabled: true,
        question: 'YBS2006 Mobil derste Zeki Hoca\'nın tahtaya yazdığı ilk kod neydi?',
        hint: 'Konsol çıktısı...',
        answer: 'Hello World',
        isSolved: false,
      },
    },
    isUnlocked: false,
    memoryCount: 14,
    previewCover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
    tag: 'Grup Kapsülü • 🎓 Mezuniyet',
  },

  {
    id: 'cap_2',
    title: '🕵️‍♀️ Gizli Doğum Günü Mektubu',
    description: 'Bunu sadece o gün benimle olan ve gizli soruyu doğru bilen açabilir...',
    author: {
      name: 'Selin A.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    createdAt: '22 Kasım 2024',
    isPublic: false,
    isGroup: false,
    collaboratorCount: 1,

    // KİLİT KOMBİNASYONU: Sadece Şifre / Bilmece (Tek Kilit)
    lockType: 'riddle',
    locks: {
      time: { enabled: false },
      location: { enabled: false },
      riddle: {
        enabled: true,
        question: 'İlk tanıştığımız gün Kadıköy\'de içtiğimiz kahve neydi?',
        hint: 'Fındıklı bir şey...',
        answer: 'Hazelnut Latte',
        isSolved: false,
      },
    },
    isUnlocked: false,
    memoryCount: 3,
    previewCover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
    tag: 'Özel Kapsül • 🗝️ Şifreli',
  },

  {
    id: 'cap_3',
    title: '☕ Vize Sonrası İtiraf Kaseti 🎙️',
    description: 'Mobil Programlama vizesinden çıktığımız an kaydettiğimiz ses kaydı ve fotoğraflar!',
    author: {
      name: 'Emre B.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    createdAt: '03 Kasım 2024',
    isPublic: true,
    isGroup: true,
    collaborators: ['Emre B.', 'Dilara T.', 'Kaan D.'],
    collaboratorCount: 3,

    // KİLİT KOMBİNASYONU: Zaman + Şifre (İkili Kilit)
    lockType: 'time_riddle',
    locks: {
      time: {
        enabled: true,
        targetDate: '2025-01-15T12:00:00',
        label: '15 Ocak 2025 (Final Günü)',
        remainingDays: 51,
      },
      location: { enabled: false },
      riddle: {
        enabled: true,
        question: 'Sınavın 3. sorusundaki sayacın adı neydi?',
        hint: 'State içindeki değişken...',
        answer: 'counter',
        isSolved: false,
      },
    },
    isUnlocked: false,
    memoryCount: 5,
    previewCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
    tag: 'Grup Kapsülü • 🎙️ Sesli Kaset',
  },

  {
    id: 'cap_4',
    title: '🏛️ Sahaflar Çarşısı Gizli Anısı',
    description: 'Sadece o meydana gidip çınar altındaki banka oturanlar bu anıyı görebilir!',
    author: {
      name: 'Melis K.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
    createdAt: '18 Ekim 2024',
    isPublic: true,
    isGroup: false,
    collaboratorCount: 1,

    // KİLİT KOMBİNASYONU: Sadece Mekan (Konum Bazlı Kilit)
    lockType: 'location',
    locks: {
      time: { enabled: false },
      location: {
        enabled: true,
        name: 'Beyazıt Sahaflar Çarşısı Tarihi Kapısı 📚',
        distanceMeters: 80,
        isNearby: true, // Kullanıcı şu an yakın!
      },
      riddle: { enabled: false },
    },
    isUnlocked: false,
    memoryCount: 4,
    previewCover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600',
    tag: 'Mekan Kapsülü • 📍 Konum Şartı',
  },

  {
    id: 'cap_5',
    title: '💌 1 Yıl Sonraki Kendime Mektup',
    description: 'Gelecekteki ben, umarım React Native projeni A+ ile vermişsindir!',
    author: {
      name: 'Dilara T.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    createdAt: '01 Ocak 2025',
    isPublic: false,
    isGroup: false,
    collaboratorCount: 1,

    // KİLİT KOMBİNASYONU: Sadece Zaman (Klasik Zaman Kapsülü)
    lockType: 'time',
    locks: {
      time: {
        enabled: true,
        targetDate: '2026-01-01T00:00:00',
        label: '1 Ocak 2026',
        remainingDays: 402,
      },
      location: { enabled: false },
      riddle: { enabled: false },
    },
    isUnlocked: false,
    memoryCount: 2,
    previewCover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    tag: 'Kişisel Kapsül • ⏳ Zaman Kilidi',
  },

  {
    id: 'cap_6',
    title: '🍕 Kampüs Arkası Dilim Pizza Masası',
    description: 'Sadece pizzacıya oturup garsonun adını bilen dostlar bu albümü açabilir!',
    author: {
      name: 'Kaan D.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    createdAt: '10 Kasım 2024',
    isPublic: true,
    isGroup: true,
    collaborators: ['Kaan D.', 'Dilara T.', 'Melis K.'],
    collaboratorCount: 3,

    // KİLİT KOMBİNASYONU: Mekan + Şifre (İkili Kilit)
    lockType: 'location_riddle',
    locks: {
      time: { enabled: false },
      location: {
        enabled: true,
        name: 'Vezneciler Nostalji Pizza & Cafe 🍕',
        distanceMeters: 620,
        isNearby: false,
      },
      riddle: {
        enabled: true,
        question: 'Sürekli sipariş verdiğimiz büyük boy pizzanın adı neydi?',
        hint: 'Dört peynirli...',
        answer: 'Quattro Formaggi',
        isSolved: false,
      },
    },
    isUnlocked: false,
    memoryCount: 6,
    previewCover: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
    tag: 'Grup Kapsülü • 📍 Mekan + 🧩 Şifre',
  },

  // 7. KAPSÜL: KİLİDİ AÇILMIŞ (UNLOCKED) ÖRNEK!
  // Kullanıcının albüm, kaset, polaroid ve post-it scrapbook deneyimini hemen görebilmesi için:
  {
    id: 'cap_unlocked_1',
    title: '🍂 Belgrad Ormanı Sonbahar Pikniği',
    description: 'Kilidi açıldı! Bütün polaroidler, gülüşmeler ve ses kasetimiz burada ✨',
    author: {
      name: 'Dilara & Arkadaşları',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    createdAt: '12 Ekim 2024',
    isPublic: true,
    isGroup: true,
    collaborators: ['Dilara T.', 'Melis K.', 'Emre B.'],
    collaboratorCount: 3,

    lockType: 'time',
    locks: {
      time: { enabled: true, label: 'Açıldı (15 Kasım 2024)' },
      location: { enabled: false },
      riddle: { enabled: false },
    },
    isUnlocked: true, // AÇILDI! 🎉
    memoryCount: 4,
    previewCover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    tag: 'Açıldı • 🎀 Scrapbook Albümü',

    // İÇERİK: Scrapbook parçaları (Polaroid, Kaset, Post-it)
    memories: [
      {
        id: 'mem_1',
        type: 'polaroid',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
        caption: 'Hazan yaprakları ve en güzel dostlar 🍁',
        date: '12 Ekim 2024',
        rotation: '-3deg',
        tapeColor: '#E2CA9E',
      },
      {
        id: 'mem_2',
        type: 'cassette',
        title: 'Gitar Eşliğinde Şarkı Söyleyişimiz 🎵',
        duration: '02:18',
        author: 'Emre B.',
        audioUrl: 'mock_audio_url',
      },
      {
        id: 'mem_3',
        type: 'postit',
        content: 'Termostaki çayı döken Melis\'i asla unutmayacağız 😂 Ama sandviçler harikaydı! Seneye tekrarı şart!',
        color: '#FFF6D1',
        author: 'Dilara T.',
        pinColor: '#B82633',
      },
      {
        id: 'mem_4',
        type: 'polaroid',
        image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600',
        caption: 'Günün batışı ve kamp ateşi başı 🔥',
        date: '12 Ekim 2024',
        rotation: '2.5deg',
        tapeColor: '#D9989B',
      },
    ],
  },
];
