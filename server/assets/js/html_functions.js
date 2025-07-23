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