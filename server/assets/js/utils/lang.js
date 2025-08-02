let translations;
let currentLang;

function setLanguage(lang) {
    return fetch(`../../../components/lang/lang-${lang}.json`) // ✅ Return the promise!
        .then(response => response.json())
        .then(data => {
            translations = data;
            currentLang = lang;
            document.documentElement.lang = lang;

            observer.disconnect();
            updateTexts();
            observer.observe(document.body, { childList: true, subtree: true });
        });
}


function updateTexts() {
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

function t(key, params = {}) {
    let text = translations[key] || key;
    for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

// Run on page load
window.languageReady = (async () => {
    currentLang = localStorage.getItem("lang") || "en";
    await setLanguage(currentLang);
})();



// Create the observer
const observer = new MutationObserver(async () => {
    currentLang = localStorage.getItem("lang") || "en";
    await setLanguage(currentLang);
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });
