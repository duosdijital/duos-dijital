// ============ AYARLAR ============
// WhatsApp numarası (başında + olmadan, ülke koduyla)
const WHATSAPP_NO = "905352251028";
const EMAIL = "duosdijitaldestek@gmail.com";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const waLink = text => `https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(text)}`;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// ============ MENÜ + İLERLEME ÇUBUĞU ============
const nav = $("#nav");
const progress = $("#scrollProgress");
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  updateSteps();
};
window.addEventListener("scroll", onScroll, { passive: true });

const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  navLinks.classList.toggle("open");
});
$$("a", navLinks).forEach(a => a.addEventListener("click", () => {
  menuBtn.classList.remove("open");
  navLinks.classList.remove("open");
}));

// ============ GÖRÜNME ANİMASYONLARI ============
const revealAll = () => $$(".reveal").forEach(el => el.classList.add("visible"));
if ("IntersectionObserver" in window && !reduced) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      $$("[data-count]", e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));
  // Güvenlik ağı: herhangi bir sebeple tetiklenmezse içerik gizli kalmasın
  setTimeout(() => $$(".reveal:not(.visible)").forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("visible");
  }), 2500);
} else {
  document.documentElement.classList.add("no-anim");
  revealAll();
  $$("[data-count]").forEach(countUp);
}

// Sayaç
function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = 1;
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || "";
  const prefix = el.dataset.prefix || "";
  const start = performance.now();
  const dur = 1600;
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = prefix + Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ============ DÖNEN KELİME ============
const rotator = $("#rotator");
const words = ["3 saniyede", "siz uyurken", "komisyonsuz", "otomatik olarak"];
let wi = 0;
if (rotator && !reduced) {
  setInterval(() => {
    rotator.classList.add("out");
    setTimeout(() => {
      wi = (wi + 1) % words.length;
      rotator.firstElementChild.textContent = words[wi];
      rotator.classList.remove("out");
      rotator.classList.add("in");
      requestAnimationFrame(() => requestAnimationFrame(() => rotator.classList.remove("in")));
    }, 420);
  }, 2600);
}

// ============ CANLI TELEFON SOHBETİ ============
const chat = $("#chatBody");
const phoneStatus = $("#phoneStatus");
const script = [
  { t: "in", h: "Merhaba, 14-17 Kasım 2 kişi için jakuzili bungalov müsait mi? Fiyat nedir?", time: "01:45", wait: 900 },
  { t: "typing", wait: 1400 },
  { t: "out", h: "Merhaba! 3 gece için 2 seçeneğimiz müsait:<br><span class='price-l'>1) Jakuzili Bungalov: 16.500 TL</span><br><span class='price-l'>2) Havuzlu Villa: 22.000 TL</span><br>Fotoğraf göndermemi ister misiniz?", time: "01:45", wait: 2200 },
  { t: "in", h: "Evet lütfen, bungalovda şömine var mı?", time: "01:46", wait: 1200 },
  { t: "typing", wait: 1200 },
  { t: "out", h: "<div class='msg-photos'><span>Bungalov</span><span>Villa</span></div>Evet, gerçek odun şöminesi var 🔥 Ön rezervasyon oluşturayım mı?", time: "01:46", wait: 2200 },
  { t: "in", h: "Harika, bungalovu ayırtalım. Ahmet Yılmaz", time: "01:47", wait: 1000 },
  { t: "typing", wait: 1000 },
  { t: "out", h: "Teşekkürler Ahmet Bey! Kaydınız oluşturuldu ✅", time: "01:47", wait: 900 },
  { t: "sys", h: "🔔 Rezervasyon tesis sahibine iletildi", wait: 3800 },
];
let si = 0;
function runChat() {
  if (!chat) return;
  if (si >= script.length) {
    chat.style.transition = "opacity .5s";
    chat.style.opacity = 0;
    setTimeout(() => { chat.innerHTML = ""; chat.style.opacity = 1; si = 0; runChat(); }, 600);
    return;
  }
  const step = script[si++];
  $(".typing-dots", chat)?.remove();
  phoneStatus.textContent = "çevrimiçi";
  phoneStatus.classList.remove("typing");
  if (step.t === "typing") {
    chat.insertAdjacentHTML("beforeend", "<div class='typing-dots'><i></i><i></i><i></i></div>");
    phoneStatus.textContent = "yazıyor...";
    phoneStatus.classList.add("typing");
  } else if (step.t === "sys") {
    chat.insertAdjacentHTML("beforeend", `<div class='sys-note'>${step.h}</div>`);
  } else {
    chat.insertAdjacentHTML("beforeend", `<div class='msg ${step.t}'>${step.h}<time>${step.time}</time></div>`);
  }
  // Taşan eski mesajları kaldır
  const fits = () => {
    const kids = [...chat.children];
    const total = kids.reduce((s, k) => s + k.offsetHeight + 10, 0) + 32;
    return total <= chat.clientHeight;
  };
  while (!fits() && chat.children.length > 1) chat.firstElementChild.remove();
  setTimeout(runChat, step.wait);
}
runChat();

