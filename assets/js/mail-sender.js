// Initialize EmailJS
(function () {
    emailjs.init("QWydQI-gge4zgXq1U");
})();

const mailerForm = document.getElementById('dashliroMailerForm');
const successMsg = document.getElementById('dashliroSuccessMsg');
const errorMsg = document.getElementById('dashliroErrorMsg');
const loadingOverlay = document.getElementById('loading-overlay');

if (mailerForm) {
    mailerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';
        loadingOverlay.style.display = 'flex';

        const templateParams = {
            name: document.getElementById('dashliroRecipientName').value.trim(),
            package_summary: document.getElementById('dashliroPackageSummary').value.trim(),
            address: document.getElementById('dashliroDeliveryAddress').value.trim(),
            tracking_id: document.getElementById('dashliroTrackingId').value.trim(),
            email: document.getElementById('dashliroRecipientEmail').value.trim()
        };

        try {
            const response = await emailjs.send(
                "service_xryhlm2",
                "template_g9ncgh6",
                templateParams
            );
            loadingOverlay.style.display = 'none';
            successMsg.style.display = 'block';
            mailerForm.reset();
            console.log("Email sent successfully:", response.status, response.text);

            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 3000);

        } catch (err) {
            loadingOverlay.style.display = 'none';
            errorMsg.style.display = 'block';
            console.error("Email sending failed:", err);

            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 3000);

        }
    });
}