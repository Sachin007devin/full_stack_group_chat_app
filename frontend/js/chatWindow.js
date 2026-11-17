// Mock Database for WhatsApp-style Contacts & Messages
const chatData = {
  1: {
    id: 1,
    name: "Neon Arcade Lounge",
    avatar: "🎮",
    status: "24 squad members online",
    online: true,
    unread: 2,
    time: "11:52 PM",
    preview: "Watch party starting now! Dropped synthwave stems.",
    messages: [
      { sender: "@sora", text: "bro who saw the latest cyberpunk tournament qualifiers??", time: "11:48 PM", incoming: true },
      { sender: "@kal.wav", text: "Watch party starting now! Dropped the synthwave album stems in the audio channel. Turn bass up 🎛️", time: "11:50 PM", incoming: true },
      { type: "voice", sender: "@sora", duration: "0:38", time: "11:51 PM", incoming: true },
      { sender: "You", text: "omg that flick was unreal!! i'm hopping on discord voice in 5 mins after grabbing boba 🧋", time: "11:52 PM", incoming: false, status: "Delivered" }
    ]
  },
  2: {
    id: 2,
    name: "Sora ⚡",
    avatar: "🦊",
    status: "Online",
    online: true,
    unread: 0,
    time: "10:14 PM",
    preview: "Let's run ranked matches tonight!",
    messages: [
      { sender: "Sora", text: "Yo, are we locking in for the raid tonight?", time: "10:10 PM", incoming: true },
      { sender: "You", text: "Yeah absolutely, give me 20 minutes.", time: "10:14 PM", incoming: false, status: "Read" }
    ]
  },
  3: {
    id: 3,
    name: "Chloe Vibes",
    avatar: "🎧",
    status: "Last seen 2 hours ago",
    online: false,
    unread: 1,
    time: "Yesterday",
    preview: "Check out this new reel edit ✨",
    messages: [
      { type: "photo", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600", sender: "Chloe", time: "Yesterday", incoming: true },
      { sender: "Chloe", text: "Check out this new spatial render I made!", time: "Yesterday", incoming: true }
    ]
  },
  4: {
    id: 4,
    name: "Alex IRF",
    avatar: "👾",
    status: "Online",
    online: true,
    unread: 0,
    time: "Monday",
    preview: "Squad lobby code is 8080",
    messages: [
      { sender: "Alex", text: "Squad lobby code is 8080. Join up!", time: "Monday", incoming: true }
    ]
  }
};

let activeContactId = 1;
let currentFilter = 'all';

// DOM Elements
const contactsContainer = document.getElementById('contacts-container');
const chatMessagesContainer = document.getElementById('chat-messages-container');
const headerName = document.getElementById('header-name');
const headerStatus = document.getElementById('header-status');
const headerAvatar = document.getElementById('header-avatar');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const contactSearch = document.getElementById('contact-search');
const chatSearch = document.getElementById('chat-search');
const attachToggle = document.getElementById('attach-toggle');
const attachmentMenu = document.getElementById('attachment-menu');
const micBtn = document.getElementById('mic-btn');
const recordingBanner = document.getElementById('recording-banner');
const cancelRec = document.getElementById('cancel-rec');
const mediaModal = document.getElementById('media-modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');

// Render Contacts List
function renderContacts(filter = 'all', searchQuery = '') {
  contactsContainer.innerHTML = '';
  
  Object.values(chatData).forEach(contact => {
    // Apply Filter
    if (filter === 'online' && !contact.online) return;
    if (filter === 'unread' && contact.unread === 0) return;

    // Apply Search
    if (searchQuery && !contact.name.toLowerCase().includes(searchQuery.toLowerCase()) && !contact.preview.toLowerCase().includes(searchQuery.toLowerCase())) {
      return;
    }

    const item = document.createElement('div');
    item.className = `contact-item ${contact.id === activeContactId ? 'active' : ''}`;
    item.onclick = () => selectContact(contact.id);

    item.innerHTML = `
      <div class="contact-avatar-wrap">
        <div class="contact-avatar">${contact.avatar}</div>
        ${contact.online ? '<span class="online-indicator"></span>' : ''}
      </div>
      <div class="contact-info">
        <div class="contact-top-row">
          <span class="contact-name">${contact.name}</span>
          <span class="contact-time">${contact.time}</span>
        </div>
        <div class="contact-bottom-row">
          <span class="contact-preview">${contact.preview}</span>
          ${contact.unread > 0 ? `<span class="unread-badge">${contact.unread}</span>` : ''}
        </div>
      </div>
    `;
    contactsContainer.appendChild(item);
  });
}

// Select Contact & Load Chat
function selectContact(id) {
  activeContactId = id;
  const contact = chatData[id];
  contact.unread = 0; // Clear unread count

  headerName.textContent = contact.name;
  headerAvatar.textContent = contact.avatar;
  headerStatus.innerHTML = contact.online 
    ? `<span class="green-dot"></span> Online` 
    : contact.status;

  renderContacts(currentFilter, contactSearch.value);
  renderMessages();
}

// Render Messages for Active Chat
function renderMessages(searchQuery = '') {
  chatMessagesContainer.innerHTML = '';
  const contact = chatData[activeContactId];

  contact.messages.forEach(msg => {
    if (searchQuery && msg.text && !msg.text.toLowerCase().includes(searchQuery.toLowerCase())) return;

    const row = document.createElement('div');
    row.className = `message-row ${msg.incoming ? 'incoming' : 'outgoing'}`;

    let contentHTML = '';

    if (msg.type === 'voice') {
      contentHTML = `
        <div class="chat-voice-player">
          <button class="play-msg-btn">▶</button>
          <div class="voice-bars">
            <span class="active"></span><span class="active"></span><span class="active"></span>
            <span></span><span class="active"></span><span></span><span class="active"></span>
          </div>
          <span style="font-size: 0.7rem; color: var(--text-muted);">${msg.duration}</span>
        </div>
      `;
    } else if (msg.type === 'photo') {
      contentHTML = `
        <img src="${msg.url}" alt="Attachment" style="max-width: 240px; border-radius: 0.75rem; cursor: pointer;" onclick="openMediaModal('${msg.url}', 'photo')">
      `;
    } else {
      contentHTML = `<p class="msg-text">${msg.text}</p>`;
    }

    row.innerHTML = `
      <div class="message-bubble">
        ${msg.incoming && msg.sender ? `<span class="msg-sender">${msg.sender}</span>` : ''}
        ${contentHTML}
        <div class="msg-meta">
          <span>${msg.time}</span>
          ${!msg.incoming ? `<span class="ticks">✓✓</span>` : ''}
        </div>
      </div>
    `;

    chatMessagesContainer.appendChild(row);
  });

  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Send New Message
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const contact = chatData[activeContactId];
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  contact.messages.push({
    sender: "You",
    text: text,
    time: timeStr,
    incoming: false
  });

  contact.preview = text;
  contact.time = timeStr;

  messageInput.value = '';
  renderMessages();
  renderContacts(currentFilter, contactSearch.value);
}

sendBtn.onclick = sendMessage;
messageInput.onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };

