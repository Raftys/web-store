// Get modal elements
let modal = document.getElementById("myModal");
let modalContent = document.getElementById("modal-body");
let closeButton = document.getElementsByClassName("close")[0];

// Function to open the modal
function openModal(contentType) {
    modal.style.display = "block";

    if (contentType === "bank") {
        // Bank scenario content
        modalContent.innerHTML = `
            <h2>Πληροφορίες Τράπεζας</h2>
            <p><span class="bold-text">Τράπεζα Πειραιώς:</span> GR 290172 2490 0052 4909 3136868</p>
            <p>Το συνολικό ποσό που πρέπει να σταλθεί είναι <span id="final_amount" class="bold-text"></span></p>
            <input type="text" id="receipt" placeholder="Enter Payment Receipt Number" oninput="checkReceiptInput()">
            <button class="modal-button" id="complete-button" onclick="completePayment()" disabled>Ολοκλήρωση</button>
        `;
    } else if (contentType === "iris") {
        // IRIS scenario content
        modalContent.innerHTML = `
            <h2>IRIS</h2>
            <p><span class="bold-text">Τηλέφωνο:</span> 6945793397</p>
            <p>Το συνολικό ποσό που πρέπει να σταλθεί είναι <span id="final_amount" class="bold-text"></span></p>
            <input type="text" id="receipt" placeholder="Enter Payment Receipt Number" oninput="checkReceiptInput()">
            <button class="modal-button" id="complete-button" onclick="completePayment()" disabled>Ολοκλήρωση</button>
        `;
    } else if (contentType === "credit-card") {
        modalContent.innerHTML = `<h2>Coming Soon...</h2>`;
    }

    // Set the final amount
    document.getElementById('final_amount').textContent = getFinalAmount() + '€';
}

// Function to check if the receipt input is not empty
function checkReceiptInput() {
    const receiptInput = document.getElementById("receipt");
    const completeButton = document.getElementById("complete-button");
    // Enable the button if the receipt input is not empty
    completeButton.disabled = receiptInput.value.trim() === "";
}

// Close modal when the 'x' is clicked
closeButton.onclick = function() {
    modal.style.display = "none";
}

// Close modal when clicking outside the modal
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
