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
            <h2>Bank Details</h2>
            <p>Bank Name 1: IBAN1234567890</p>
            <p>Bank Name 2: IBAN0987654321</p>
            <p>Bank Name 3: IBAN1122334455</p>
            <input type="text" id="receipt" placeholder="Enter Payment Receipt Number">
            <button disabled id="complete-button" onclick="completePayment()">Ολοκλήρωση</button>
        `;
    } else if (contentType === "iris") {
        // IRIS scenario content
        modalContent.innerHTML = `
            <h2>IRIS</h2>
            <p>Phone Number: 123456789</p>
            <input type="text" id="receipt" placeholder="Enter Payment Receipt Number">
            <button id= "complete-button" onclick="completePayment()">Ολοκλήρωση</button>
        `;
    } else if (contentType === "credit-card"){
        modalContent.innerHTML = `<h2>Coming Soon...</h2>`;
    }
}

// Function to handle the payment completion button click

// Open modal button click event (for testing, you can choose scenario dynamically)

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

function checkReceiptInput() {
    const receiptInput = document.getElementById("receipt");
    const completeButton = document.getElementById("complete-button");
    completeButton.disabled = receiptInput.value.trim() === "";
}