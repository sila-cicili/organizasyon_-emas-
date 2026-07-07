/* ============================================================
   Esri Türkiye · Organizasyon Şeması — Uygulama Mantığı
   1) orgData (JSON)  →  2) ağaç kur  →  3) DOM render  →
   4) SVG kavisli bağlantılar  →  5) zoom/pan/arama etkileşimi
   ============================================================ */

/* ---------- 1) VERİ (id, name, title, parentId, [dept]) ---------- */
const orgData = [
  // Üst katman: Global → Distribütör → iki kol
  { id: 100, name: "Esri Global",         title: "",                             parentId: null, tier: "global",      icon: "global" },
  { id: 101, name: "Esri Türkiye",        title: "Yetkili Distribütör",          parentId: 100,  tier: "distributor", icon: "distributor" },
  { id: 102, name: "İç Organizasyon",     title: "Şirket Ekibi",                 parentId: 101,  tier: "section",     icon: "internal" },
  { id: 103, name: "Partner Ekosistemi",  title: "İş Ortakları",                 parentId: 101,  tier: "section",     icon: "partners", partner: true },

  // Üst yönetim (İç Organizasyon altında)
  { id: 1,  name: "Mehmet Tankut",        title: "",                           parentId: 102 },
  { id: 2,  name: "Barış Uz",             title: "CEO (Genel Müdür)",          parentId: 1 },

  // 1) İş Geliştirme ve Satış
  { id: 3,  name: "Evren Arın",           title: "İş Geliştirme Direktörü",    parentId: 2,  dept: "İş Geliştirme & Satış" },
  { id: 4,  name: "İrem Keserci",         title: "Ticari Sektör Müdürü",       parentId: 3 },
  { id: 5,  name: "Seçil Sualp",          title: "Ticari Sektör Satış Yön.",   parentId: 4 },
  { id: 6,  name: "Ece Ortak",            title: "Ticari Sektör Satış Yön. (Uzman)", parentId: 4 },
  { id: 7,  name: "Derya Karahasanoğlu",  title: "Enerji ve Altyapı Sektör Müdürü", parentId: 3 },
  { id: 8,  name: "Ümit Çokrak",          title: "Enerji ve Altyapı Satış Yön.", parentId: 7 },
  { id: 9,  name: "Nur Beyza Sağıroğlu",  title: "Enerji ve Altyapı Satış Yön.", parentId: 7 },
  { id: 10, name: "Ayberk Atabey",        title: "Kamu Sektörü Lideri",        parentId: 3 },
  { id: 11, name: "Emre Sezgin",          title: "Kamu Sektörü Satış Yön.",    parentId: 10 },
  { id: 12, name: "Ramazan Civelek",      title: "Kamu Sektörü Satış Yön.",    parentId: 10 },
  { id: 13, name: "Deniz Köfter",         title: "Yerel Yön. Sektör Kıdemli Müdürü", parentId: 3 },
  { id: 14, name: "Serhat Kaya",          title: "Yerel Yönetimler Satış Yön.", parentId: 13 },
  { id: 15, name: "Merve Balaban",        title: "Partner Yöneticisi (Expert)", parentId: 3 },
  { id: 16, name: "Selma Yakut",          title: "Savunma Sektörü Yöneticisi", parentId: 3 },
  { id: 17, name: "Suatcan Özkan",        title: "Satış Destek Uzmanı",        parentId: 3 },

  // 2) Profesyonel Hizmetler
  { id: 18, name: "Çağlar Uzuner",        title: "Profesyonel Hizmetler Grup Müdürü", parentId: 2, dept: "Profesyonel Hizmetler" },
  { id: 19, name: "Mahir Kuru",           title: "Altyapı & Enerji Teknik Lideri", parentId: 18 },
  { id: 20, name: "Meral Eryılmaz",       title: "Ticari Sektör Teknik Lideri", parentId: 18 },
  { id: 21, name: "Gönül Yıldız",         title: "Danışman / Senior Consultant", parentId: 18 },
  { id: 22, name: "Damla Yılmaz",         title: "Kıdemli Çözüm Mühendisi",    parentId: 18 },
  { id: 23, name: "Ayşe Sena Şahan",      title: "Çözüm Mühendisi (Uzman)",    parentId: 18 },
  { id: 24, name: "Ahmet Özcan",          title: "Çözüm Mühendisi",            parentId: 18 },
  { id: 25, name: "Ekin Şenol",           title: "Çözüm Mühendisi",            parentId: 18 },
  { id: 26, name: "Elif Çelikel Bilgin",  title: "Çözüm Mühendisi",            parentId: 18 },
  { id: 27, name: "Gürkan Turhal",        title: "Çözüm Müh. Uzman Yardımcısı", parentId: 18 },
  { id: 28, name: "Rana Yeşim Doğan",     title: "Çözüm Müh. Uzman Yardımcısı", parentId: 18 },

  // 3) Teknik Destek
  { id: 29, name: "Zühal Salyador",       title: "Teknik Destek Takım Lideri", parentId: 2, dept: "Teknik Destek" },
  { id: 30, name: "Ozan Can Talun",       title: "Teknik Destek Uzmanı",       parentId: 29 },
  { id: 31, name: "Fatih Çiçek",          title: "Teknik Destek Uzmanı",       parentId: 29 },
  { id: 32, name: "Betül Çalım",          title: "Teknik Destek Uzmanı",       parentId: 29 },
  { id: 33, name: "Batuhan Atlıhan",      title: "Sistem Destek Uzmanı",       parentId: 29 },
  { id: 34, name: "Oğuzhan Akçalı",       title: "Sistem Destek Uzman Yrd.",   parentId: 29 },

  // 4) Eğitim ve Akademi
  { id: 35, name: "Utku Şahin",           title: "Eğitim Müdürü",              parentId: 2, dept: "Eğitim & Akademi" },
  { id: 36, name: "Esra Aydın Demiröz",   title: "Eğitim Kıdemli Uzmanı",      parentId: 35 },
  { id: 37, name: "Arda Çetinkaya",       title: "Eğitim Kıdemli Uzmanı",      parentId: 35 },
  { id: 38, name: "Tuğçe Ateş",           title: "Eğitim Uzmanı",              parentId: 35 },
  { id: 39, name: "Ilgın Çiğdem",         title: "Eğitim Uzman Yardımcısı",    parentId: 35 },
  { id: 40, name: "İrfan Taşköprü",       title: "Eğitim Uzman Yardımcısı",    parentId: 35 },

  // 5) Müşteri Başarı
  { id: 41, name: "Kıvılcım Tezan Ocak",  title: "Müşteri Başarı Birim Müdürü", parentId: 2, dept: "Müşteri Başarı" },
  { id: 42, name: "Samet Erdem",          title: "Müşteri Başarı Kıdemli Uzmanı", parentId: 41 },
  { id: 43, name: "Seda Durav",           title: "Müşteri Başarı Uzmanı",      parentId: 41 },

  // 6) Pazarlama
  { id: 44, name: "Gülru Belül",          title: "Pazarlama Müdürü",           parentId: 2, dept: "Pazarlama" },
  { id: 45, name: "Aras Kılıç",           title: "Pazarlama Kıdemli Uzmanı",   parentId: 44 },
  { id: 46, name: "Sibel Özkan",          title: "Pazarlama Kıdemli Uzmanı",   parentId: 44 },
  { id: 47, name: "Cenk Doğu",            title: "Pazarlama Uzmanı",           parentId: 44 },

  // 7) İnsan ve Kültür (İK)
  { id: 48, name: "Gözde Önal",           title: "İnsan ve Kültür Müdürü",     parentId: 2, dept: "İnsan & Kültür" },
  { id: 49, name: "Işıl Çandıroğlu",      title: "Ofis Asistanı",              parentId: 48 },
  { id: 50, name: "Gökhan Öztürk",        title: "Lojistik Sorumlusu",         parentId: 48 },
  { id: 51, name: "Erkan Doğan",          title: "Lojistik Sorumlusu",         parentId: 48 },
  { id: 52, name: "Meral Bazna",          title: "Mutfak ve Servis Sorumlusu", parentId: 48 },

  // 8) Mali İşler
  { id: 53, name: "Mikail Demirci",       title: "Mali İşler Kıdemli Müdürü",  parentId: 2, dept: "Mali İşler" },
  { id: 54, name: "Serhan Sarıdede",      title: "Mali İşler Kıdemli Uzmanı",  parentId: 53 },
  { id: 55, name: "Aykut Korkut",         title: "Mali İşler Kıdemli Uzmanı",  parentId: 53 },

  // ---- PARTNER EKOSİSTEMİ (İş Ortakları) ----
  // Platin
  { id: 200, name: "Platin Partnerler",   title: "Platinum",   parentId: 103, ptier: "platin", icon: "award" },
  { id: 201, name: "MipMap",              title: "",           parentId: 200 },

  // Altın
  { id: 210, name: "Altın Partnerler",    title: "Gold",       parentId: 103, ptier: "altin", icon: "award" },
  { id: 211, name: "REMAP Teknoloji Çözümleri Ltd. Şti.", title: "", parentId: 210 },
  { id: 212, name: "Mapit Bilgi Teknolojileri A.Ş.",      title: "", parentId: 210 },
  { id: 213, name: "Geolab Bilgi Teknolojileri Ltd. Şti.",title: "", parentId: 210 },

  // Member (ızgara düzeninde)
  { id: 220, name: "Member Partnerler",   title: "Member",     parentId: 103, ptier: "member", icon: "award", grid: true },
  { id: 221, name: "Açı Bilişim Teknolojileri Yazılım Danışmanlık Hizmetleri", title: "", parentId: 220 },
  { id: 222, name: "Adres Harita San. ve Tic. Ltd. Şti.",     title: "", parentId: 220 },
  { id: 223, name: "Alkazar Mühendislik ve Danışmanlık Ltd. Şti.", title: "", parentId: 220 },
  { id: 224, name: "Anka IT Bilişim Teknolojileri Tic. Ltd. Şti.", title: "", parentId: 220 },
  { id: 225, name: "Aselmap Teknoloji Çözümleri",            title: "", parentId: 220 },
  { id: 226, name: "ASSYSTEM Enerji ve Çevre A.Ş.",          title: "", parentId: 220 },
  { id: 227, name: "EnerjiSA Enerji A.Ş.",                   title: "", parentId: 220 },
  { id: 228, name: "Frekans Çevre Ölçüm Müh. Dan. Taah. İth. İhr. Ltd. Şti.", title: "", parentId: 220 },
  { id: 229, name: "Geoinsight Araştırma Yazılım ve Danışmanlık Ltd. Şti.",   title: "", parentId: 220 },
  { id: 230, name: "Globetech Coğrafi Bilgi Teknolojileri Yazılım Planlama Harita Enerji Eğitim Müh. Dan. Ltd. Şti.", title: "", parentId: 220 },
  { id: 231, name: "ICNN Yapım Bil. Dan. Tar. Sav. Enr. İnş. İhr. İth. San. ve Tic. A.Ş.", title: "", parentId: 220 },
  { id: 232, name: "Idema Uluslararası Danışmanlık Kalkınma Yönetimi A.Ş.", title: "", parentId: 220 },
  { id: 233, name: "IDVLabs Yazılım ve Danışmanlık Hizmetleri A.Ş.", title: "", parentId: 220 },
  { id: 234, name: "Impro Uydu Görüntü İşleme ve Telekomünikasyon A.Ş.", title: "", parentId: 220 },
  { id: 235, name: "Mapkon Bilişim ve Teknoloji Ltd. Şti.",  title: "", parentId: 220 },
  { id: 236, name: "Mekansal Zeka Yazılım Elektronik Dan. Eğt. Or. Tic. Ltd. Şti.", title: "", parentId: 220 },
  { id: 237, name: "Mep Sistem Bilişim Teknolojileri Tic. Ltd. Şti.", title: "", parentId: 220 },
  { id: 238, name: "Parametre Araştırma Bilişim Planlama Ltd. Şti.", title: "", parentId: 220 },
  { id: 239, name: "Rodosto Teknoloji",                      title: "", parentId: 220 },
  { id: 240, name: "SHK Bilişim Teknolojileri",              title: "", parentId: 220 },
  { id: 241, name: "Underground Consultancy-Arda Ayhan",     title: "", parentId: 220 },
];

