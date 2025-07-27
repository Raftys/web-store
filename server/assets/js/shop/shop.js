let products;

// Fetch all products from the server
function fetchProducts() {
    const formData = new FormData();
    formData.append('action', 'fetch_products');
    return fetch('../../include/shop/shop.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();  // parse JSON here
        });
}

// Load and display products on the page
async function loadProducts(super_user = null) {
    // Fetch the container element for product items
    const itemList = document.querySelector('#item_list');

    itemList.innerHTML = '';
    if (products.length <= 0) {
        itemList.innerHTML = '<p>No items found.</p>';
        return;
    }

    // Load the product card HTML template
    const productHTML = await loadHtmlComponent('../../components/built/product/product.html');

    // Loop through each product and create a product card
    products.forEach(item => {
        const productCard = productHTML.cloneNode(true);

        productCard.setAttribute('id', item.id);

        productCard.querySelector('#product_image').src = item.main_image;
        productCard.querySelector('#product_name').textContent = item.name;
        productCard.querySelector('#product_small_description').textContent = item.small_description;

        if(super_user === null) {
            productCard.querySelector('#product_price').textContent = 'Total: ' + item.price + '€';
            productCard.querySelector('#product_price_per_item').textContent = 'Per Item: ' + item.price + '€';

            // Setup decrement quantity button
            productCard.querySelector('.decrease_button').addEventListener('click', (event) => {
                event.stopPropagation();
                decrementQuantity(productCard, item);
            });

            // Setup increment quantity button
            productCard.querySelector('.increase_button').addEventListener('click', (event) => {
                event.stopPropagation();
                incrementQuantity(productCard, item);
            });

            // Navigate to product details page on card click
            productCard.addEventListener('click', () => {
                window.location.href = `main.php?page=product&product_id=${item.id}`;
            });

            productCard.querySelector('.add_button').style.display = 'flex';

            // Prevent event bubbling on money container click
            productCard.querySelector('#money_container').addEventListener('click', (event) => {
                event.stopPropagation();
            });

            // Add to cart button logic
            productCard.querySelector('.add_button').addEventListener('click', (event) => {
                event.stopPropagation();
                item.quantity = parseInt(productCard.querySelector('#quantity').textContent);
                addItem(item);
            });
        } else {
            productCard.querySelector('#money_container').innerHTML = '<button class="simple_button" id="edit_product">Edit</button>';
            productCard.querySelector('#edit_product').addEventListener('click', () => {
                openProductForm(item)
            })
        }
        itemList.appendChild(productCard);
    });
}

// Initialize page on window load
window.onload = async function () {
    const super_user = getQueryParameter('user');
    if (super_user === 'super') {
        document.getElementById('add_product').style.display = 'flex';
    }
    await initPage(super_user)
};

async function initPage(supe_user) {
    products = toArray(await fetchProducts());
    await loadProducts(supe_user);
}

function toArray(value) {
    return Array.isArray(value) ? value : [value];
}

