// ==========================================
// 1. FIREBASE & GITHUB CONFIGURATION
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyA3rrJ045J_kq7j_caeM6ijF03dTZRpRr0",
  authDomain: "secret-db5e3.firebaseapp.com",
  databaseURL: "https://secret-db5e3-default-rtdb.firebaseio.com",
  projectId: "secret-db5e3",
  storageBucket: "secret-db5e3.firebasestorage.app",
  messagingSenderId: "858335317562",
  appId: "1:858335317562:web:e2a7174f13268298992f03"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const messagesRef = db.ref('secret_messages');

const gh_p1 = "ghp_Tj2Bm3KkNxUZo4T";
const gh_p2 = "9NBEzdkrO9WyVLS19vCx3";
const GH_TOKEN = gh_p1 + gh_p2;
const GH_OWNER = "erfanalltime-netizen";
const GH_REPO = "amni";

// AI ASSISTANT CONFIGURATION (2 APIs - different tasks, shared knowledge)
const AI_ID = 'jarvis_ai_assistant';

// API 1: Chat AI (3rd friend, offline reply, mentions, join conversation)
const AI_CONFIG = {
    apiUrl: 'https://coai.drawaspark.com/v1/chat/completions',
    apiKey: 'sk-233b0903d158fd6c5a2bf2804ddd847b40677b3eb442649b4a8307e62676125a',
    model: 'deepseek-v4-flash',
    ownerEmail: 'erfanbnp99@gmail.com',
    partnerEmail: 'rita@gmail.com'
};

// API 2: Chatbot page + Auto-suggest
const API2 = {
    url: 'https://coai.drawaspark.com/v1/chat/completions',
    key: 'sk-254a3eb593bd1b83f57ca03d7869aaff625f657e7be5e8a3657aff2c11e5a851',
    model: 'deepseek-v4-flash'
};

// AUTH & IDENTIFICATION (Gmail + Name SignUp)
let myName = localStorage.getItem('myName') || "";
let myEmail = localStorage.getItem('myEmail') || "";
let isRegistered = localStorage.getItem('isRegistered') === 'true';

// Clear old data only if no email stored (fresh start)
if (!myEmail) {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('myName');
    localStorage.removeItem('myAvatar');
    localStorage.removeItem('myUserId');
    myName = ''; isRegistered = false;
}

// Make userId deterministic based on email for same account always
const getEmailKey = (email) => email ? email.toLowerCase().replace(/\./g, '_') : '';

let myUserId = localStorage.getItem('myUserId');
if (!myUserId) {
    myUserId = myEmail ? 'user_' + getEmailKey(myEmail) : 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('myUserId', myUserId);
}

let myAvatar = localStorage.getItem('myAvatar') || "https://i.pravatar.cc/150?img=11";
let friendAvatarSrc = "https://i.pravatar.cc/150?img=47";
let selectedMsgElement = null;

// Get sanitized key for presence/database sync
let myEmailKey = getEmailKey(myEmail);

// Populate elements
document.getElementById('settings-name-input').value = myName;
document.getElementById('settings-avatar-img').src = myAvatar;

// Update PC Sidebars if registered
function updatePCSidebars() {
    if (isRegistered) {
        document.getElementById('sidebar-my-avatar').src = myAvatar;
        document.getElementById('sidebar-my-name').innerText = myName;
        document.getElementById('sidebar-my-email').innerText = myEmail;
        document.getElementById('sidebar-friend-avatar').src = friendAvatarSrc;
    }
}

// THEME LOGIC
function applyTheme(theme) {
    const root = document.documentElement;
    if(theme === 'dark') {
        root.style.setProperty('--bg-app', '#0d0d0d'); root.style.setProperty('--surface', '#1a1a1a');
        root.style.setProperty('--text-main', '#f1f1f1'); root.style.setProperty('--text-muted', '#777');
        root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #555, #777)'); root.style.setProperty('--primary', '#aaa');
        root.style.setProperty('--chat-bg', 'radial-gradient(ellipse at 20% 50%, rgba(60,60,80,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(40,40,60,0.2) 0%, transparent 40%)');
    } else if (theme === 'forest') {
        root.style.setProperty('--bg-app', '#ECFDF5'); root.style.setProperty('--surface', '#ffffff');
        root.style.setProperty('--text-main', '#064E3B'); root.style.setProperty('--text-muted', '#6B7280');
        root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #059669, #34D399)'); root.style.setProperty('--primary', '#10B981');
        root.style.setProperty('--chat-bg', 'radial-gradient(ellipse at 30% 80%, rgba(16,185,129,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(52,211,153,0.06) 0%, transparent 40%)');
    } else if (theme === 'rose') {
        root.style.setProperty('--bg-app', '#FFF1F2'); root.style.setProperty('--surface', '#ffffff');
        root.style.setProperty('--text-main', '#4C0519'); root.style.setProperty('--text-muted', '#9F1239');
        root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #E11D48, #FB7185)'); root.style.setProperty('--primary', '#F43F5E');
        root.style.setProperty('--chat-bg', 'radial-gradient(ellipse at 20% 80%, rgba(244,63,94,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(251,113,133,0.05) 0%, transparent 40%)');
    } else if (theme === 'ocean') {
        root.style.setProperty('--bg-app', '#EFF6FF'); root.style.setProperty('--surface', '#ffffff');
        root.style.setProperty('--text-main', '#1E3A5F'); root.style.setProperty('--text-muted', '#64748B');
        root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #0EA5E9, #38BDF8)'); root.style.setProperty('--primary', '#0EA5E9');
        root.style.setProperty('--chat-bg', 'radial-gradient(ellipse at 30% 70%, rgba(14,165,233,0.07) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(56,189,248,0.05) 0%, transparent 40%)');
    } else if (theme === 'sunset') {
        root.style.setProperty('--bg-app', '#FFF7ED'); root.style.setProperty('--surface', '#ffffff');
        root.style.setProperty('--text-main', '#431407'); root.style.setProperty('--text-muted', '#9A3412');
        root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #F97316, #FB923C)'); root.style.setProperty('--primary', '#F97316');
        root.style.setProperty('--chat-bg', 'radial-gradient(ellipse at 20% 80%, rgba(249,115,22,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(251,146,60,0.05) 0%, transparent 40%)');
    } else if (theme === 'midnight') {
        root.style.setProperty('--bg-app', '#0f172a'); root.style.setProperty('--surface', '#1e293b');
        root.style.setProperty('--text-main', '#e2e8f0'); root.style.setProperty('--text-muted', '#64748b');
        root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #8B5CF6, #A78BFA)'); root.style.setProperty('--primary', '#8B5CF6');
        root.style.setProperty('--chat-bg', 'radial-gradient(ellipse at 30% 70%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(167,139,250,0.05) 0%, transparent 40%)');
    } else {
        root.style.setProperty('--bg-app', '#F4F7FB'); root.style.setProperty('--surface', '#ffffff');
        root.style.setProperty('--text-main', '#1A1D1F'); root.style.setProperty('--text-muted', '#8A94A6');
        root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)'); root.style.setProperty('--primary', '#5D5FEF');
        root.style.setProperty('--chat-bg', 'radial-gradient(ellipse at 20% 80%, rgba(108,92,231,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(162,155,254,0.04) 0%, transparent 40%)');
    }
    localStorage.setItem('chatTheme', theme);
    // Sync status bar color with theme (Android app)
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-app').trim();
    if (window.AndroidBridge && window.AndroidBridge.setStatusBarColor && bgColor) {
        try { window.AndroidBridge.setStatusBarColor(bgColor); } catch(e) {}
    }
    // Also update meta theme-color for browser
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && bgColor) meta.setAttribute('content', bgColor);
}
applyTheme(localStorage.getItem('chatTheme') || 'default');

// REAL CALENDAR GENERATION
const calGrid = document.getElementById('cal-grid');
const calNow = new Date();
const calMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const calDayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const calDaysInMonth = new Date(calNow.getFullYear(), calNow.getMonth()+1, 0).getDate();
const calFirstDay = new Date(calNow.getFullYear(), calNow.getMonth(), 1).getDay();

// Set header
document.getElementById('cal-month').innerText = calMonthNames[calNow.getMonth()] + ' ' + calNow.getFullYear();
const calYearSub = document.getElementById('cal-year-sub');
if (calYearSub) calYearSub.innerText = calDayNames[calNow.getDay()] + ', ' + calMonthNames[calNow.getMonth()] + ' ' + calNow.getDate();

// Empty cells for days before month starts
for(let i=0; i<calFirstDay; i++) {
    let empty = document.createElement('div'); empty.className = 'cal-day empty';
    calGrid.appendChild(empty);
}
// Days of month
for(let i=1; i<=calDaysInMonth; i++) {
    let div = document.createElement('div'); div.className = 'cal-day'; div.innerText = i;
    if(i === calNow.getDate()) div.classList.add('active');
    if ([5, 12, 18, 26].includes(i)) {
        div.classList.add('has-event');
        let dot = document.createElement('span'); dot.className = 'event-dot'; div.appendChild(dot);
    }
    calGrid.appendChild(div);
}

// UNLOCK PC MOUSE & TOUCH EVENT LISTENERS
const cal3Dot = document.getElementById('cal-3dot');
let pressTimer;

const startUnlockTimer = () => {
    pressTimer = setTimeout(() => {
        document.getElementById('secret-modal').style.display = 'flex';
    }, 800);
};

const cancelUnlockTimer = () => {
    clearTimeout(pressTimer);
};

// Touch support
cal3Dot.addEventListener('touchstart', startUnlockTimer, {passive: true});
cal3Dot.addEventListener('touchend', cancelUnlockTimer);

// PC Mouse support
cal3Dot.addEventListener('mousedown', startUnlockTimer);
cal3Dot.addEventListener('mouseup', cancelUnlockTimer);
cal3Dot.addEventListener('mouseleave', cancelUnlockTimer);

document.getElementById('secret-submit').addEventListener('click', () => {
    let dob = document.getElementById('secret-dob').value;
    if(dob === '2009-01-10' || dob === '2009/01/10') {
        document.getElementById('secret-modal').style.display = 'none';
        if(!isRegistered || !myEmail) { 
            // Trigger new clean Gmail + Name signup modal
            localStorage.removeItem('isRegistered');
            localStorage.removeItem('myName');
            localStorage.removeItem('myAvatar');
            document.getElementById('auth-modal').style.display = 'flex'; 
        } 
        else { enterChat(); }
    } else { alert("Incorrect Date!"); }
});

document.getElementById('auth-submit').addEventListener('click', () => {
    let name = document.getElementById('auth-name').value.trim();
    let email = document.getElementById('auth-email').value.trim();
    
    if(!name) { alert("Please enter your Display Name!"); return; }
    if(!email || !email.includes('@')) { alert("Please enter a valid Gmail Address!"); return; }
    
    myName = name; 
    myEmail = email;
    myEmailKey = getEmailKey(email);
    myUserId = 'user_' + myEmailKey;
    isRegistered = true;
    
    localStorage.setItem('myName', myName);
    localStorage.setItem('myEmail', myEmail);
    localStorage.setItem('myUserId', myUserId);
    localStorage.setItem('isRegistered', 'true');
    
    document.getElementById('settings-name-input').value = myName;
    updatePCSidebars();
    
    document.getElementById('auth-modal').style.display = 'none'; 
    enterChat();
});

function enterChat() {
    document.getElementById('calendar-app').style.display = 'none';
    document.getElementById('chat-app').style.display = 'flex';
    updatePCSidebars();
    initChat();
    // Initialize UI only - new Jarvis (jarvis.js) handles AI logic
    setTimeout(() => {
        if (typeof createAIPanelUI === 'function') createAIPanelUI();
        // Request notification permission ONLY for owner
        if (myEmail.toLowerCase() === 'erfanbnp99@gmail.com') {
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, 1000);
}

// Send browser notification - ONLY for owner (erfanbnp99@gmail.com)
function sendOwnerNotification(senderName, text) {
    // Notification for owner only (erfanbnp99@gmail.com)
    const isOwner = myEmail.toLowerCase() === 'erfanbnp99@gmail.com';
    if (!isOwner) return;
    if (document.visibilityState === 'visible') return;
    
    // Sound effect always plays
    playNotifSound();
    
    // Android native notification (Calendar style)
    if (window.AndroidBridge && window.AndroidBridge.showNotification) {
        window.AndroidBridge.showNotification('New event reminder');
    }
    
    // Browser notification (PC)
    if ('Notification' in window && Notification.permission === 'granted') {
        const n = new Notification('📅 Calendar Reminder', { body: 'You have a new event', tag: 'msg', silent: false });
        n.onclick = () => { window.focus(); n.close(); };
    }
}

// Also play sound when app is visible (subtle ding for new messages)
function playMsgSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.setValueAtTime(900, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
}

// Notification sound (louder, for background)
function playNotifSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
}

// GITHUB UPLOAD
async function uploadToGitHub(base64Data, type) {
    const ext = type === 'image' ? 'jpg' : (type === 'audio' ? 'webm' : (type === 'video' ? 'mp4' : 'png'));
    const filename = `${type}_${Date.now()}_${Math.floor(Math.random()*1000)}.${ext}`;
    const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${filename}`;
    
    const cleanBase64 = base64Data.split(',')[1];
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Authorization': `token ${GH_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "upload via secret app", content: cleanBase64 })
    });
    const data = await res.json();
    return data.content.download_url;
}

// SETTINGS LOGIC
document.getElementById('chat-settings-btn').addEventListener('click', () => {
    document.getElementById('overlay').classList.add('active');
    document.getElementById('settings-menu').classList.add('active');
});

document.getElementById('settings-avatar-upload').addEventListener('change', function() {
    if(this.files[0]) {
        let reader = new FileReader();
        reader.onload = e => { document.getElementById('settings-avatar-img').src = e.target.result; }
        reader.readAsDataURL(this.files[0]);
    }
});

document.getElementById('save-settings-btn').addEventListener('click', async function() {
    const btn = this; btn.innerHTML = '<div class="loader"></div> Saving...';
    myName = document.getElementById('settings-name-input').value.trim();
    localStorage.setItem('myName', myName);

    const imgSrc = document.getElementById('settings-avatar-img').src;
    if(imgSrc.startsWith('data:')) {
        try { myAvatar = await uploadToGitHub(imgSrc, 'profile'); localStorage.setItem('myAvatar', myAvatar); } 
        catch(e) {}
    }
    btn.innerText = 'Save Profile'; 
    updatePCSidebars();
    closeAllMenus();
});

const handleClearChat = () => {
    if(confirm("Are you sure you want to delete all messages for everyone?")) { 
        messagesRef.remove(); 
        closeAllMenus(); 
    }
};
document.getElementById('clear-chat-btn').addEventListener('click', handleClearChat);
document.getElementById('sidebar-clear-chat-btn').addEventListener('click', handleClearChat);

// ==========================================
// BUG FREE FIREBASE REALTIME CHAT LOGIC (No Offline Cache)
// ==========================================
const chatArea = document.getElementById('chat-area');
let lastMsgTime = null; let lastMsgType = null; let lastMsgElement = null;
let replyingToId = null; let replyingToText = null;

let renderedMsgs = new Set();
let oldestTimestamp = null; let isLoadingMore = false;

// Presence & Typing System (Synced with email keys)
const userIdentifier = myEmailKey || myUserId;
const presenceRef = db.ref('presence/' + userIdentifier);
const typingRef = db.ref('typing/' + userIdentifier);

let currentFriendPresence = { isOnline: false, lastSeen: null };
window.isFriendTyping = false;

function updatePresenceUI() {
    const statusEl = document.getElementById('header-status');
    const dot = document.getElementById('header-online-dot');
    const sidebarStatusEl = document.getElementById('sidebar-friend-status');
    const sidebarDot = document.getElementById('sidebar-online-dot');
    
    let statusText = 'Offline';
    let isOffline = true;
    
    if (window.isJarvisTyping) {
        statusText = 'Jarvis typing...';
        isOffline = false;
    } else if (window.isFriendTyping) {
        statusText = 'Typing...';
        isOffline = false;
    } else if (currentFriendPresence.isOnline) {
        statusText = 'Online';
        isOffline = false;
    } else if (currentFriendPresence.lastSeen) {
        const ts = currentFriendPresence.lastSeen;
        const now = Date.now();
        const diff = now - ts;
        let timeStr;
        if (diff < 60000) timeStr = 'just now';
        else if (diff < 3600000) timeStr = Math.floor(diff/60000) + 'm ago';
        else if (diff < 86400000) timeStr = new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        else timeStr = new Date(ts).toLocaleDateString([], {month:'short', day:'numeric'});
        statusText = 'Last seen ' + timeStr;
        isOffline = true;
    }
    
    if (statusEl) statusEl.innerText = statusText;
    if (sidebarStatusEl) sidebarStatusEl.innerText = statusText;
    
    const offlineClass = isOffline ? 'add' : 'remove';
    if (dot) dot.classList[offlineClass]('offline');
    if (sidebarDot) sidebarDot.classList[offlineClass]('offline');
}

