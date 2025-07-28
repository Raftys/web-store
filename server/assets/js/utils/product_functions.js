// Increment the quantity of the product
function incrementQuantity(productCard = null, item = null) {
    if(item == null) {
        const quantity = parseInt(document.getElementById("quantity").textContent);
        document.getElementById("quantity").textContent = String(quantity + 1);
        updatePrice(quantity+1);
    } else {
        let quantity = productCard.querySelector('#quantity').textContent;
        let new_quantity = parseInt(quantity) + 1;
        productCard.querySelector('#quantity').textContent = String(new_quantity);
        productCard.querySelector('#product_price').textContent= 'Total: ' + (item.price*new_quantity).toFixed(2) + '€';
    }
}

// Decrement the quantity of the product
function decrementQuantity(productCard = null, item = null) {
    if (item == null) {
        const quantity = parseInt(document.getElementById("quantity").textContent);
        if (quantity > 1) {
            document.getElementById("quantity").textContent = String(quantity - 1);
            updatePrice(quantity-1);
        }
    } else {
        let quantity = productCard.querySelector('#quantity').textContent;
        let new_quantity = 1;
        if (quantity > 1) {
            new_quantity = parseInt(quantity) - 1;
        }
        productCard.querySelector('#quantity').textContent = String(new_quantity);
        productCard.querySelector('#product_price').textContent='Total: ' + (item.price*new_quantity).toFixed(2) + '€';
    }
}

// Update the displayed price based on the quantity
function updatePrice(quantity) {
    // Get quantity
    const priceDisplay = document.getElementById('product_price');
    if (priceDisplay) {
        const totalPrice = (product_info.get("price") * quantity).toFixed(2);
        priceDisplay.innerText = `Τιμή: ${totalPrice}€`;
    }
}

// Prepare the FormData object with product information
function prepareItems(item) {
    let product_info = new FormData();
    product_info.append('name',item.name);
    product_info.append('id',item.id);
    product_info.append('image',item.main_image);
    product_info.append('price',item.price);
    product_info.append('offer',"no");
    product_info.append("quantity",item.quantity);
    return product_info;
}

// Add an item to the cart by sending a POST request
function addItem(item) {
    const formData = prepareItems(item)
    formData.append('action','add');
    fetch('../../include/cart/cart.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse JSON if the response is OK
        })
        .then(data => {
            document.getElementById('cart_label').innerText = `(${data.totalItems})`;
            if(formData.get('quantity') >0 ){
                showNotification(`Το προϊόν ${formData.get("name")} έχει προστεθεί στο καλάθι σας.`, "success").catch(console.error);
                return false;
            } else {
                showNotification(`Το προϊόν ${formData.get("name")} έχει αφαιρεθεί στο καλάθι σας.`, "info").catch(console.error);
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error); // Log the error for debugging
            alert("Error: " + error.message); // Display the error message
        });
}
