function setLanguage(lang) {
    fetch(`../../../components/lang/lang-${lang}.json`)
        .then(response => response.json())
        .then(data => {
            currentLang = lang;
            localStorage.setItem("lang", lang);
            document.documentElement.lang = lang; // update <html lang="">
            temp = data;

            observer.disconnect(); // 🔴 Stop observing temporarily
            updateTexts(data);
            observer.observe(document.body, { childList: true, subtree: true }); // 🟢 Resume observing
        });
}

function updateTexts(translations) {
    // Update text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });

    // Update data-tooltip attributes
    document.querySelectorAll("[data-i18n-tooltip]").forEach(el => {
        const key = el.getAttribute("data-i18n-tooltip");
        if (translations[key]) {
            el.setAttribute("data-i18n-tooltip", translations[key]);
        }
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[key]) {
            el.setAttribute("placeholder", translations[key]);
        }
    });
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
    let currentLang = localStorage.getItem("lang") || "en"; // default to English
    setLanguage(currentLang);
});

// Create the observer
const observer = new MutationObserver(() => {
    let currentLang = localStorage.getItem("lang") || "en"; // default English;
    setLanguage(currentLang);
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });
