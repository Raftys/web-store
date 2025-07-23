// Function to create and display notification
async function showNotification(message, type="info") {
    try {
        const path = '/components/built/toast/toast.html';
        const response = await fetch(path);

        if (!response.ok) {
            console.log('Failed to load toast HTML');
            return;
        }


        const toastHtml = await response.text();
        const container = document.createElement('div');
        container.innerHTML = toastHtml.trim();
        const toast = container.firstElementChild;
        const toast_title = toast.querySelector('.toast_title');

        switch (type) {
            case "info":
                toast_title.textContent = "Info Message";
                toast.querySelector('.wave').style.fill= 'var(--blue-500)';
                toast.querySelector('.icon_container').style.background= 'var(--blue-500)';
                toast.querySelector('.toast_icon').style.color= 'var(--blue-700)';
                toast.querySelector('.toast_title').style.color= 'var(--blue-500)';
                break;
            case "error":
                toast_title.textContent = "Error Message";
                toast.querySelector('.wave').style.fill= 'var(--red-500)';
                toast.querySelector('.icon_container').style.background= 'var(--red-500)';
                toast.querySelector('.toast_icon').style.color= 'var(--red-700)';
                toast.querySelector('.toast_title').style.color= 'var(--red-500)';
                break;
        }

        const toast_message = toast.querySelector('.toast_text');
        toast_message.textContent = message;

        // Ensure toast shows on top and visible
        Object.assign(toast.style, {
            position: 'fixed',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            display: 'flex',
        });


        document.body.appendChild(toast);

        // Add close button behavior
        const closeBtn = toast.querySelector('.cross_icon');
        if (closeBtn) {
            closeBtn.style.cursor = 'pointer';
            closeBtn.addEventListener('click', () => toast.remove());
        }

        // Optional auto-remove after 4 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    } catch (error) {
        console.error('Error showing toast:', error);
    }
}



let item_name = "name";
function loadItemName(product_id) {
    return fetch('../../../include/shop/product_preview.php', { // Make sure the path is correct relative to product.html
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'product_id': product_id // Send the product ID to the PHP script
        })
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            if (data && !data.error) { // Check if there's data and no error
                // Populate the product details in the HTML
                item_name = data.name;
                return item_name;
            } else {
                console.error('Error in data:', data.error);
                return null;
            }
        })
        .catch(error => console.error('Error fetching product details:', error));
}

function setElementValueOrContent(id, value) {
    const element = document.getElementById(id);
    if (element) {
        if (element.tagName === 'INPUT') {
            // If it's an input or textarea, set the value
            element.value = value;
        } else {
            // Otherwise, set the innerHTML
            element.innerHTML = value;
        }
    } else {
        console.warn(`Element with ID '${id}' not found.`);
    }
}

let logged_in =0;
function setLogged_in(value) {
    this.logged_in = value;
}
function getLogged_in() {
    return logged_in === 1;  // Will return true if logged_in is 1, false if it is 0
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}