// ============ 3D EĞİM + FARE IŞIĞI ============
const phone = $("#heroPhone");
const glow = $("#cursorGlow");
if (finePointer && !reduced) {
  window.addEventListener("pointermove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
    if (phone) {
      const r = phone.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
        const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        phone.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 12}deg)`;
      }
    }
  }, { passive: true });

  // Kartlarda fareyi takip eden ışık
  $$(".spot").forEach(card => card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));

  // Mıknatıs butonlar
  $$(".magnetic").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });
}

// ============ SÜREÇ ÇİZGİSİ ============
const steps = $("#steps");
const stepsFill = $("#stepsFill");
const stepEls = $$(".step");
function updateSteps() {
  if (!steps) return;
  const r = steps.getBoundingClientRect();
  const p = Math.min(Math.max((innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.2), 0), 1);
  stepsFill.style.setProperty("--fill", p);
  stepsFill.style.transform = `scaleX(${p})`;
  stepEls.forEach((s, i) => s.classList.toggle("lit", p >= (i / stepEls.length) + 0.05 || p >= 0.98));
}

// ============ KAYIP HESAPLAYICI ============
const fmt = n => n.toLocaleString("tr-TR") + " TL";
const lostIn = $("#lostIn"), priceIn = $("#priceIn");
const calcMonth = $("#calcMonth");
function calc() {
  const lost = +lostIn.value, price = +priceIn.value;
  const month = lost * price;
  $("#lostOut").textContent = lost;
  $("#priceOut").textContent = fmt(price);
  calcMonth.textContent = fmt(month);
  $("#calcYear").textContent = fmt(month * 12);
  [lostIn, priceIn].forEach(i => i.style.setProperty("--p", ((i.value - i.min) / (i.max - i.min)) * 100 + "%"));
  calcMonth.classList.add("bump");
  clearTimeout(calc.t);
  calc.t = setTimeout(() => calcMonth.classList.remove("bump"), 150);
  $("#calcWa").href = waLink(
    `Merhaba, sitenizdeki hesaplayıcıyı kullandım. Ayda yaklaşık ${lost} müşteri kaçırıyoruz (aylık ${fmt(month)} kayıp). Tesisime özel ücretsiz demo görmek istiyorum.`
  );
}
if (lostIn) { lostIn.addEventListener("input", calc); priceIn.addEventListener("input", calc); calc(); }

// ============ VİDEO & SEKMELER ============
$$(".video-play").forEach(btn => {
  const vid = document.getElementById(btn.dataset.playFor);
  if (!vid) return;
  btn.addEventListener("click", () => { vid.play(); });
  vid.addEventListener("play", () => btn.classList.add("hide"));
  vid.addEventListener("pause", () => btn.classList.remove("hide"));
  vid.addEventListener("ended", () => btn.classList.remove("hide"));
});

const vTabs = $$("[data-video-tab]");
vTabs.forEach(tab => tab.addEventListener("click", () => {
  const key = tab.dataset.videoTab;
  vTabs.forEach(t => {
    const on = t === tab;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on ? "true" : "false");
  });
  $$(".site-video").forEach(v => { try { v.pause(); } catch {} });
  $$(".video-panel").forEach(p => {
    const on = p.id === `vpanel-${key}`;
    p.classList.toggle("active", on);
    if (on) $$(".reveal", p).forEach(el => el.classList.add("visible"));
  });
}));

// ============ PAKET → FORM ============
const hizmetSel = $("#hizmetSel");
$$("[data-paket]").forEach(b => b.addEventListener("click", () => {
  const map = { "Başlangıç": "Web Sitesi", "Tesis Pro": "Tesis Pro (Site + Asistan)", "Otomasyon": "İş Otomasyonu" };
  if (hizmetSel) hizmetSel.value = map[b.dataset.paket] || hizmetSel.value;
}));

// ============ FORM → WHATSAPP ============
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const text =
    `Merhaba, web sitenizden yazıyorum.\n\n` +
    `Ad: ${f.get("ad")}\n` +
    (f.get("isletme") ? `İşletme: ${f.get("isletme")}\n` : "") +
    `İletişim: ${f.get("iletisim")}\n` +
    `Hizmet: ${f.get("hizmet")}\n` +
    `Mesaj: ${f.get("mesaj") || "-"}`;
  window.open(waLink(text), "_blank");
});

// ============ WHATSAPP BALONU ============
const bubble = $("#waBubble");
if (bubble && !sessionStorage.getItem("waBubbleClosed")) {
  setTimeout(() => bubble.classList.add("show"), 9000);
}
$("#waBubbleX")?.addEventListener("click", () => {
  bubble.classList.remove("show");
  sessionStorage.setItem("waBubbleClosed", 1);
});

$("#year").textContent = new Date().getFullYear();
onScroll();