/* ---------- Departman renk paleti (Esri mavisiyle uyumlu) ---------- */
const BRAND = "#005e95";          // üst yönetim / iç organizasyon
const PARTNER_COLOR = "#64748b";  // partner ekosistemi (nötr arduvaz)
const PARTNER_TIER_COLORS = {     // metalik katman renkleri
  platin: "#6f8bb0",  // platin (çelik mavi)
  altin:  "#c19a2b",  // altın (sarı)
  member: "#9aa1ac",  // member (gümüşi gri)
};
const DEPT_COLORS = {
  "İş Geliştirme & Satış": "#0079c1", // Esri mavi
  "Profesyonel Hizmetler": "#12a5b0", // deniz mavisi / teal
  "Teknik Destek":         "#3fa535", // Esri yeşili
  "Eğitim & Akademi":      "#d1841f", // amber
  "Müşteri Başarı":        "#c94f92", // magenta
  "Pazarlama":             "#7a5cd0", // mor
  "İnsan & Kültür":        "#e2683c", // mercan
  "Mali İşler":            "#4a72b0", // arduvaz mavi
  "İş Ortakları":          PARTNER_COLOR, // partner ekosistemi
};

/* Departman görev tanımları (lejantta tıklanınca gösterilir) */
const DEPT_INFO = {
  "İş Geliştirme & Satış":
    "Yeni iş fırsatları yaratır ve müşteri ilişkilerini yönetir. Ticari, kamu, enerji & altyapı, yerel yönetim ve savunma sektörlerinde Esri çözümlerini konumlandırarak satış hedeflerini gerçekleştirir.",
  "Profesyonel Hizmetler":
    "Müşterilere özel coğrafi bilgi sistemi (CBS) çözümleri tasarlar ve hayata geçirir. Danışmanlık, çözüm mühendisliği ve teknik proje geliştirme faaliyetlerini yürütür.",
  "Teknik Destek":
    "Ürün ve sistemlerin kesintisiz çalışmasını sağlar. Müşteri sorunlarını çözer; kurulum, yapılandırma ve sistem desteği sunar.",
  "Eğitim & Akademi":
    "Kullanıcıların Esri teknolojilerini etkin kullanabilmesi için eğitim programları hazırlar ve sunar; akademik iş birliklerini yürütür.",
  "Müşteri Başarı":
    "Müşterilerin çözümlerden en yüksek değeri elde etmesini sağlar. Ürün benimsemesini, memnuniyeti ve uzun vadeli iş birliğini takip eder.",
  "Pazarlama":
    "Marka bilinirliğini artırır; etkinlik, içerik ve kampanya yönetimini üstlenir. Dijital iletişim ve pazarlama faaliyetlerini yürütür.",
  "İnsan & Kültür":
    "İşe alım, çalışan deneyimi ve şirket kültürünü yönetir. Ofis, lojistik ve idari operasyonların işleyişini destekler.",
  "Mali İşler":
    "Şirketin finansal süreçlerini yönetir. Muhasebe, raporlama, bütçe planlaması ve mali uyumdan sorumludur.",
  "İş Ortakları":
    "50 yılı aşkın teknoloji ve pazar liderliğiyle Esri ve iş ortağı ekosistemi, ArcGIS sistemlerini kullanarak dünya genelinde çeşitli sektörlere destek sağlar. Ürün ve hizmetlerini Esri teknolojisiyle sunan geniş bir ağ; sektör lideri stratejik iş birliklerini ve yenilikçi startup ortaklarını kapsar.",
};

