import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
const db = getDatabase(app);


const form = document.querySelector(".form-box");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fullName = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value.trim();

  if (fullName.length < 3) {
    alert("Full name must be at least 3 characters long.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userRef = ref(db, "users/" + user.uid);
    await set(userRef, {
      fullName: fullName,
      email: email,
      uid: user.uid,
      joinedAt: new Date().toISOString()
    });

    localStorage.setItem("fullName", fullName);

    alert("Registration successful! Welcome, "+ fullName);
    window.location.href = "index.html";  //Redirect to login page
  }catch (error) {
    alert("Error: " + error.message);
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

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
