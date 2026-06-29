const demoRoleViews = {
  admin: {
    roleLabel: 'مسؤول عام',
    welcomeRole: 'صلاحية كاملة على النظام والقطاعات',
    pages: ['dashboard', 'incidents', 'reports', 'map', 'settings']
  },
  health: {
    roleLabel: 'قطاع صحي',
    welcomeRole: 'إدارة الخدمات والمنشآت الصحية',
    pages: ['dashboard', 'incidents', 'reports', 'map']
  },
  municipality: {
    roleLabel: 'قطاع بلدي',
    welcomeRole: 'إدارة البلاغات والجولات البلدية',
    pages: ['dashboard', 'incidents', 'reports', 'map']
  }
};

const navLabels = {
  dashboard: 'الرئيسية',
  incidents: 'البلاغات',
  reports: 'التقارير',
  map: 'الخريطة',
  settings: 'الإعدادات'
};

const incidents = [
  { id: '#REP-1042', title: 'ملاحظة نظافة في حي الروضة', sector: 'بلدي', status: 'open', area: 'جدة', priority: 'متوسطة' },
  { id: '#REP-1045', title: 'طلب صيانة إنارة شارع', sector: 'بلدي', status: 'progress', area: 'جدة', priority: 'عالية' },
  { id: '#REP-1058', title: 'بلاغ ازدحام في مركز صحي', sector: 'صحي', status: 'closed', area: 'مكة', priority: 'منخفضة' },
  { id: '#REP-1061', title: 'متابعة موعد تطعيم', sector: 'صحي', status: 'open', area: 'المدينة', priority: 'عالية' },
];

let currentUser = null;
let currentPage = 'dashboard';

function getStoredUser() {
  const stored = localStorage.getItem('portalUser') || sessionStorage.getItem('portalUser');
  if (!stored) {
    const fallback = { name: 'Ziad', role: 'admin', isLoggedIn: true, otpVerified: true };
    localStorage.setItem('portalUser', JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored);
  } catch {
    const fallback = { name: 'Ziad', role: 'admin', isLoggedIn: true, otpVerified: true };
    localStorage.setItem('portalUser', JSON.stringify(fallback));
    return fallback;
  }
}

function statusClass(status){
  if(status === 'open') return 'open';
  if(status === 'progress') return 'progress';
  return 'closed';
}
function statusLabel(status){
  if(status === 'open') return 'جديد';
  if(status === 'progress') return 'قيد المعالجة';
  return 'مغلق';
}

function renderNav() {
  const config = demoRoleViews[currentUser.role] || demoRoleViews.admin;
  const nav = document.getElementById('navList');
  nav.innerHTML = '';
  config.pages.forEach((page) => {
    const btn = document.createElement('button');
    btn.className = 'nav-btn' + (currentPage === page ? ' active' : '');
    btn.textContent = navLabels[page];
    btn.addEventListener('click', () => {
      currentPage = page;
      renderNav();
      renderPage();
    });
    nav.appendChild(btn);
  });
}

function metricCard(title, value, note) {
  return `<div class="card"><h3>${title}</h3><div class="metric">${value}</div><div class="metric-note">${note}</div></div>`;
}

