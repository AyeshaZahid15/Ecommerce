import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, get, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDL8W5w1H1_eGGq4snsu9gdcr58w6glBFA",
  authDomain: "ecommerce-website-6d679.firebaseapp.com",
  databaseURL: "https://ecommerce-website-6d679-default-rtdb.firebaseio.com",
  projectId: "ecommerce-website-6d679",
  storageBucket: "ecommerce-website-6d679.firebasestorage.app",
  messagingSenderId: "500732378994",
  appId: "1:500732378994:web:e5ed90f21559f96d55e7eb",
  measurementId: "G-ZXCBZ8FQMZ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);


const userEmailSpan = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userEmailSpan.textContent = `Welcome, ${user.email}`;
    logoutBtn.style.display = "inline-block";

    const userRef = ref(db, 'users/' + user.uid);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, {
        email: user.email,
        uid: user.uid,
        joinedAt: new Date().toISOString()
      });
      console.log("User added to Firebase Realtime Database");
    }
  } else {
    window.location.href = "index.html";
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
    window.location.href = "index.html"; // redirect back to login page
  } catch (error) {
    alert("Error logging out: " + error.message);
  }
});

const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
  button.addEventListener("click", event => {
    const productBox = event.target.closest(".product-box");
    addToCart(productBox);
  });
});

const cartContent = document.querySelector(".cart-content");
const addToCart = productBox => {
  const productImgSrc = productBox.querySelector("img").src;
  const productTitle = productBox.querySelector(".product-title").textContent;
  const productPrice = productBox.querySelector(".price").textContent;

  const cartItems = document.querySelectorAll(".cart-product-title");
  for(let items of cartItems){
    if(items.textContent === productTitle){
      alert("This item is already in the cart.");
      return;
    }
  }

  const cartBox = document.createElement("div");
  cartBox.classList.add("cart-box");
  cartBox.innerHTML = `
    <img src="${productImgSrc}" class="cart-img">
    <div class="cart-detail">
      <h2 class="cart-product-title">${productTitle}</h2>
      <span class="cart-price">${productPrice}</span>
      <div class="cart-quantity">
        <button id="decrement">-</button>
        <span class="number">1</span>
        <button id="increment">+</button>
      </div>
    </div>
    <i class="ri-delete-bin-line cart-remove"></i>
`;

  cartContent.appendChild(cartBox);

  cartBox.querySelector(".cart-remove").addEventListener("click", () => {
    cartBox.remove();

    updateCartCount(-1);

    updateTotalPrice();
  });

    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        const decrementButton = cartBox.querySelector("#decrement");
        let quantity = parseInt(numberElement.textContent);

        if(event.target.id === "decrement"  && quantity > 1){
            quantity--;
            if(quantity === 1){
                decrementButton.style.color = "#999";
            }
        } else if(event.target.id === "increment"){
            quantity++;
            decrementButton.style.color = "#333";
        }

        numberElement.textContent = quantity;

        updateTotalPrice();
    });

    updateCartCount(1);

    updateTotalPrice();
};

const updateTotalPrice = () => {
  const totalPriceElement = document.querySelector(".total-price");
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  let total = 0;
  cartBoxes.forEach(cartBox => {
    const priceElement = cartBox.querySelector(".cart-price");
    const quantityElement = cartBox.querySelector(".number");
    const price = priceElement.textContent.replace("$", "");
    const quantity = quantityElement.textContent;
    total += price * quantity;
  });
  totalPriceElement.textContent = `$${total}`;
};

let cartItemCount = 0;
const updateCartCount = change => {
  const cartItemCountBadge = document.querySelector(".cart-item-count");
  cartItemCount += change;
  if(cartItemCount > 0){
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = cartItemCount;
  } else{
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent = "";
  }
};

const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  if(cartBoxes.length === 0){
    alert("Your cart is empty. Please add items to your cart before buying.");
    return;
  }

  cartBoxes.forEach(cartBox => cartBox.remove());

  cartItemCount = 0;
  updateCartCount(0);

  updateTotalPrice();

  alert("Thank you for your purchase!");
});

const maleBtn = document.getElementById("maleBtn");
const femaleBtn = document.getElementById("femaleBtn");
const products = document.querySelectorAll(".product-box");

function filterProducts(gender) {
  products.forEach(product => {
    if (product.getAttribute("data-gender") === gender) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

filterProducts("female");

maleBtn.addEventListener("click", () => {
  filterProducts("male");
  maleBtn.classList.add("active");
  femaleBtn.classList.remove("active");
});

femaleBtn.addEventListener("click", () => {
  filterProducts("female");
  femaleBtn.classList.add("active");
  maleBtn.classList.remove("active");
});




let button = document.getElementById("btn");
let container = document.getElementById("container");
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message");
const submitBtn = document.getElementById("submit");

const adminEmail = "test@gmail.com";
const adminLink = document.getElementById("adminLink");


button.addEventListener("click", function () {
  if (container.style.display === "none" || container.style.display === "") {
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
});

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  if (user.email === adminEmail) {
    adminLink.style.display = "inline-block";
  } else {
    adminLink.style.display = "none";
  }

  const messagesRef = ref(db, "chats/" + user.uid + "/messages/");
  const userMetaRef = ref(db, "chats/" + user.uid + "/meta");

  async function sendMessage() {
    const msg = input.value.trim();
    if (msg === "") return;

    const userRef = ref(db, "users/" + user.uid);
    const snap = await get(userRef);
    let senderName = "Anonymous";

    if (snap.exists()) {
      senderName = snap.val().firstName || "Anonymous";
    }

    const chatUserRef = ref(db, "chats/" + user.uid);
    set(chatUserRef, { name: senderName });

    push(messagesRef, {
      text: msg,
      senderId: user.uid,
      senderName: senderName,
      timestamp: Date.now()
    });

    input.value = "";
  }

  submitBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
let chatStartedNotified = false;
let notifiedMessages = new Set(); 

onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  const isMe = data.senderId === user.uid;

  const message = document.createElement("p");
  message.innerHTML = `<strong>${data.senderName}:</strong> ${data.text}`;
  message.style.background = isMe ? "#0081C9" : "#E5E5E5";
  message.style.color = isMe ? "white" : "black";
  message.style.padding = "8px 12px";
  message.style.borderRadius = "15px";
  message.style.margin = "5px 0";
  message.style.display = "inline-block";

  const messagediv = document.createElement("div");
  messagediv.style.textAlign = isMe ? "right" : "left";
  messagediv.appendChild(message);

  chatBox.appendChild(messagediv);
  chatBox.scrollTop = chatBox.scrollHeight;

  
  if (user.email !== adminEmail) {
 
    if (!chatStartedNotified && !isMe) {
      chatStartedNotified = true;
      showNotification("Your chat has started with support");
      notifiedMessages.add(snapshot.key);
      return;
    }
  }
});
  function showNotification(msg) {
    let box = document.getElementById("notificationBox");
    let message = document.getElementById("notificationMessage");

    message.textContent = msg;
    box.classList.add("show");

 
    setTimeout(() => {
      closeNotification();
    }, 5000);
  }

  window.closeNotification = function () {
    document.getElementById("notificationBox").classList.remove("show");
  };
});