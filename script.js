
// ==========================================
// 1. منطق الفيديو الترحيبي (Intro Video Handler)
// ==========================================
const intro = document.getElementById("intro");
const video = document.getElementById("introVideo");

if (video && intro) {
    // عند انتهاء الفيديو، يتم إخفاؤه بتأثير تدريجي
    video.addEventListener("ended", function () {
        intro.classList.add("hide");

        setTimeout(function () {
            intro.style.display = "none";
        }, 800);
    });

    // كاحتياط: إخفاء الفيديو تلقائياً بعد 5 ثوانٍ إذا حدثت مشكلة في التشغيل
    setTimeout(() => {
        if (intro.style.display !== "none") {
            intro.style.opacity = "0";
            setTimeout(() => {
                intro.style.display = "none";
            }, 800);
        }
    }, 5000);
}


// ==========================================
// 2. نظام ترجمة اللغات (Language Translation)
// ==========================================
let currentLang = localStorage.getItem("engiflowLang") || "en";

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("engiflowLang", lang);

    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

    // ترجمة جميع العناصر التي تحتوي على data-en و data-ar
    document.querySelectorAll("[data-en][data-ar]").forEach(element => {
        const translatedText = element.getAttribute(`data-${currentLang}`);
        if (translatedText) {
            element.textContent = translatedText;
        }
    });

    // تحديث نص زر اللغة
    const langLabel = document.getElementById("langLabel");
    if (langLabel) {
        langLabel.textContent = currentLang === "en" ? "العربية" : "English";
    }

    // تحديث عنوان الصفحة (Title)
    document.title = currentLang === "en"
        ? "EngiFlow AI | Smart Engineering"
        : "EngiFlow AI | منصة هندسية ذكية";
}

// تطبيق اللغة المخزنة فور تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);
});

// تفعيل زر تبديل اللغة عند الضغط عليه
const langBtn = document.getElementById("langBtn");
if (langBtn) {
    langBtn.addEventListener("click", () => {
        const newLang = currentLang === "en" ? "ar" : "en";
        applyLanguage(newLang);
    });
}