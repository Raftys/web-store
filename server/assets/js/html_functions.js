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
// Utility function to get query parameters from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}