// Show a notification toast with a message and type (info or error)
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
                toast.querySelector('.wave').style.fill= 'var(--blue)';
                toast.querySelector('.icon_container').style.background= 'var(--blue)';
                toast.querySelector('.toast_icon').style.color= 'var(--secondary)';
                toast.querySelector('.toast_title').style.color= 'var(--blue)';
                break;
            case "error":
                toast_title.textContent = "Error Message";
                toast.querySelector('.wave').style.fill= 'var(--red)';
                toast.querySelector('.icon_container').style.background= 'var(--red)';
                toast.querySelector('.toast_icon').style.color= 'var(--secondary)';
                toast.querySelector('.toast_title').style.color= 'var(--red)';
                break;
        }

        const toast_message = toast.querySelector('.toast_text');
        toast_message.textContent = message;

        // Style toast to be fixed and visible on screen
        Object.assign(toast.style, {
            position: 'fixed',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            display: 'flex',
        });

        document.body.appendChild(toast);

        // Add close button functionality
        const closeBtn = toast.querySelector('.cross_icon');
        if (closeBtn) {
            closeBtn.style.cursor = 'pointer';
            closeBtn.addEventListener('click', () => toast.remove());
        }

        // Automatically remove toast after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    } catch (error) {
        console.error('Error showing toast:', error);
    }
}

// Set the value or content of an element by ID
function setElementValueOrContent(id, value) {
    const element = document.getElementById(id);
    if (element) {
        if (element.tagName === 'INPUT') {
            // If element is an input, set its value
            element.value = value;
        } else {
            // Otherwise, set innerHTML content
            element.innerHTML = value;
        }
    } else {
        console.warn(`Element with ID '${id}' not found.`);
    }
}
