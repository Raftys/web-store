document.addEventListener('DOMContentLoaded', function() {
    // Get the current URL's search parameters (everything after '?')
    const params = new URLSearchParams(window.location.search);

    // Get the 'id' parameter from the URL
    const id = params.get('product_id');
    alert(id);
});