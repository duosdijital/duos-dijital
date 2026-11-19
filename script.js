// WhatsApp numarası (başında + olmadan, ülke koduyla)
const WHATSAPP_NO = "905000000000";

// Menü kaydırınca koyulaşsın
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20));

// Mobil menü
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  menuBtn.classList.remove("open");
  navLinks.classList.remove("open");
}));

// Tüm öğeleri anında görünür yap ve sayaçları başlat
document.querySelectorAll(".reveal").forEach((el) => {
  el.classList.add("visible");
  el.querySelectorAll("[data-count]").forEach(countUp);
});

// Sayaç animasyonu
function countUp(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || "";
  const start = performance.now();
  const dur = 1400;
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Form: mesajı WhatsApp'ta hazır açar
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const text =
    `Merhaba, web sitenizden yazıyorum.\n\n` +
    `Ad: ${f.get("ad")}\n` +
    `İletişim: ${f.get("iletisim")}\n` +
    `Hizmet: ${f.get("hizmet")}\n` +
    `Mesaj: ${f.get("mesaj") || "-"}`;
  window.open(`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(text)}`, "_blank");
});

document.getElementById("year").textContent = new Date().getFullYear();
