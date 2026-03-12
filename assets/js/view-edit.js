// ====================== IMPORTS ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, onValue, set, remove, get, child, push } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

// ====================== ELEMENTS ======================
const logoutButton = document.getElementById("logoutButton");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmationPopup = document.getElementById("confirmationPopup");
const popupOverlay = document.getElementById("popupOverlay");
const loadingScreen = document.getElementById("loading-overlay");
const dashboardContent = document.getElementById("dashboard-content");

const trackingForm = document.getElementById("trackingForm");
const resetFormBtn = document.getElementById("resetFormBtn");

const trackingTableBody = document.getElementById("trackingTableBody");

// Track the currently editing tracking ID
let editingTrackingId = null;

// ====================== LOADING ======================
function showLoading() {
    loadingScreen.style.display = "flex";
    loadingScreen.style.opacity = "1";
    dashboardContent.style.display = "none";
}

function hideLoading() {
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
        loadingScreen.style.display = "none";
        dashboardContent.style.display = "block";
    }, 300);
}

// ====================== AUTH ======================
document.addEventListener("DOMContentLoaded", () => {
    showLoading();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            hideLoading();
            loadTrackingData();
        } else {
            window.location.href = "login-admin.html";
        }
    });
});

// ====================== FETCH TRACKING DATA ======================
function loadTrackingData() {
    const trackingRef = ref(database, "tracking");
    onValue(trackingRef, (snapshot) => {
        trackingTableBody.innerHTML = "";

        if (!snapshot.exists()) {
            trackingTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center;">No tracking records yet.</td></tr>`;
            return;
        }

        snapshot.forEach((childSnap) => {
            const data = childSnap.val();
            const row = document.createElement("tr");

            const progressStr = data.progress
                ? `${data.progress.location || "N/A"} / ${data.progress.date || "N/A"} / ${data.progress.time || "N/A"}`
                : "N/A";

            row.innerHTML = `
        <td>
          <button class="edit-tracking" data-id="${childSnap.key}"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="delete-tracking" data-id="${childSnap.key}"><i class="fa-solid fa-trash-can"></i></button>
        </td>
        <td>${data.receiverName || "N/A"}</td>
        <td>${data.trackingId || "N/A"}</td>
        <td>${data.receiverAddress || "N/A"}</td>
        <td>${data.dispatchDate || "N/A"}</td>
        <td>${data.deliveryDate || "N/A"}</td>
        <td>${data.currentStatus || "N/A"}</td>
        <td>${data.packageSummary || "N/A"}</td>
        <td>${progressStr}</td>
      `;
            trackingTableBody.appendChild(row);
        });

        // Attach button listeners
        document.querySelectorAll(".edit-tracking").forEach(btn => {
            btn.onclick = () => startEditTracking(btn.dataset.id);
        });

        document.querySelectorAll(".delete-tracking").forEach(btn => {
            btn.onclick = () => deleteTracking(btn.dataset.id);
        });
    }, (error) => {
        console.error("Error loading tracking data:", error);
    });
}

// ====================== START EDITING ======================
function startEditTracking(id) {
    get(child(ref(database), `tracking/${id}`)).then(snapshot => {
        if (!snapshot.exists()) return;
        const data = snapshot.val();

        editingTrackingId = id;

        // Populate the form with latest data
        document.getElementById("trackingId").value = data.trackingId || "";
        document.getElementById("receiverName").value = data.receiverName || "";
        document.getElementById("receiverAddress").value = data.receiverAddress || "";
        document.getElementById("dispatchDate").value = data.dispatchDate || "";
        document.getElementById("deliveryDate").value = data.deliveryDate || "";
        document.getElementById("packageSummary").value = data.packageSummary || "";
        document.getElementById("currentStatus").value = data.currentStatus || "";
        if (data.progress) {
            document.getElementById("progressLocation").value = data.progress.location || "";
            document.getElementById("progressDate").value = data.progress.date || "";
            document.getElementById("progressTime").value = data.progress.time || "";
        }

        // Scroll smoothly to the form
        trackingForm.scrollIntoView({ behavior: "smooth", block: "start" });

        // Change submit button text
        trackingForm.querySelector(".save-btn").textContent = "Update Tracking";
    }).catch(err => console.error("Error fetching tracking for edit:", err));
}