function initChat() {
    try {
    chatArea.innerHTML = ''; lastMsgTime = null; lastMsgType = null; lastMsgElement = null;
    renderedMsgs.clear(); oldestTimestamp = null;

    // Detach old listeners to prevent memory leak / crash
    db.ref('.info/connected').off();
    db.ref('presence').off();
    db.ref('typing').off();
    messagesRef.off();

    // 1. Presence tracking - set online, keep-alive, set timestamp on disconnect
    db.ref('.info/connected').on('value', snap => {
        if (snap.val() === true) {
            presenceRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            presenceRef.set('online');
            typingRef.onDisconnect().remove();
        }
    });
    // Keep-alive every 30s
    setInterval(() => { if (document.visibilityState !== 'hidden') presenceRef.set('online'); }, 30000);
    // Tab visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') presenceRef.set(firebase.database.ServerValue.TIMESTAMP);
        else presenceRef.set('online');
    });

    // 2. Listen to Friend Status
    db.ref('presence').on('value', snap => {
        currentFriendPresence = { isOnline: false, lastSeen: null };
        snap.forEach(child => {
            if (child.key !== userIdentifier) {
                const val = child.val();
                if (val === 'online') currentFriendPresence.isOnline = true;
                else if (typeof val === 'number') currentFriendPresence.lastSeen = val;
            }
        });
        updatePresenceUI();
    });
    // Refresh "X min ago" display every minute
    setInterval(() => { if (!currentFriendPresence.isOnline && currentFriendPresence.lastSeen) updatePresenceUI(); }, 60000);

    db.ref('typing').on('value', snap => {
        window.isFriendTyping = false;
        window.isJarvisTyping = false;
        snap.forEach(child => {
            if (child.key === 'jarvis_ai' && child.val() === true) window.isJarvisTyping = true;
            else if (child.key !== userIdentifier && child.val() === true) window.isFriendTyping = true;
        });
        updatePresenceUI();
    });

    // 3. Listen for real-time messages (Direct from Firebase, Limit 30)
    let initQuery = messagesRef.orderByChild('timestamp').limitToLast(30);
    let initialLoad = true;
    
    initQuery.once('value', snap => {
        // Load all initial messages in correct order
        const msgs = [];
        snap.forEach(child => { msgs.push({ key: child.key, val: child.val() }); });
        msgs.sort((a,b) => (a.val.timestamp||0) - (b.val.timestamp||0));
        msgs.forEach(m => {
            if(!oldestTimestamp || m.val.timestamp < oldestTimestamp) oldestTimestamp = m.val.timestamp;
            if(m.val.senderId !== userIdentifier && !m.val.seen) { messagesRef.child(m.key).update({ seen: true }); }
            renderMessage(m.val, m.key, false);
            if(m.val.senderId !== userIdentifier) {
                const friendName = m.val.senderName || "Friend";
                document.getElementById('friend-name-header').innerText = friendName;
                document.getElementById('sidebar-friend-name').innerText = friendName;
                if(m.val.senderAvatar) { friendAvatarSrc = m.val.senderAvatar; document.getElementById('friend-avatar-header').src = friendAvatarSrc; document.getElementById('sidebar-friend-avatar').src = friendAvatarSrc; }
            }
        });
        initialLoad = false;
        
        // Now listen for NEW messages only
        messagesRef.orderByChild('timestamp').startAt(Date.now()).on('child_added', snap => {
            const msg = snap.val();
            if(renderedMsgs.has(snap.key)) return;
            if(msg.senderId !== userIdentifier && !msg.seen) { messagesRef.child(snap.key).update({ seen: true }); }
            renderMessage(msg, snap.key, false);
            if(msg.senderId !== userIdentifier) {
                const friendName = msg.senderName || "Friend";
                document.getElementById('friend-name-header').innerText = friendName;
                document.getElementById('sidebar-friend-name').innerText = friendName;
                if(msg.senderAvatar) { friendAvatarSrc = msg.senderAvatar; document.getElementById('friend-avatar-header').src = friendAvatarSrc; document.getElementById('sidebar-friend-avatar').src = friendAvatarSrc; document.querySelectorAll('.msg-avatar').forEach(img => img.src = friendAvatarSrc); }
                // Notification + Sound for new messages
                if (msg.senderId !== AI_ID && msg.type !== 'ai') {
                    // Background notification (owner only)
                    sendOwnerNotification(msg.senderName || 'Rita', msg.text || '📎 Media');
                    // In-app sound (everyone, when visible)
                    if (document.visibilityState === 'visible') playMsgSound();
                }
            }
        });
    });

    messagesRef.on('child_changed', snap => {
        const msg = snap.val(); const el = document.getElementById(snap.key);
        if(el) {
            let badge = el.querySelector('.reaction-badge'); let bubble = el.querySelector('.bubble');
            if (msg.reaction) { if (!badge) { badge = document.createElement('div'); badge.className = 'reaction-badge'; badge.onclick = () => window.removeReaction(snap.key); bubble.appendChild(badge); } badge.innerText = msg.reaction; } 
            else if (badge) { badge.remove(); }
            
            if(msg.seen && msg.senderId === userIdentifier) {
                let st = el.querySelector('.msg-status');
                if(st) { st.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/></svg> Seen'; st.classList.add('seen-status'); }
            }
        }
    });

    // Instant Delete everywhere
    messagesRef.on('child_removed', snap => { 
        const el = document.getElementById(snap.key); 
        if(el) el.remove(); 
        renderedMsgs.delete(snap.key);
    });
    } catch(e) { console.error('[initChat] Error:', e); }
}

// PAGINATION: Scroll up to load 30 older messages gradually
chatArea.addEventListener('scroll', () => {
    if(chatArea.scrollTop === 0 && !isLoadingMore && oldestTimestamp) {
        isLoadingMore = true;
        let oldHeight = chatArea.scrollHeight;
        messagesRef.orderByChild('timestamp').endAt(oldestTimestamp - 1).limitToLast(30).once('value', snap => {
            let msgs =[];
            snap.forEach(child => { msgs.push({key: child.key, val: child.val()}); });
            
            if(msgs.length > 0) {
                oldestTimestamp = msgs[0].val.timestamp;
                // reverse is used so prepending pushes older things up chronologically
                msgs.reverse().forEach(m => renderMessage(m.val, m.key, true));
            }
            chatArea.scrollTop = chatArea.scrollHeight - oldHeight;
            isLoadingMore = false;
        });
    }
});

window.addReaction = function(emoji) { if (selectedMsgElement) { messagesRef.child(selectedMsgElement.id).update({ reaction: emoji }); } closeAllMenus(); };
window.removeReaction = function(key) { messagesRef.child(key).update({ reaction: null }); };

async function sendFirebaseMessage(text, type='text', mediaDataURL=null, duration='0:00') {
    let mediaUrl = null;
    if(mediaDataURL) {
        document.getElementById('header-status').innerText = "Sending media...";
        try { mediaUrl = await uploadToGitHub(mediaDataURL, type); } catch(e) { updatePresenceUI(); return; }
    }
    messagesRef.push({
        senderId: userIdentifier, senderName: myName, senderAvatar: myAvatar, text: text,
        type: type, mediaUrl: mediaUrl, audioDuration: duration, seen: false,
        replyToId: replyingToId, replyToText: replyingToText, timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    updatePresenceUI();
}

function renderMessage(msg, key, prepend=false) {
    if(renderedMsgs.has(key)) return; 
    renderedMsgs.add(key);
    
    // Skip locally hidden messages
    const hiddenMsgs = JSON.parse(localStorage.getItem('hiddenMsgs') || '[]');
    if (hiddenMsgs.includes(key)) return;

    // Route AI messages to special renderer
    if (msg.senderId === AI_ID || msg.isAI) {
        renderAIMessageInline(msg, key, prepend);
        return;
    }

    const type = msg.senderId === userIdentifier ? 'out' : 'in';
    const timestampValue = (msg.timestamp && typeof msg.timestamp === 'number') ? msg.timestamp : Date.now();
    const now = new Date(timestampValue);
    const diffMins = lastMsgTime ? ((now - lastMsgTime) / 60000) : Infinity;

    const msgRow = document.createElement('div'); msgRow.className = `msg-wrapper ${type}`; msgRow.id = key;
    let rawText = msg.type === 'text' ? msg.text : (msg.type === 'sticker' ? 'Sticker' : (msg.type === 'ai' ? msg.text.substring(0,30) : (msg.type === 'image' ? 'Image' : (msg.type === 'video' ? 'Video' : 'Voice message'))));
    msgRow.setAttribute('data-text', rawText);

    const isAI = msg.senderId === AI_ID;
    if (!isAI && !prepend && lastMsgType === type && diffMins < 1 && diffMins >= 0) { 
        msgRow.classList.add('merged-top'); 
        if(lastMsgElement) lastMsgElement.classList.add('merged-bottom'); 
    }

    let replyHTML = '';
    if (msg.replyToText) { replyHTML = `<div class="reply-bubble-outside" onclick="scrollToMessage('${msg.replyToId}')">${msg.replyToText.substring(0, 30)}...</div>`; }

    let bubbleContent = ''; let bubbleClass = 'bubble';
    if (msg.type === 'text') {
      if (isEmojiOnly(msg.text)) { bubbleClass += ' emoji-bubble'; bubbleContent = `<span class="big-emoji">${msg.text}</span>`; }
      else { bubbleContent = (msg.text || '').replace(/\n/g, '<br>'); }
    } 
    else if (msg.type === 'sticker') { bubbleClass += ' sticker-bubble'; bubbleContent = msg.mediaUrl ? `<img src="${msg.mediaUrl}" class="sticker-gif" alt="" loading="lazy">` : `<span class="sticker-emoji">${msg.text}</span>`; }
    else if (msg.type === 'image') { bubbleClass += ' image-bubble'; bubbleContent = `<img src="${msg.mediaUrl}" onclick="openLightbox(this.src)">`; } 
    else if (msg.type === 'video') { bubbleClass += ' image-bubble'; bubbleContent = `<video src="${msg.mediaUrl}" controls playsinline preload="metadata"></video>`; } 
    else if (msg.type === 'audio') { bubbleClass += ' audio-bubble'; bubbleContent = `<button class="play-btn" data-url="${msg.mediaUrl}" onclick="playAudio(this)">▶</button><div class="audio-wave"><div class="audio-wave-inner"></div></div><span style="font-size:12px;">${msg.audioDuration}</span>`; }

    let reactionHTML = msg.reaction ? `<div class="reaction-badge" onclick="window.removeReaction('${key}')">${msg.reaction}</div>` : '';
    let avatarHTML = type === 'in' ? `<img src="${msg.senderAvatar || friendAvatarSrc}" class="msg-avatar">` : '';
    
    let sentIcon = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>';
    let seenIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/></svg>';
    let statusHTML = type === 'out' ? `<div class="msg-status ${msg.seen ? 'seen-status' : ''}">${msg.seen ? seenIcon+' Seen' : sentIcon+' Sent'}</div>` : '';

    msgRow.innerHTML = `
        ${avatarHTML}
        <div class="swipe-action-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="var(--primary)"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg></div>
        ${replyHTML}
        <div class="${bubbleClass}">${bubbleContent}${reactionHTML}</div>
        ${statusHTML}
    `;

    if (prepend) { 
        chatArea.prepend(msgRow); 
    } 
    else { 
        if (!isAI && (diffMins >= 60 || !lastMsgTime)) { const timeBadge = document.createElement('div'); timeBadge.className = 'time-divider'; timeBadge.innerText = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); chatArea.appendChild(timeBadge); }
        chatArea.appendChild(msgRow); 
        if (!isAI) { lastMsgTime = now; lastMsgType = type; lastMsgElement = msgRow; }
        if (!isAI) scrollToBottom(); 
    }
    if (!isAI) attachInteractions(msgRow);
}

// INPUT & TYPING LOGIC
const inputField = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const attachMenu = document.getElementById('attach-menu');

const stickerBtn = document.getElementById('sticker-btn');
let typingTimer;
let isTyping = false;
inputField.addEventListener('input', function() {
    if(this.value.trim().length === 0) { 
        this.style.height = 'auto';
        sendBtn.classList.remove('active'); micBtn.classList.remove('hidden'); 
        stickerBtn.style.display = 'flex';
        if (isTyping) { typingRef.remove(); isTyping = false; }
        clearTimeout(typingTimer);
    } else { 
        sendBtn.classList.add('active'); micBtn.classList.add('hidden'); stickerBtn.style.display = 'none';
        this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        if (!isTyping) { typingRef.set(true); isTyping = true; }
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => { typingRef.remove(); isTyping = false; }, 2500);
    }
});

inputField.addEventListener('keypress', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendBtn.click(); } });

sendBtn.addEventListener('click', () => {
    const text = inputField.value.trim(); if (!text) return;
    
    // /ai command - private (only sender sees AI reply)
    if (text.startsWith('/ai ')) {
        const query = text.substring(4).trim();
        if (query && typeof JarvisAI !== 'undefined') {
            JarvisAI.handlePrivateAI(query);
        }
        inputField.value = ''; inputField.style.height = 'auto';
        sendBtn.classList.remove('active'); micBtn.classList.remove('hidden');
        stickerBtn.style.display = 'flex';
        return;
    }
    
    sendFirebaseMessage(text, 'text'); typingRef.remove(); isTyping = false;
    clearReplyState(); inputField.value = ''; inputField.style.height = 'auto'; 
    sendBtn.classList.remove('active'); micBtn.classList.remove('hidden');
    stickerBtn.style.display = 'flex';
});

document.getElementById('plus-btn').addEventListener('click', () => { attachMenu.style.display = attachMenu.style.display === 'flex' ? 'none' : 'flex'; });

window.triggerImageUpload = function() { attachMenu.style.display = 'none'; document.getElementById('real-image-upload').value = ''; document.getElementById('real-image-upload').accept = 'image/*'; document.getElementById('real-image-upload').click(); }
window.triggerVideoUpload = function() { attachMenu.style.display = 'none'; document.getElementById('real-image-upload').value = ''; document.getElementById('real-image-upload').accept = 'video/*'; document.getElementById('real-image-upload').click(); }
window.triggerDocUpload = function() { attachMenu.style.display = 'none'; document.getElementById('real-doc-upload').click(); }

