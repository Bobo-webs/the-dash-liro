// ====================== IMPORTS ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

// ====================== CONFIG ======================
const firebaseConfig = {
    apiKey: "AIzaSyDsElhTPwA5F0_jU9hbrGHlSXjUj4SbEd4",
    authDomain: "dashliro.firebaseapp.com",
    databaseURL: "https://dashliro-default-rtdb.firebaseio.com",
    projectId: "dashliro",
    storageBucket: "dashliro.firebasestorage.app",
    messagingSenderId: "579044733911",
    appId: "1:579044733911:web:0a54acc9dc96a1265fd192",
    measurementId: "G-EJX8ELYMHZ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ====================== SEARCH HANDLER ======================
document.querySelectorAll(".id-search").forEach(button => {
    button.addEventListener("click", async (e) => {
        e.preventDefault();

        const input = button.parentElement.querySelector("input");
        const trackingId = input.value.trim().toUpperCase();

        if (!trackingId) {
            alert("Please enter a Tracking ID.");
            return;
        }

        try {
            const snapshot = await get(child(ref(db), `tracking/${trackingId}`));
            if (snapshot.exists()) {
                const trackingData = snapshot.val();

                // ✅ Include the trackingId itself
                const dataToStore = {
                    value: { id: trackingId, ...trackingData },
                    expiry: Date.now() + 10 * 60 * 1000 // 10 minutes
                };

                localStorage.setItem("trackingData", JSON.stringify(dataToStore));
                window.location.href = "track.html";
            } else {
                alert("Tracking ID not found. Please check and try again.");
            }
        } catch (error) {
            console.error("Error fetching tracking data:", error);
            alert("Failed to retrieve tracking data. Try again later.");
        }
    });
});

// ====================== AUTO CLEAR EXPIRED DATA ======================
setInterval(() => {
    const stored = localStorage.getItem("trackingData");
    if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() > parsed.expiry) {
            localStorage.removeItem("trackingData");
            console.log("Tracking data expired and cleared from localStorage.");
        }
    }
}, 60 * 1000);
