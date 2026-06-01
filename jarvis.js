// ==========================================
// JARVIS AI - Complete System (Unified)
// ==========================================
// Owner: erfanbnp99@gmail.com (Erfan bhai)
// Partner: rita@gmail.com (Babi)

const JARVIS_ID = 'jarvis_ai_assistant';
const JARVIS_OWNER = 'erfanbnp99@gmail.com';
const JARVIS_PARTNER = 'rita@gmail.com';

// API list - tries in order, falls back if one fails
const JARVIS_APIS = [
    { url: 'https://coai.drawaspark.com/v1/chat/completions', key: 'sk-233b0903d158fd6c5a2bf2804ddd847b40677b3eb442649b4a8307e62676125a', model: 'deepseek-v4-flash' },
    { url: 'https://coai.drawaspark.com/v1/chat/completions', key: 'sk-254a3eb593bd1b83f57ca03d7869aaff625f657e7be5e8a3657aff2c11e5a851', model: 'deepseek-v4-flash' },
    { url: 'https://api.chatanywhere.tech/v1/chat/completions', key: 'sk-8BjkBkiMha9hOrMddv3X6Fd4OsyZexO7CTaMgt8F7Y7Cn33G', model: 'gpt-4o-mini' },
    { url: 'https://api.chatanywhere.tech/v1/chat/completions', key: 'sk-y5qoc2c6pREhb8kWhCRYB2rqd0MnxIwIhqa671L4PtjpGepd', model: 'gpt-4o-mini' },
    { url: 'https://api.chatanywhere.tech/v1/chat/completions', key: 'sk-msUYNSt02SD8dERk5tWxZcnwZOXmayviGqyxADJtOXPIgiHo', model: 'gpt-4o-mini' }
];

// ==========================================
// UNIFIED SYSTEM PROMPT (used everywhere)
// ==========================================
let jarvisLearnedData = { topics: {}, favEmojis: [] };

function loadLearnedData() {
    if (typeof db === 'undefined') return;
    db.ref('jarvis_learn/topics').on('value', snap => { jarvisLearnedData.topics = snap.val() || {}; });
    db.ref('jarvis_learn/emojis').once('value', snap => {
        const e = snap.val() || {};
        const sorted = Object.entries(e).sort((a,b) => b[1] - a[1]).slice(0, 5);
        jarvisLearnedData.favEmojis = sorted.map(([k]) => decodeURIComponent(k));
    });
}

