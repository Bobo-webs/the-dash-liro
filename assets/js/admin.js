// ====================== IMPORTS ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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
    } else {
      window.location.href = "login-admin.html";
    }
  });
});

// ====================== GENERATE TRACKING ID ======================
function generateTrackingId() {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return "DL" + randomDigits;
}

// ====================== FORM HANDLER ======================
trackingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = trackingForm.querySelector(".save-btn");
  submitBtn.disabled = true;

  const trackingId = document.getElementById("trackingId").value || generateTrackingId();
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

  const trackingData = {
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
    history: [], // Initialize empty history for new entries
    createdBy: auth.currentUser?.uid || "unknown"
  };

  try {
    const trackingRef = ref(database, `tracking/${trackingId}`);
    await set(trackingRef, trackingData);
    alert("✅ Tracking details saved successfully!");
    trackingForm.reset();
    document.getElementById("trackingId").value = generateTrackingId();
  } catch (error) {
    console.error("Error saving tracking data:", error);
    alert("❌ Failed to save tracking data.");
  } finally {
    submitBtn.disabled = false;
  }
});

// ====================== RESET FORM ======================
resetFormBtn.addEventListener("click", () => {
  trackingForm.reset();
  document.getElementById("trackingId").value = generateTrackingId();
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