function renderDashboard() {
  const metrics = currentUser.role === 'health'
    ? [
        ['المواعيد اليوم', '128', 'إجمالي الحجوزات المجدولة اليوم'],
        ['الحالات المفتوحة', '16', 'تحتاج متابعة عاجلة'],
        ['المنشآت الصحية', '12', 'نشطة في النظام'],
        ['الرضا العام', '92%', 'آخر 30 يوم']
      ]
    : currentUser.role === 'municipality'
    ? [
        ['الجولات اليومية', '34', 'مجدولة لليوم الحالي'],
        ['البلاغات الجديدة', '18', 'تم استقبالها اليوم'],
        ['المخالفات', '7', 'بحاجة مراجعة'],
        ['نسبة الإنجاز', '87%', 'آخر 30 يوم']
      ]
    : [
        ['إجمالي المستخدمين', '128', 'جميع مستخدمي المنصة'],
        ['البلاغات النشطة', '42', 'عبر كل القطاعات'],
        ['التقارير اليومية', '19', 'تم إنشاؤها اليوم'],
        ['مستوى الخدمة', '96%', 'آخر 30 يوم']
      ];

  return `
    <section class="grid-cards">${metrics.map(m => metricCard(...m)).join('')}</section>
    <section class="two-col">
      <div class="section">
        <div class="section-head">
          <div>
            <h2>نظرة سريعة</h2>
            <p>ملخص تشغيلي لأهم المؤشرات والخدمات</p>
          </div>
        </div>
        <div class="list">
          <div class="list-item"><strong>إدارة ذكية للطلبات</strong> عرض البلاغات والمواعيد والمهام في لوحة موحدة.</div>
          <div class="list-item"><strong>توزيع حسب الصلاحية</strong> المحتوى يتغير تلقائيًا حسب نوع المستخدم.</div>
          <div class="list-item"><strong>جاهز للربط الخلفي</strong> يمكن استبدال البيانات التجريبية بـ API لاحقًا بسهولة.</div>
        </div>
      </div>
      <div class="section">
        <div class="section-head">
          <div>
            <h2>صلاحياتك</h2>
            <p>المزايا المتاحة لحسابك الحالي</p>
          </div>
        </div>
        <div class="chips">
          ${(demoRoleViews[currentUser.role] || demoRoleViews.admin).pages.map(p => `<span class="chip">${navLabels[p]}</span>`).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderIncidents(filter='') {
  const filtered = incidents.filter(item => {
    const text = `${item.id} ${item.title} ${item.sector} ${item.area} ${item.priority}`.toLowerCase();
    return text.includes(filter.toLowerCase());
  });

  return `
    <section class="section">
      <div class="section-head">
        <div>
          <h2>قائمة البلاغات</h2>
          <p>متابعة مباشرة للحالات المفتوحة والمغلقة</p>
        </div>
      </div>
      <div class="table">
        ${filtered.map(item => `
          <div class="table-row">
            <div><strong>${item.id}</strong><div>${item.title}</div></div>
            <div>${item.sector} — ${item.area}</div>
            <div><span class="status ${statusClass(item.status)}">${statusLabel(item.status)}</span></div>
            <div>${item.priority}</div>
          </div>
        `).join('') || '<div class="empty-note">لا توجد نتائج مطابقة لعملية البحث.</div>'}
      </div>
    </section>
  `;
}

function renderReports() {
  return `
    <section class="grid-cards">
      ${metricCard('تقارير يومية', '19', 'جاهزة للتصدير')}
      ${metricCard('تقارير أسبوعية', '6', 'آخر 7 أيام')}
      ${metricCard('تقارير شهرية', '3', 'تمت المراجعة')}
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <h2>التقارير الجاهزة</h2>
          <p>نماذج تقارير يمكن ربطها لاحقًا بملفات PDF أو API</p>
        </div>
      </div>
      <div class="list">
        <div class="list-item"><strong>تقرير الأداء التشغيلي</strong> يعرض حالة النظام وأهم مؤشرات الأداء اليومية.</div>
        <div class="list-item"><strong>تقرير البلاغات</strong> توزيع البلاغات حسب الحالة والمنطقة والقطاع.</div>
        <div class="list-item"><strong>تقرير مستوى الخدمة</strong> قياس الالتزام الزمني وجودة التنفيذ.</div>
      </div>
    </section>
  `;
}

function renderMap() {
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <h2>الخريطة التفاعلية</h2>
          <p>عرض مرئي مبسط لمواقع البلاغات والخدمات</p>
        </div>
      </div>
      <div class="map-box">
        <div class="map-grid"></div>
        <span class="map-pin" style="top:22%; right:28%"></span>
        <span class="map-pin green" style="top:48%; right:44%"></span>
        <span class="map-pin blue" style="top:62%; right:18%"></span>
        <span class="map-pin" style="top:38%; right:70%"></span>
      </div>
    </section>
  `;
}

function renderSettings() {
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <h2>الإعدادات</h2>
          <p>خيارات واجهة مؤقتة قابلة للربط لاحقًا</p>
        </div>
      </div>
      <div class="settings-grid">
        <div class="setting-tile"><h4>الملف الشخصي</h4><p>الاسم: ${currentUser.name}<br>الدور: ${currentUser.role}</p></div>
        <div class="setting-tile"><h4>الإشعارات</h4><p>تنبيهات البلاغات وتحديثات الحالة والمواعيد.</p></div>
        <div class="setting-tile"><h4>الأمان</h4><p>التحقق الثنائي مفعل ضمن تجربة المشروع.</p></div>
        <div class="setting-tile"><h4>الربط الخلفي</h4><p>واجهة جاهزة لاستبدال البيانات التجريبية بخدمة حقيقية.</p></div>
      </div>
    </section>
  `;
}

function renderPage() {
  const view = document.getElementById('view');
  const search = document.getElementById('searchInput').value || '';

  const titles = {
    dashboard: ['لوحة التحكم', 'نظرة شاملة على النظام والخدمات'],
    incidents: ['البلاغات', 'عرض ومتابعة البلاغات حسب القطاع والحالة'],
    reports: ['التقارير', 'تقارير تشغيلية وإحصائية جاهزة للعرض'],
    map: ['الخريطة', 'تتبع بصري للبلاغات والمواقع'],
    settings: ['الإعدادات', 'تخصيص وبيانات الحساب والخيارات العامة']
  };

  const [title, subtitle] = titles[currentPage] || titles.dashboard;
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = subtitle;

  if (currentPage === 'dashboard') view.innerHTML = renderDashboard();
  if (currentPage === 'incidents') view.innerHTML = renderIncidents(search);
  if (currentPage === 'reports') view.innerHTML = renderReports();
  if (currentPage === 'map') view.innerHTML = renderMap();
  if (currentPage === 'settings') view.innerHTML = renderSettings();
}

function initApp() {
  currentUser = getStoredUser();
  const config = demoRoleViews[currentUser.role] || demoRoleViews.admin;
  document.getElementById('welcomeName').textContent = `مرحباً، ${currentUser.name}`;
  document.getElementById('welcomeRole').textContent = config.welcomeRole;
  document.getElementById('rolePill').textContent = config.roleLabel;
  document.getElementById('userAvatar').textContent = (currentUser.name || 'U').charAt(0).toUpperCase();

  renderNav();
  renderPage();

  document.getElementById('searchInput').addEventListener('input', () => {
    if (currentPage === 'incidents') renderPage();
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('portalUser');
    sessionStorage.removeItem('portalUser');
    localStorage.removeItem('portalPendingAuth');
    sessionStorage.removeItem('portalPendingAuth');
    window.location.href = 'index.html';
  });
}

initApp();