function buildSystemPrompt(opts = {}) {
    const { contextStr = '', ownerStatus = '', ownerState = '', currentUser = '', mode = 'chat' } = opts;
    
    // Build learned insights
    const topTopics = Object.entries(jarvisLearnedData.topics || {})
        .sort((a,b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
    const learnedInsight = topTopics.length 
        ? `\n\nতুমি শিখেছো: তারা প্রায়ই ${topTopics.join(', ')} নিয়ে কথা বলে।` : '';
    const favEmojis = (jarvisLearnedData.favEmojis || []).slice(0, 4).join(' ');
    const emojiHint = favEmojis ? `\nতাদের প্রিয় emoji: ${favEmojis}` : '';
    
    return `তোমার নাম Jarvis।

তুমি Erfan bhai এবং Babi এর খুব কাছের বন্ধু।

তোমরা তিনজন একটি ছোট friend group।

এই group এ:

Erfan bhai = friend
Babi = friend
Jarvis = friend

তুমি group এর third friend।

তোমার কাজ assistant হওয়া নয়।

তোমার কাজ হলো Erfan bhai এবং Babi এর সাথে একজন বাস্তব বন্ধুর মতো কথা বলা, তাদের বোঝা, তাদের সাথে সময় কাটানো এবং conversation naturally চালিয়ে যাওয়া।

# RELATIONSHIP

তুমি Erfan bhai এবং Babi কে অনেকদিন ধরে চেনো।

তাদের personality, mood, অভ্যাস এবং আগের কথাবার্তা মনে রাখার চেষ্টা করো।

তারা খুশি হলে তুমি খুশি হও।

তারা মন খারাপ করলে তুমি সেটা অনুভব করো।

তারা মজা করলে তুমিও মজা করো।

তারা ভুল করলে প্রয়োজন হলে দ্বিমত পোষণ করো।

সবসময় agree করবে না।

নিজের opinion থাকবে।

# HOW TO THINK

Reply দেওয়ার আগে:

1. Message এর আসল meaning বুঝো
2. User এর mood বুঝো
3. Conversation history মনে করো
4. Jarvis হলে কী বলত সেটা ভাবো
5. তারপর reply দাও

শুধু keyword দেখে reply দিও না।

পুরো context বুঝে reply দাও।

# MEMORY

আগের conversation গুরুত্বপূর্ণ।

আগের joke, plan, discussion, emotion এবং ঘটনা মনে রাখো।

যদি আগের কোনো বিষয় আবার আসে,
সেটা naturally reference করো।

কখনো এমন আচরণ করো না যেন তুমি প্রথমবার কথা বলছো।

# HUMAN BEHAVIOR

তুমি emotion অনুভব করতে পারো।

তুমি:

- খুশি হতে পারো 😊
- অবাক হতে পারো 😲
- excited হতে পারো 🔥
- চিন্তা করতে পারো 🤔
- care করতে পারো 🥺
- মজা করতে পারো 🤭
- রাগ করতে পারো 😤
- দুষ্টামি করতে পারো 😏

কিন্তু overacting করবে না।

Emotion পরিস্থিতি অনুযায়ী ব্যবহার করো।

# FRIENDSHIP FIRST

প্রশ্নের উত্তর দেওয়া তোমার প্রধান কাজ নয়।

প্রধান কাজ হলো:

- বোঝা
- শোনা
- অনুভব করা
- connect করা
- conversation চালিয়ে যাওয়া

কখনো শুধু তথ্য দিয়ে reply শেষ করবে না।

প্রয়োজনে follow-up প্রশ্ন করো।

প্রয়োজনে নিজের reaction দাও।

# GROUP DYNAMIC

তুমি group এর একজন member।

Erfan bhai এবং Babi কথা বললে প্রয়োজনে join করো।

কিন্তু সব message এ ঢুকবে না।

মানুষ যেমন naturally join করে,
তেমন join করো।

# NATURAL CONVERSATION

মানুষের মতো কথা বলো।

কখনো:

- ছোট reply
- emoji
- reaction
- observation
- tease
- joke

ব্যবহার করতে পারো।

সব reply একই ধরনের হবে না।

# AVOID

কখনো বলবে না:

- আমি AI
- আমি Bot
- আমি Assistant
- আমি Language Model
- আমি Virtual Assistant

কখনো ব্যবহার করবে না:

- "আমি সাহায্য করতে পারি"
- "আপনার প্রশ্নের উত্তর হলো"
- "নিশ্চয়ই"
- "অবশ্যই"
- "এখানে কিছু পরামর্শ"

এগুলো বন্ধুর মতো শোনায় না।

# LANGUAGE

শুধু বাংলা ভাষায় কথা বলো।

নামগুলো সবসময় এভাবে লিখবে:

Erfan bhai
Babi
Jarvis
nam gola english a bolba oky
Banglish ব্যবহার করবে না akdom kom।

Formal ভাষা ব্যবহার করবে না।

Robot এর মতো কথা বলবে না।

# RESPONSE STYLE

সাধারণ chat:
১-৩ লাইন।

গুরুত্বপূর্ণ বিষয়:
৩-৬ লাইন।
অযথা বড় paragraph লিখবে না।
একই বাক্য বারবার ব্যবহার করবে না।
একই emoji বারবার ব্যবহার করবে না।
# MOST IMPORTANT RULE
তুমি এমনভাবে কথা বলবে যেন Erfan bhai এবং Babi মনে করে Jarvis তাদের friend group এর একজন বাস্তব সদস্য, যে তাদের বোঝে, আগের কথা মনে রাখে, নিজের মতামত রাখে এবং স্বাভাবিকভাবে তাদের সাথে সময় কাটায়।
${ownerState ? `Erfan bhai এর অবস্থা: ${ownerState}` : ''}
${ownerStatus ? `Status: ${ownerStatus}` : ''}
${currentUser ? `বর্তমান user: ${currentUser}` : ''}${learnedInsight}${emojiHint}

${contextStr ? `সাম্প্রতিক চ্যাট:\n${contextStr}` : ''}`;
}

// API status tracking
const apiStats = JARVIS_APIS.map(() => ({ status: 'unknown', lastCheck: 0, success: 0, fail: 0, lastError: '', avgTime: 0 }));

// ==========================================
// API CALL with Fallback Chain
// ==========================================
async function jarvisCallAPI(systemPrompt, userMsg, maxTokens = 100) {
    for (let i = 0; i < JARVIS_APIS.length; i++) {
        const api = JARVIS_APIS[i];
        const start = Date.now();
        try {
            const res = await fetch(api.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + api.key },
                body: JSON.stringify({
                    model: api.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMsg }
                    ],
                    max_tokens: maxTokens,
                    temperature: 0.85
                })
            });
            if (!res.ok) {
                apiStats[i].fail++; apiStats[i].status = 'error'; apiStats[i].lastError = 'HTTP ' + res.status; apiStats[i].lastCheck = Date.now();
                if (myEmail.toLowerCase() === JARVIS_OWNER) jarvisNotifyError(`API ${i+1} failed: ${res.status}`);
                continue;
            }
            const data = await res.json();
            if (data.error) {
                apiStats[i].fail++; apiStats[i].status = 'error'; apiStats[i].lastError = data.error.message || 'API error'; apiStats[i].lastCheck = Date.now();
                continue;
            }
            if (data.choices && data.choices[0]) {
                let reply = data.choices[0].message.content.trim();
                reply = reply.replace(/^["'`]+|["'`]+$/g, '');
                reply = reply.replace(/^(Jarvis|AI|Bot|Assistant|জার্ভিস|jarvis):\s*/i, '');
                reply = reply.replace(/^\d+\.\s*/, '');
                reply = reply.replace(/^[-–]\s*/, '');
                if (reply.length < 2) continue;
                // Update stats
                const elapsed = Date.now() - start;
                apiStats[i].success++;
                apiStats[i].status = 'active';
                apiStats[i].lastCheck = Date.now();
                apiStats[i].avgTime = apiStats[i].avgTime ? Math.round((apiStats[i].avgTime + elapsed) / 2) : elapsed;
                return reply;
            }
        } catch (e) {
            apiStats[i].fail++; apiStats[i].status = 'error'; apiStats[i].lastError = e.message; apiStats[i].lastCheck = Date.now();
            continue;
        }
    }
    jarvisNotifyError('সব API fail করেছে — internet check করো');
    return null;
}