// ====================== DELETE TRACKING ======================
function deleteTracking(id) {
    if (!confirm("Delete this tracking record?")) return;
    remove(ref(database, `tracking/${id}`))
        .then(() => loadTrackingData())
        .catch(err => console.error("Error deleting tracking:", err));
}

// ====================== SUBMIT FORM ======================
trackingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = trackingForm.querySelector(".save-btn");
    submitBtn.disabled = true;

    const trackingId = document.getElementById("trackingId").value;
    const receiverName = document.getElementById("receiverName").value.trim();
    const receiverAddress = document.getElementById("receiverAddress").value.trim();
    const dispatchDate = document.getElementById("dispatchDate").value;
    const deliveryDate = document.getElementById("deliveryDate").value;
    const packageSummary = document.getElementById("packageSummary").value.trim();
    const currentStatus = document.getElementById("currentStatus").value;
    const progressLocation = document.getElementById("progressLocation").value.trim();
    const progressDate = document.getElementById("progressDate").value;
    const progressTime = document.getElementById("progressTime").value;

    if (!receiverName || !receiverAddress || !dispatchDate || !deliveryDate || !packageSummary || !currentStatus || !progressLocation || !progressDate || !progressTime) {
        alert("Please fill in all fields.");
        submitBtn.disabled = false;
        return;
    }

    try {
        const trackingRef = ref(database, `tracking/${editingTrackingId || trackingId}`);
        const snapshot = await get(trackingRef);

        let history = [];
        if (snapshot.exists()) {
            const existingData = snapshot.val();
            // Push current status/progress to history before update
            if (existingData.currentStatus && existingData.progress) {
                history = existingData.history || [];
                history.push({
                    status: existingData.currentStatus,
                    progress: existingData.progress,
                    updatedBy: auth.currentUser?.uid || "unknown",
                    timestamp: new Date().toISOString()
                });
            }
        }

        const updatedData = {
            trackingId,
            receiverName,
            receiverAddress,
            dispatchDate,
            deliveryDate,
            packageSummary,
            currentStatus,
            progress: {
                location: progressLocation,
                date: progressDate,
                time: progressTime
            },
            history,
            lastUpdatedBy: auth.currentUser?.uid || "unknown"
        };

        await set(trackingRef, updatedData);
        alert("✅ Tracking details updated successfully!");
        trackingForm.reset();
        trackingForm.querySelector(".save-btn").textContent = "Update Tracking";
        editingTrackingId = null;
    } catch (err) {
        console.error("Error updating tracking:", err);
        alert("❌ Failed to update tracking.");
    } finally {
        submitBtn.disabled = false;
    }
});

// ====================== RESET FORM ======================
resetFormBtn.addEventListener("click", () => {
    trackingForm.reset();
    document.getElementById("trackingId").value = "";
    editingTrackingId = null;
    trackingForm.querySelector(".save-btn").textContent = "Update Tracking";
});

// ====================== LOGOUT ======================
function showPopup() {
    confirmationPopup.classList.add("show");
    popupOverlay.classList.add("show");
}
function hidePopup() {
    confirmationPopup.classList.remove("show");
    popupOverlay.classList.remove("show");
}
logoutButton.addEventListener("click", showPopup);
confirmYes.addEventListener("click", () => {
    signOut(auth).then(() => {
        hidePopup();
        window.location.href = "login-admin.html";
    });
});
confirmNo.addEventListener("click", hidePopup);
popupOverlay.addEventListener("click", hidePopup);
