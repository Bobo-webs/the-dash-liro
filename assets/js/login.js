// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

// Firebase config
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Loading overlay functions
const showLoading = () => {
  document.getElementById("loading-overlay").classList.add("show");
};
const hideLoading = () => {
  document.getElementById("loading-overlay").classList.remove("show");
};

// Error display function
function showInlineError(show) {
  const errorP = document.querySelector(".error p");
  if (errorP) {
    errorP.style.display = show ? "block" : "none";
  }
}

// Submit button handler
const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
  event.preventDefault();

  const emailValue = document.getElementById("email").value.trim();
  const passwordValue = document.getElementById("password").value.trim();

  showInlineError(false); // hide old error
  if (!emailValue || !passwordValue) return;

  showLoading();

  signInWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCredential) => {
      const user = userCredential.user;
      get(ref(database, "users/" + user.uid))
        .then((snapshot) => {
          hideLoading();

          if (snapshot.exists()) {
            const userData = snapshot.val();
            const userRole = userData.role;

            if (userRole === "admin") {
              document.getElementById("popup-success").style.display = "block";
              setTimeout(() => {
                document.getElementById("popup-success").style.display = "none";
                window.location.href = "admin.html";
              }, 1000);
            } else {
              alert(
                "You are not currently registered as an administrator. Please contact the site developer to request admin access."
              );
            }
          } else {
            console.error("No user data found");
            showInlineError(true);
          }
        })
        .catch((error) => {
          hideLoading();
          console.error("Error fetching user data:", error);
          showInlineError(true);
        });
    })
    .catch((error) => {
      hideLoading();
      console.error("Firebase login error:", error.code);

      if (error.code === "auth/network-request-failed") {
        alert("Network connection interrupted");
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        // show red inline error under password
        showInlineError(true);
      } else {
        alert("Login failed. " + error.message);
      }
    });
});