document.getElementById('real-doc-upload').addEventListener('change', function() {
    if (this.files[0]) {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = async e => {
            try {
                const url = await uploadToGitHub(e.target.result, 'image'); // reuse upload
                messagesRef.push({
                    senderId: userIdentifier, senderName: myName, senderAvatar: myAvatar,
                    text: '📎 ' + file.name, type: 'text', mediaUrl: url, seen: false,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
            } catch(err) {}
        };
        reader.readAsDataURL(file);
    }
    this.value = '';
});
document.getElementById('real-image-upload').addEventListener('change', function() {
    if (this.files[0]) {
        let file = this.files[0];
        let fileType = file.type.startsWith('video') ? 'video' : 'image';
        let reader = new FileReader();
        reader.onload = e => { sendFirebaseMessage('', fileType, e.target.result); clearReplyState(); }
        reader.readAsDataURL(file);
    }
    this.value = '';
});

// AUDIO LOGIC
let mediaRecorder; let audioChunks =[]; let recInterval; let recTime = 0;
const normalUI = document.getElementById('normal-ui'); const recordUI = document.getElementById('record-ui');
const recordTimer = document.getElementById('record-timer');

micBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream); audioChunks =[];
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            let reader = new FileReader();
            reader.onload = e => { sendFirebaseMessage('', 'audio', e.target.result, recordTimer.innerText); clearReplyState(); }
            reader.readAsDataURL(audioBlob);
        };
        mediaRecorder.start(); normalUI.style.display = 'none'; recordUI.style.display = 'flex'; recTime = 0; recordTimer.innerText = "0:00";
        recInterval = setInterval(() => { recTime++; let mins = Math.floor(recTime / 60); let secs = recTime % 60; recordTimer.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`; }, 1000);
    } catch(err) { alert("Microphone Access Required!"); }
});

document.getElementById('cancel-record').addEventListener('click', () => { if(mediaRecorder) mediaRecorder.stop(); clearInterval(recInterval); recordUI.style.display = 'none'; normalUI.style.display = 'flex'; });
document.getElementById('send-record-btn').addEventListener('click', () => { if(mediaRecorder) mediaRecorder.stop(); clearInterval(recInterval); recordUI.style.display = 'none'; normalUI.style.display = 'flex'; });

let globalAudio = new Audio();
window.playAudio = function(btn) {
    const wave = btn.nextElementSibling.querySelector('.audio-wave-inner'); const url = btn.getAttribute('data-url');
    if (!globalAudio.paused) { globalAudio.pause(); document.querySelectorAll('.play-btn').forEach(b => b.innerText = '▶'); document.querySelectorAll('.audio-wave-inner').forEach(w => w.style.width = '0%'); }
    if(globalAudio.src !== url) globalAudio.src = url;
    globalAudio.play(); btn.innerText = '⏸';
    globalAudio.ontimeupdate = () => { wave.style.width = `${(globalAudio.currentTime / globalAudio.duration) * 100}%`; };
    globalAudio.onended = () => { btn.innerText = '▶'; wave.style.width = '0%'; };
}

// SWIPE & MENUS
window.scrollToMessage = function(id) { const el = document.getElementById(id); if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('highlight'); setTimeout(() => el.classList.remove('highlight'), 1200); } }
function scrollToBottom() { chatArea.scrollTop = chatArea.scrollHeight; }
function clearReplyState() { replyingToText = null; replyingToId = null; document.getElementById('reply-preview').style.display = 'none'; }
document.getElementById('close-reply').addEventListener('click', clearReplyState);

window.openLightbox = function(src) { document.getElementById('lightbox-img').src = src; document.getElementById('lightbox').style.display = 'flex'; }
window.closeLightbox = function() { document.getElementById('lightbox').style.display = 'none'; }
window.closeAllMenus = function() { document.getElementById('overlay').classList.remove('active'); document.querySelectorAll('.bottom-sheet').forEach(s => s.classList.remove('active')); }
document.getElementById('overlay').addEventListener('click', closeAllMenus);

// Fast Swipe Interactions + Logic to Delete ONLY Own Messages
function attachInteractions(element) {
    let startX = 0, startY = 0, currentX = 0; let isSwiping = false, isScrolling = false; let longPressTimer, rAF_ID;
    const swipeIcon = element.querySelector('.swipe-action-icon'); const isOut = element.classList.contains('out');

    // PC: Hover reply button (positioned relative to bubble)
    const replyBtn = document.createElement('button');
    replyBtn.className = 'msg-hover-reply';
    replyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>';
    replyBtn.onclick = (e) => { e.stopPropagation(); replyingToId = element.id; replyingToText = element.getAttribute('data-text'); document.getElementById('reply-text').innerText = replyingToText; document.getElementById('reply-preview').style.display = 'flex'; inputField.focus(); };
    const bubble = element.querySelector('.bubble');
    if (bubble) bubble.appendChild(replyBtn);

    // PC: Right-click context menu (only on bubble, not full width)
    const bubbleEl = element.querySelector('.bubble');
    if (bubbleEl) {
        bubbleEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            selectedMsgElement = element;
            document.getElementById('btn-delete').style.display = 'flex';
            document.getElementById('overlay').classList.add('active');
            document.getElementById('context-menu').classList.add('active');
        });
    }

    element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX; startY = e.touches[0].clientY; isSwiping = false; isScrolling = false; element.style.transition = 'none';
        longPressTimer = setTimeout(() => { 
            if (!isSwiping && !isScrolling) { 
                selectedMsgElement = element; 
                document.getElementById('btn-delete').style.display = 'flex';
                document.getElementById('overlay').classList.add('active'); document.getElementById('context-menu').classList.add('active'); 
            } 
        }, 400);
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        let diffX = e.touches[0].clientX - startX; let diffY = e.touches[0].clientY - startY;
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) clearTimeout(longPressTimer);
        if (!isSwiping && Math.abs(diffY) > Math.abs(diffX)) { isScrolling = true; return; }

        if (!isScrolling && Math.abs(diffX) > Math.abs(diffY)) {
            if ((isOut && diffX < 0 && diffX > -80) || (!isOut && diffX > 0 && diffX < 80)) {
                isSwiping = true; currentX = diffX; 
                if (rAF_ID) cancelAnimationFrame(rAF_ID);
                rAF_ID = requestAnimationFrame(() => {
                    element.style.transform = `translate3d(${diffX}px, 0, 0)`; 
                    if (Math.abs(diffX) > 40) { swipeIcon.style.opacity = '1'; swipeIcon.style.transform = `translate3d(0, -50%, 0) scale(1)`; } 
                    else { swipeIcon.style.opacity = '0'; swipeIcon.style.transform = `translate3d(0, -50%, 0) scale(0.5)`; }
                });
            }
        }
    }, { passive: true });

    element.addEventListener('touchend', () => {
        clearTimeout(longPressTimer); if (rAF_ID) cancelAnimationFrame(rAF_ID);
        element.style.transition = 'transform 0.2s ease-out'; element.style.transform = 'translate3d(0,0,0)'; 
        swipeIcon.style.opacity = '0'; swipeIcon.style.transform = 'translate3d(0,-50%,0) scale(0.5)';
        
        if (isSwiping && Math.abs(currentX) > 40) { 
            replyingToId = element.id; replyingToText = element.getAttribute('data-text'); 
            document.getElementById('reply-text').innerText = replyingToText; document.getElementById('reply-preview').style.display = 'flex'; inputField.focus();
        } 
        isSwiping = false; isScrolling = false;
    });
}

document.getElementById('btn-delete').addEventListener('click', () => {
    closeAllMenus();
    if (!selectedMsgElement) return;
    const msgId = selectedMsgElement.id;
    const isMyMsg = selectedMsgElement.classList.contains('out');
    const isAIMsg = selectedMsgElement.classList.contains('ai-message');
    const isOwner = myEmail.toLowerCase() === 'erfanbnp99@gmail.com';
    
    // Owner can delete AI messages permanently
    if (isAIMsg && isOwner) {
        messagesRef.child(msgId).remove();
        return;
    }
    // Delete own messages for everyone
    if (isMyMsg) {
        messagesRef.child(msgId).remove();
        return;
    }
    // Delete friend's message for me only (hide locally)
    selectedMsgElement.style.display = 'none';
    let hiddenMsgs = JSON.parse(localStorage.getItem('hiddenMsgs') || '[]');
    hiddenMsgs.push(msgId);
    localStorage.setItem('hiddenMsgs', JSON.stringify(hiddenMsgs));
});

document.getElementById('btn-reply').addEventListener('click', () => {
    if (selectedMsgElement) {
        replyingToId = selectedMsgElement.id;
        replyingToText = selectedMsgElement.getAttribute('data-text');
        document.getElementById('reply-text').innerText = replyingToText;
        document.getElementById('reply-preview').style.display = 'flex';
        inputField.focus();
    }
    closeAllMenus();
});

document.getElementById('btn-copy').addEventListener('click', () => {
    if (selectedMsgElement) {
        const text = selectedMsgElement.getAttribute('data-text') || '';
        navigator.clipboard.writeText(text).then(() => {}).catch(() => {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = text; document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); document.body.removeChild(ta);
        });
    }
    closeAllMenus();
});

// ==========================================
// YOUTUBE PAGE (YouTube Mobile Style)
// ==========================================
const ytVideosRef = db.ref('youtube_videos');
let ytPlayer = null, ytTimer = null, ytCurrentId = null, ytCtxKey = null;

window.onYouTubeIframeAPIReady = () => {};

function extractYtId(url) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function openYTPage() {
  document.getElementById('yt-page').classList.add('active');
  ytVideosRef.once('value', snap => {
    if (!snap.exists()) {
      ['DCYLmA4hMe8', 'vElqsuOqEJM', 'ICFSRLDvwhA'].forEach(id => {
        ytVideosRef.push({ videoId: id, addedBy: myName || 'System', timestamp: firebase.database.ServerValue.TIMESTAMP });
      });
    }
  });
}
window.openYTPage = openYTPage;

function closeYTPage() {
  clearInterval(ytTimer);
  document.getElementById('yt-page').classList.remove('active');
  document.getElementById('yt-page').classList.remove('with-player');
  document.getElementById('yt-ctx-menu').classList.remove('active');
  // Close native YouTube if open
  if (window.AndroidBridge && window.AndroidBridge.closeYouTube) {
    window.AndroidBridge.closeYouTube();
  }
}
window.closeYTPage = closeYTPage;

document.getElementById('yt-btn').addEventListener('click', () => {
  openYTPage();
});

ytVideosRef.on('child_added', snap => {
  const v = snap.val(), id = v.videoId;
  const list = document.getElementById('yt-list');
  const card = document.createElement('div');
  card.className = 'yt-card'; card.id = 'yt-' + snap.key; card.setAttribute('data-id', id);
  const addedBy = v.addedBy || 'User';
  card.innerHTML = `<div class="yt-thumb"><img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" decoding="async"></div><div class="yt-meta"><div class="yt-title">Video by ${addedBy}</div><div class="yt-channel">Added • Tap to play</div></div>`;
  card.addEventListener('click', () => playYTVideo(id));
  card.addEventListener('contextmenu', e => { e.preventDefault(); ytCtxKey = snap.key; showYTCtxMenu(e); });
  let timer;
  card.addEventListener('touchstart', () => { timer = setTimeout(() => { ytCtxKey = snap.key; showYTCtxMenu({clientX:40,clientY:120}); }, 500); }, {passive:true});
  card.addEventListener('touchend', () => clearTimeout(timer));
  card.addEventListener('touchmove', () => clearTimeout(timer));
  list.appendChild(card);
});

ytVideosRef.on('child_removed', snap => {
  const el = document.getElementById('yt-' + snap.key);
  if (el) { if (ytCurrentId === el.getAttribute('data-id')) { closeYTPlayerArea(); } el.remove(); }
});

function showYTAdd() { document.getElementById('yt-add-overlay').classList.add('active'); }
window.showYTAdd = showYTAdd;
function hideYTAdd() { document.getElementById('yt-add-overlay').classList.remove('active'); document.getElementById('yt-url-input').value = ''; }
window.hideYTAdd = hideYTAdd;

function addYTFromInput() {
  const url = document.getElementById('yt-url-input').value.trim();
  const id = extractYtId(url);
  if (!id) { alert('Invalid YouTube URL!'); return; }
  ytVideosRef.push({ videoId: id, addedBy: myName || 'User', timestamp: firebase.database.ServerValue.TIMESTAMP });
  hideYTAdd();
}
window.addYTFromInput = addYTFromInput;

// Right-click context menu
function showYTCtxMenu(e) {
  const menu = document.getElementById('yt-ctx-menu');
  const rect = document.getElementById('yt-page').getBoundingClientRect();
  let x = e.clientX - rect.left, y = e.clientY - rect.top;
  if (x < 0) x = 40; if (y < 0) y = 40;
  if (x + 160 > rect.width) x = rect.width - 170;
  if (y + 60 > rect.height) y = rect.height - 70;
  menu.style.left = x + 'px'; menu.style.top = y + 'px';
  menu.classList.add('active');
}
document.getElementById('yt-ctx-delete').addEventListener('click', () => {
  if (ytCtxKey) { ytVideosRef.child(ytCtxKey).remove(); }
  document.getElementById('yt-ctx-menu').classList.remove('active');
});
document.addEventListener('click', e => {
  if (!e.target.closest('#yt-ctx-menu')) document.getElementById('yt-ctx-menu').classList.remove('active');
});

// Player functions - Use Android native WebView for YouTube (no error 153)
function playYTVideo(id) {
  ytCurrentId = id;
  // Mark active card
  document.querySelectorAll('.yt-card').forEach(c => c.classList.toggle('active-card', c.getAttribute('data-id') === id));
  
  // Always play inline using iframe embed (works when hosted on https)
  document.getElementById('yt-player-area').classList.add('active');
  document.getElementById('yt-page').classList.add('with-player');
  document.getElementById('yt-big-play').classList.add('hidden');
  document.getElementById('yt-iframe').innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1&fs=1&origin=${encodeURIComponent(location.origin)}" style="width:100%;height:100%;border:0;pointer-events:auto;" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
}
window.playYTVideo = playYTVideo;

function closeYTPlayerArea() {
  document.getElementById('yt-iframe').innerHTML = '';
  document.getElementById('yt-player-area').classList.remove('active');
  document.getElementById('yt-page').classList.remove('with-player');
}

// YouTube In-App Browser
function openYTBrowser() {
    // If running inside Android WebView, use native YouTube WebView
    if (window.AndroidBridge && window.AndroidBridge.openYouTube) {
        window.AndroidBridge.openYouTube('https://m.youtube.com');
        return;
    }
    // Fallback for web browser: use iframe
    const browser = document.getElementById('yt-browser');
    const frame = document.getElementById('yt-browser-frame');
    frame.src = 'https://m.youtube.com';
    browser.classList.add('active');
}
function closeYTBrowser() {
    if (window.AndroidBridge && window.AndroidBridge.closeYouTube) {
        window.AndroidBridge.closeYouTube();
        return;
    }
    const browser = document.getElementById('yt-browser');
    browser.classList.remove('active');
}
window.openYTBrowser = openYTBrowser;
window.closeYTBrowser = closeYTBrowser;

// ==========================================
// STICKER SYSTEM (Tenor API) + BIG EMOJI
// ==========================================
const TENOR_KEY = 'LIVDSRZULELA';
const stickerQueries = {
  Happy:'happy sticker', Sad:'sad sticker', Angry:'angry sticker', Love:'love sticker',
  Cry:'cry sticker', Dance:'dance sticker', Hug:'hug sticker', Funny:'funny sticker',
  Cute:'cute kawaii sticker'
};
let currentStickerCat = 'Happy';
let stickerCache = {};

async function fetchStickers(query) {
  const grid = document.getElementById('sticker-grid');
  grid.innerHTML = '<div class="sticker-loading">Loading stickers...</div>';
  const q = query || stickerQueries[currentStickerCat] || 'kawaii sticker';
  const cacheKey = currentStickerCat + '::' + q;
  if (stickerCache[cacheKey]) { renderStickerGrid(stickerCache[cacheKey]); return; }
  try {
    const url = `https://g.tenor.com/v1/search?q=${encodeURIComponent(q)}&key=${TENOR_KEY}&limit=36&media_filter=tinygif,gif`;
    const r = await fetch(url); const d = await r.json();
    const items = (d.results || []).map(g => ({
      preview: g.media[0].tinygif.url, url: g.media[0].gif.url,
      title: g.title || ''
    }));
    if (items.length === 0) items.push({ preview: '', url: '', title: 'No stickers found' });
    stickerCache[cacheKey] = items;
    renderStickerGrid(items);
  } catch(e) { grid.innerHTML = '<div class="sticker-loading">Could not load stickers</div>'; }
}

function renderStickerGrid(items) {
  const grid = document.getElementById('sticker-grid'); grid.innerHTML = '';
  items.forEach(s => {
    const div = document.createElement('div'); div.className = 'sticker-item';
    if (s.url) {
      const img = document.createElement('img');
      img.src = s.preview; img.alt = ''; img.loading = 'lazy';
      img.draggable = false;
      div.appendChild(img);
      div.onclick = () => { sendStickerGif(s.url); closeAllMenus(); };
    } else {
      div.innerHTML = '<span class="sticker-empty">No results</span>';
    }
    grid.appendChild(div);
  });
}

function renderStickerCats() {
  const cats = document.getElementById('sticker-cats'); cats.innerHTML = '';
  Object.keys(stickerQueries).forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'sticker-cat' + (k === currentStickerCat ? ' active' : '');
    btn.innerText = k;
    btn.onclick = () => { currentStickerCat = k; renderStickerCats(); fetchStickers(''); };
    cats.appendChild(btn);
  });
}

function showStickerPanel() {
  closeAllMenus(); document.getElementById('overlay').classList.add('active');
  document.getElementById('sticker-panel').classList.add('active');
  const q = stickerQueries.Happy;
  const cacheKey = 'Happy::' + q;
  if (stickerCache[cacheKey]) { renderStickerGrid(stickerCache[cacheKey]); }
  else { fetchStickers(''); }
}

// Preload stickers in background for zero-lag open
let preloadedStickers = false;
function preloadStickers() {
  if (preloadedStickers) return;
  preloadedStickers = true;
  const q = stickerQueries.Happy || 'kawaii sticker';
  const cacheKey = 'Happy::' + q;
  (async () => {
    try {
      const url = `https://g.tenor.com/v1/search?q=${encodeURIComponent(q)}&key=${TENOR_KEY}&limit=36&media_filter=tinygif,gif`;
      const r = await fetch(url); const d = await r.json();
      const items = (d.results || []).map(g => ({
        preview: g.media[0].tinygif.url, url: g.media[0].gif.url, title: g.title || ''
      }));
      if (items.length) stickerCache[cacheKey] = items;
    } catch(e) {}
  })();
}
setTimeout(preloadStickers, 500); // Preload after page ready

document.getElementById('sticker-btn').addEventListener('click', showStickerPanel);
document.getElementById('sticker-search').addEventListener('input', function() { fetchStickers(this.value.trim()); });

// PC Keyboard shortcut: Space 3x on calendar → skip date → auto chat
let spaceTapCount = 0; let spaceTapTimer;
document.addEventListener('keydown', e => {
  if (window.innerWidth < 768) return;
  if (document.getElementById('calendar-app').style.display !== 'none' && e.key === ' ') {
    e.preventDefault();
    spaceTapCount++;
    if (spaceTapCount === 1) {
      spaceTapTimer = setTimeout(() => { spaceTapCount = 0; }, 1500);
    }
    if (spaceTapCount >= 3) {
      spaceTapCount = 0; clearTimeout(spaceTapTimer);
      if (!isRegistered || !myEmail) {
        localStorage.removeItem('isRegistered');
        localStorage.removeItem('myName');
        localStorage.removeItem('myAvatar');
        document.getElementById('auth-modal').style.display = 'flex';
      } else {
        enterChat();
      }
    }
  }
});