/* Departman/rol ikonları (çizgi ikon, avatar içinde beyaz gösterilir) */
const DEPT_ICONS = {
  "İş Geliştirme & Satış": '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  "Profesyonel Hizmetler": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  "Teknik Destek": '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  "Eğitim & Akademi": '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5"/>',
  "Müşteri Başarı": '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  "Pazarlama": '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  "İnsan & Kültür": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  "Mali İşler": '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
};
const LEADER_ICON = '<path d="M2 4l3 12h14l3-12-6 7-4-7-4 7z"/><path d="M5 20h14"/>';

/* Üst katman / özel düğüm ikonları */
const SPECIAL_ICONS = {
  global:      '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  distributor: '<path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M9.5 21v-5h5v5"/>',
  internal:    '<circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/><path d="M12 7.4v3.6M6.6 16.8 10.5 12.6M17.4 16.8 13.5 12.6"/>',
  partners:    '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
  award:       '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>',
};

function avatarIcon(iconKey, dept) {
  const inner = (iconKey && SPECIAL_ICONS[iconKey]) ||
                (dept && DEPT_ICONS[dept]) || LEADER_ICON;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

/* ---------- 2) Düz listeyi ağaca çevir ---------- */
function buildTree(data) {
  const map = new Map();
  data.forEach(p => map.set(p.id, { ...p, children: [] }));
  let root = null;
  map.forEach(node => {
    if (node.parentId == null) root = node;
    else map.get(node.parentId)?.children.push(node);
  });
  return root;
}

/* ---------- 3) DOM render ---------- */
const cardById = new Map();       // id -> .card elemanı
const accentById = new Map();     // id -> departman rengi (bağlantı çizgileri için)
const verticalParents = new Set();// alt ekibini DİKEY listeleyen düğüm id'leri
const gridParents = new Set();    // alt ekibini IZGARA düzeninde gösteren düğümler
const gridBoxByParent = new Map();// id -> ızgara kutusu elemanı (bağlantı için)
const partnerIds = new Set();     // partner ekosistemine ait tüm kart id'leri

/* Bir düğüm dikey liste ile mi gösterilsin?
   → tüm alt öğeleri "yaprak" (kendi alt ekibi olmayan) ise evet. */
function isVerticalGroup(node) {
  return node.children.length > 0 &&
         node.children.every(c => c.children.length === 0);
}

function renderNode(node, { isRoot = false, accent = BRAND, dept = null, isPartner = false, partnerColor = null } = {}) {
  const partner = node.partner || isPartner;
  // Partner katman rengi (platin/altın/member) → aşağı miras
  const myPartnerColor = node.ptier ? (PARTNER_TIER_COLORS[node.ptier] || partnerColor) : partnerColor;
  // Renk: partner → katman/nötr; departman başı → kendi rengi; değilse üstten miras
  const myAccent = partner ? (myPartnerColor || PARTNER_COLOR)
                 : node.dept ? (DEPT_COLORS[node.dept] || accent)
                 : accent;
  const myDept = node.dept || dept;   // üst yönetimde null → liderlik ikonu
  if (partner) partnerIds.add(node.id);

  const wrap = document.createElement("div");
  wrap.className = "node";

  const card = document.createElement("div");
  const tierClass = node.tier ? ` card--${node.tier}` : (isRoot ? " card--root" : "");
  card.className = "card" + tierClass + (partner ? " card--partner" : "");
  card.dataset.id = node.id;
  card.style.setProperty("--accent", myAccent);
  if (node.children.length) card.classList.add("has-children");

  // Avatar (baş harfler) + kimlik bloğu
  const top = document.createElement("div");
  top.className = "card__top";

  const avatar = document.createElement("div");
  avatar.className = "card__avatar";
  avatar.innerHTML = avatarIcon(node.icon || (partner ? "partners" : null), myDept);

  const idBox = document.createElement("div");
  idBox.className = "card__id";

  const name = document.createElement("p");
  name.className = "card__name";
  name.textContent = node.name;
  idBox.appendChild(name);

  if (node.title) {                       // boş başlık satırını atla
    const title = document.createElement("p");
    title.className = "card__title";
    title.textContent = node.title;
    idBox.appendChild(title);
  }

  top.append(avatar, idBox);
  card.appendChild(top);

  if (node.dept) {
    const badge = document.createElement("span");
    badge.className = "card__badge";
    badge.textContent = node.dept;
    card.appendChild(badge);
  }

  cardById.set(node.id, card);
  accentById.set(node.id, myAccent);
  wrap.appendChild(card);

  if (node.children.length) {
    const grid = !!node.grid;
    const vertical = !grid && isVerticalGroup(node);
    if (vertical) {
      verticalParents.add(node.id);
      wrap.classList.add("node--vlist");
    }

    const childrenBox = document.createElement("div");
    childrenBox.className = "children" +
      (vertical ? " children--vertical" : "") +
      (grid ? " children--grid" : "");
    if (grid) { gridParents.add(node.id); gridBoxByParent.set(node.id, childrenBox); }
    node.children.forEach(child =>
      childrenBox.appendChild(renderNode(child, { accent: myAccent, dept: myDept, isPartner: partner, partnerColor: myPartnerColor }))
    );
    wrap.appendChild(childrenBox);

    // Karta tıklayınca alt ekibi katla/aç
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      childrenBox.classList.toggle("collapsed");
      card.classList.toggle("collapsed-parent");
      drawConnectors();
    });
  }

  return wrap;
}

