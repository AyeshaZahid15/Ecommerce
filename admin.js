import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue, onChildAdded, push, get, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

let currentChatUser = null;
let currentUser = null;
let messagesUnsubscribe = null;

// -------------------- AUTH CHECK --------------------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  console.log('Admin logged in:', currentUser.uid);

  // Ensure user info is stored in DB
  const userRef = ref(db, "users/" + user.uid);
  await set(userRef, {
    name: user.displayName || "Anonymous",
    email: user.email
  }).catch(err => console.error('Set user error', err));

  // Render the interface only AFTER fetching user info
  renderAdminInterface();
  loadUsers();
});

// -------------------- RENDER INTERFACE --------------------
function renderAdminInterface() {
  document.body.innerHTML = `
    <button class="back" id="back">Back</button>
    <div class="container">
      <div class="sidebar">
        <h1>Users-List</h1>
        <div id="userList" class="user-list"></div>
      </div>
      <div class="chat-section" id="chatSection">
        <div class="header" id="chatHeader"><h2>Select a user to start chat</h2></div>
        <div class="chat-box" id="chatBox"></div>
        <div class="input-area" id="inputArea" style="display:none;">
          <input type="text" id="messageInput" class="input" placeholder="Type your message...">
          <button class="btn1" id="sendBtn"><i class="ri-send-plane-fill"></i></button>
        </div>
      </div>
    </div>
  `;

  // Re-bind DOM elements after rendering
  const userListDiv = document.getElementById("userList");
  const chatBox = document.getElementById("chatBox");
  const chatHeader = document.getElementById("chatHeader");
  const inputArea = document.getElementById("inputArea");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");

  document.getElementById("back").addEventListener("click", () => {
    window.location.href = "web.html";
  });

  // -------------------- LOAD USERS --------------------
  function loadUsers() {
    const usersRef = ref(db, "users/");
    onChildAdded(usersRef, (snap) => {
      const userId = snap.key;
      const userData = snap.val();
      if (currentUser && userId === currentUser.uid) return;

      const userName = userData.name || userData.email || "Anonymous";
      const btn = document.createElement("div");
      btn.classList.add("user-item");
      btn.textContent = userName;
      btn.onclick = () => loadMessages(userId, userName);

      userListDiv.appendChild(btn);
    });
  }

  // -------------------- LOAD MESSAGES --------------------
  async function loadMessages(userId, name) {
    if (typeof messagesUnsubscribe === "function") messagesUnsubscribe();

    currentChatUser = userId;
    chatHeader.innerHTML = `<h2>Chat with ${name}</h2>`;
    chatBox.innerHTML = "";
    inputArea.style.display = "flex";

    const msgsRef = ref(db, `admin/${userId}/messages/`);

    messagesUnsubscribe = onValue(msgsRef, (snapshot) => {
      const data = snapshot.val();
      chatBox.innerHTML = "";
      if (!data) {
        chatBox.innerHTML = "<p style='color:#888;'>No messages yet.</p>";
        return;
      }
      Object.values(data).forEach(msg => {
        const p = document.createElement("p");
        p.className = (msg.senderId === currentUser.uid) ? "message me" : "message other";
        p.innerHTML = `<strong>${msg.senderName || 'Unknown'}:</strong> ${msg.text || ''}`;
        chatBox.appendChild(p);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    }, (err) => {
      console.error('onValue error', err);
    });
  }

  // -------------------- SEND MESSAGE --------------------
  sendBtn.addEventListener("click", () => {
    if (!currentChatUser) return alert("Select a user first!");
    const text = messageInput.value.trim();
    if (!text) return;

    const msgsRef = ref(db, `admin/${currentChatUser}/messages/`);
    push(msgsRef, {
      text,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || "Admin",
      timestamp: Date.now()
    }).then(() => {
      messageInput.value = "";
    }).catch(err => {
      console.error('Push error', err);
    });
  });

  // Load users once interface ready
  loadUsers();
}
