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
