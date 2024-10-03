document.addEventListener('DOMContentLoaded', function () {
    fetch('fetch_products.php')
        .then(response => response.json())
        .then(data => {
            const itemList = document.querySelector('.item-list');
            if (data.length > 0) {
                data.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    itemDiv.setAttribute("product_id",item.id);
                    itemDiv.innerHTML = `
                        <img src="${item.image}" alt="">
                        <div class="item-text">
                            <h2>${item.name}</h2>
                            <p>${item.description}</p>
                            <p>Price: ${parseFloat(item.price).toFixed(2)}€</p>                       
                        </div>
                        <button class="buy-button" >Προσθήκη</button>
                    `;
                    itemList.appendChild(itemDiv);

                    itemDiv.addEventListener('click', function () {
                        const productId = this.getAttribute('product_id'); // Get product ID from clicked item
                        document.getElementById('product_id_input').value = productId; // Set hidden input value
                        document.getElementById('productForm').submit(); // Submit the form
                    });
                });
            } else {
                itemList.innerHTML = '<p>No items found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });
});

function handleclick(itemId) {
    window.location.href = 'main.php?ProductZpage=home'; // Redirect
}