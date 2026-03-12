// Initialize EmailJS
(function () {
    emailjs.init("QWydQI-gge4zgXq1U");
})();

const form = document.getElementById("contact-form");
const popup = document.getElementById("dashliroContactPopup");
const overlay = document.getElementById("dashliroContactOverlay");
const title = document.getElementById("dashliroContactTitle");
const message = document.getElementById("dashliroContactMessage");
const closeBtn = document.getElementById("dashliroContactClose");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const templateParams = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim(),
    };

    // Show loading overlay
    overlay.style.display = "block";
    popup.style.display = "block";
    title.textContent = "Sending...";
    message.textContent = "Please wait while we send your message.";
    popup.classList.add("sending");

    try {
        await emailjs.send("service_xryhlm2", "template_p4rwnkt", templateParams);
        title.textContent = "✅ Message Sent!";
        message.textContent = "Your message has been successfully delivered.";
        popup.classList.remove("sending");
        popup.classList.add("success");
        form.reset();

        // ✅ Hide popup after 3 seconds
        setTimeout(() => {
            popup.style.display = "none";
            overlay.style.display = "none";
            popup.classList.remove("success");
        }, 3000);

    } catch (error) {
        console.error("Email send failed:", error);
        title.textContent = "❌ Message Failed!";
        message.textContent = "Something went wrong. Please try again later.";
        popup.classList.remove("sending");
        popup.classList.add("error");

        // ❌ Hide popup after 3 seconds
        setTimeout(() => {
            popup.style.display = "none";
            overlay.style.display = "none";
            popup.classList.remove("error");
        }, 3000);
    }

});

// Close popup handler
closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";
});

// Click outside popup to close
overlay.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";
});