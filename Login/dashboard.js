function getSavedUser() {
  const localUser = localStorage.getItem("portalUser");
  const sessionUser = sessionStorage.getItem("portalUser");
  return localUser || sessionUser;
}

function logout() {
  localStorage.removeItem("portalUser");
  sessionStorage.removeItem("portalUser");
  window.location.href = "login.html";
}

window.logout = logout;

const dashboardData = {
  admin: {
    title: "لوحة تحكم المسؤول العام",
    desc: "إدارة شاملة لجميع القطاعات والمستخدمين والصلاحيات.",
    badge: "صلاحية: مسؤول عام",
    roleText: "مسؤول النظام الكامل",
    menu: ["الرئيسية", "التقارير", "البلدية", "الصحة", "المستخدمون", "الإعدادات"],
    stats: [
      { title: "إجمالي المستخدمين", value: "128" },
      { title: "طلبات قائمة", value: "42" },
      { title: "تقارير اليوم", value: "19" },
      { title: "حجوزات نشطة", value: "31" }
    ],
    services: [
      "عرض جميع تقارير البلدية والصحة",
      "إضافة وتعديل وحذف المستخدمين",
      "إدارة الصلاحيات والأدوار",
      "متابعة حالة النظام بالكامل"
    ],
    showAdminSection: true
  },

  health: {
    title: "لوحة القطاع الصحي",
    desc: "إدارة المواعيد والخدمات الصحية والبلاغات الطبية.",
    badge: "صلاحية: قطاع صحي",
    roleText: "موظف صحي",
    menu: ["الرئيسية", "المواعيد", "المستشفيات", "البلاغات", "التقارير"],
    stats: [
      { title: "المواعيد اليوم", value: "24" },
      { title: "البلاغات الصحية", value: "8" },
      { title: "المستشفيات النشطة", value: "12" },
      { title: "طلبات المراجعة", value: "5" }
    ],
    services: [
      "إدارة حجوزات المواعيد",
      "متابعة حالة المستشفيات والمراكز",
      "استعراض البلاغات الصحية",
      "إصدار تقارير الخدمات الصحية"
    ],
    showAdminSection: false
  },

  municipality: {
    title: "لوحة القطاع البلدي",
    desc: "إدارة الرقابة البلدية والبلاغات والملاحظات الميدانية.",
    badge: "صلاحية: قطاع بلدي",
    roleText: "موظف بلدي",
    menu: ["الرئيسية", "الرقابة", "البلاغات", "الجولات", "التقارير"],
    stats: [
      { title: "الجولات اليوم", value: "14" },
      { title: "البلاغات البلدية", value: "17" },
      { title: "المخالفات", value: "6" },
      { title: "طلبات المعالجة", value: "9" }
    ],
    services: [
      "متابعة البلاغات البلدية",
      "إدارة الجولات الرقابية",
      "تسجيل الملاحظات والمخالفات",
      "استعراض تقارير الأداء البلدي"
    ],
    showAdminSection: false
  }
};

function createMenu(items) {
  const menuContainer = document.getElementById("menuContainer");
  menuContainer.innerHTML = "";

  items.forEach(item => {
    const button = document.createElement("button");
    button.textContent = item;
    menuContainer.appendChild(button);
  });
}

function createStats(stats) {
  const statsCards = document.getElementById("statsCards");
  statsCards.innerHTML = "";

  stats.forEach(stat => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${stat.title}</h3>
      <div class="num">${stat.value}</div>
    `;
    statsCards.appendChild(card);
  });
}

function createServices(services) {
  const servicesList = document.getElementById("servicesList");
  servicesList.innerHTML = "";

  services.forEach(service => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.textContent = service;
    servicesList.appendChild(item);
  });
}

function loadDashboard() {
  const savedUser = getSavedUser();

  if (!savedUser) {
    window.location.href = "login.html";
    return;
  }

  let user;
  try {
    user = JSON.parse(savedUser);
  } catch {
    logout();
    return;
  }

  if (!user.isLoggedIn || !user.role || !dashboardData[user.role]) {
    logout();
    return;
  }

  const data = dashboardData[user.role];

  document.getElementById("welcomeUser").textContent = `مرحباً، ${user.name}`;
  document.getElementById("roleText").textContent = data.roleText;
  document.getElementById("dashboardTitle").textContent = data.title;
  document.getElementById("dashboardDesc").textContent = data.desc;
  document.getElementById("roleBadge").textContent = data.badge;

  createMenu(data.menu);
  createStats(data.stats);
  createServices(data.services);

  const adminSection = document.getElementById("adminSection");
  if (data.showAdminSection) {
    adminSection.classList.remove("hidden");
  } else {
    adminSection.classList.add("hidden");
  }
}

loadDashboard();