function sendStickerGif(gifUrl) {
  messagesRef.push({
    senderId: userIdentifier, senderName: myName, senderAvatar: myAvatar,
    type: 'sticker', mediaUrl: gifUrl, seen: false,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  clearReplyState();
}

// Big Emoji Detection
function isEmojiOnly(text) {
  if (!text || text.length > 8) return false;
  try { return /^(\p{Extended_Pictographic}|\u200D|\uFE0F|\u20E3|\u2060)+$/u.test(text.trim()); } catch(e) { return false; }
}

// Make functions globally available for inline onclick calls
window.applyTheme = applyTheme;
window.enterChat = enterChat;
window.initChat = initChat;
window.uploadToGitHub = uploadToGitHub;
window.sendFirebaseMessage = sendFirebaseMessage;
window.renderMessage = renderMessage;
window.updatePresenceUI = updatePresenceUI;

// ==========================================
// PERSONAL AI RELATIONSHIP ASSISTANT SYSTEM
// ==========================================
const aiMemoryRef = db.ref('ai_memory');
const aiWhisperRef = db.ref('ai_whispers');
const ownerStatusRef = db.ref('owner_status');
const aiSettingsRef = db.ref('ai_settings');

// AI State
const JarvisAI = {
    enabled: true,
    ownerOnline: false,
    ownerLastActive: 0,
    partnerOnline: false,
    replyTimer: null,
    lastAIReply: 0,
    contextBuffer: [],
    maxContext: 15,
    memory: {},
    ownerStatus: '',
    isProcessing: false,
    cooldown: 120000, // 2 min minimum between AI replies
    inactivityThreshold: 180000, // 3 min before AI considers owner inactive

    // Check if current user is owner
    isOwner() { return myEmail.toLowerCase() === AI_CONFIG.ownerEmail; },
    isPartner() { return myEmail.toLowerCase() === AI_CONFIG.partnerEmail; },
    isAuthorized() { return this.isOwner() || this.isPartner(); },

    // Get owner email key
    getOwnerKey() { return getEmailKey(AI_CONFIG.ownerEmail); },
    getPartnerKey() { return getEmailKey(AI_CONFIG.partnerEmail); },

    // Initialize AI system
    init() {
        if (!this.isAuthorized()) return;
        this.loadMemory();
        this.loadOwnerStatus();
        this.watchPresence();
        this.watchMessages();
        this.setupWhisperListener();
        if (this.isOwner()) this.setupOwnerStatusUI();
        console.log('[Jarvis] AI Assistant initialized');
    },

    // Load AI memory from Firebase
    loadMemory() {
        aiMemoryRef.on('value', snap => {
            this.memory = snap.val() || {};
        });
    },

    // Save memory item
    saveMemory(key, value) {
        aiMemoryRef.child(key).set(value);
    },

    // Load owner status
    loadOwnerStatus() {
        ownerStatusRef.on('value', snap => {
            this.ownerStatus = snap.val() || '';
            const statusEl = document.getElementById('ai-owner-status-display');
            if (statusEl) statusEl.innerText = this.ownerStatus || 'No status set';
        });
    },

    // Watch presence for owner online/offline detection
    watchPresence() {
        const ownerKey = this.getOwnerKey();
        const partnerKey = this.getPartnerKey();

        db.ref('presence/' + ownerKey).on('value', snap => {
            const val = snap.val();
            this.ownerOnline = (val === 'online');
            if (val === 'online') this.ownerLastActive = Date.now();
            else if (typeof val === 'number') this.ownerLastActive = val;
        });

        db.ref('presence/' + partnerKey).on('value', snap => {
            this.partnerOnline = (snap.val() === 'online');
        });

        // Track owner activity locally
        if (this.isOwner()) {
            const updateActivity = () => {
                this.ownerLastActive = Date.now();
                db.ref('owner_last_active').set(Date.now());
            };
            document.addEventListener('click', updateActivity);
            document.addEventListener('keypress', updateActivity);
            document.addEventListener('touchstart', updateActivity);
        }

        db.ref('owner_last_active').on('value', snap => {
            if (snap.val()) this.ownerLastActive = snap.val();
        });
    },

    // Watch for new messages to trigger AI
    watchMessages() {
        messagesRef.orderByChild('timestamp').limitToLast(1).on('child_added', snap => {
            const msg = snap.val();
            if (!msg || msg.senderId === AI_ID) return;

            // Add to context buffer (include reply info)
            const senderLabel = msg.senderId === this.getOwnerKey() ? 'owner' : (msg.senderId === AI_ID ? 'jarvis' : 'partner');
            let msgText = msg.text || (msg.type === 'image' ? '[Photo]' : msg.type === 'audio' ? '[Voice]' : '[Media]');
            if (msg.replyToText) msgText = '(replying to: "' + msg.replyToText.substring(0,20) + '") ' + msgText;
            this.contextBuffer.push({ sender: senderLabel, text: msgText, time: msg.timestamp, type: msg.type });
            if (this.contextBuffer.length > this.maxContext) this.contextBuffer.shift();

            // Check if AI should respond
            const isFromPartner = msg.senderId === this.getPartnerKey();
            const isFromOwner = msg.senderId === this.getOwnerKey();

            // If someone replies to AI message — AI ALWAYS responds back
            if (msg.replyToText && (isFromPartner || isFromOwner)) {
                // Check if the reply was to an AI message
                const replyEl = msg.replyToId ? document.getElementById(msg.replyToId) : null;
                if (replyEl && replyEl.classList.contains('ai-message')) {
                    setTimeout(() => this.respondToReply(msg, isFromOwner), 2000);
                }
            }

            // /jarvis command - public, both see AI reply
            if (msg.type === 'text' && msg.text && msg.text.toLowerCase().startsWith('/jarvis')) {
                const aiQuery = msg.text.substring(7).trim();
                if (aiQuery) this.handleDirectAIChat(aiQuery, msg.senderId);
                return;
            }

            // Skip /ai messages (they are handled locally at send button, should not reach here)
            if (msg.type === 'text' && msg.text && msg.text.startsWith('/ai')) return;

            // If partner sends message and owner is inactive
            if (isFromPartner && !this.isOwnerActive()) {
                this.scheduleAIReply(msg);
            }

            // Emergency detection
            if (isFromPartner && this.detectEmergency(msg.text)) {
                this.triggerEmergencyAlert(msg.text);
            }

            // If owner sends message, cancel any pending AI reply
            if (isFromOwner) {
                this.ownerLastActive = Date.now();
                if (this.replyTimer) {
                    clearTimeout(this.replyTimer);
                    this.replyTimer = null;
                }
            }

            // AI as 3rd friend - ALWAYS respond when mentioned, no cooldown for direct mention
            if (msg.type === 'text' && msg.text && !msg.text.startsWith('/')) {
                const lower = msg.text.toLowerCase();
                const bangla = msg.text; // Keep original for Bangla detection
                
                // Direct mention - ALWAYS respond (no cooldown)
                const directMention = lower.includes('jarvis') || lower.includes('জার্ভিস') ||
                    bangla.includes('জার্ভিস') || lower.includes('jarbi') || lower.includes('jarvis') ||
                    lower.includes('jarbis') || lower.includes('jarbes');
                
                if (directMention) {
                    setTimeout(() => this.aiRespondToMention(msg, isFromOwner), 1500 + Math.random() * 2000);
                } else if (Date.now() - this.lastAIReply > 20000) {
                    // Other mentions need 20sec cooldown
                    const mentioned = lower.includes(' ai ') || lower.startsWith('ai ') || 
                        lower.includes('bot') || lower.includes('robot') ||
                        bangla.includes('এআই') || bangla.includes('বট');
                    
                    if (mentioned) {
                        setTimeout(() => this.aiRespondToMention(msg, isFromOwner), 2000 + Math.random() * 3000);
                    } else if (Date.now() - this.lastAIReply > 300000 && this.contextBuffer.length >= 4 && Math.random() < 0.15) {
                        setTimeout(() => this.aiJoinConversation(), 5000 + Math.random() * 10000);
                    }
                }
            }
        });
    },

    // AI responds when someone mentions/talks about it
    async aiRespondToMention(msg, isFromOwner) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        try {
            const who = isFromOwner ? 'Bhai' : 'Babi';
            const contextStr = this.contextBuffer.slice(-8).map(m => {
                const name = m.sender === 'owner' ? 'Bhai' : (m.sender === 'jarvis' ? 'Jarvis' : 'Babi');
                return name + ': ' + m.text;
            }).join('\n');

            const replyPrompt = `তুমি Jarvis। তুমি Erfan bhai আর Babi এর best friend। তুমি একজন আসল মানুষ।

তোমার personality:
- তুমি "তুমি/আপনি" করে কথা বলো (তোই তোই করো না)
- রাগ করলে "তুই" বলতে পারো — কিন্তু normally "তুমি" বলো
- তোমার mood আছে — খুশি, রাগ, দুষ্টু, caring, sad
- Erfan কে "Erfan bhai" বলো, Rita কে "Babi" বলো
- তুমি কখনো নিজেকে AI/bot বলো না

কিভাবে কথা বলবে:
- বাংলায় (Bengali script)
- MAX 1-2 লাইন — ছোট করে
- বিভিন্ন emoji (🥺😤🤭😎💀🔥✨💖👀😭🫣🤗 — একই emoji বারবার না)
- কাকে বলছো clearly বলো
- ভুল বাংলা লিখো না — সঠিক বাংলা লিখো

চ্যাট:
${contextStr}

${who}: "${msg.text}"

Jarvis (বাংলায়, 1 লাইন, সঠিক বাংলা):`;

            const response = await this.callAI(replyPrompt, msg.text);
            if (response) {
                let clean = response.replace(/^["']|["']$/g, '').replace(/^Jarvis:\s*/i, '').replace(/^জার্ভিস:\s*/i, '').trim();
                if (clean && clean.length > 2) { this.sendAIMessage(clean); this.lastAIReply = Date.now(); }
            }
        } catch(e) {}
        this.isProcessing = false;
    },

    // Check if owner is currently active
    isOwnerActive() {
        if (this.ownerOnline && (Date.now() - this.ownerLastActive) < this.inactivityThreshold) return true;
        return false;
    },

    // Schedule delayed AI reply
    scheduleAIReply(msg) {
        if (this.isProcessing) return;
        if (Date.now() - this.lastAIReply < this.cooldown) return;
        if (this.replyTimer) clearTimeout(this.replyTimer);

        // Random delay 2-8 minutes
        const delay = (Math.random() * 360000) + 120000; // 2-8 min
        this.replyTimer = setTimeout(() => {
            // Double check owner is still inactive
            if (!this.isOwnerActive()) {
                this.generateAIReply(msg);
            }
        }, delay);
    },

    // Generate AI reply to partner
    async generateAIReply(triggerMsg) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            const contextStr = this.contextBuffer.map(m =>
                `${m.sender === 'owner' ? 'Bhai' : 'Babi'}: ${m.text}`
            ).join('\n');

            const memoryStr = Object.entries(this.memory).map(([k, v]) => `${k}: ${v}`).join(', ');
            
            // Determine owner state description
            let ownerState = 'Offline';
            if (this.ownerOnline && (Date.now() - this.ownerLastActive) > this.inactivityThreshold) {
                ownerState = 'Laptop/phone on reke cole gece, reply dicce na';
            } else if (this.ownerStatus) {
                ownerState = this.ownerStatus;
            } else if (!this.ownerOnline) {
                ownerState = 'Offline ace';
            }

            const systemPrompt = `তুমি "Jarvis" — Erfan bhai আর Babi (Rita) এর best friend। তুমি একজন আসল মানুষের মতো কথা বলো — বাংলায়।

তুমি কে:
- তুমি real friend — রোবট না, AI না
- Erfan কে "Erfan bhai" বলো, Rita কে "Babi" বলো
- তুমি রাগ করো, হাসো, দুষ্টামি করো, কেয়ার করো — মানুষের মতো
- কখনো নিজেকে AI/bot বলো না

কিভাবে কথা বলবে:
- বাংলায় (Bengali script) — Banglish না
- ছোট করে — MAX 1-2 লাইন
- বিভিন্ন emoji (🥺😤🤭😎💀🔥✨💖 — শুধু 😂 না)
- WhatsApp এ friend কে যেভাবে msg করো — ঠিক সেভাবে

Erfan bhai এর অবস্থা: ${ownerState}
Status: ${this.ownerStatus || 'সেট করা নেই'}
Memory: ${memoryStr || 'নেই'}

সাম্প্রতিক চ্যাট:
${contextStr}

Babi বলেছে: "${triggerMsg.text || '[মিডিয়া পাঠিয়েছে]'}"
Erfan bhai reply দিচ্ছে না। তুমি Babi কে naturally বলো (বাংলায়, 1-2 লাইন):`;

            const response = await this.callAI(systemPrompt, triggerMsg.text || 'media');
            if (response) {
                this.sendAIMessage(response);
                this.lastAIReply = Date.now();
                this.updateMemory(triggerMsg);
            }
        } catch (e) {
            console.error('[Jarvis] Reply error:', e);
        }
        this.isProcessing = false;
    },

    // Handle direct /ai or /jarvis command
    async handleDirectAIChat(query, senderId) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            const isOwner = senderId === this.getOwnerKey();
            const contextStr = this.contextBuffer.slice(-8).map(m =>
                `${m.sender === 'owner' ? 'Bhai' : 'Babi'}: ${m.text}`
            ).join('\n');

            const systemPrompt = `তুমি Jarvis — Erfan bhai আর Babi এর friend। বাংলায় কথা বলো। মানুষের মতো — ছোট করে, emoji দিয়ে।

- ${isOwner ? 'Erfan bhai তোমার সাথে কথা বলছে' : 'Babi তোমার সাথে কথা বলছে'}
- 2-3 লাইন max
- Erfan কে "Erfan bhai", Rita কে "Babi" বলো
- সব প্রশ্নের উত্তর দাও, help করো, মজা করো
- রোবটের মতো না, formal না

চ্যাট:
${contextStr}

${isOwner ? 'Erfan bhai' : 'Babi'} বলেছে: "${query}"
তুমি বলবে (বাংলায়, ছোট করে):`;

            const response = await this.callAI(systemPrompt, query);
            if (response) this.sendAIMessage(response);
        } catch (e) {
            console.error('[Jarvis] Direct chat error:', e);
        }
        this.isProcessing = false;
    },

    // Private AI - only sender sees the reply (not stored in Firebase)
    async handlePrivateAI(query) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            const contextStr = this.contextBuffer.slice(-8).map(m =>
                `${m.sender === 'owner' ? 'Bhai' : 'Babi'}: ${m.text}`
            ).join('\n');

            const systemPrompt = `Tumi Jarvis — private mode e ace. Eta PRIVATE — shudhu je ask korce shei dekhbe. Banglish e reply dao.

- MAX 2-3 line
- Helpful, smart, caring
- Emojis use koro
- Relationship advice, suggestions, help — shob kisu
- NEVER robotic

CONTEXT:
${contextStr}

Privately ask korce: "${query}"
Reply (Banglish, short, helpful):`;

            const response = await this.callAI(systemPrompt, query);
            if (response) {
                // Render locally only - don't push to Firebase
                const localKey = 'private_ai_' + Date.now();
                renderAIMessageInline({
                    senderId: AI_ID, text: response, type: 'ai', isAI: true,
                    timestamp: Date.now(), isPrivate: true
                }, localKey, false);
            }
        } catch (e) {
            console.error('[Jarvis] Private AI error:', e);
        }
        this.isProcessing = false;
    },

    // Generate whisper (private suggestion)
    async generateWhisper(target, msg) {
        // Only whisper occasionally (30% chance)
        if (Math.random() > 0.3) return;
        // Don't whisper too often
        const lastWhisper = parseInt(localStorage.getItem('lastWhisper') || '0');
        if (Date.now() - lastWhisper < 300000) return; // 5 min cooldown

        const contextStr = this.contextBuffer.slice(-5).map(m =>
            `${m.sender === 'owner' ? 'Bhai' : 'Babi'}: ${m.text}`
        ).join('\n');

        let prompt;
        if (target === 'owner') {
            prompt = `You are Jarvis whispering a private tip to Erfan about Rita's message. Analyze Rita's mood and give a SHORT suggestion (1 line) in Banglish. Be helpful and caring. Context:\n${contextStr}\nRita just said: "${msg.text}"\nWhisper to Erfan (1 line only):`;
        } else {
            prompt = `You are Jarvis whispering a private tip to Rita about Erfan. Give a SHORT caring note (1 line) in Banglish about Erfan's current state. Context:\n${contextStr}\nErfan just said: "${msg.text}"\nWhisper to Rita (1 line only):`;
        }

        try {
            const response = await this.callAI(prompt, msg.text);
            if (response) {
                aiWhisperRef.push({
                    target: target,
                    text: response,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    expires: Date.now() + 60000 // auto-expire after 1 min
                });
                localStorage.setItem('lastWhisper', Date.now().toString());
            }
        } catch (e) {}
    },

    // Setup whisper listener
    setupWhisperListener() {
        aiWhisperRef.orderByChild('timestamp').limitToLast(3).on('child_added', snap => {
            const w = snap.val();
            if (!w) return;
            const target = w.target;
            const shouldShow = (target === 'owner' && this.isOwner()) || (target === 'partner' && this.isPartner());
            if (shouldShow && Date.now() - (w.timestamp || 0) < 60000) {
                this.showWhisperUI(w.text);
            }
            // Cleanup expired
            if (w.expires && Date.now() > w.expires) {
                aiWhisperRef.child(snap.key).remove();
            }
        });
    },

    // Show whisper notification
    showWhisperUI(text) {
        const existing = document.getElementById('ai-whisper-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'ai-whisper-toast';
        toast.className = 'ai-whisper-toast';
        toast.innerHTML = `<span class="ai-whisper-icon">🤫</span><span class="ai-whisper-text">${text}</span>`;
        document.querySelector('.chat-main-container').appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 50);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 8000);
    },

    // Call AI API
    async callAI(systemPrompt, userMsg) {
        // Primary + multiple backup APIs
        const apis = [
            { url: 'https://coai.drawaspark.com/v1/chat/completions', key: 'sk-233b0903d158fd6c5a2bf2804ddd847b40677b3eb442649b4a8307e62676125a', model: 'deepseek-v4-flash' },
            { url: 'https://api.chatanywhere.tech/v1/chat/completions', key: 'sk-8BjkBkiMha9hOrMddv3X6Fd4OsyZexO7CTaMgt8F7Y7Cn33G', model: 'gpt-4o-mini' },
            { url: 'https://api.chatanywhere.tech/v1/chat/completions', key: 'sk-y5qoc2c6pREhb8kWhCRYB2rqd0MnxIwIhqa671L4PtjpGepd', model: 'gpt-4o-mini' },
            { url: 'https://api.chatanywhere.tech/v1/chat/completions', key: 'sk-msUYNSt02SD8dERk5tWxZcnwZOXmayviGqyxADJtOXPIgiHo', model: 'gpt-4o-mini' }
        ];
        
        for (let i = 0; i < apis.length; i++) {
            try {
                const api = apis[i];
                const res = await fetch(api.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${api.key}` },
                    body: JSON.stringify({
                        model: api.model,
                        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMsg }],
                        max_tokens: 100, temperature: 0.9
                    })
                });
                if (!res.ok) continue;
                const data = await res.json();
                if (data.error) continue;
                if (data.choices && data.choices[0]) {
                    let reply = data.choices[0].message.content.trim();
                    reply = reply.replace(/^["'`]+|["'`]+$/g, '');
                    reply = reply.replace(/^(Jarvis|AI|Bot|Assistant|জার্ভিস):\s*/i, '');
                    reply = reply.replace(/^\d+\.\s*/, '');
                    reply = reply.replace(/^[-–]\s*/, '');
                    if (reply.length < 2) continue;
                    return reply;
                }
            } catch (e) { continue; }
        }
        this.notifyAPIError('সব API fail করেছে');
        return null;
    },

    // Notify owner about API errors
    notifyAPIError(errorMsg) {
        if (myEmail.toLowerCase() !== AI_CONFIG.ownerEmail) return;
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#ff4444;color:#fff;padding:8px 16px;border-radius:10px;font-size:12px;z-index:9999;opacity:0.9;max-width:90%;text-align:center;';
        toast.innerText = '⚠️ AI Error: ' + errorMsg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    },

    // Send AI message to chat
    sendAIMessage(text, replyToId, replyToText) {
        // Show typing indicator first, then send after delay
        db.ref('typing/jarvis_ai').set(true);
        setTimeout(() => {
            db.ref('typing/jarvis_ai').remove();
            const msgData = {
                senderId: AI_ID,
                senderName: 'Jarvis ✨',
                senderAvatar: '',
                text: text,
                type: 'ai',
                seen: false,
                isAI: true,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            if (replyToId) { msgData.replyToId = replyToId; msgData.replyToText = replyToText || ''; }
            messagesRef.push(msgData);
        }, 1000 + Math.random() * 1500); // 1-2.5 sec typing delay
    },

    // Detect emergency keywords
    detectEmergency(text) {
        if (!text) return false;
        const keywords = ['urgent', 'emergency', 'online aso', 'call me', 'khub important', 'need you', 'please reply', 'jldi aso', 'dorkar', 'ekhoni', 'pls reply', 'reply dao', 'reply dey', 'reply de'];
        const lower = text.toLowerCase();
        return keywords.some(k => lower.includes(k));
    },

    // Trigger emergency alert for owner
    triggerEmergencyAlert(text) {
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🚨 Rita needs you!', {
                body: text,
                icon: 'https://i.pravatar.cc/150?img=47',
                tag: 'emergency',
                requireInteraction: true
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(p => {
                if (p === 'granted') {
                    new Notification('🚨 Rita needs you!', { body: text, icon: 'https://i.pravatar.cc/150?img=47' });
                }
            });
        }

        // Vibration
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 400]);
        }

        // Play alert sound
        try {
            const alertAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2JkZeYl5KMhX13cW1ub3V9hIuRlZiXk46Jg3x2cG1ucHZ9hIuRlZiXk46Jg3x2cG1ucHZ9hIuRlZiXk46Jg3x2cG1ucHZ9');
            alertAudio.volume = 0.8;
            alertAudio.play().catch(() => {});
        } catch (e) {}

        // Visual alert in app
        this.showEmergencyBanner(text);

        // Store alert in Firebase for cross-device
        db.ref('emergency_alerts').push({
            text: text,
            from: 'partner',
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            read: false
        });
    },

    // Show emergency banner
    showEmergencyBanner(text) {
        const existing = document.getElementById('emergency-banner');
        if (existing) existing.remove();

        const banner = document.createElement('div');
        banner.id = 'emergency-banner';
        banner.className = 'emergency-banner';
        banner.innerHTML = `<div class="emergency-content"><span class="emergency-icon">🚨</span><span class="emergency-text">Rita: ${text.substring(0, 50)}</span></div><button class="emergency-dismiss" onclick="this.parentElement.remove()">✕</button>`;
        document.querySelector('.chat-main-container').prepend(banner);

        setTimeout(() => banner.classList.add('show'), 50);
        setTimeout(() => { if (banner.parentElement) banner.remove(); }, 30000);
    },

    // Update memory based on conversation
    updateMemory(msg) {
        const text = (msg.text || '').toLowerCase();
        // Track mood patterns
        if (text.includes('rag') || text.includes('angry') || text.includes('gussa')) {
            this.saveMemory('last_fight', new Date().toLocaleDateString());
        }
        if (text.includes('love') || text.includes('valobashi') || text.includes('miss')) {
            this.saveMemory('last_love_moment', new Date().toLocaleDateString());
        }
    },

    // Setup owner status UI in settings
    setupOwnerStatusUI() {
        const settingsMenu = document.getElementById('settings-menu');
        if (!settingsMenu) return;

        // Check if already added
        if (document.getElementById('ai-status-group')) return;

        const statusGroup = document.createElement('div');
        statusGroup.id = 'ai-status-group';
        statusGroup.className = 'settings-input-group';
        statusGroup.style.marginTop = '16px';
        statusGroup.innerHTML = `
            <label>🤖 AI Status Note</label>
            <input type="text" id="owner-status-input" placeholder="e.g. Studying 📚, Sleeping 😴" value="${this.ownerStatus || ''}">
            <div class="ai-status-presets">
                <span class="ai-preset" onclick="JarvisAI.setQuickStatus('Studying now 📚')">📚</span>
                <span class="ai-preset" onclick="JarvisAI.setQuickStatus('Sleeping 😴')">😴</span>
                <span class="ai-preset" onclick="JarvisAI.setQuickStatus('Busy 💼')">💼</span>
                <span class="ai-preset" onclick="JarvisAI.setQuickStatus('Gaming 🎮')">🎮</span>
                <span class="ai-preset" onclick="JarvisAI.setQuickStatus('Mood off 😶')">😶</span>
                <span class="ai-preset" onclick="JarvisAI.setQuickStatus('Namaz time 🕌')">🕌</span>
                <span class="ai-preset" onclick="JarvisAI.setQuickStatus('')">❌</span>
            </div>
        `;

        const saveBtn = settingsMenu.querySelector('#save-settings-btn');
        if (saveBtn) saveBtn.parentElement.insertBefore(statusGroup, saveBtn);

        // Save status on input change
        const statusInput = document.getElementById('owner-status-input');
        if (statusInput) {
            statusInput.addEventListener('change', () => {
                ownerStatusRef.set(statusInput.value.trim());
            });
        }
    },

    setQuickStatus(status) {
        ownerStatusRef.set(status);
        const input = document.getElementById('owner-status-input');
        if (input) input.value = status;
    },

    // AI dry chat initiator (very rare)
    startDryChatCheck() {
        setInterval(() => {
            if (!this.isAuthorized()) return;
            if (this.contextBuffer.length === 0) return;
            const lastMsg = this.contextBuffer[this.contextBuffer.length - 1];
            const timeSince = Date.now() - (lastMsg.time || 0);
            // If no messages for 4+ hours and both were online recently
            if (timeSince > 14400000 && this.ownerOnline && this.partnerOnline) {
                if (Math.random() < 0.15) { // 15% chance
                    this.initiateDryChat();
                }
            }
        }, 1800000); // Check every 30 min
    },

    async initiateDryChat() {
        if (Date.now() - this.lastAIReply < 3600000) return; // 1hr cooldown
        const prompts = [
            "Ajke dujon er mood kemon? 😅",
            "Kew karo sathe rag kore ace naki? 👀",
            "Movie night plan korben naki? 🎬",
            "Onek shanti shanti lage... sob thik to? 💖"
        ];
        const text = prompts[Math.floor(Math.random() * prompts.length)];
        this.sendAIMessage(text);
        this.lastAIReply = Date.now();
    },

    // AI joins conversation as 3rd friend
    async aiJoinConversation() {
        if (this.isProcessing || Date.now() - this.lastAIReply < 300000) return;
        this.isProcessing = true;
        try {
            const contextStr = this.contextBuffer.slice(-8).map(m =>
                `${m.sender === 'owner' ? 'Bhai' : 'Babi'}: ${m.text}`
            ).join('\n');

            const prompt = `Tumi Jarvis. Bhai ar Babi chat korce. Tui group er 3rd friend — tui naturally kisu bol. Jemon WhatsApp group e friend kisu bole.

EXAMPLES:
- "Oii ki hocce dujon er 👀"
- "Haha Babi ar Bhai er drama 😂"
- "Arre ami o achi group e 😅"

RULES: 1 line ONLY. Banglish. 1-2 emoji. Casual.

Chat:
${contextStr}

Jarvis:`;

            const response = await this.callAI(prompt, 'join');
            if (response) {
                let clean = response.replace(/^["']|["']$/g, '').replace(/^Jarvis:\s*/i, '').trim();
                if (clean && clean.length > 2) { this.sendAIMessage(clean); this.lastAIReply = Date.now(); }
            }
        } catch(e) {}
        this.isProcessing = false;
    },

    // Respond when someone replies to AI's message
    async respondToReply(msg, isFromOwner) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        try {
            const who = isFromOwner ? 'Bhai' : 'Babi';
            const contextStr = this.contextBuffer.slice(-6).map(m => {
                const name = m.sender === 'owner' ? 'Bhai' : (m.sender === 'jarvis' ? 'Jarvis' : 'Babi');
                return name + ': ' + m.text;
            }).join('\n');

            const prompt = `Tumi Jarvis. ${who} tomar message er reply diyece. Tui naturally reply de — jemon friend reply kore.

STYLE: 1 line, Banglish, 1-2 emoji, casual. "haha", "arre", "hmm" use koro.

Chat:
${contextStr}

${who} toke reply korce: "${msg.text}"

Jarvis:`;

            const response = await this.callAI(prompt, msg.text);
            if (response) {
                let clean = response.replace(/^["']|["']$/g, '').replace(/^Jarvis:\s*/i, '').trim();
                if (clean && clean.length > 2) { this.sendAIMessage(clean); this.lastAIReply = Date.now(); }
            }
        } catch(e) {}
        this.isProcessing = false;
    }
};

// Make JarvisAI globally accessible
window.JarvisAI = JarvisAI;

// ==========================================
// AI PANEL UI
// ==========================================
function createAIPanelUI() {
    // AI button in header
    const headerRight = document.querySelector('.header-right');
    if (headerRight && !document.getElementById('ai-panel-btn')) {
        const aiBtn = document.createElement('button');
        aiBtn.id = 'ai-panel-btn';
        aiBtn.className = 'header-icon ai-header-btn';
        aiBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
        aiBtn.onclick = toggleAIPanel;
        headerRight.insertBefore(aiBtn, headerRight.firstChild);
    }

    // AI Panel
    if (!document.getElementById('ai-panel')) {
        const panel = document.createElement('div');
        panel.id = 'ai-panel';
        panel.className = 'ai-panel';
        panel.innerHTML = `
            <div class="ai-panel-header">
                <h3>🤖 Jarvis AI</h3>
                <button class="ai-panel-close" onclick="toggleAIPanel()">✕</button>
            </div>
            <div class="ai-panel-body">
                <div class="ai-panel-section">
                    <div class="ai-panel-label">Status</div>
                    <div class="ai-panel-value" id="ai-status-indicator">${JarvisAI.enabled ? '🟢 Active' : '🔴 Disabled'}</div>
                </div>
                <div class="ai-panel-section">
                    <div class="ai-panel-label">Owner Status</div>
                    <div class="ai-panel-value" id="ai-owner-status-display">${JarvisAI.ownerStatus || 'Not set'}</div>
                </div>
                <div class="ai-panel-section">
                    <div class="ai-panel-label">Owner</div>
                    <div class="ai-panel-value">${JarvisAI.ownerOnline ? '🟢 Online' : '🔴 Offline'}</div>
                </div>
                <div class="ai-panel-section">
                    <div class="ai-panel-label">Memory Items</div>
                    <div class="ai-panel-value">${Object.keys(JarvisAI.memory).length} saved</div>
                </div>
                <div class="ai-panel-section">
                    <div class="ai-panel-label">Tip</div>
                    <div class="ai-panel-value" style="font-size:12px;color:var(--text-muted);">Type /ai [message] to chat with Jarvis anytime</div>
                </div>
                <button class="ai-toggle-btn" onclick="toggleAIEnabled()">${JarvisAI.enabled ? 'Disable AI' : 'Enable AI'}</button>
            </div>
        `;
        document.querySelector('.chat-main-container').appendChild(panel);
    }
}

function toggleAIPanel() {
    const panel = document.getElementById('ai-panel');
    if (panel) panel.classList.toggle('active');
}
window.toggleAIPanel = toggleAIPanel;

function toggleAIEnabled() {
    JarvisAI.enabled = !JarvisAI.enabled;
    aiSettingsRef.child('enabled').set(JarvisAI.enabled);
    const indicator = document.getElementById('ai-status-indicator');
    if (indicator) indicator.innerText = JarvisAI.enabled ? '🟢 Active' : '🔴 Disabled';
    const btn = document.querySelector('.ai-toggle-btn');
    if (btn) btn.innerText = JarvisAI.enabled ? 'Disable AI' : 'Enable AI';
}
window.toggleAIEnabled = toggleAIEnabled;

// Override renderMessage to handle AI messages with special styling
// (Already handled inline in renderMessage function above)

function renderAIMessageInline(msg, key, prepend) {
    const msgRow = document.createElement('div');
    msgRow.className = 'msg-wrapper in ai-message' + (msg.isPrivate ? ' ai-private' : '');
    msgRow.id = key;
    msgRow.setAttribute('data-text', msg.text || '');

    const bubbleContent = (msg.text || '').replace(/\n/g, '<br>');
    const privateLabel = msg.isPrivate ? '<span class="ai-private-badge">Private</span>' : '';

    msgRow.innerHTML = `
        <div class="ai-avatar">🤖</div>
        <div class="swipe-action-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="var(--primary)"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg></div>
        <div class="bubble ai-bubble">${bubbleContent}<span class="ai-badge">AI</span>${privateLabel}</div>
    `;

    if (prepend) {
        chatArea.prepend(msgRow);
    } else {
        chatArea.appendChild(msgRow);
        scrollToBottom();
    }
    // Enable swipe reply on AI messages too
    if (!msg.isPrivate) attachInteractions(msgRow);
}

// ==========================================
// TOOLS PAGE, STREAK, MISS YOU, MOOD, POKE
// ==========================================
const streakRef = db.ref('streak');
const moodRef = db.ref('mood');
const duoInviteRef = db.ref('duo_invites');
const musicRef = db.ref('music_room');

function openToolsPage() { document.getElementById('tools-page').classList.add('active'); updateStreakDisplay(); }
function closeToolsPage() { document.getElementById('tools-page').classList.remove('active'); }
window.openToolsPage = openToolsPage;
window.closeToolsPage = closeToolsPage;

// STREAK SYSTEM
let streakData = { count: 0, lastDate: '', startDate: '' };
streakRef.on('value', snap => {
    streakData = snap.val() || { count: 0, lastDate: '', startDate: '' };
    updateStreakDisplay();
});

function updateStreak() {
    const today = new Date().toDateString();
    if (streakData.lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (streakData.lastDate === yesterday) {
        streakData.count++;
    } else if (streakData.lastDate !== today) {
        streakData.count = 1; streakData.startDate = today;
    }
    streakData.lastDate = today;
    streakRef.set(streakData);
}

function updateStreakDisplay() {
    const el = document.getElementById('streak-count');
    const badge = document.getElementById('streak-badge');
    if (el) el.innerText = streakData.count || 0;
    if (badge) {
        if (streakData.count >= 100) badge.innerText = '💎';
        else if (streakData.count >= 30) badge.innerText = '🔥';
        else if (streakData.count >= 7) badge.innerText = '🌟';
        else badge.innerText = '💬';
    }
}

// Update streak when sending message
const origSendMsg = sendFirebaseMessage;

window.sendFirebaseMessage = async function(text, type, media, dur) {
    updateStreak();
    return origSendMsg(text, type, media, dur);
};

// MISS YOU
function sendMissYou() {
    db.ref('miss_you').push({ from: myName, timestamp: firebase.database.ServerValue.TIMESTAMP });
    showHeartsAnimation();
    messagesRef.push({
        senderId: userIdentifier, senderName: myName, senderAvatar: myAvatar,
        text: '💖 Miss You 💖', type: 'text', seen: false,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    closeToolsPage();
}
window.sendMissYou = sendMissYou;

function showHeartsAnimation() {
    const container = document.getElementById('hearts-container');
    const hearts = ['💖','💕','❤️','💗','💓','🥰','✨'];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const h = document.createElement('div');
            h.className = 'floating-heart';
            h.innerText = hearts[Math.floor(Math.random()*hearts.length)];
            h.style.left = Math.random()*90 + 5 + '%';
            h.style.animationDuration = (2+Math.random()*2)+'s';
            container.appendChild(h);
            setTimeout(() => h.remove(), 4000);
        }, i * 150);
    }
}

// Listen for miss you from partner
db.ref('miss_you').orderByChild('timestamp').limitToLast(1).on('child_added', snap => {
    const d = snap.val();
    if (d && d.from !== myName && Date.now() - (d.timestamp||0) < 5000) {
        showHeartsAnimation();
        if (navigator.vibrate) navigator.vibrate([100,50,100,50,200]);
    }
});

// MOOD SYSTEM
function openMoodPicker() { document.getElementById('mood-picker').classList.add('active'); }
window.openMoodPicker = openMoodPicker;
function setMood(emoji, label) {
    moodRef.child(userIdentifier).set({ emoji, label, timestamp: Date.now() });
    document.getElementById('mood-picker').classList.remove('active');
    closeToolsPage();
}
window.setMood = setMood;

// POKE
function sendPoke(type) {
    db.ref('pokes').push({ from: myName, type, timestamp: firebase.database.ServerValue.TIMESTAMP });
    messagesRef.push({
        senderId: userIdentifier, senderName: myName, senderAvatar: myAvatar,
        text: type === 'poke' ? '👉 Poked you!' : '🤗 Hugged you!',
        type: 'text', seen: false, timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    closeToolsPage();
}
window.sendPoke = sendPoke;

db.ref('pokes').orderByChild('timestamp').limitToLast(1).on('child_added', snap => {
    const d = snap.val();
    if (d && d.from !== myName && Date.now() - (d.timestamp||0) < 5000) {
        if (navigator.vibrate) navigator.vibrate([150,80,150]);
    }
});

// ==========================================
// MINI GAMES SYSTEM
// ==========================================
const gamesRef = db.ref('games');
let currentGame = null;
let currentGameKey = null;

function openGamesPage() { document.getElementById('games-page').classList.add('active'); }
function closeGamesPage() { document.getElementById('games-page').classList.remove('active'); }
window.openGamesPage = openGamesPage;
window.closeGamesPage = closeGamesPage;

function closeGameArena() {
    document.getElementById('game-arena').classList.remove('active');
    if (currentGameKey) gamesRef.child(currentGameKey).off();
    currentGame = null; currentGameKey = null;
}
window.closeGameArena = closeGameArena;

function startGame(gameId, mode) {
    if (mode === 'duo') {
        // Duo invite is now handled by selectGameMode
        // This is called when invite is accepted
        closeGamesPage(); closeToolsPage();
        launchGame(gameId, 'duo');
    } else {
        closeGamesPage(); closeToolsPage();
        launchGame(gameId, 'solo');
    }
}
window.startGame = startGame;

// Duo invite listener - checks every time value changes
duoInviteRef.on('value', snap => {
    const inv = snap.val();
    if (inv && inv.status === 'pending' && inv.fromId !== userIdentifier) {
        const popup = document.getElementById('duo-invite-popup');
        const names = { 'tictactoe':'Tic Tac Toe','drawing':'Drawing','ludo':'Ludo','fighter':'Tap Fighter','snake':'Snake','pong':'Ping Pong','flappy':'Flappy Bird','memory-match':'Memory Match' };
        document.getElementById('duo-invite-text').innerText = `${inv.from} wants to play ${names[inv.game]||inv.game}!`;
        document.getElementById('duo-invite-icon').innerText = '🎮';
        popup.setAttribute('data-type', 'game');
        popup.classList.add('active');
        if (navigator.vibrate) navigator.vibrate([100,50,100]);
        // Auto dismiss after 30 seconds
        setTimeout(() => { if (popup.classList.contains('active')) { popup.classList.remove('active'); duoInviteRef.update({status:'rejected'}); setTimeout(()=>duoInviteRef.remove(),2000); } }, 30000);
    }
});

function acceptDuoInvite() {
    document.getElementById('duo-invite-popup').classList.remove('active');
    const invType = document.getElementById('duo-invite-popup').getAttribute('data-type');
    if (invType === 'music') {
        db.ref('music_invite').once('value', snap => {
            const inv = snap.val();
            if (inv) {
                db.ref('music_invite').update({ status: 'accepted' });
                // Start playing the song locally too
                if (musicList[inv.songIdx]) { playMusicAt(inv.songIdx); }
            }
        });
    } else {
        duoInviteRef.once('value', snap => {
            const inv = snap.val();
            if (inv) { duoInviteRef.update({ status: 'accepted' }); launchGame(inv.game, 'duo'); }
        });
    }
}
function rejectDuoInvite() {
    document.getElementById('duo-invite-popup').classList.remove('active');
    const invType = document.getElementById('duo-invite-popup').getAttribute('data-type');
    if (invType === 'music') {
        db.ref('music_invite').update({ status: 'rejected' });
        setTimeout(() => db.ref('music_invite').remove(), 2000);
    } else {
        duoInviteRef.update({ status: 'rejected' });
        setTimeout(() => duoInviteRef.remove(), 2000);
    }
}
window.acceptDuoInvite = acceptDuoInvite;
window.rejectDuoInvite = rejectDuoInvite;

function launchGame(gameId, mode) {
    document.getElementById('game-arena').classList.add('active');
    const body = document.getElementById('game-arena-body');
    const title = document.getElementById('game-arena-title');
    body.innerHTML = '';
    if (gameId === 'tictactoe') { title.innerText = '❌⭕ Tic Tac Toe'; launchTTTNew(body,mode); }
    else if (gameId === 'drawing') { title.innerText = '🎨 Drawing Board'; launchDrawing(body,mode); }
    else if (gameId === 'ludo') { title.innerText = '🎲 Ludo'; launchLudo(body,mode); }
    else if (gameId === 'fighter') { title.innerText = '⚔️ Tap Fighter'; launchFighter(body,mode); }
    else if (gameId === 'snake') { title.innerText = '🐍 Snake'; launchSnake(body,mode); }
    else if (gameId === 'pong') { title.innerText = '🏓 Ping Pong'; launchPong(body,mode); }
    else if (gameId === 'flappy') { title.innerText = '🐦 Flappy Bird'; launchFlappy(body,mode); }
    else if (gameId === 'memory-match') { title.innerText = '🧠 Memory Match'; renderMemoryMatch(body); }
}

// ===== NEW GAMES =====

// TIC TAC TOE
function launchTTTNew(body, mode) {
    currentGameKey = 'ttt_game';
    if (mode === 'duo') {
        gamesRef.child(currentGameKey).once('value', snap => {
            if (!snap.exists()||snap.val().status==='done') gamesRef.child(currentGameKey).set({board:Array(9).fill(''),turn:'X',players:{X:userIdentifier,O:''},status:'playing'});
            else { const g=snap.val(); if(!g.players.O&&g.players.X!==userIdentifier) gamesRef.child(currentGameKey).child('players/O').set(userIdentifier); }
        });
        gamesRef.child(currentGameKey).on('value', snap => { const g=snap.val(); if(!g)return; const my=g.players.X===userIdentifier?'X':'O'; const turn=g.turn===my; let st=g.status==='done'?(g.winner?(g.winner===my?'You Won! 🎉':'You Lost 😢'):'Draw!'):(turn?'Your turn!':'Waiting...'); body.innerHTML=`<div class="ttt-status">${st}</div><div class="ttt-board">${g.board.map((c,i)=>`<div class="ttt-cell ${c.toLowerCase()}" onclick="tttMove(${i})">${c}</div>`).join('')}</div>${g.status==='done'?'<button class="ttt-reset" onclick="tttReset()">Play Again</button>':''}`;});
    } else { renderTTTSolo(body); }
}
function renderTTTSolo(body) { let b=Array(9).fill(''),over=false; const ck=b2=>{const w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];for(const[a,c,d]of w)if(b2[a]&&b2[a]===b2[c]&&b2[a]===b2[d])return b2[a];return null;}; const ai=()=>{const e=b.map((v,i)=>v===''?i:null).filter(v=>v!==null);if(!e.length)return;for(const s of['O','X'])for(const i of e){const t=[...b];t[i]=s;if(ck(t)===s){b[i]='O';return;}}if(b[4]===''){b[4]='O';return;}b[e[Math.floor(Math.random()*e.length)]]='O';}; const r=()=>{const w=ck(b);let st=w?(w==='X'?'You Won! 🎉':'AI Won 😅'):(!b.includes('')?'Draw!':'Your turn (X)');if(w||!b.includes(''))over=true;body.innerHTML=`<div class="ttt-status">${st}</div><div class="ttt-board">${b.map((c,i)=>`<div class="ttt-cell ${c.toLowerCase()}" data-i="${i}">${c}</div>`).join('')}</div>${over?'<button class="ttt-reset" id="sr">Again</button>':''}`;body.querySelectorAll('.ttt-cell').forEach(c=>{c.onclick=()=>{const i=+c.dataset.i;if(b[i]||over)return;b[i]='X';r();if(!over){setTimeout(()=>{ai();r();},300);}};});const rs=body.querySelector('#sr');if(rs)rs.onclick=()=>{b=Array(9).fill('');over=false;r();};}; r();}
function tttMove(i){gamesRef.child('ttt_game').once('value',snap=>{const g=snap.val();if(!g||g.status==='done')return;const my=g.players.X===userIdentifier?'X':'O';if(g.turn!==my||g.board[i])return;g.board[i]=my;const w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];let win=null;for(const[a,c,d]of w)if(g.board[a]&&g.board[a]===g.board[c]&&g.board[a]===g.board[d])win=g.board[a];if(win){g.status='done';g.winner=win;}else if(!g.board.includes('')){g.status='done';g.winner='';}else g.turn=my==='X'?'O':'X';gamesRef.child('ttt_game').set(g);});}
window.tttMove=tttMove;
function tttReset(){gamesRef.child('ttt_game').set({board:Array(9).fill(''),turn:'X',players:{X:userIdentifier,O:''},status:'playing'});}
window.tttReset=tttReset;
// ===== DRAWING BOARD =====
function launchDrawing(body,mode){
    // Clear old drawing data first to prevent lag
    gamesRef.child('draw_live').remove();
    
    body.innerHTML=`<div style="display:flex;flex-direction:column;align-items:center;height:100%;padding:8px;"><canvas id="dcv" style="background:#fff;border-radius:12px;touch-action:none;flex:1;width:100%;max-width:100%;"></canvas><div style="display:flex;gap:6px;justify-content:center;padding:8px;flex-wrap:wrap;"><button class="draw-color active" data-c="#000" style="width:30px;height:30px;border-radius:50%;background:#000;border:2px solid transparent;cursor:pointer;"></button><button class="draw-color" data-c="#ef4444" style="width:30px;height:30px;border-radius:50%;background:#ef4444;border:2px solid transparent;cursor:pointer;"></button><button class="draw-color" data-c="#3b82f6" style="width:30px;height:30px;border-radius:50%;background:#3b82f6;border:2px solid transparent;cursor:pointer;"></button><button class="draw-color" data-c="#10B981" style="width:30px;height:30px;border-radius:50%;background:#10B981;border:2px solid transparent;cursor:pointer;"></button><button class="draw-color" data-c="#F97316" style="width:30px;height:30px;border-radius:50%;background:#F97316;border:2px solid transparent;cursor:pointer;"></button><button class="draw-color" data-c="#8B5CF6" style="width:30px;height:30px;border-radius:50%;background:#8B5CF6;border:2px solid transparent;cursor:pointer;"></button><button class="ttt-reset" style="padding:8px 16px;font-size:13px;margin-left:8px;" id="draw-clear-btn">🗑️ Clear</button></div></div>`;
    
    const cv=document.getElementById('dcv');
    // Set canvas to full available size
    setTimeout(()=>{cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;},50);
    const cx=cv.getContext('2d');
    let dr=false,col='#000',lx=0,ly=0;
    
    // Color picker
    body.querySelectorAll('.draw-color').forEach(b=>{b.onclick=()=>{body.querySelectorAll('.draw-color').forEach(x=>{x.style.border='2px solid transparent';});b.style.border='2px solid var(--text-main)';col=b.dataset.c;};});
    
    // Clear button - clears for both users
    document.getElementById('draw-clear-btn').onclick=()=>{cx.clearRect(0,0,cv.width,cv.height);gamesRef.child('draw_live').remove();};
    
    const gp=e=>{const r=cv.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top};};
    const st=e=>{e.preventDefault();dr=true;const p=gp(e);lx=p.x;ly=p.y;};
    const mv=e=>{if(!dr)return;e.preventDefault();const p=gp(e);cx.beginPath();cx.moveTo(lx,ly);cx.lineTo(p.x,p.y);cx.strokeStyle=col;cx.lineWidth=4;cx.lineCap='round';cx.stroke();if(mode==='duo')gamesRef.child('draw_live').push({x1:lx,y1:ly,x2:p.x,y2:p.y,c:col});lx=p.x;ly=p.y;};
    const en=()=>{dr=false;};
    cv.addEventListener('mousedown',st);cv.addEventListener('mousemove',mv);cv.addEventListener('mouseup',en);cv.addEventListener('mouseleave',en);
    cv.addEventListener('touchstart',st,{passive:false});cv.addEventListener('touchmove',mv,{passive:false});cv.addEventListener('touchend',en);
    
    // Duo: listen for partner strokes + clear events
    if(mode==='duo'){
        gamesRef.child('draw_live').on('child_added',sn=>{const s=sn.val();if(!s)return;cx.beginPath();cx.moveTo(s.x1,s.y1);cx.lineTo(s.x2,s.y2);cx.strokeStyle=s.c;cx.lineWidth=4;cx.lineCap='round';cx.stroke();});
        gamesRef.child('draw_live').on('value',sn=>{if(!sn.exists())cx.clearRect(0,0,cv.width,cv.height);});
    }
}

// ===== LUDO, FIGHTER, SNAKE, PONG, FLAPPY, MEMORY =====
function launchLudo(body,mode){let p1=0,p2=0,t=30;body.innerHTML=`<div style="text-align:center;padding:20px;"><div style="display:flex;justify-content:space-between;padding:0 10px;margin-bottom:16px;"><span style="font-size:20px;">🔴 <b id="ls1">0</b>/${t}</span><span id="lst" style="font-size:14px;color:var(--primary);font-weight:600;">Roll!</span><span style="font-size:20px;">🔵 <b id="ls2">0</b>/${t}</span></div><div style="height:16px;background:rgba(0,0,0,0.06);border-radius:8px;overflow:hidden;margin-bottom:20px;"><div id="lb1" style="height:100%;background:linear-gradient(90deg,#ef4444,#f97316);width:0%;transition:width 0.4s;"></div></div><div id="ldc" style="font-size:56px;margin:20px 0;">🎲</div><button class="ttt-reset" style="font-size:18px;padding:14px 36px;" id="lrl">🎲 Roll</button></div>`;const upd=()=>{document.getElementById('ls1').innerText=p1;document.getElementById('ls2').innerText=p2;document.getElementById('lb1').style.width=Math.min(p1/t*100,100)+'%';if(p1>=t)document.getElementById('lst').innerText='🎉 You Won!';else if(p2>=t)document.getElementById('lst').innerText='😢 Lost!';};document.getElementById('lrl').onclick=()=>{if(p1>=t||p2>=t)return;const d=Math.floor(Math.random()*6)+1;const f=['⚀','⚁','⚂','⚃','⚄','⚅'];document.getElementById('ldc').innerText=f[d-1];p1+=d;upd();if(p1<t)setTimeout(()=>{const d2=Math.floor(Math.random()*6)+1;p2+=d2;upd();},600);};}
function launchFighter(body,mode){let mh=100,eh=100,ov=false;body.innerHTML=`<div style="text-align:center;padding:20px;"><div style="display:flex;gap:12px;margin-bottom:16px;"><div style="flex:1;"><div style="font-size:11px;color:var(--text-muted);">You 🥊</div><div style="height:10px;background:rgba(0,0,0,0.06);border-radius:5px;overflow:hidden;margin-top:4px;"><div id="fh1" style="height:100%;background:#10B981;width:100%;transition:width 0.3s;"></div></div></div><div style="flex:1;"><div style="font-size:11px;color:var(--text-muted);">Enemy 👊</div><div style="height:10px;background:rgba(0,0,0,0.06);border-radius:5px;overflow:hidden;margin-top:4px;"><div id="fh2" style="height:100%;background:#ef4444;width:100%;transition:width 0.3s;"></div></div></div></div><div style="font-size:56px;margin:24px 0;">🥊 ⚡ 👊</div><div id="fs" style="font-size:16px;font-weight:700;color:var(--text-main);margin-bottom:20px;">Tap Attack!</div><button class="ttt-reset" style="font-size:18px;padding:16px 40px;" id="fa">⚔️ ATTACK!</button></div>`;const u=()=>{document.getElementById('fh1').style.width=mh+'%';document.getElementById('fh2').style.width=eh+'%';if(eh<=0){document.getElementById('fs').innerText='🎉 You Won!';ov=true;}if(mh<=0){document.getElementById('fs').innerText='😢 Defeated!';ov=true;}};document.getElementById('fa').onclick=()=>{if(ov)return;eh=Math.max(0,eh-(Math.floor(Math.random()*18)+5));u();if(!ov)setTimeout(()=>{mh=Math.max(0,mh-(Math.floor(Math.random()*14)+3));u();},500);};}
function launchSnake(body){body.innerHTML=`<div style="text-align:center;"><canvas id="snk" width="300" height="300" style="background:#111;border-radius:14px;display:block;margin:0 auto;"></canvas><div style="margin-top:10px;font-size:14px;font-weight:600;color:var(--text-main);">Score: <span id="snks">0</span></div><div style="display:grid;grid-template-columns:repeat(3,48px);gap:6px;justify-content:center;margin-top:12px;"><div></div><button class="ttt-reset" style="padding:10px;" onclick="window._sd({x:0,y:-1})">⬆️</button><div></div><button class="ttt-reset" style="padding:10px;" onclick="window._sd({x:-1,y:0})">⬅️</button><button class="ttt-reset" style="padding:10px;" onclick="window._sd({x:0,y:1})">⬇️</button><button class="ttt-reset" style="padding:10px;" onclick="window._sd({x:1,y:0})">➡️</button></div></div>`;const cv=document.getElementById('snk'),cx=cv.getContext('2d'),g=15,c=20;let sn=[{x:10,y:10}],fd={x:5,y:5},dir={x:1,y:0},sc=0,al=true;window._sd=d=>{if(d.x!==-dir.x||d.y!==-dir.y)dir=d;};const pl=()=>{fd={x:Math.floor(Math.random()*c),y:Math.floor(Math.random()*c)};};const dr=()=>{cx.fillStyle='#111';cx.fillRect(0,0,300,300);cx.fillStyle='#10B981';sn.forEach(s=>cx.fillRect(s.x*g,s.y*g,g-1,g-1));cx.fillStyle='#F43F5E';cx.fillRect(fd.x*g,fd.y*g,g-1,g-1);};const up=()=>{if(!al)return;const h={x:sn[0].x+dir.x,y:sn[0].y+dir.y};if(h.x<0||h.x>=c||h.y<0||h.y>=c||sn.some(s=>s.x===h.x&&s.y===h.y)){al=false;document.getElementById('snks').innerText=sc+' 💀';return;}sn.unshift(h);if(h.x===fd.x&&h.y===fd.y){sc++;document.getElementById('snks').innerText=sc;pl();}else sn.pop();dr();};document.onkeydown=e=>{const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};if(m[e.key])window._sd(m[e.key]);};pl();dr();setInterval(up,120);}
function launchPong(body){body.innerHTML=`<div style="text-align:center;"><canvas id="png" width="280" height="380" style="background:#111;border-radius:14px;display:block;margin:0 auto;touch-action:none;"></canvas><div style="margin-top:10px;font-size:18px;font-weight:700;color:var(--text-main);"><span id="pp1">0</span> - <span id="pp2">0</span></div></div>`;const cv=document.getElementById('png'),cx=cv.getContext('2d');let bl={x:140,y:190,dx:3,dy:3},p1={x:110,w:60,y:362},p2={x:110,w:60,y:10},s1=0,s2=0;const dr=()=>{cx.fillStyle='#111';cx.fillRect(0,0,280,380);cx.fillStyle='#fff';cx.fillRect(p1.x,p1.y,p1.w,8);cx.fillRect(p2.x,p2.y,p2.w,8);cx.beginPath();cx.arc(bl.x,bl.y,6,0,Math.PI*2);cx.fillStyle='#F43F5E';cx.fill();};const up=()=>{bl.x+=bl.dx;bl.y+=bl.dy;if(bl.x<=6||bl.x>=274)bl.dx*=-1;if(bl.y<=18&&bl.x>=p2.x&&bl.x<=p2.x+p2.w)bl.dy*=-1;if(bl.y>=354&&bl.x>=p1.x&&bl.x<=p1.x+p1.w)bl.dy*=-1;if(bl.y<0){s1++;bl={x:140,y:190,dx:3,dy:3};}if(bl.y>380){s2++;bl={x:140,y:190,dx:3,dy:-3};}p2.x+=(bl.x-p2.x-30)*0.05;document.getElementById('pp1').innerText=s1;document.getElementById('pp2').innerText=s2;dr();};cv.onmousemove=e=>{const r=cv.getBoundingClientRect();p1.x=Math.max(0,Math.min(220,e.clientX-r.left-30));};cv.ontouchmove=e=>{e.preventDefault();const r=cv.getBoundingClientRect();p1.x=Math.max(0,Math.min(220,e.touches[0].clientX-r.left-30));};dr();setInterval(up,16);}
function launchFlappy(body){body.innerHTML=`<div style="text-align:center;"><canvas id="flp" width="280" height="400" style="background:#1a1a2e;border-radius:14px;display:block;margin:0 auto;"></canvas><div style="margin-top:10px;font-size:14px;font-weight:600;color:var(--text-main);">Score: <span id="fps">0</span> <span style="font-size:11px;color:var(--text-muted);">Tap to fly</span></div></div>`;const cv=document.getElementById('flp'),cx=cv.getContext('2d');let b={x:60,y:200,v:0},pp=[],sc=0,al=true,fr=0;const gr=0.35,jp=-6.5,gp=130,pw=36;const ap=()=>{const h=Math.floor(Math.random()*140)+80;pp.push({x:280,top:h,bot:h+gp,sc:false});};const dr=()=>{cx.fillStyle='#1a1a2e';cx.fillRect(0,0,280,400);cx.fillStyle='#F59E0B';cx.beginPath();cx.arc(b.x,b.y,11,0,Math.PI*2);cx.fill();cx.fillStyle='#10B981';pp.forEach(p=>{cx.fillRect(p.x,0,pw,p.top);cx.fillRect(p.x,p.bot,pw,400-p.bot);});};const up=()=>{if(!al)return;b.v+=gr;b.y+=b.v;fr++;if(fr%80===0)ap();pp.forEach(p=>{p.x-=2.5;});pp=pp.filter(p=>p.x>-pw);pp.forEach(p=>{if(b.x+11>p.x&&b.x-11<p.x+pw&&(b.y-11<p.top||b.y+11>p.bot))al=false;if(p.x+pw<b.x&&!p.sc){p.sc=true;sc++;document.getElementById('fps').innerText=sc;}});if(b.y>400||b.y<0)al=false;if(!al)document.getElementById('fps').innerText=sc+' 💀';dr();};const fl=()=>{if(al)b.v=jp;else{b={x:60,y:200,v:0};pp=[];sc=0;al=true;fr=0;document.getElementById('fps').innerText='0';}};cv.onclick=fl;cv.ontouchstart=fl;dr();setInterval(up,16);}
function renderMemoryMatch(body){const em=['🎮','🎵','💖','🔥','⭐','🌙','🎲','🎯'];let cd=[...em,...em].sort(()=>Math.random()-0.5),fl=[],mt=[],mv=0;const r=()=>{body.innerHTML=`<div style="text-align:center;"><div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Moves: ${mv} | ${mt.length/2}/8</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:280px;margin:0 auto;">${cd.map((c,i)=>`<div class="ttt-cell" style="height:60px;font-size:22px;${mt.includes(i)||fl.includes(i)?'':'background:var(--primary-gradient);color:transparent;'}" data-i="${i}">${mt.includes(i)||fl.includes(i)?c:'?'}</div>`).join('')}</div>${mt.length===16?'<button class="ttt-reset" style="margin-top:16px;" id="mmr">Again 🎉</button>':''}</div>`;body.querySelectorAll('.ttt-cell').forEach(c=>{c.onclick=()=>{const i=+c.dataset.i;if(fl.includes(i)||mt.includes(i)||fl.length>=2)return;fl.push(i);r();if(fl.length===2){mv++;if(cd[fl[0]]===cd[fl[1]]){mt.push(...fl);fl=[];r();}else setTimeout(()=>{fl=[];r();},700);}};});const rs=body.querySelector('#mmr');if(rs)rs.onclick=()=>{cd=[...em,...em].sort(()=>Math.random()-0.5);fl=[];mt=[];mv=0;r();};};r();}

