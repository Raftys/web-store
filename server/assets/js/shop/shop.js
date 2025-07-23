document.addEventListener('DOMContentLoaded', function () {
    fetch('../../include/shop/fetch_products.php')
        .then(response => response.json())
        .then(async data => {
            const itemList = document.querySelector('#item_list');
            if (data.length > 0) {

                // Fetch html
                const productResponse = await fetch('../../components/built/product/product.html');
                const product = await productResponse.text();

                data.forEach(item => {

                    const productHTML = product;

                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = productHTML.trim();
                    const productCard = wrapper.firstElementChild;

                    productCard.setAttribute('id',item.id);

                    productCard.querySelector('#product_image').src = item.main_image;
                    productCard.querySelector('#product_name').textContent=item.name;
                    productCard.querySelector('#product_price').textContent='Total: ' + item.price + '€';
                    productCard.querySelector('#product_price_per_item').textContent='Per Item: ' + item.price + '€';
                    productCard.querySelector('.decrease_button').addEventListener('click',() => {
                        event.stopPropagation()
                        decrementQuantity(productCard,item);
                    });
                    productCard.querySelector('.increase_button').addEventListener('click',() => {
                        event.stopPropagation()
                        incrementQuantity(productCard,item);
                    });

                    productCard.addEventListener('click', () => {
                        window.location.href = `main.php?page=product&product_id=${item.id}`;
                    });

                    productCard.querySelector('.add_button').style.display='flex';

                    productCard.querySelector('#money_container').addEventListener('click', () => {
                        event.stopPropagation();
                    })

                    productCard.querySelector('.add_button').addEventListener('click', () => {
                        event.stopPropagation();
                        // add to cart
                        item.quantity = parseInt(productCard.querySelector('#quantity').textContent);
                        addItem(item);
                    })



                    itemList.appendChild(productCard);
                });
            } else {
                itemList.innerHTML = '<p>No items found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });
});



