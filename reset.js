import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

form.addEventListener("submit", async (event) => {
  event.preventDefault(); 

  const email = form.querySelector('input[type="email"]').value.trim();

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);

    alert(`Reset link has been sent to ${email}`);
    
    window.location.href = "index.html"; //Redirect back to login
  } catch(error) {
    alert("Error: " + error.message);
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