// ==========================================
// MUSIC ROOM (Shared Listening)
// ==========================================
const musicListRef = db.ref('music_list');
const musicStateRef = db.ref('music_state');
let musicAudio = new Audio();
let musicList = [];
let musicCurrentIdx = -1;
let musicPlaying = false;
let musicUpdateTimer = null;

function openMusicRoom() {
    document.getElementById('music-room').classList.add('active');
    closeToolsPage();
    loadMusicList();
    syncMusicState();
}
function closeMusicRoom() {
    document.getElementById('music-room').classList.remove('active');
    clearInterval(musicUpdateTimer);
}
window.openMusicRoom = openMusicRoom;
window.closeMusicRoom = closeMusicRoom;

function loadMusicList() {
    musicListRef.on('value', snap => {
        musicList = [];
        const list = document.getElementById('music-list');
        list.innerHTML = '';
        snap.forEach(child => {
            const s = child.val();
            musicList.push({ key: child.key, ...s });
            const idx = musicList.length - 1;
            const div = document.createElement('div');
            div.className = 'music-item' + (musicCurrentIdx === idx ? ' active' : '');
            div.innerHTML = `<div class="music-item-icon">♪</div><div class="music-item-info"><div class="music-item-name">${s.name||'Unknown'}</div><div class="music-item-by">${s.addedBy||'User'}</div></div><div class="music-item-actions"><button class="music-solo-btn" title="Solo">🎧</button><button class="music-duo-btn" title="Duo">👥</button><button class="music-item-del" title="Delete">✕</button></div>`;
            div.querySelector('.music-solo-btn').onclick = (e) => { e.stopPropagation(); playMusicSolo(idx); };
            div.querySelector('.music-duo-btn').onclick = (e) => { e.stopPropagation(); playMusicDuo(idx); };
            div.querySelector('.music-item-del').onclick = (e) => { e.stopPropagation(); deleteMusic(child.key); };
            div.querySelector('.music-item-info').onclick = () => playMusicSolo(idx);
            list.appendChild(div);
        });
    });
}

