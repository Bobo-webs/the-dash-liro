// ====================== IMPORTS ====================== 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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
const resetFormBtn = document.getElementById("resetFormBtn");
const mailerForm = document.getElementById("dashliroMailerForm");

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

// ====================== RESET FORM ======================
resetFormBtn.addEventListener("click", () => {
  mailerForm.reset();
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
