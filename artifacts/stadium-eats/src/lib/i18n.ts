import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app.name": "Stadium Eats",
      "splash.step1.title": "Scan your ticket",
      "splash.step1.desc": "Your seat is your delivery address",
      "splash.step2.title": "Browse stands",
      "splash.step2.desc": "Order from the best local and global food",
      "splash.step3.title": "Eat at your seat",
      "splash.step3.desc": "We deliver straight to you so you don't miss a minute",
      "splash.button.scan": "Scan Ticket to Enter",
      "splash.button.demo": "Use demo ticket",
      
      "home.welcome": "Welcome to",
      "home.section": "Section",
      "home.seat": "Seat",
      "home.trending": "Trending near you",
      "home.categories": "Categories",
      "home.all_stands": "All Stands",
      
      "stand.status.open": "Open",
      "stand.status.busy": "Busy",
      "stand.status.temp_closed": "Temporarily Closed",
      "stand.status.closed": "Closed",
      "stand.wait_time": "{{minutes}} min",
      "stand.reopens_at": "Reopens at {{time}}",
      
      "menu.add_to_cart": "Add to cart",
      "menu.halal": "Halal",
      "menu.vegetarian": "Vegetarian",
      
      "cart.title": "Your Order",
      "cart.empty": "Your cart is empty",
      "cart.subtotal": "Subtotal",
      "cart.delivery_fee": "Delivery Fee",
      "cart.total": "Total",
      "cart.checkout": "Checkout",
      "cart.schedule": "Schedule for later",
      "cart.payment_method": "Payment Method",
      "cart.destination": "Delivery Destination",
      "cart.confirm_switch_title": "Switch to a different stand?",
      "cart.confirm_switch_desc": "Your cart will be cleared if you order from a different stand.",
      
      "order.status.received": "Received",
      "order.status.preparing": "Preparing",
      "order.status.on_the_way": "On the Way",
      "order.status.delivered": "Delivered",
      "order.status.cancelled": "Cancelled",
      
      "orders.title": "My Orders",
      "orders.active": "Active",
      "orders.history": "History",
      "orders.eta": "ETA: {{minutes}} min",
      "orders.rate": "Rate your order",
      "orders.no_active": "No active orders right now",
      
      "nav.home": "Home",
      "nav.orders": "Orders",
      "nav.profile": "Profile",
      
      "rider.login.title": "Rider Login",
      "rider.login.pin": "Enter your PIN",
      "rider.login.button": "Login",
      "rider.dashboard.title": "Rider Dashboard",
      "rider.dashboard.active_orders": "Active Orders",
      "rider.dashboard.delivered_today": "Delivered Today",
      "rider.dashboard.avg_time": "Avg Time (min)",
      "rider.action.picked_up": "Mark Picked Up",
      "rider.action.en_route": "En Route",
      "rider.action.delivered": "Delivered",
      
      "admin.login.title": "Admin Login",
      "admin.dashboard.title": "Dashboard",
      "admin.nav.overview": "Overview",
      "admin.nav.orders": "Orders",
      "admin.nav.stands": "Stands",
      "admin.nav.riders": "Riders",
      "admin.nav.heatmap": "Heatmap"
    }
  },
  fr: {
    translation: {
      "app.name": "Stadium Eats",
      "splash.step1.title": "Scannez votre billet",
      "splash.step1.desc": "Votre siège est votre adresse de livraison",
      "splash.step2.title": "Parcourez les stands",
      "splash.step2.desc": "Commandez la meilleure nourriture locale et mondiale",
      "splash.step3.title": "Mangez à votre place",
      "splash.step3.desc": "Nous livrons directement pour ne pas manquer une minute",
      "splash.button.scan": "Scanner le billet pour entrer",
      "splash.button.demo": "Utiliser un billet de démo",
      
      "home.welcome": "Bienvenue au",
      "home.section": "Section",
      "home.seat": "Siège",
      "home.trending": "Tendances près de vous",
      "home.categories": "Catégories",
      "home.all_stands": "Tous les stands",
      
      "stand.status.open": "Ouvert",
      "stand.status.busy": "Occupé",
      "stand.status.temp_closed": "Temporairement fermé",
      "stand.status.closed": "Fermé",
      "stand.wait_time": "{{minutes}} min",
      "stand.reopens_at": "Rouvre à {{time}}",
      
      "menu.add_to_cart": "Ajouter au panier",
      "menu.halal": "Halal",
      "menu.vegetarian": "Végétarien",
      
      "cart.title": "Votre Commande",
      "cart.empty": "Votre panier est vide",
      "cart.subtotal": "Sous-total",
      "cart.delivery_fee": "Frais de livraison",
      "cart.total": "Total",
      "cart.checkout": "Payer",
      "cart.schedule": "Planifier pour plus tard",
      "cart.payment_method": "Moyen de paiement",
      "cart.destination": "Destination de livraison",
      "cart.confirm_switch_title": "Changer de stand ?",
      "cart.confirm_switch_desc": "Votre panier sera vidé si vous commandez dans un autre stand.",
      
      "order.status.received": "Reçu",
      "order.status.preparing": "En préparation",
      "order.status.on_the_way": "En route",
      "order.status.delivered": "Livré",
      "order.status.cancelled": "Annulé",
      
      "orders.title": "Mes Commandes",
      "orders.active": "Actives",
      "orders.history": "Historique",
      "orders.eta": "ETA : {{minutes}} min",
      "orders.rate": "Évaluez votre commande",
      "orders.no_active": "Aucune commande active en ce moment",
      
      "nav.home": "Accueil",
      "nav.orders": "Commandes",
      "nav.profile": "Profil",
      
      "rider.login.title": "Connexion Livreur",
      "rider.login.pin": "Entrez votre code PIN",
      "rider.login.button": "Connexion",
      "rider.dashboard.title": "Tableau de bord Livreur",
      "rider.dashboard.active_orders": "Commandes Actives",
      "rider.dashboard.delivered_today": "Livrées Aujourd'hui",
      "rider.dashboard.avg_time": "Temps moyen (min)",
      "rider.action.picked_up": "Marquer Récupéré",
      "rider.action.en_route": "En Route",
      "rider.action.delivered": "Livré",
      
      "admin.login.title": "Connexion Admin",
      "admin.dashboard.title": "Tableau de bord",
      "admin.nav.overview": "Aperçu",
      "admin.nav.orders": "Commandes",
      "admin.nav.stands": "Stands",
      "admin.nav.riders": "Livreurs",
      "admin.nav.heatmap": "Carte de chaleur"
    }
  },
  ar: {
    translation: {
      "app.name": "ملعب إيتس",
      "splash.step1.title": "امسح تذكرتك",
      "splash.step1.desc": "مقعدك هو عنوان التوصيل الخاص بك",
      "splash.step2.title": "تصفح الأكشاك",
      "splash.step2.desc": "اطلب من أفضل الأطعمة المحلية والعالمية",
      "splash.step3.title": "كل في مقعدك",
      "splash.step3.desc": "نقوم بالتوصيل إليك مباشرة حتى لا تفوتك دقيقة",
      "splash.button.scan": "امسح التذكرة للدخول",
      "splash.button.demo": "استخدم تذكرة تجريبية",
      
      "home.welcome": "مرحباً بك في",
      "home.section": "قسم",
      "home.seat": "مقعد",
      "home.trending": "شائع بالقرب منك",
      "home.categories": "الفئات",
      "home.all_stands": "جميع الأكشاك",
      
      "stand.status.open": "مفتوح",
      "stand.status.busy": "مشغول",
      "stand.status.temp_closed": "مغلق مؤقتاً",
      "stand.status.closed": "مغلق",
      "stand.wait_time": "{{minutes}} دقيقة",
      "stand.reopens_at": "يفتح عند {{time}}",
      
      "menu.add_to_cart": "أضف إلى السلة",
      "menu.halal": "حلال",
      "menu.vegetarian": "نباتي",
      
      "cart.title": "طلبك",
      "cart.empty": "سلتك فارغة",
      "cart.subtotal": "المجموع الفرعي",
      "cart.delivery_fee": "رسوم التوصيل",
      "cart.total": "الإجمالي",
      "cart.checkout": "الدفع",
      "cart.schedule": "الجدولة لوقت لاحق",
      "cart.payment_method": "طريقة الدفع",
      "cart.destination": "وجهة التوصيل",
      "cart.confirm_switch_title": "التبديل إلى كشك آخر؟",
      "cart.confirm_switch_desc": "سيتم مسح سلتك إذا قمت بالطلب من كشك آخر.",
      
      "order.status.received": "تم الاستلام",
      "order.status.preparing": "قيد التحضير",
      "order.status.on_the_way": "في الطريق",
      "order.status.delivered": "تم التوصيل",
      "order.status.cancelled": "أُلغيت",
      
      "orders.title": "طلباتي",
      "orders.active": "النشطة",
      "orders.history": "السجل",
      "orders.eta": "الوقت المتوقع: {{minutes}} دقيقة",
      "orders.rate": "قيم طلبك",
      "orders.no_active": "لا توجد طلبات نشطة حالياً",
      
      "nav.home": "الرئيسية",
      "nav.orders": "الطلبات",
      "nav.profile": "الملف الشخصي",
      
      "rider.login.title": "تسجيل دخول الموصل",
      "rider.login.pin": "أدخل رمز PIN",
      "rider.login.button": "دخول",
      "rider.dashboard.title": "لوحة تحكم الموصل",
      "rider.dashboard.active_orders": "الطلبات النشطة",
      "rider.dashboard.delivered_today": "تم التوصيل اليوم",
      "rider.dashboard.avg_time": "متوسط الوقت (دقيقة)",
      "rider.action.picked_up": "تم الاستلام",
      "rider.action.en_route": "في الطريق",
      "rider.action.delivered": "تم التوصيل",
      
      "admin.login.title": "تسجيل دخول المسؤول",
      "admin.dashboard.title": "لوحة التحكم",
      "admin.nav.overview": "نظرة عامة",
      "admin.nav.orders": "الطلبات",
      "admin.nav.stands": "الأكشاك",
      "admin.nav.riders": "الموصلون",
      "admin.nav.heatmap": "الخريطة الحرارية"
    }
  },
  es: {
    translation: {
      "app.name": "Stadium Eats",
      "splash.step1.title": "Escanea tu boleto",
      "splash.step1.desc": "Tu asiento es tu dirección de entrega",
      "splash.step2.title": "Explora los puestos",
      "splash.step2.desc": "Pide de la mejor comida local y global",
      "splash.step3.title": "Come en tu asiento",
      "splash.step3.desc": "Te entregamos directamente para que no te pierdas un minuto",
      "splash.button.scan": "Escanear boleto para entrar",
      "splash.button.demo": "Usar boleto de demostración",
      
      "home.welcome": "Bienvenido a",
      "home.section": "Sección",
      "home.seat": "Asiento",
      "home.trending": "Tendencias cerca de ti",
      "home.categories": "Categorías",
      "home.all_stands": "Todos los puestos",
      
      "stand.status.open": "Abierto",
      "stand.status.busy": "Ocupado",
      "stand.status.temp_closed": "Cerrado temporalmente",
      "stand.status.closed": "Cerrado",
      "stand.wait_time": "{{minutes}} min",
      "stand.reopens_at": "Reabre a las {{time}}",
      
      "menu.add_to_cart": "Añadir al carrito",
      "menu.halal": "Halal",
      "menu.vegetarian": "Vegetariano",
      
      "cart.title": "Tu Pedido",
      "cart.empty": "Tu carrito está vacío",
      "cart.subtotal": "Subtotal",
      "cart.delivery_fee": "Tarifa de entrega",
      "cart.total": "Total",
      "cart.checkout": "Pagar",
      "cart.schedule": "Programar para más tarde",
      "cart.payment_method": "Método de pago",
      "cart.destination": "Destino de entrega",
      "cart.confirm_switch_title": "¿Cambiar de puesto?",
      "cart.confirm_switch_desc": "Tu carrito se vaciará si pides en otro puesto.",
      
      "order.status.received": "Recibido",
      "order.status.preparing": "Preparando",
      "order.status.on_the_way": "En camino",
      "order.status.delivered": "Entregado",
      "order.status.cancelled": "Cancelado",
      
      "orders.title": "Mis Pedidos",
      "orders.active": "Activos",
      "orders.history": "Historial",
      "orders.eta": "ETA: {{minutes}} min",
      "orders.rate": "Califica tu pedido",
      "orders.no_active": "No hay pedidos activos en este momento",
      
      "nav.home": "Inicio",
      "nav.orders": "Pedidos",
      "nav.profile": "Perfil",
      
      "rider.login.title": "Acceso de Repartidor",
      "rider.login.pin": "Introduce tu PIN",
      "rider.login.button": "Entrar",
      "rider.dashboard.title": "Panel del Repartidor",
      "rider.dashboard.active_orders": "Pedidos Activos",
      "rider.dashboard.delivered_today": "Entregados Hoy",
      "rider.dashboard.avg_time": "Tiempo medio (min)",
      "rider.action.picked_up": "Marcar Recogido",
      "rider.action.en_route": "En Camino",
      "rider.action.delivered": "Entregado",
      
      "admin.login.title": "Acceso Admin",
      "admin.dashboard.title": "Panel de control",
      "admin.nav.overview": "Resumen",
      "admin.nav.orders": "Pedidos",
      "admin.nav.stands": "Puestos",
      "admin.nav.riders": "Repartidores",
      "admin.nav.heatmap": "Mapa de calor"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
  if (lng === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lng;
  }
  localStorage.setItem("se.lang", lng);
});

// Init on boot
const savedLang = localStorage.getItem("se.lang") || 'en';
i18n.changeLanguage(savedLang);

export default i18n;
