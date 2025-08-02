// Run this on every page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(savedTheme);
});

// Show a notification toast with a message and type (info or error)
async function showNotification(message, type="info") {
    try {
        const path = '/components/built/toast/toast.html';
        const response = await fetch(path);

        if (!response.ok) {
            console.log('Failed to load toast HTML');
            return;
        }

        const toastHtml = await response.text();
        const container = document.createElement('div');
        container.innerHTML = toastHtml.trim();
        const toast = container.firstElementChild;
        const toast_title = toast.querySelector('.toast_title');

        switch (type) {
            case "info":
                toast_title.textContent = t('toast_info');
                toast.querySelector('.wave').style.fill= 'var(--blue)';
                toast.querySelector('.icon_container').style.background= 'var(--blue)';
                toast.querySelector('.toast_icon').style.color= 'var(--secondary)';
                toast.querySelector('.toast_title').style.color= 'var(--blue)';
                break;
            case "error":
                toast_title.textContent =  t('toast_error');
                toast.querySelector('.wave').style.fill= 'var(--red)';
                toast.querySelector('.icon_container').style.background= 'var(--red)';
                toast.querySelector('.toast_icon').style.color= 'var(--secondary)';
                toast.querySelector('.toast_title').style.color= 'var(--red)';
                break;
        }

        const toast_message = toast.querySelector('.toast_text');
        toast_message.textContent = message;

        // Style toast to be fixed and visible on screen
        Object.assign(toast.style, {
            position: 'fixed',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            display: 'flex',
        });

        document.body.appendChild(toast);

        // Add close button functionality
        const closeBtn = toast.querySelector('.cross_icon');
        if (closeBtn) {
            closeBtn.style.cursor = 'pointer';
            closeBtn.addEventListener('click', () => toast.remove());
        }

        // Automatically remove toast after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    } catch (error) {
        console.error('Error showing toast:', error);
    }
}

// Load an HTML component from a given path and return its first element
async function loadHtmlComponent(path) {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            console.error(`Failed to load HTML from: ${path}`);
            return null;
        }

        const html = await response.text();

        const container = document.createElement('div');
        container.innerHTML = html.trim();

        return container.firstElementChild;
    } catch (error) {
        console.error(`Error loading component from ${path}:`, error);
        return null;
    }
}

// Get a query parameter value by name from the current URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Apply saved theme or system default on load
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme); // Apply light or dark
}

// Apply saved language on load
function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    setLanguage(lang);
}

function replaceText(itemHTMl = null, id, message) {
    if (itemHTMl != null) {
        itemHTMl.querySelector(id).removeAttribute('data-i18n');
        itemHTMl.querySelector(id).textContent = message;
    } else {
        document.querySelector(id).removeAttribute('data-i18n');
        document.querySelector(id).textContent = message;
    }
}