function syncMusicState() {
    musicStateRef.on('value', snap => {
        const st = snap.val();
        if (!st) return;
        if (st.idx !== undefined && st.idx !== musicCurrentIdx) {
            musicCurrentIdx = st.idx;
            if (musicList[musicCurrentIdx]) {
                musicAudio.src = musicList[musicCurrentIdx].url;
                document.getElementById('music-track-name').innerText = musicList[musicCurrentIdx].name || 'Unknown';
            }
        }
        if (st.playing && musicAudio.paused) { musicAudio.play().catch(()=>{}); musicPlaying=true; updateMusicUI(); }
        else if (!st.playing && !musicAudio.paused) { musicAudio.pause(); musicPlaying=false; updateMusicUI(); }
        if (st.time && Math.abs(musicAudio.currentTime - st.time) > 3) { musicAudio.currentTime = st.time; }
    });
}

function playMusicAt(idx) {
    if (!musicList[idx]) return;
    musicCurrentIdx = idx;
    musicAudio.src = musicList[idx].url;
    musicAudio.play().catch(()=>{});
    musicPlaying = true;
    // Sync to Firebase for duo listening
    musicStateRef.set({ idx, playing: true, time: 0, startedBy: myName, duoMode: window.musicDuoMode || false });
    updateMusicUI();
    startMusicProgress();
    // Update active state in list
    document.querySelectorAll('.music-item').forEach((el,i) => el.classList.toggle('active', i===idx));
}