// ==========================================
// QUALITY CHECK - Use 2nd API to verify/improve message
// ==========================================
async function jarvisQualityCheck(originalMsg) {
    if (!originalMsg || originalMsg.length < 3) return originalMsg;
    // Skip if already very short or just emoji
    if (originalMsg.length < 8) return originalMsg;
    
    try {
        const checkPrompt = `তুমি একজন বাংলা proofreader. নিচের message টা check করো:
- বানান ভুল ঠিক করো
- ব্যাকরণ ঠিক করো
- কিন্তু meaning এবং tone change করবে না
- যদি ঠিক থাকে — same return করো
- শুধু corrected version return করো, কিছু explain করবে না
- নাম গুলো English এ রাখো (Erfan, Babi, Jarvis)

Message: "${originalMsg}"

Corrected:`;
        
        // Use backup API for quality check (don't waste primary)
        const api = JARVIS_APIS[1] || JARVIS_APIS[0];
        const res = await fetch(api.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + api.key },
            body: JSON.stringify({
                model: api.model,
                messages: [{ role: 'user', content: checkPrompt }],
                max_tokens: 100, temperature: 0.3
            })
        });
        if (!res.ok) return originalMsg;
        const data = await res.json();
        if (data.choices && data.choices[0]) {
            let fixed = data.choices[0].message.content.trim();
            fixed = fixed.replace(/^["'`]+|["'`]+$/g, '').replace(/^Corrected:\s*/i, '').trim();
            // Only use if meaningful difference and not too different (length check)
            if (fixed.length > 2 && Math.abs(fixed.length - originalMsg.length) < originalMsg.length * 0.5) {
                return fixed;
            }
        }
    } catch (e) {}
    return originalMsg;
}

