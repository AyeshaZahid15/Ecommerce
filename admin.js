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
const backBtn = document.getElementById("back"); // ✅ Matches your HTML

let selectedUserId = null;

// -------------------- AUTH CHECK --------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`✅ Admin logged in as: ${user.email}`);
    loadUsers();
  } else {
    console.warn("⚠️ Not authenticated, redirecting to admin-login.html");
    window.location.href = "index.html";
  }
});

// -------------------- LOAD USERS --------------------
function loadUsers() {
  console.log("📥 Loading users from /chats/");
  const usersRef = ref(db, "chats/");

  onValue(usersRef, (snapshot) => {
    userList.innerHTML = "";
    if (!snapshot.exists()) {
      console.warn("⚠️ No users found in chats/");
      userList.innerHTML = "<p>No users yet.</p>";
      return;
    }

    snapshot.forEach((childSnapshot) => {
      const userId = childSnapshot.key;
      const meta = childSnapshot.val().name || "User";

      const userItem = document.createElement("div");
      userItem.textContent = `${meta} (${userId})`;
      userItem.classList.add("user-item");
      userItem.addEventListener("click", () => {
        selectedUserId = userId;
        console.log(`💬 Selected user: ${userId}`);
        loadMessages(userId);
      });
      userList.appendChild(userItem);
    });

    console.log("✅ Users loaded successfully");
  });
}

// -------------------- LOAD MESSAGES --------------------
function loadMessages(userId) {
  console.log(`🗨️ Loading messages for user: ${userId}`);
  const msgsRef = ref(db, `chats/${userId}/messages/`);

  onValue(msgsRef, (snapshot) => {
    chatBox.innerHTML = "";
    if (!snapshot.exists()) {
      chatBox.innerHTML = "<p>No messages yet.</p>";
      console.warn(`⚠️ No messages found for user ${userId}`);
      return;
    }

    snapshot.forEach((msgSnap) => {
      const msg = msgSnap.val();
      const msgDiv = document.createElement("div");
      msgDiv.classList.add(msg.sender === "admin" ? "admin-msg" : "user-msg");
      msgDiv.textContent = `${msg.sender}: ${msg.text}`;
      chatBox.appendChild(msgDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
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
  console.log("🔙 Returning to main site...");
  window.location.href = "web.html"; // ✅ change this if your main page has a different name
});