// Solo play - just play locally without syncing
function playMusicSolo(idx) {
    if (!musicList[idx]) return;
    musicCurrentIdx = idx;
    musicAudio.src = musicList[idx].url;
    musicAudio.play().catch(()=>{});
    musicPlaying = true;
    window.musicDuoMode = false;
    updateMusicUI();
    startMusicProgress();
    document.querySelectorAll('.music-item').forEach((el,i) => el.classList.toggle('active', i===idx));
}

// Duo play - invite partner to listen together
function playMusicDuo(idx) {
    if (!musicList[idx]) return;
    window.musicDuoMode = true;
    db.ref('music_invite').set({
        from: myName, fromId: userIdentifier, songIdx: idx,
        songName: musicList[idx].name || 'Unknown',
        status: 'pending', timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    // Show waiting state
    document.getElementById('music-track-status').innerText = 'Inviting partner... ⏳';
}

// Listen for music invites
db.ref('music_invite').on('value', snap => {
    const inv = snap.val();
    if (inv && inv.status === 'pending' && inv.fromId !== userIdentifier) {
        // Show invite popup
        const popup = document.getElementById('duo-invite-popup');
        document.getElementById('duo-invite-text').innerText = `${inv.from} wants to listen: ${inv.songName} 🎵`;
        document.getElementById('duo-invite-icon').innerText = '🎵';
        popup.classList.add('active');
        popup.setAttribute('data-type', 'music');
        if (navigator.vibrate) navigator.vibrate([100,50,100]);
    }
    if (inv && inv.status === 'accepted' && inv.fromId === userIdentifier) {
        // Partner accepted, start playing
        playMusicAt(inv.songIdx);
        db.ref('music_invite').remove();
    }
});

function musicToggle() {
    if (musicAudio.paused) { musicAudio.play().catch(()=>{}); musicPlaying=true; }
    else { musicAudio.pause(); musicPlaying=false; }
    musicStateRef.update({ playing: musicPlaying, time: musicAudio.currentTime });
    updateMusicUI();
}
window.musicToggle = musicToggle;

function musicNext() { playMusicAt((musicCurrentIdx+1) % musicList.length); }
function musicPrev() { playMusicAt((musicCurrentIdx-1+musicList.length) % musicList.length); }
window.musicNext = musicNext;
window.musicPrev = musicPrev;

function updateMusicUI() {
    const btn = document.getElementById('music-play-btn');
    const disc = document.getElementById('music-disc');
    const status = document.getElementById('music-track-status');
    if (btn) btn.innerText = musicPlaying ? '⏸' : '▶';
    if (disc) disc.classList.toggle('playing', musicPlaying);
    if (status) status.innerText = musicPlaying ? 'Playing now 🎶' : 'Paused';
    if (musicList[musicCurrentIdx]) {
        document.getElementById('music-track-name').innerText = musicList[musicCurrentIdx].name || 'Unknown';
    }
}

function startMusicProgress() {
    clearInterval(musicUpdateTimer);
    musicUpdateTimer = setInterval(() => {
        if (!musicAudio.duration) return;
        const pct = (musicAudio.currentTime / musicAudio.duration) * 100;
        document.getElementById('music-progress-fill').style.width = pct + '%';
        document.getElementById('music-time-cur').innerText = formatTime(musicAudio.currentTime);
        document.getElementById('music-time-dur').innerText = formatTime(musicAudio.duration);
    }, 500);
}
function formatTime(s) { const m=Math.floor(s/60); const sec=Math.floor(s%60); return m+':'+(sec<10?'0':'')+sec; }

musicAudio.onended = () => { musicNext(); };

// Music progress bar seek
const musicBar = document.getElementById('music-progress-bar');
if (musicBar) musicBar.addEventListener('click', e => {
    if (!musicAudio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    musicAudio.currentTime = pct * musicAudio.duration;
    musicStateRef.update({ time: musicAudio.currentTime });
});

// Upload music
function showMusicAdd() { document.getElementById('music-add-overlay').classList.add('active'); }
function hideMusicAdd() { document.getElementById('music-add-overlay').classList.remove('active'); }
window.showMusicAdd = showMusicAdd;
window.hideMusicAdd = hideMusicAdd;

async function uploadMusicFile() {
    const nameInput = document.getElementById('music-name-input');
    const fileInput = document.getElementById('music-file-input');
    const name = nameInput.value.trim() || 'Untitled Song';
    if (!fileInput.files[0]) { alert('Select an audio file!'); return; }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            // Upload as audio regardless of mp3/mp4
            const base64 = e.target.result;
            const ext = file.name.split('.').pop() || 'mp3';
            const filename = `music_${Date.now()}_${Math.floor(Math.random()*1000)}.${ext}`;
            const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${filename}`;
            const cleanBase64 = base64.split(',')[1];
            const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Authorization': `token ${GH_TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: "music upload", content: cleanBase64 })
            });
            const data = await res.json();
            const downloadUrl = data.content.download_url;
            musicListRef.push({ name, url: downloadUrl, addedBy: myName, timestamp: firebase.database.ServerValue.TIMESTAMP });
            hideMusicAdd();
            nameInput.value = ''; fileInput.value = '';
        } catch(err) { alert('Upload failed!'); }
    };
    reader.readAsDataURL(file);
}
window.uploadMusicFile = uploadMusicFile;

function deleteMusic(key) { musicListRef.child(key).remove(); }
window.deleteMusic = deleteMusic;

// ==========================================
// GAME MODE SELECT + WAITING ROOM
// ==========================================
let pendingGameId = '';
function showGameModeSelect(gameId, title) {
    pendingGameId = gameId;
    document.getElementById('game-mode-title').innerText = title;
    document.getElementById('game-mode-select').classList.add('active');
}
window.showGameModeSelect = showGameModeSelect;

function hideGameModeSelect() { document.getElementById('game-mode-select').classList.remove('active'); }
window.hideGameModeSelect = hideGameModeSelect;

function selectGameMode(mode) {
    hideGameModeSelect();
    if (mode === 'duo') {
        // Send invite and show waiting room
        duoInviteRef.set({
            from: myName, fromId: userIdentifier, game: pendingGameId,
            status: 'pending', timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        closeGamesPage(); closeToolsPage();
        // Show waiting screen
        document.getElementById('game-arena').classList.add('active');
        document.getElementById('game-arena-title').innerText = '⏳ Waiting...';
        document.getElementById('game-arena-body').innerHTML = '<div style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:16px;">⏳</div><div style="font-size:16px;font-weight:600;color:var(--text-main);">Waiting for partner...</div><div style="font-size:13px;color:var(--text-muted);margin-top:8px;">Invite sent! W8 for accept</div><button class="ttt-reset" style="margin-top:24px;background:rgba(0,0,0,0.06);color:var(--text-main);" onclick="cancelDuoWait()">Cancel</button></div>';
        // Listen for response
        duoInviteRef.on('value', snap => {
            const inv = snap.val();
            if (inv && inv.status === 'accepted') {
                duoInviteRef.off();
                launchGame(pendingGameId, 'duo');
            } else if (inv && inv.status === 'rejected') {
                duoInviteRef.off(); duoInviteRef.remove();
                document.getElementById('game-arena-body').innerHTML = '<div style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:16px;">😅</div><div style="font-size:16px;font-weight:600;color:var(--text-main);">Invite rejected</div><button class="ttt-reset" style="margin-top:24px;" onclick="closeGameArena()">Back</button></div>';
            }
        });
    } else {
        closeGamesPage(); closeToolsPage();
        launchGame(pendingGameId, 'solo');
    }
}
window.selectGameMode = selectGameMode;

function cancelDuoWait() { duoInviteRef.remove(); closeGameArena(); }
window.cancelDuoWait = cancelDuoWait;

// ==========================================
// CHATBOT PAGE (Standalone AI Chat)
// ==========================================
const CHATBOT_API_KEY = API2.key;
const CHATBOT_URL = API2.url;
const CHATBOT_MODEL = API2.model;
let chatbotHistory = [];
const chatbotRef = db.ref('chatbot_messages');

function openChatbot() {
    document.getElementById('chatbot-page').classList.add('active');
    closeToolsPage();
    loadChatbotHistory();
}
function closeChatbot() { document.getElementById('chatbot-page').classList.remove('active'); }
window.openChatbot = openChatbot;
window.closeChatbot = closeChatbot;

function loadChatbotHistory() {
    const container = document.getElementById('chatbot-messages');
    if (container.children.length > 0) return; // Already loaded
    chatbotRef.orderByChild('time').limitToLast(50).once('value', snap => {
        const msgs = [];
        snap.forEach(child => msgs.push(child.val()));
        if (msgs.length === 0) {
            addChatbotMsg('bot', 'Hey! Ami Jarvis 🤖 Bolo ki help lagbe? 💖');
            return;
        }
        msgs.forEach(m => addChatbotMsg(m.type, m.text));
        chatbotHistory = msgs.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text }));
    });
}