// Filter Chips event listeners
document.querySelectorAll('.filter-chips .chip').forEach(chip => {
  chip.onclick = () => {
    document.querySelector('.filter-chips .chip.active').classList.remove('active');
    chip.classList.add('active');
    currentFilter = chip.getAttribute('data-filter');
    renderContacts(currentFilter, contactSearch.value);
  };
});

// Search Contacts
contactSearch.oninput = (e) => {
  renderContacts(currentFilter, e.target.value);
};

// Search Inside Chat
chatSearch.oninput = (e) => {
  renderMessages(e.target.value);
};

// Attachment Menu Toggle
attachToggle.onclick = () => {
  attachmentMenu.style.display = attachmentMenu.style.display === 'flex' ? 'none' : 'flex';
};

// Send Mock Attachments
function sendAttachment(type) {
  attachmentMenu.style.display = 'none';
  const contact = chatData[activeContactId];
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (type === 'photo') {
    contact.messages.push({
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600',
      time: timeStr,
      incoming: false
    });
    contact.preview = '📷 Photo attachment';
  } else if (type === 'audio') {
    contact.messages.push({
      type: 'voice',
      duration: '0:19',
      time: timeStr,
      incoming: false
    });
    contact.preview = '🎵 Voice note (0:19)';
  }

  renderMessages();
}