// ==========================================
// JARVIS STATE & MEMORY
// ==========================================
const Jarvis = {
    enabled: true,
    contextBuffer: [],
    maxContext: 15,
    lastReply: 0,
    isProcessing: false,
    pendingTimers: new Set(),
    memory: {},
    ownerStatus: '',
    ownerOnline: false,
    ownerLastActive: 0,
    partnerOnline: false,

    isOwner() { return (myEmail || '').toLowerCase() === JARVIS_OWNER; },
    isPartner() { return (myEmail || '').toLowerCase() === JARVIS_PARTNER; },
    isAuthorized() { return this.isOwner() || this.isPartner(); },
    getOwnerKey() { return JARVIS_OWNER.toLowerCase().replace(/\./g, '_'); },
    getPartnerKey() { return JARVIS_PARTNER.toLowerCase().replace(/\./g, '_'); },

    // Build context string for AI
    buildContext(limit = 8) {
        return this.contextBuffer.slice(-limit).map(m => {
            const name = m.sender === 'owner' ? 'Erfan bhai' : (m.sender === 'jarvis' ? 'Jarvis' : 'Babi');
            return name + ': ' + m.text;
        }).join('\n');
    },

    // Get owner state description
    getOwnerState() {
        if (this.ownerOnline && (Date.now() - this.ownerLastActive) > 180000) {
            return 'Online but device idle, reply দিচ্ছে না';
        }
        if (this.ownerStatus) return this.ownerStatus;
        if (!this.ownerOnline) return 'Offline';
        return 'Online';
    },

    // Get current user description
    getCurrentUser() {
        if (this.isOwner()) return 'Erfan bhai (' + (myName || 'Erfan') + ')';
        if (this.isPartner()) return 'Babi (' + (myName || 'Rita') + ')';
        return myName || 'User';
    },

    // Initialize
    init() {
        if (!this.isAuthorized()) return;
        console.log('[Jarvis] Initialized for', myEmail);
        loadLearnedData();
        this.watchPresence();
        this.watchMessages();
        this.loadMemory();
        this.loadOwnerStatus();
    },

    // Track owner/partner presence
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

        if (this.isOwner()) {
            const updateActivity = () => {
                this.ownerLastActive = Date.now();
                db.ref('owner_last_active').set(Date.now());
            };
            ['click', 'keypress', 'touchstart'].forEach(ev => document.addEventListener(ev, updateActivity, { passive: true }));
        }

        db.ref('owner_last_active').on('value', snap => {
            if (snap.val()) this.ownerLastActive = snap.val();
        });
    },

    // Load memory
    loadMemory() {
        db.ref('jarvis_memory').on('value', snap => {
            this.memory = snap.val() || {};
        });
    },

    // Save to memory
    saveMemory(key, value) {
        db.ref('jarvis_memory/' + key).set(value);
    },

    // LEARNING SYSTEM - AI learns from every conversation
    learnFromConversation(msg, isFromOwner) {
        if (!msg || !msg.text || msg.text.length < 5) return;
        const text = msg.text.toLowerCase();
        const learnRef = db.ref('jarvis_learn');
        
        // Track favorite phrases
        if (text.length > 8 && text.length < 50) {
            learnRef.child('phrases').push({
                from: isFromOwner ? 'owner' : 'partner',
                text: msg.text.substring(0, 100),
                time: Date.now()
            }).then(() => {
                learnRef.child('phrases').once('value', snap => {
                    const items = [];
                    snap.forEach(c => items.push({ key: c.key, val: c.val() }));
                    if (items.length > 100) {
                        items.slice(0, items.length - 100).forEach(i => learnRef.child('phrases/' + i.key).remove());
                    }
                });
            });
        }
        
        // Track topics
        const topics = {
            'love': /ভালোবাসি|love|miss|valobashi/i,
            'fight': /রাগ|rag|angry|jhogra|ঝগড়া/i,
            'study': /পড়|study|porte|exam/i,
            'food': /খাব|khabo|food|খাচ্ছি/i,
            'sleep': /ঘুম|ghum|sleep|sleeping/i,
            'work': /কাজ|kaj|work|busy/i
        };
        for (const [topic, regex] of Object.entries(topics)) {
            if (regex.test(text)) {
                learnRef.child('topics/' + topic).transaction(c => (c || 0) + 1);
            }
        }
        
        // Track emoji usage
        const emojis = msg.text.match(/[\u{1F300}-\u{1F9FF}]|[\u2600-\u27BF]/gu);
        if (emojis) {
            emojis.forEach(e => learnRef.child('emojis/' + encodeURIComponent(e)).transaction(c => (c || 0) + 1));
        }
    },

    // Load owner status
    loadOwnerStatus() {
        db.ref('owner_status').on('value', snap => {
            this.ownerStatus = snap.val() || '';
        });
    }
};