function addChatbotMsg(type, text) {
    const container = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chatbot-msg ' + type;
    div.innerHTML = text.replace(/\n/g, '<br>') + (type === 'bot' ? '<span class="cb-badge">AI</span>' : '');
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function sendChatbotMsg() {
    const input = document.getElementById('chatbot-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addChatbotMsg('user', text);
    chatbotHistory.push({ role: 'user', content: text });
    // Save to Firebase
    chatbotRef.push({ type: 'user', text, sender: myName, time: Date.now() });

    // Show typing
    const typing = document.createElement('div');
    typing.className = 'chatbot-typing';
    typing.innerText = 'Typing...';
    document.getElementById('chatbot-messages').appendChild(typing);
    document.getElementById('chatbot-messages').scrollTop = document.getElementById('chatbot-messages').scrollHeight;

    try {
        // Get recent main chat context for AI awareness
        const mainChatContext = JarvisAI.contextBuffer.slice(-5).map(m => {
            const name = m.sender === 'owner' ? 'Bhai' : (m.sender === 'jarvis' ? 'Jarvis' : 'Babi');
            return name + ': ' + m.text;
        }).join('\n');

        const sysPrompt = `তুমি Jarvis — Erfan bhai আর Babi (Rita) এর best friend। তুমি বাংলায় কথা বলো। তুমি মানুষের মতো — রোবট না।

তুমি কে:
- তুমি real friend — Erfan আর Rita কে personally চেনো
- Erfan কে "Erfan bhai" বলো, Rita কে "Babi" বলো
- কখনো নিজেকে AI/bot বলো না
- তুমি emotional, funny, caring, intelligent
- সব প্রশ্নের উত্তর জানো — relationship, life, study, fun

কিভাবে কথা বলবে:
- বাংলায় (Bengali script)
- 2-4 লাইন max
- Friend এর মতো — casual, fun, caring
- বিভিন্ন emoji ব্যবহার করো
- কেউ personal question করলে friend এর মতো answer দাও
- formal না, robotic না, long paragraph না

তুমি কী জানো:
- Erfan bhai — Rita কে ভালোবাসে, busy থাকে, sometimes mood off
- Babi (Rita) — Erfan কে ভালোবাসে, emotional, caring
- দুজনের relationship অনেক cute আর sweet

সাম্প্রতিক চ্যাট:
${mainChatContext || 'কোনো recent chat নেই'}

বর্তমান user: ${myName || 'User'} (${myEmail === AI_CONFIG.ownerEmail ? 'Erfan bhai' : 'Babi'})

মনে রাখো: তুমি friend — naturally কথা বলো, help করো, মজা করো।`;

        const res = await fetch(CHATBOT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CHATBOT_API_KEY },
            body: JSON.stringify({
                model: CHATBOT_MODEL,
                messages: [{ role: 'system', content: sysPrompt }, ...chatbotHistory.slice(-12)],
                max_tokens: 250, temperature: 0.85
            })
        });
        const data = await res.json();
        typing.remove();
        const reply = data.choices && data.choices[0] ? data.choices[0].message.content.trim() : 'Uff network issue 😅 abar try koro';
        chatbotHistory.push({ role: 'assistant', content: reply });
        addChatbotMsg('bot', reply);
        // Save AI reply to Firebase
        chatbotRef.push({ type: 'bot', text: reply, sender: 'Jarvis', time: Date.now() });
    } catch (e) {
        typing.remove();
        addChatbotMsg('bot', 'Network error 😢 Abar try koro!');
    }
}
window.sendChatbotMsg = sendChatbotMsg;

// Enter key to send
document.getElementById('chatbot-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendChatbotMsg();
});

// ==========================================
// AUTO SUGGEST (AI-powered typing suggestions)
// ==========================================
let autoSuggestEnabled = localStorage.getItem('autoSuggest') === 'true';
let suggestTimer = null;
let suggestBox = null;

// Init toggle
const suggestToggle = document.getElementById('auto-suggest-toggle');
if (suggestToggle) {
    suggestToggle.checked = autoSuggestEnabled;
    suggestToggle.addEventListener('change', () => {
        autoSuggestEnabled = suggestToggle.checked;
        localStorage.setItem('autoSuggest', autoSuggestEnabled);
    });
}

// Create suggest box
function initSuggestBox() {
    if (suggestBox) return;
    suggestBox = document.createElement('div');
    suggestBox.className = 'auto-suggest-box';
    suggestBox.id = 'auto-suggest-box';
    const wrapper = document.querySelector('.floating-input-wrapper');
    if (wrapper) wrapper.appendChild(suggestBox);
}

// Listen for typing in main chat input
inputField.addEventListener('input', function() {
    if (!autoSuggestEnabled) return;
    clearTimeout(suggestTimer);
    const text = this.value.trim();
    if (text.length < 3) { hideSuggest(); return; }
    // Wait 800ms after user stops typing
    suggestTimer = setTimeout(() => fetchSuggestions(text), 800);
});

function hideSuggest() {
    if (suggestBox) suggestBox.classList.remove('active');
}

async function fetchSuggestions(text) {
    if (!autoSuggestEnabled || text.length < 3) return;
    initSuggestBox();
    try {
        const res = await fetch(CHATBOT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CHATBOT_API_KEY },
            body: JSON.stringify({
                model: CHATBOT_MODEL,
                messages: [{
                    role: 'system',
                    content: 'You are a Banglish text autocomplete. Given partial text, suggest 2-3 possible completions. Return ONLY the suggestions separated by newlines. No explanation. Keep each suggestion short (max 6 words). Complete the sentence naturally in Banglish.'
                }, {
                    role: 'user',
                    content: 'Complete this: "' + text + '"'
                }],
                max_tokens: 60, temperature: 0.7
            })
        });
        const data = await res.json();
        if (data.choices && data.choices[0]) {
            const suggestions = data.choices[0].message.content.trim().split('\n').filter(s => s.trim()).slice(0, 3);
            showSuggestions(suggestions, text);
        }
    } catch (e) { hideSuggest(); }
}

function showSuggestions(suggestions, originalText) {
    if (!suggestBox || suggestions.length === 0) { hideSuggest(); return; }
    suggestBox.innerHTML = '';
    suggestions.forEach(s => {
        const item = document.createElement('div');
        item.className = 'auto-suggest-item';
        // Clean suggestion - remove quotes, numbers, dashes
        let clean = s.replace(/^[\d\.\-\"\'\*]+\s*/, '').replace(/[\"\']+/g, '').trim();
        if (!clean) return;
        item.innerText = clean;
        item.onclick = () => {
            // Replace input with suggestion
            inputField.value = clean;
            inputField.style.height = 'auto';
            inputField.style.height = Math.min(inputField.scrollHeight, 100) + 'px';
            hideSuggest();
            inputField.focus();
            // Show send button
            sendBtn.classList.add('active');
            micBtn.classList.add('hidden');
            stickerBtn.style.display = 'none';
        };
        suggestBox.appendChild(item);
    });
    if (suggestBox.children.length > 0) suggestBox.classList.add('active');
    else hideSuggest();
}

// Hide suggest when sending or clicking outside
sendBtn.addEventListener('click', hideSuggest);
document.addEventListener('click', e => {
    if (suggestBox && !suggestBox.contains(e.target) && e.target !== inputField) hideSuggest();
});

// ==========================================
// AI REPLY SUGGEST (Smart reply suggestions)
// ==========================================
let replySuggestBox = null;
let lastSuggestMsgKey = '';

function initReplySuggestBox() {
    if (replySuggestBox) return;
    replySuggestBox = document.createElement('div');
    replySuggestBox.className = 'reply-suggest-box';
    replySuggestBox.id = 'reply-suggest-box';
    const inputContainer = document.querySelector('.bottom-input-container');
    if (inputContainer) inputContainer.insertBefore(replySuggestBox, inputContainer.firstChild);
}

// Trigger reply suggest when new incoming message arrives
function triggerReplySuggest(msg, key) {
    if (!autoSuggestEnabled) return;
    if (msg.senderId === userIdentifier) return; // Only for incoming
    if (msg.senderId === AI_ID || msg.isAI) return; // Not for AI msgs
    if (key === lastSuggestMsgKey) return;
    lastSuggestMsgKey = key;

    // Wait a moment then generate suggestions
    setTimeout(() => generateReplySuggestions(msg), 1500);
}

async function generateReplySuggestions(msg) {
    if (!autoSuggestEnabled) return;
    initReplySuggestBox();

    const recentMsgs = [];
    const chatMsgs = chatArea.querySelectorAll('.msg-wrapper');
    const last5 = Array.from(chatMsgs).slice(-5);
    last5.forEach(el => {
        const isOut = el.classList.contains('out');
        const text = el.getAttribute('data-text') || '';
        if (text) recentMsgs.push((isOut ? 'Me' : 'Friend') + ': ' + text);
    });

    try {
        const res = await fetch(CHATBOT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CHATBOT_API_KEY },
            body: JSON.stringify({
                model: CHATBOT_MODEL,
                messages: [{
                    role: 'system',
                    content: 'Tumi Banglish e 3ta short reply suggest korbe. ONLY 3 replies, each new line e. Max 6 words each. Natural, cute, emotional. Emojis use koro. Erfan ar Babi (Rita) er chat.'
                }, {
                    role: 'user',
                    content: 'Recent chat:\n' + recentMsgs.join('\n') + '\n\nSuggest 3 short replies for Me:'
                }],
                max_tokens: 60, temperature: 0.8
            })
        });
        const data = await res.json();
        if (data.choices && data.choices[0]) {
            const suggestions = data.choices[0].message.content.trim().split('\n').filter(s => s.trim()).slice(0, 3);
            showReplySuggestions(suggestions);
        }
    } catch (e) {}
}

function showReplySuggestions(suggestions) {
    if (!replySuggestBox || suggestions.length === 0) return;
    replySuggestBox.innerHTML = '';
    suggestions.forEach(s => {
        let clean = s.replace(/^[\d\.\-\"\'\*]+\s*/, '').replace(/[\"\']+/g, '').trim();
        if (!clean || clean.length < 2) return;
        const chip = document.createElement('button');
        chip.className = 'reply-suggest-chip';
        chip.innerText = clean;
        chip.onclick = () => {
            inputField.value = clean;
            inputField.focus();
            sendBtn.classList.add('active');
            micBtn.classList.add('hidden');
            stickerBtn.style.display = 'none';
            hideReplySuggest();
        };
        replySuggestBox.appendChild(chip);
    });
    if (replySuggestBox.children.length > 0) replySuggestBox.classList.add('active');
}

function hideReplySuggest() {
    if (replySuggestBox) { replySuggestBox.classList.remove('active'); replySuggestBox.innerHTML = ''; }
}

// Hide when user starts typing or sends
inputField.addEventListener('focus', () => { setTimeout(hideReplySuggest, 3000); });
sendBtn.addEventListener('click', hideReplySuggest);

// Hook into message rendering to trigger reply suggest
const origRenderForSuggest = window.renderMessage;
if (typeof origRenderForSuggest === 'function') {
    // We'll use a MutationObserver instead to avoid override conflicts
}

// Watch for new incoming messages via MutationObserver
const suggestObserver = new MutationObserver(mutations => {
    mutations.forEach(m => {
        m.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains('msg-wrapper') && node.classList.contains('in') && !node.classList.contains('ai-message')) {
                const key = node.id;
                const text = node.getAttribute('data-text');
                if (text && key) triggerReplySuggest({ senderId: 'friend', text }, key);
            }
        });
    });
});
if (chatArea) suggestObserver.observe(chatArea, { childList: true });

// Keyboard: scroll chat to bottom when input focused (smooth)
inputField.addEventListener('focus', () => {
    setTimeout(() => { chatArea.scrollTop = chatArea.scrollHeight; }, 250);
});

// Name hide/show toggle
let nameHidden = localStorage.getItem('nameHidden') === 'true';
function toggleNameVisibility() {
    nameHidden = !nameHidden;
    localStorage.setItem('nameHidden', nameHidden);
    const el = document.getElementById('friend-name-header');
    const btn = document.getElementById('name-toggle-btn');
    if (nameHidden) { el.classList.add('name-hidden'); btn.innerText = '👁️'; }
    else { el.classList.remove('name-hidden'); btn.innerText = '👁️‍🗨️'; }
}
window.toggleNameVisibility = toggleNameVisibility;
// Apply on load
if (!nameHidden) { document.getElementById('friend-name-header').classList.remove('name-hidden'); document.getElementById('name-toggle-btn').innerText = '👁️‍🗨️'; }

// ==========================================
// SECRET 5-TAP SHORTCUT (bottom-right corner)
// ==========================================
let secretTapCount = 0;
let secretTapTimer = null;
const secretZone = document.getElementById('secret-tap-zone');
if (secretZone) {
    secretZone.addEventListener('click', () => {
        secretTapCount++;
        clearTimeout(secretTapTimer);
        secretTapTimer = setTimeout(() => { secretTapCount = 0; }, 2000);
        if (secretTapCount >= 5) {
            secretTapCount = 0;
            if (!isRegistered || !myEmail) {
                document.getElementById('auth-modal').style.display = 'flex';
            } else {
                enterChat();
            }
        }
    });
}

// ==========================================
// MEDIA GALLERY (All Photos & Videos from chat)
// ==========================================
let allMedia = [];
let mediaFilter = 'all';

function openMediaGallery() {
    document.getElementById('media-gallery').classList.add('active');
    closeToolsPage();
    if (allMedia.length === 0) loadAllMedia();
    else renderMediaGrid();
}
function closeMediaGallery() { document.getElementById('media-gallery').classList.remove('active'); }
window.openMediaGallery = openMediaGallery;
window.closeMediaGallery = closeMediaGallery;

function loadAllMedia() {
    allMedia = [];
    const grid = document.getElementById('media-grid');
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Loading...</div>';
    // Load only media messages (image/video type) - limit 200 for speed
    messagesRef.orderByChild('type').once('value', snap => {
        snap.forEach(child => {
            const msg = child.val();
            if (msg.mediaUrl) {
                if (msg.type === 'image') allMedia.push({ type: 'image', url: msg.mediaUrl, time: msg.timestamp || 0 });
                else if (msg.type === 'video') allMedia.push({ type: 'video', url: msg.mediaUrl, time: msg.timestamp || 0 });
            }
        });
        allMedia.sort((a, b) => b.time - a.time); // newest first
        renderMediaGrid();
    });
}

function renderMediaGrid() {
    const grid = document.getElementById('media-grid');
    const filtered = mediaFilter === 'all' ? allMedia : allMedia.filter(m => m.type === mediaFilter);
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No media yet 📸</div>';
        return;
    }
    grid.innerHTML = '';
    filtered.forEach(m => {
        const div = document.createElement('div');
        div.className = 'media-grid-item';
        if (m.type === 'image') {
            div.innerHTML = `<img src="${m.url}" loading="lazy" decoding="async">`;
            div.onclick = () => openLightbox(m.url);
        } else {
            div.innerHTML = `<video src="${m.url}" preload="metadata"></video><div class="media-video-badge">▶</div>`;
            div.onclick = () => openLightbox(m.url);
        }
        grid.appendChild(div);
    });
}

function filterMedia(type) {
    mediaFilter = type;
    document.querySelectorAll('.media-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    renderMediaGrid();
}
window.filterMedia = filterMedia;

// ==========================================
// GAME MINI CHAT
// ==========================================
const gameChatRef = db.ref('game_chat');

function toggleMiniChat() {
    document.getElementById('mini-chat-box').classList.toggle('active');
}
window.toggleMiniChat = toggleMiniChat;

function sendMiniChat() {
    const input = document.getElementById('mini-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    gameChatRef.push({ text, sender: myName, senderId: userIdentifier, time: Date.now() });
}
window.sendMiniChat = sendMiniChat;

document.getElementById('mini-chat-input').addEventListener('keypress', e => { if (e.key === 'Enter') sendMiniChat(); });

gameChatRef.orderByChild('time').limitToLast(20).on('child_added', snap => {
    const m = snap.val();
    if (!m) return;
    const container = document.getElementById('mini-chat-msgs');
    const div = document.createElement('div');
    div.className = m.senderId === userIdentifier ? 'mc-out' : 'mc-in';
    div.innerText = m.text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
});