/* ---------- 4) SVG kavisli bağlantılar ---------- */
const svg = document.getElementById("lines");
const canvas = document.getElementById("canvas");
const treeEl = document.getElementById("tree");

svg.innerHTML = `<g id="linesG"></g>`;
const linesG = document.getElementById("linesG");

// Her ebeveyn için alt öğe id listesi (bir kez)
const childrenOf = new Map();
orgData.forEach(p => {
  if (p.parentId == null) return;
  if (!childrenOf.has(p.parentId)) childrenOf.set(p.parentId, []);
  childrenOf.get(p.parentId).push(p.id);
});
const tierById = new Map(orgData.map(p => [p.id, p.tier || null]));

function drawConnectors() {
  const cRect = canvas.getBoundingClientRect();
  const s = state.scale || 1;
  // Ölçekten arındırılmış koordinat (canvas iç koordinatı)
  const px = v => (v - cRect.left) / s;
  const py = v => (v - cRect.top) / s;

  svg.setAttribute("width", treeEl.scrollWidth);
  svg.setAttribute("height", treeEl.scrollHeight);

  let html = "";
  const stroke = (d, color, w = 2, op = 0.85) =>
    `<path d="${d}" stroke="${color}" stroke-width="${w}" opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;

  childrenOf.forEach((childIds, parentId) => {
    const parentCard = cardById.get(parentId);
    if (!parentCard || parentCard.offsetParent === null) return;

    // IZGARA düzeni: ebeveynden kutunun üst-ortasına tek gövde çizgisi
    if (gridParents.has(parentId)) {
      const box = gridBoxByParent.get(parentId);
      if (!box || box.offsetParent === null) return;
      const pr = parentCard.getBoundingClientRect();
      const br = box.getBoundingClientRect();
      const pcx = px(pr.left + pr.width / 2), pby = py(pr.bottom);
      const cx = px(br.left + br.width / 2), ty = py(br.top);
      const dy = (ty - pby) / 2;
      const color = accentById.get(parentId) || PARTNER_COLOR;
      html += stroke(`M ${pcx} ${pby} C ${pcx} ${pby + dy}, ${cx} ${ty - dy}, ${cx} ${ty}`, color, 2.5, 0.8);
      return;
    }

    // Görünür (katlanmamış) alt kartlar
    const kids = childIds
      .map(id => ({ id, card: cardById.get(id) }))
      .filter(k => k.card && k.card.offsetParent !== null);
    if (!kids.length) return;

    const pr = parentCard.getBoundingClientRect();

    if (verticalParents.has(parentId)) {
      /* ---- DİKEY yerleşim: sol omurga + dirsekler ---- */
      const rects = kids.map(k => ({ ...k, r: k.card.getBoundingClientRect() }));
      const spineX = Math.min(...rects.map(k => px(k.r.left))) - 20;
      const firstCy = py(rects[0].r.top + rects[0].r.height / 2);
      const lastCy  = py(rects[rects.length - 1].r.top + rects[rects.length - 1].r.height / 2);
      const pcx = px(pr.left + pr.width / 2);
      const pby = py(pr.bottom);

      // Ebeveyn kartından omurganın tepesine yumuşak iniş + dikey omurga
      const parentColor = accentById.get(parentId) || BRAND;
      html += stroke(
        `M ${pcx} ${pby} C ${pcx} ${pby + 18}, ${spineX} ${firstCy - 18}, ${spineX} ${firstCy} L ${spineX} ${lastCy}`,
        parentColor, 2, 0.7
      );

      // Her alt karta yatay dirsek (departman rengiyle)
      rects.forEach(k => {
        const cy = py(k.r.top + k.r.height / 2);
        const lx = px(k.r.left);
        const color = accentById.get(k.id) || parentColor;
        const r = 8; // köşe yuvarlaması
        html += stroke(
          `M ${spineX} ${cy} L ${lx - r} ${cy}`,
          color, 2, 0.85
        );
      });
    } else {
      /* ---- YATAY yerleşim: yumuşak S-kavisler ---- */
      const x1 = px(pr.left + pr.width / 2);
      const y1 = py(pr.bottom);
      const pTier = tierById.get(parentId);
      // Üst katman kenarları daha kalın (Global → Türkiye → kollar)
      let w = 2, op = 0.8;
      if (pTier === "global")      { w = 4.5; op = 0.95; }
      else if (pTier === "distributor") { w = 3.2; op = 0.9; }
      kids.forEach(k => {
        const kr = k.card.getBoundingClientRect();
        const x2 = px(kr.left + kr.width / 2);
        const y2 = py(kr.top);
        const dy = (y2 - y1) / 2;
        const color = accentById.get(k.id) || BRAND;
        html += stroke(
          `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`,
          color, w, op
        );
      });
    }
  });

  linesG.innerHTML = html;
}

/* ---------- 5) Zoom & Pan ---------- */
const stage = document.getElementById("stage");
const state = { scale: 1, x: 0, y: 0 };

function applyTransform() {
  canvas.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
}

function zoomTo(newScale, cx, cy) {
  newScale = Math.min(2, Math.max(0.3, newScale));
  const rect = stage.getBoundingClientRect();
  cx = cx ?? rect.width / 2;
  cy = cy ?? rect.height / 2;
  // Odak noktasını sabit tutarak ölçekle
  const wx = (cx - state.x) / state.scale;
  const wy = (cy - state.y) / state.scale;
  state.scale = newScale;
  state.x = cx - wx * state.scale;
  state.y = cy - wy * state.scale;
  applyTransform();
}

// Ekrana sığdır + ortala
function fitToScreen() {
  const rect = stage.getBoundingClientRect();
  const w = treeEl.scrollWidth + 160;   // padding payı
  const h = treeEl.scrollHeight + 200;
  const scale = Math.min(rect.width / w, rect.height / h, 1);
  state.scale = Math.max(0.3, scale);
  state.x = (rect.width - w * state.scale) / 2 + 80 * state.scale;
  state.y = 20;
  applyTransform();
}

// Fare tekerleği ile zoom
stage.addEventListener("wheel", (e) => {
  e.preventDefault();
  const rect = stage.getBoundingClientRect();
  const factor = e.deltaY < 0 ? 1.12 : 0.89;
  zoomTo(state.scale * factor, e.clientX - rect.left, e.clientY - rect.top);
}, { passive: false });

// Sürükleyerek kaydır
let drag = null;
stage.addEventListener("pointerdown", (e) => {
  e.preventDefault();                 // metin seçimini engelle
  drag = { sx: e.clientX, sy: e.clientY, ox: state.x, oy: state.y };
  stage.classList.add("dragging");
  stage.setPointerCapture(e.pointerId);
});
// Bazı tarayıcılarda seçim yine başlarsa güvence katmanı
stage.addEventListener("selectstart", (e) => e.preventDefault());
stage.addEventListener("pointermove", (e) => {
  if (!drag) return;
  state.x = drag.ox + (e.clientX - drag.sx);
  state.y = drag.oy + (e.clientY - drag.sy);
  applyTransform();
});
function endDrag() { drag = null; stage.classList.remove("dragging"); }
stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);

// Zoom butonları (kaldırıldıysa sessizce atla) + arama kutusu (kaldırıldı)
document.getElementById("zoomIn")?.addEventListener("click",  () => zoomTo(state.scale * 1.15));
document.getElementById("zoomOut")?.addEventListener("click", () => zoomTo(state.scale * 0.87));
document.getElementById("zoomReset")?.addEventListener("click", fitToScreen);

const searchEl = document.getElementById("search");
searchEl?.addEventListener("input", () => {
  const q = searchEl.value.trim().toLocaleLowerCase("tr");
  if (q && activeDept) clearActiveDept();   // departman seçimini bırak
  cardById.forEach((card, id) => {
    card.classList.remove("match", "dimmed");
    if (!q) return;
    const p = orgData.find(o => o.id == id);
    const hit = (p.name + " " + p.title).toLocaleLowerCase("tr").includes(q);
    card.classList.toggle("match", hit);
    card.classList.toggle("dimmed", !hit);
  });
});

/* ---------- Departman lejantı + görev tanımı ---------- */
let activeDept = null;

function highlightDept(name) {
  const color = DEPT_COLORS[name];
  const partnerLegend = name === "İş Ortakları";  // tüm partner ekosistemi
  cardById.forEach((card, id) => {
    const match = partnerLegend ? partnerIds.has(id) : accentById.get(id) === color;
    card.classList.toggle("match", match);
    card.classList.toggle("dimmed", !match);
  });
}
function clearDeptHighlight() {
  cardById.forEach(card => card.classList.remove("match", "dimmed"));
}
function clearActiveDept() {
  activeDept = null;
  clearDeptHighlight();
  const el = document.getElementById("legend");
  el.querySelector(".legend__detail")?.classList.remove("show");
  el.querySelectorAll(".legend__item").forEach(i => i.classList.remove("active"));
}

function selectDept(name) {
  const el = document.getElementById("legend");
  const detail = el.querySelector(".legend__detail");

  if (activeDept === name) {              // aynı departmana tekrar tıkla → kapat
    clearActiveDept();
    return;
  }

  activeDept = name;
  if (searchEl) searchEl.value = "";      // arama varsa çakışmayı önle
  highlightDept(name);

  el.querySelectorAll(".legend__item").forEach(i =>
    i.classList.toggle("active", i.dataset.dept === name)
  );

  detail.style.setProperty("--accent", DEPT_COLORS[name]);
  detail.innerHTML = `
    <p class="legend__detail-name">${name}</p>
    <p class="legend__detail-text">${DEPT_INFO[name] || ""}</p>`;
  detail.classList.add("show");
}

function buildLegend() {
  const el = document.getElementById("legend");
  if (!el) return;
  let html = `<div class="legend__title">Departmanlar</div>`;
  Object.entries(DEPT_COLORS).forEach(([name, color]) => {
    html += `<button type="button" class="legend__item" data-dept="${name}">
      <span class="legend__dot" style="background:${color}"></span>
      <span class="legend__label">${name}</span>
    </button>`;
  });
  html += `<div class="legend__detail"></div>`;
  el.innerHTML = html;

  el.querySelectorAll(".legend__item").forEach(item =>
    item.addEventListener("click", () => selectDept(item.dataset.dept))
  );
}

/* ---------- Başlat ---------- */
function init() {
  const root = buildTree(orgData);
  treeEl.appendChild(renderNode(root, { isRoot: true }));
  buildLegend();

  fitToScreen();
  drawConnectors();

  // Fontlar/yerleşim oturunca yeniden çiz
  requestAnimationFrame(() => { fitToScreen(); drawConnectors(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { fitToScreen(); drawConnectors(); });
  }
}

window.addEventListener("resize", () => { fitToScreen(); drawConnectors(); });
init();
