// -------------------- IMPORTS --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// -------------------- FIREBASE CONFIG --------------------
const firebaseConfig = {
  apiKey: "AIzaSyDL8W5w1H1_eGGq4snsu9gdcr58w6glBFA",
  authDomain: "ecommerce-website-6d679.firebaseapp.com",
  databaseURL: "https://ecommerce-website-6d679-default-rtdb.firebaseio.com",
  projectId: "ecommerce-website-6d679",
  storageBucket: "ecommerce-website-6d679.appspot.com",
  messagingSenderId: "500732378994",
  appId: "1:500732378994:web:e5ed90f21559f96d55e7eb",
  measurementId: "G-ZXCBZ8FQMZ"
};

// -------------------- INITIALIZE FIREBASE --------------------
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// -------------------- UI ELEMENTS --------------------
const userList = document.getElementById("userList");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const backBtn = document.getElementById("back");
let selectedUserId = null;

// -------------------- AUTH CHECK --------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`✅ Admin logged in as: ${user.email}`);
    loadUsers();
  } else {
    console.warn("⚠️ Not authenticated, redirecting to login page...");
    window.location.href = "index.html";
  }
});

// -------------------- LOAD USERS --------------------
function loadUsers() {
  console.log("📥 Loading users from /users/");
  const usersRef = ref(db, "users/");

  onValue(usersRef, (snapshot) => {
    userList.innerHTML = "";
    if (!snapshot.exists()) {
      console.warn("⚠️ No users found in /users/");
      userList.innerHTML = "<p>No users yet.</p>";
      return;
    }

    snapshot.forEach((childSnapshot) => {
      const userId = childSnapshot.key;
      const userData = childSnapshot.val() || {};

      const username = userData.username || null;
      const email = userData.email || null;
      const displayName = username || email || `User (${userId.slice(0, 6)}...)`;

      const userItem = document.createElement("div");
      userItem.textContent = displayName;
      userItem.classList.add("user-item");

      userItem.addEventListener("click", () => {
        selectedUserId = userId;
        console.log(`💬 Selected user: ${displayName} (${userId})`);
        loadMessages(userId);
      });

      userList.appendChild(userItem);
    });

    console.log("✅ All users displayed successfully");
  }, (error) => {
    console.error("❌ Error reading /users/:", error);
  });
}

// -------------------- LOAD MESSAGES --------------------
function loadMessages(userId) {
  console.log(`💭 Loading messages for user: ${userId}`);
  const msgsRef = ref(db, `chats/${userId}/messages/`);

  onValue(msgsRef, (snapshot) => {
    chatBox.innerHTML = "";
    if (!snapshot.exists()) {
      chatBox.innerHTML = "<p>No messages yet.</p>";
      console.warn(`⚠️ No messages found for user ${userId}`);
      return;
    }

    snapshot.forEach((msgSnap) => {
      const msg = msgSnap.val() || {};
      const sender =
        msg.sender && msg.sender !== "undefined"
          ? msg.sender
          : "User"; // <-- Fix undefined sender here
      const text = msg.text || "";

      const msgDiv = document.createElement("div");
      msgDiv.classList.add(sender === "admin" ? "admin-msg" : "user-msg");
      msgDiv.textContent = `${sender}: ${text}`;
      chatBox.appendChild(msgDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
    console.log(`✅ Messages loaded for ${userId}`);
  }, (error) => {
    console.error(`❌ Error loading messages for ${userId}:`, error);
  });
}

// -------------------- SEND MESSAGE --------------------
sendBtn.addEventListener("click", () => {
  if (!selectedUserId || !messageInput.value.trim()) {
    console.warn("⚠️ No user selected or message empty");
    return;
  }

  const text = messageInput.value.trim();
  const newMsgRef = push(ref(db, `chats/${selectedUserId}/messages/`));

  set(newMsgRef, {
    sender: "admin",
    text: text,
    timestamp: Date.now(),
  })
    .then(() => {
      console.log(`📤 Sent to ${selectedUserId}: ${text}`);
      messageInput.value = "";
    })
    .catch((err) => console.error("❌ Message send error:", err));
});

// -------------------- BACK BUTTON --------------------
backBtn.addEventListener("click", () => {
  console.log("⬅️ Returning to main site...");
  window.location.href = "web.html";
});
