import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDL8W5w1H1_eGGq4snsu9gdcr58w6glBFA",
  authDomain: "ecommerce-website-6d679.firebaseapp.com",
  projectId: "ecommerce-website-6d679",
  storageBucket: "ecommerce-website-6d679.firebasestorage.app",
  messagingSenderId: "500732378994",
  appId: "1:500732378994:web:e5ed90f21559f96d55e7eb",
  measurementId: "G-ZXCBZ8FQMZ",
  databaseURL: "https://ecommerce-website-6d679-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const form = document.querySelector(".form-box");

const passwordInput = document.querySelector('input[type="password"]');
if (passwordInput) {
  const toggle = document.createElement("i");
  toggle.classList.add("fas", "fa-eye", "toggle-password");
  passwordInput.parentElement.appendChild(toggle);

  toggle.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggle.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      passwordInput.type = "password";
      toggle.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value.trim();

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    alert("Login successful! Welcome " + user.email);
  
    window.location.href = "web.html"; //Redirect to website

  } catch (error) {
    alert("Error: " + error.message);
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
  } else {
    console.log("No user logged in");
  }
});