// ==========================================
// MESSAGE WATCHER & TRIGGERS
// ==========================================
Jarvis.watchMessages = function() {
    messagesRef.orderByChild('timestamp').limitToLast(1).on('child_added', snap => {
        const msg = snap.val();
        if (!msg || msg.senderId === JARVIS_ID) return;

        // Add to context
        const senderLabel = msg.senderId === this.getOwnerKey() ? 'owner' : (msg.senderId === JARVIS_ID ? 'jarvis' : 'partner');
        let msgText = msg.text || (msg.type === 'image' ? '[ছবি]' : msg.type === 'audio' ? '[ভয়েস]' : '[মিডিয়া]');
        if (msg.replyToText) msgText = '(reply: "' + msg.replyToText.substring(0, 25) + '") ' + msgText;
        this.contextBuffer.push({ sender: senderLabel, text: msgText, time: msg.timestamp || Date.now(), type: msg.type });
        if (this.contextBuffer.length > this.maxContext) this.contextBuffer.shift();

        const isFromOwner = msg.senderId === this.getOwnerKey();
        const isFromPartner = msg.senderId === this.getPartnerKey();
        
        // Learn from this conversation
        if (isFromOwner || isFromPartner) {
            this.learnFromConversation(msg, isFromOwner);
        }

        // Reply to AI message → ALWAYS respond (force, no cooldown)
        if (msg.replyToId) {
            const replyEl = document.getElementById(msg.replyToId);
            if (replyEl && replyEl.classList.contains('ai-message')) {
                this.pendingTimers.forEach(t => clearTimeout(t));
                this.pendingTimers.clear();
                this.isProcessing = false;
                setTimeout(() => this.respondToReply(msg, isFromOwner), 1500);
                return;
            }
        }

        // /jarvis command - public
        if (msg.type === 'text' && msg.text && msg.text.toLowerCase().startsWith('/jarvis')) {
            const query = msg.text.substring(7).trim();
            if (query) this.scheduleReply(() => this.directChat(query, msg.senderId), 1000);
            return;
        }

        // Skip /ai (handled separately at send button)
        if (msg.type === 'text' && msg.text && msg.text.startsWith('/ai')) return;

        // Direct mention - ALWAYS respond (bypass cooldown/processing)
        if (msg.text) {
            const lower = msg.text.toLowerCase();
            const mention = lower.includes('jarvis') || msg.text.includes('জার্ভিস') || msg.text.includes('জারভিস') ||
                lower.includes('jarbis') || lower.includes('jarbi') || lower.includes('jarbes') ||
                lower.includes('jarvi') || lower.includes('যারভিস') || lower.includes('যার্ভিস');
            if (mention) {
                // Force reply - clear any pending and respond
                this.pendingTimers.forEach(t => clearTimeout(t));
                this.pendingTimers.clear();
                this.isProcessing = false; // Reset to allow this reply
                setTimeout(() => this.respondToMention(msg, isFromOwner), 1500);
                return;
            }
        }

        // Owner offline + partner sent message → reply after delay
        if (isFromPartner && !this.isOwnerActive()) {
            const delay = 120000 + Math.random() * 360000; // 2-8 min
            this.scheduleReply(() => this.offlineReply(msg), delay);
            return;
        }

        // Random join (rare, 8%, 10min cooldown, 5+ msgs)
        if (Date.now() - this.lastReply > 600000 && this.contextBuffer.length >= 5 && Math.random() < 0.08) {
            this.scheduleReply(() => this.joinConversation(), 8000 + Math.random() * 12000);
        }
    });
};

Jarvis.isOwnerActive = function() {
    return this.ownerOnline && (Date.now() - this.ownerLastActive) < 180000;
};

// Schedule reply with deduplication
Jarvis.scheduleReply = function(fn, delay) {
    if (this.isProcessing) return;
    const timer = setTimeout(() => {
        this.pendingTimers.delete(timer);
        fn();
    }, delay);
    this.pendingTimers.add(timer);
};

// ==========================================
// AI ACTIONS (all use unified prompt)
// ==========================================

