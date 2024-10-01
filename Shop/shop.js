document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;

    fetch('/add-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: productName, price: productPrice })
    })
        .then(response => response.json())
        .then(data => {
            displayProduct(data);
            document.getElementById('productForm').reset();
        });
});

function displayProduct(product) {
    const productList = document.getElementById('productList');
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `<h3>${product.name}</h3><p>Price: $${product.price}</p>`;
    productList.appendChild(productDiv);
}