// Voice Note Simulation
micBtn.onclick = () => {
  recordingBanner.style.display = 'flex';
  let secs = 0;
  const timer = document.getElementById('rec-timer');
  
  window.recInterval = setInterval(() => {
    secs++;
    timer.textContent = `0:${secs < 10 ? '0' : ''}${secs}`;
  }, 1000);
};

cancelRec.onclick = () => {
  clearInterval(window.recInterval);
  recordingBanner.style.display = 'none';
};

// Lightbox Modal Functions
function openMediaModal(url, type) {
  modalContent.innerHTML = `<img src="${url}" alt="Fullscreen preview">`;
  mediaModal.style.display = 'flex';
}

closeModal.onclick = () => { mediaModal.style.display = 'none'; };


// fecthing messages

const LOGGED_IN_USER_ID = 1; // Login ke baad token/localStorage se milega
let oldestMessageId = null;
let isLoadingMore = false;
let hasMoreMessages = true;

// 1. Load Initial Chat
async function loadInitialChat(receiverId) {
  oldestMessageId = null;
  hasMoreMessages = true;
  chatMessagesContainer.innerHTML = '';

  const { data } = await axios.get(`/api/messages/${receiverId}?limit=10`, {
    headers: { 'Authorization': `${localStorage.getItem('token')}` }
  });

  if (data.success && data.data.chronologicalMessages.length > 0) {
    const msgs = data.data.chronologicalMessages;
    oldestMessageId = msgs[0].id;
    hasMoreMessages = data.data.hasMore;
    renderFetchedMessages(msgs, false);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }
}

// 2. Infinite Scroll Up
chatMessagesContainer.addEventListener('scroll', async () => {
  if (chatMessagesContainer.scrollTop === 0 && !isLoadingMore && hasMoreMessages) {
    isLoadingMore = true;
    const previousScrollHeight = chatMessagesContainer.scrollHeight;

    const { data } = await axios.get(`/api/messages/${activeContactId}?limit=10&beforeId=${oldestMessageId}`, {
      headers: { 'Authorization': `${localStorage.getItem('token')}` }
    });

    if (data.success && data.data.chronologicalMessages.length > 0) {
      const msgs = data.data.chronologicalMessages;
      oldestMessageId = msgs[0].id;
      hasMoreMessages = data.data.hasMore;
      renderFetchedMessages(msgs, true);

      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight - previousScrollHeight;
    }
    isLoadingMore = false;
  }
});

// 3. Left/Right Alignment Logic
function renderFetchedMessages(messages, prepend = false) {
  const fragment = document.createDocumentFragment();

  messages.forEach(msg => {
    const isOutgoing = msg.senderId === LOGGED_IN_USER_ID; // Right side agar sender == logged-in user
    const row = document.createElement('div');
    row.className = `message-row ${isOutgoing ? 'outgoing' : 'incoming'}`;
    row.innerHTML = `
      <div class="message-bubble">
        <p class="msg-text">${msg.content}</p>
        <div class="msg-meta">
          <span>${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          ${isOutgoing ? `<span class="ticks">${msg.isRead ? '✓✓' : '✓'}</span>` : ''}
        </div>
      </div>
    `;
    fragment.appendChild(row);
  });

  if (prepend) {
    chatMessagesContainer.prepend(fragment);
  } else {
    chatMessagesContainer.appendChild(fragment);
  }
}



// Initial Load
renderContacts();
renderMessages();