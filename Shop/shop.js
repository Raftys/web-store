document.addEventListener('DOMContentLoaded', function () {
    fetch('fetch_products.php')
        .then(response => response.json())
        .then(data => {
            const itemList = document.querySelector('.item-list');
            if (data.length > 0) {
                data.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    itemDiv.innerHTML = `
                        <h2>${item.name}</h2>
                        <p>${item.description}</p>
                        <p>Price: $${parseFloat(item.price).toFixed(2)}</p>
                    `;
                    itemList.appendChild(itemDiv);
                });
            } else {
                itemList.innerHTML = '<p>No items found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });
});