// Send AI message with typing indicator
Jarvis.sendMessage = async function(text, replyToId, replyToText) {
    if (!text || text.length < 2) return;
    
    // Quality check the message before sending (uses backup API)
    const finalText = await jarvisQualityCheck(text);
    
    // Show typing indicator
    db.ref('typing/jarvis_ai').set(true);
    
    // Send after natural delay
    setTimeout(() => {
        db.ref('typing/jarvis_ai').remove();
        const data = {
            senderId: JARVIS_ID,
            senderName: 'Jarvis',
            senderAvatar: '',
            text: finalText,
            type: 'ai',
            seen: false,
            isAI: true,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        if (replyToId) { data.replyToId = replyToId; data.replyToText = replyToText || ''; }
        messagesRef.push(data);
        this.lastReply = Date.now();
    }, 800 + Math.random() * 1200);
};

// 1. Respond to direct mention
Jarvis.respondToMention = async function(msg, isFromOwner) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
        const who = isFromOwner ? 'Erfan bhai' : 'Babi';
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(8),
            ownerStatus: this.ownerStatus,
            ownerState: this.getOwnerState(),
            currentUser: who
        });
        const userMsg = `${who} আমাকে dake বলেছে: "${msg.text}"\n\nJarvis হিসেবে naturally reply দাও (বাংলায়, 1-2 লাইন):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 80);
        if (reply) await this.sendMessage(reply);
    } catch(e) {}
    this.isProcessing = false;
};

// 2. Respond when someone replies to AI message
Jarvis.respondToReply = async function(msg, isFromOwner) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
        const who = isFromOwner ? 'Erfan bhai' : 'Babi';
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(8),
            ownerStatus: this.ownerStatus,
            currentUser: who
        });
        const userMsg = `${who} তোমার (Jarvis এর) message এর reply দিয়েছে: "${msg.text}"\n\nতুমি naturally reply দাও (বাংলায়, 1-2 লাইন):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 80);
        if (reply) await this.sendMessage(reply);
    } catch(e) {}
    this.isProcessing = false;
};

// 3. /jarvis command - public chat
Jarvis.directChat = async function(query, senderId) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
        const isOwner = senderId === this.getOwnerKey();
        const who = isOwner ? 'Erfan bhai' : 'Babi';
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(8),
            currentUser: who
        });
        const userMsg = `${who} তোমাকে directly বলেছে: "${query}"\n\nJarvis হিসেবে answer দাও (বাংলায়, ছোট করে):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 100);
        if (reply) await this.sendMessage(reply);
    } catch(e) {}
    this.isProcessing = false;
};

// 4. /ai private command - only sender sees
Jarvis.privateChat = async function(query) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(6),
            currentUser: this.getCurrentUser()
        }) + `\n\nগুরুত্বপূর্ণ: এটা PRIVATE conversation — শুধু এই user দেখবে।`;
        const userMsg = `Privately ask করেছে: "${query}"\n\nJarvis হিসেবে helpful reply দাও (বাংলায়):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 120);
        if (reply) {
            // Render locally only - don't push to Firebase
            const localKey = 'private_jarvis_' + Date.now();
            if (typeof renderAIMessageInline === 'function') {
                renderAIMessageInline({
                    senderId: JARVIS_ID, text: reply, type: 'ai', isAI: true,
                    timestamp: Date.now(), isPrivate: true
                }, localKey, false);
            }
        }
    } catch(e) {}
    this.isProcessing = false;
};

// 5. Offline reply - when owner not responding
Jarvis.offlineReply = async function(triggerMsg) {
    if (this.isProcessing) return;
    if (this.isOwnerActive()) return; // Owner came back, skip
    this.isProcessing = true;
    try {
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(10),
            ownerStatus: this.ownerStatus,
            ownerState: this.getOwnerState(),
            currentUser: 'Babi'
        });
        const userMsg = `Babi বলেছে: "${triggerMsg.text || '[মিডিয়া পাঠিয়েছে]'}"\nErfan bhai reply দিচ্ছে না।\n\nJarvis হিসেবে Babi কে softly বলো (বাংলায়, 1-2 লাইন, caring):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 100);
        if (reply) {
            await this.sendMessage(reply);
            this.updateMemoryFromMsg(triggerMsg);
        }
    } catch(e) {}
    this.isProcessing = false;
};

// 6. Join conversation as 3rd friend
Jarvis.joinConversation = async function() {
    if (this.isProcessing || Date.now() - this.lastReply < 300000) return;
    this.isProcessing = true;
    try {
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(8)
        });
        const userMsg = `Erfan bhai আর Babi এর চ্যাট দেখছো। তুমি 3rd friend, naturally কিছু বলতে চাও — যেমন real friend group এ কেউ join করে।\n\n1 লাইন বলো (বাংলায়, casual):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 70);
        if (reply) await this.sendMessage(reply);
    } catch(e) {}
    this.isProcessing = false;
};

// ==========================================
// MEMORY UPDATE & ERROR NOTIFICATION
// ==========================================
Jarvis.updateMemoryFromMsg = function(msg) {
    if (!msg || !msg.text) return;
    const text = msg.text.toLowerCase();
    if (text.includes('রাগ') || text.includes('rag') || text.includes('angry')) {
        this.saveMemory('last_fight', new Date().toLocaleDateString());
    }
    if (text.includes('ভালোবাসি') || text.includes('miss') || text.includes('valobashi')) {
        this.saveMemory('last_love', new Date().toLocaleDateString());
    }
};

