// Declare a variable to hold product data
let products;

// Initialize page on window load
document.addEventListener('DOMContentLoaded', async function () {
    // Get the 'user' query parameter from the URL
    const super_user = getQueryParameter('user');

    // If the user is 'super', display the "Add Product" button
    if (super_user === 'super') {
        document.getElementById('add_product').style.display = 'flex';
    }

    // Initialize the page with the user type
    await initPage(super_user);
});

// Fetch all products from the server
function fetchProducts() {
    // Create a FormData object for the POST request
    const formData = new FormData();

    // Add the 'fetch_products' action to the request
    formData.append('action', 'fetch_products');

    // Send a POST request to fetch products
    return fetch('../../include/shop/shop.php', {
        method: 'POST',
        body: formData
    })
        // Check if the response is OK, else throw an error
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            // Parse the response as JSON
            return response.json();
        });
}

// Load and display products on the page
async function loadProducts(super_user = null) {
    // Fetch the container element for product items
    const itemList = document.querySelector('#item_list');

    // Clear any existing product items
    itemList.innerHTML = '';

    // If no products exist, display a message
    if (products.length <= 0) {
        itemList.innerHTML = '<p>No items found.</p>';
        return;
    }

    // Load the product card HTML template
    const productHTML = await loadHtmlComponent('../../components/built/card/product.html');

    // Loop through each product and create a product card
    products.forEach(item => {
        // Clone the product card template
        const productCard = productHTML.cloneNode(true);

        // Set the product card's ID
        productCard.setAttribute('id', item.id);

        // Set product image
        productCard.querySelector('#product_image').src = item.main_image;

        // Set product name
        productCard.querySelector('#product_name').textContent = item.name;

        // Set product small description
        productCard.querySelector('#product_small_description').textContent = item.small_description;

        // If the user is a regular user (not superuser)
        if (super_user === null) {
            // Display product price and price per item
            productCard.querySelector('#product_price').textContent = t('total') + item.price + '€';
            productCard.querySelector('#product_price_per_item').textContent = t('per_item') + item.price + '€';

            // Setup decrement quantity button
            productCard.querySelector('.decrease_button').addEventListener('click', (event) => {
                // Prevent event bubbling
                event.stopPropagation();
                // Decrease quantity
                decrementQuantity(productCard, item);
            });

            // Setup increment quantity button
            productCard.querySelector('.increase_button').addEventListener('click', (event) => {
                // Prevent event bubbling
                event.stopPropagation();
                // Increase quantity
                incrementQuantity(productCard, item);
            });

            // Navigate to product details page on card click
            productCard.addEventListener('click', () => {
                window.location.href = `main.php?page=product&product_id=${item.id}`;
            });

            // Prevent event bubbling when clicking on the money container
            productCard.querySelector('#money_container').addEventListener('click', (event) => {
                event.stopPropagation();
            });

            // Add to cart button logic
            productCard.querySelector('.add_button').addEventListener('click', (event) => {
                // Prevent event bubbling
                event.stopPropagation();
                // Get selected quantity
                item.quantity = parseInt(productCard.querySelector('#quantity').textContent);
                // Add product to cart
                addItem(item);
            });
        } else {
            // If the user is super, replace money container with an edit button
            productCard.querySelector('#money_container').innerHTML = '<button class="simple_button" id="edit_product" data-i18n="edit"></button>';
            // Add event listener to open product edit form
            productCard.querySelector('#edit_product').addEventListener('click', () => {
                openProductForm(item);
            });
        }

        // Append the product card to the item list
        itemList.appendChild(productCard);
    });
}

// Initialize the page by fetching and loading products
async function initPage(super_user) {
    // Fetch products and convert them to an array
    products = toArray(await fetchProducts());
    // Load the products into the page
    await loadProducts(super_user);
}

// Convert value to an array if it isn't already
function toArray(value) {
    return Array.isArray(value) ? value : [value];
}