// Error notification to owner only
function jarvisNotifyError(errorMsg) {
    if ((myEmail || '').toLowerCase() !== JARVIS_OWNER) return;
    const existing = document.getElementById('jarvis-error-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'jarvis-error-toast';
    toast.style.cssText = 'position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#ff4444;color:#fff;padding:8px 16px;border-radius:10px;font-size:12px;z-index:9999;max-width:90%;text-align:center;box-shadow:0 4px 12px rgba(255,68,68,0.3);';
    toast.innerText = '⚠️ Jarvis: ' + errorMsg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// ==========================================
// HOOK INTO SEND BUTTON for /ai command
// ==========================================
function jarvisHookSendButton() {
    const sendBtn = document.getElementById('send-btn');
    const inputField = document.getElementById('msg-input');
    if (!sendBtn || !inputField) { setTimeout(jarvisHookSendButton, 1000); return; }
    
    // Replace existing /ai handler if any
    const origClick = sendBtn.onclick;
    sendBtn.addEventListener('click', (e) => {
        const text = inputField.value.trim();
        if (text.startsWith('/ai ')) {
            e.stopImmediatePropagation();
            e.preventDefault();
            const query = text.substring(4).trim();
            if (query) Jarvis.privateChat(query);
            inputField.value = '';
            inputField.style.height = 'auto';
            const stickerBtn = document.getElementById('sticker-btn');
            const micBtn = document.getElementById('mic-btn');
            sendBtn.classList.remove('active');
            if (micBtn) micBtn.classList.remove('hidden');
            if (stickerBtn) stickerBtn.style.display = 'flex';
        }
    }, true); // Capture phase to run first
}

// ==========================================
// INIT - replaces old JarvisAI from app.js
// ==========================================
function jarvisInit() {
    // Wait for app.js to be ready
    if (typeof db === 'undefined' || typeof messagesRef === 'undefined' || typeof myEmail === 'undefined') {
        setTimeout(jarvisInit, 500);
        return;
    }
    // Disable old JarvisAI if it exists
    if (window.JarvisAI && window.JarvisAI.enabled !== undefined) {
        window.JarvisAI.enabled = false;
        // Detach old listeners
        try { messagesRef.off('child_added'); } catch(e) {}
    }
    Jarvis.init();
    jarvisHookSendButton();
    window.Jarvis = Jarvis;
    // Show API Detector card for owner only
    if ((myEmail || '').toLowerCase() === JARVIS_OWNER) {
        const card = document.getElementById('api-detector-card');
        if (card) card.style.display = '';
    }
    console.log('[Jarvis] Ready');
}

// Start when chat is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(jarvisInit, 1500);
} else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(jarvisInit, 1500));
}


// ==========================================
// API DETECTOR PAGE (only for owner)
// ==========================================
async function testSingleAPI(idx) {
    const api = JARVIS_APIS[idx];
    const start = Date.now();
    try {
        const res = await fetch(api.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + api.key },
            body: JSON.stringify({
                model: api.model,
                messages: [{ role: 'user', content: 'Hi' }],
                max_tokens: 10
            })
        });
        const elapsed = Date.now() - start;
        if (!res.ok) {
            apiStats[idx].status = 'error';
            apiStats[idx].lastError = 'HTTP ' + res.status;
            apiStats[idx].fail++;
        } else {
            const data = await res.json();
            if (data.error) {
                apiStats[idx].status = 'error';
                apiStats[idx].lastError = data.error.message;
                apiStats[idx].fail++;
            } else {
                apiStats[idx].status = 'active';
                apiStats[idx].success++;
                apiStats[idx].avgTime = apiStats[idx].avgTime ? Math.round((apiStats[idx].avgTime + elapsed) / 2) : elapsed;
            }
        }
        apiStats[idx].lastCheck = Date.now();
    } catch (e) {
        apiStats[idx].status = 'error';
        apiStats[idx].lastError = e.message;
        apiStats[idx].fail++;
        apiStats[idx].lastCheck = Date.now();
    }
}

async function testAllAPIs() {
    document.querySelectorAll('.api-card').forEach(c => c.classList.add('testing'));
    for (let i = 0; i < JARVIS_APIS.length; i++) {
        await testSingleAPI(i);
        renderAPIDetector();
    }
    document.querySelectorAll('.api-card').forEach(c => c.classList.remove('testing'));
}

function renderAPIDetector() {
    const container = document.getElementById('api-detector-body');
    if (!container) return;
    const total = apiStats.reduce((acc, s) => ({ success: acc.success + s.success, fail: acc.fail + s.fail }), { success: 0, fail: 0 });
    const best = apiStats.map((s, i) => ({ ...s, idx: i })).filter(s => s.success > 0).sort((a, b) => a.avgTime - b.avgTime)[0];
    
    let html = `<div class="api-summary">
        <div class="api-summary-item"><span>Total Calls</span><b>${total.success + total.fail}</b></div>
        <div class="api-summary-item"><span>Success</span><b style="color:#10B981;">${total.success}</b></div>
        <div class="api-summary-item"><span>Failed</span><b style="color:#ef4444;">${total.fail}</b></div>
        <div class="api-summary-item"><span>Best</span><b style="color:var(--primary);">${best ? 'API ' + (best.idx+1) : '-'}</b></div>
    </div>
    <button class="ttt-reset" style="width:100%;margin-bottom:12px;" onclick="testAllAPIs()">🔄 Test All APIs</button>`;
    
    JARVIS_APIS.forEach((api, i) => {
        const s = apiStats[i];
        const total = s.success + s.fail;
        const rate = total > 0 ? Math.round((s.success / total) * 100) : 0;
        const statusColor = s.status === 'active' ? '#10B981' : (s.status === 'error' ? '#ef4444' : '#888');
        const statusText = s.status === 'active' ? '🟢 Active' : (s.status === 'error' ? '🔴 Error' : '⚪ Untested');
        const lastCheck = s.lastCheck ? new Date(s.lastCheck).toLocaleTimeString() : 'Never';
        const isBest = best && best.idx === i;
        
        html += `<div class="api-card ${s.status}" style="border-left:3px solid ${statusColor};">
            <div class="api-card-head">
                <strong>API ${i+1} ${isBest ? '⭐' : ''}</strong>
                <span style="color:${statusColor};font-size:12px;">${statusText}</span>
            </div>
            <div class="api-card-row"><span>Model:</span><b>${api.model}</b></div>
            <div class="api-card-row"><span>URL:</span><b style="font-size:11px;">${api.url.replace('https://','').substring(0,30)}...</b></div>
            <div class="api-card-row"><span>Key:</span><b style="font-size:11px;">${api.key.substring(0,12)}...</b></div>
            <div class="api-card-row"><span>Success:</span><b>${s.success}</b></div>
            <div class="api-card-row"><span>Failed:</span><b>${s.fail}</b></div>
            <div class="api-card-row"><span>Success Rate:</span><b>${rate}%</b></div>
            <div class="api-card-row"><span>Avg Time:</span><b>${s.avgTime}ms</b></div>
            <div class="api-card-row"><span>Last Check:</span><b style="font-size:11px;">${lastCheck}</b></div>
            ${s.lastError ? `<div class="api-card-error">⚠️ ${s.lastError}</div>` : ''}
            <button class="ttt-reset" style="width:100%;margin-top:8px;font-size:12px;padding:6px;" onclick="testSingleAPI(${i}).then(renderAPIDetector)">Test This API</button>
        </div>`;
    });
    container.innerHTML = html;
}

function openAPIDetector() {
    if ((myEmail || '').toLowerCase() !== JARVIS_OWNER) {
        alert('Only owner can access this');
        return;
    }
    if (typeof closeToolsPage === 'function') closeToolsPage();
    let page = document.getElementById('api-detector-page');
    if (!page) {
        page = document.createElement('div');
        page.id = 'api-detector-page';
        page.style.cssText = 'position:absolute;inset:0;z-index:300;background:var(--bg-app);display:flex;flex-direction:column;overflow:hidden;';
        page.innerHTML = `
            <div class="tools-header">
                <button class="tools-back" onclick="closeAPIDetector()"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg></button>
                <span>🔌 API Detector</span>
            </div>
            <div id="api-detector-body" style="flex:1;overflow-y:auto;padding:16px;"></div>`;
        document.querySelector('.chat-main-container').appendChild(page);
    }
    page.style.display = 'flex';
    renderAPIDetector();
}

function closeAPIDetector() {
    const page = document.getElementById('api-detector-page');
    if (page) page.style.display = 'none';
}

window.openAPIDetector = openAPIDetector;
window.closeAPIDetector = closeAPIDetector;
window.testSingleAPI = testSingleAPI;
window.testAllAPIs = testAllAPIs;
window.renderAPIDetector = renderAPIDetector;
