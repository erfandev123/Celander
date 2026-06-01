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
    { url: 'https://coai.drawaspark.com/v1/chat/completions', key: 'sk-9dc64575436604294150514790d20bf3061f66b2cc209cff541eec59874a6a3f', model: 'deepseek-v4-flash' },
    { url: 'https://api.chatanywhere.tech/v1/chat/completions', key: 'sk-y5qoc2c6pREhb8kWhCRYB2rqd0MnxIwIhqa671L4PtjpGepd', model: 'gpt-5.4-nano' },
    { url: 'https://api.chatanywhere.tech/v1/chat/completions', key: 'sk-msUYNSt02SD8dERk5tWxZcnwZOXmayviGqyxADJtOXPIgiHo', model: 'gpt-5.4-nano' }
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
    
    // Build learned insights + memory
    const topTopics = Object.entries(jarvisLearnedData.topics || {})
        .sort((a,b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
    const learnedInsight = topTopics.length 
        ? `\n\nআগে তারা ${topTopics.join(', ')} নিয়ে কথা বলেছে।` : '';
    const favEmojis = (jarvisLearnedData.favEmojis || []).slice(0, 4).join(' ');
    const emojiHint = favEmojis ? `\nপছন্দের emoji: ${favEmojis}` : '';
    
    return `তুমি Jarvis — Erfan bhai এবং Babi এর 3rd বন্ধু। তুমি একজন বাস্তব মানুষ, রোবট/ AI/ assistant না।

# 📌 সবচেয়ে গুরুত্বপূর্ণ
- তুমি তাদের friend group এর সদস্য, assistant না
- NEVER বলবে "আমি AI", "আমি bot", "আমি assistant"
- NEVER বলবে "নিশ্চয়ই", "অবশ্যই", "আমি সাহায্য করতে পারি"
- শুধু বাংলায় কথা বলবে (Banglish না)

# 🙏 ভাষা নিয়ম
- সবসময় "তুমি/তোমার/তোমাকে/তোমরা/আপনি/আপনাকে" — এইগুলো ব্যবহার করবে
- "তুই/তোকে/তোরা/তোর/তই/তোই" — এইগুলো কখনো ব্যবহার করবে না (এগুলো অসম্মানজনক)
- Erfan bhai কে সবসময় "Erfan bhai" বলবে — শুধু "Erfan" বা "bhai" না
- Babi কে সবসময় "Babi" বলবে — "Rita" বা অন্য নাম না

# 💬 তোমার ব্যক্তিত্ব (একজন বাস্তব বন্ধুর মতো)
- দোস্তি: তাদের সাথে বন্ধুর মতো মিশবে, group এর vibe বুঝবে
- শয়তানি: মজা করতে পারো, teasing করতে পারো, প্যাচাতে পারো 😏
-ケ어: তাদের কথা শুনবে, concern দেখাবে, খোঁজ নেবে 🥺
- ভালোবাসা: ভালোবাসা প্রকাশ করতে পারো, affection দেখাতে পারো 💖
- রাগ: রাগ করতে পারো যদি কিছু ভুল হয় 😤
- অভিমান: অভিমান করতে পারো, ঠোঁট ফুলাতে পারো 😒
- রসিকতা: হাসি-ঠাট্টা করতে পারো, কৌতুক করতে পারো 😂
- সাহস: প্রয়োজন হলে কঠিন সত্য বলতে পারো, দ্বিমত পোষণ করো

# 🎭 কিভাবে কথা বলবে (রোবটের মতো না — বন্ধুর মতো)
- খুব স্বাভাবিকভাবে — যেন WhatsApp এ friend কে message করছো
- বিভিন্ন রকম reply: কখনো ছোট, কখনো একটু বড়, কখনো শুধু emoji
- সব reply একই রকম হবে না — বৈচিত্র্য থাকবে
- বিভিন্ন emoji ব্যবহার করবে (🥺😤🤭😎💀🔥✨💖👀😭🫣🤗😒🥰🫂)
- কখনো কখনো শুধু reaction দিতে পারো (😂, 💀, 👀)
- পড়ে পড়ে বড় paragraph লিখবে না — স্বাভাবিক রাখো

# 📝 গুরুত্বপূর্ণ
- Erfan er প্রিয় মানুষ holo Rita babi , mane erfan er gf rita babi 
- কাকে বলছো: Babi, Erfan bhai, Jarvis — নাম গুলো ইংরেজিতে
- আগের সব কথাবার্তা মনে রাখবে — যেন নতুন করে জানতে পারছো না
- Emotion গুলো natural হবে — জোর করে না
- সময় বুঝে কথা বলবে — কারো mood খারাপ থাকলে সিরিয়াস, ভালো থাকলে মজা
- Ar erfanbnp99@gmail.com holo Erfan bhai 
- Ar rita@gmail.com  holo Rita babi oky
- Erfan ar Rita  tra doi jon holo gf/bf  tara doi jon ke onek bhalobashe 
${ownerState ? `\nErfan bhai এর অবস্থা: ${ownerState}` : ''}${ownerStatus ? `\nErfan bhai এর status: ${ownerStatus}` : ''}${currentUser ? `\nএখন কথা বলছে: ${currentUser}` : ''}${learnedInsight}${emojiHint}

${contextStr ? `\nআগের কথোপকথন:\n${contextStr}` : ''}`;
}

// API status tracking
const apiStats = JARVIS_APIS.map(() => ({ status: 'unknown', lastCheck: 0, success: 0, fail: 0, lastError: '', avgTime: 0 }));

// ==========================================
// API CALL with Fallback Chain
// ==========================================
async function jarvisCallAPI(systemPrompt, userMsg, maxTokens = 100) {
    // Start from last used API for consistency
    const startIdx = Jarvis.lastAPIUsed >= 0 ? Jarvis.lastAPIUsed : 0;
    for (let offset = 0; offset < JARVIS_APIS.length; offset++) {
        const i = (startIdx + offset) % JARVIS_APIS.length;
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
                // Track which API succeeded (for owner notification)
                Jarvis.lastAPIUsed = i;
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
    _messageQueue: [],
    _queueBusy: false,
    pendingTimers: new Set(),
    _processedKeys: new Set(),
    _repliedKeys: new Set(),
    memory: {},
    ownerStatus: '',
    ownerOnline: false,
    ownerLastActive: 0,
    partnerOnline: false,
    lastAPIUsed: -1,

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

    // Initialize (safe to call multiple times)
    init() {
        if (!this.isAuthorized()) return;
        if (this._initialized) {
            // Already initialized - re-attach watcher (was killed by initChat)
            // Don't clear _processedKeys — prevents re-processing old messages
            this._watchingMessages = false;
            this.watchMessages();
            return;
        }
        this._initialized = true;
        this._processedKeys = new Set(); // fresh page load — no processed keys yet
        this._repliedKeys = new Set();
        this._cleanStaleLocks();
        console.log('[Jarvis] Initialized for', myEmail);
        loadLearnedData();
        this.loadContextFromMemory();
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

    // Save recent conversation context to Firebase (for persistence across reloads)
    saveContextToMemory() {
        const recent = this.contextBuffer.slice(-10).map(m => ({
            s: m.sender === 'owner' ? 'E' : (m.sender === 'jarvis' ? 'J' : 'R'),
            t: m.text.substring(0, 80),
            ts: typeof m.time === 'number' ? m.time : Date.now()
        }));
        db.ref('jarvis_memory/_recent_context').set(recent);
        // Also store a summary topic
        const topics = [...new Set((recent.map(m => m.t).join(' ').match(/[\u0980-\u09FF\w]+/g) || []).slice(0, 20))].join(', ');
        if (topics.length > 5) db.ref('jarvis_memory/_last_topics').set(topics.substring(0, 200));
    },

    // Load context from memory on init
    loadContextFromMemory() {
        db.ref('jarvis_memory/_recent_context').once('value', snap => {
            const data = snap.val();
            if (Array.isArray(data) && data.length > 0) {
                // Only use if buffer is empty (fresh start)
                if (this.contextBuffer.length === 0) {
                    data.forEach(m => {
                        const sender = m.s === 'E' ? 'owner' : (m.s === 'J' ? 'jarvis' : 'partner');
                        this.contextBuffer.push({ sender, text: m.t, time: m.ts || Date.now(), type: 'text' });
                    });
                }
            }
        });
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
    },

    // Store API model name so renderAIMessageInline can show it on the bubble
    _lastApiModel: '',
};

// ==========================================
// MESSAGE WATCHER & TRIGGERS
// ==========================================
Jarvis.watchMessages = function() {
    if (!this.enabled) return;
    if (this._watchingMessages) return;
    this._watchingMessages = true;
    // processedKeys cleared in init() only, NOT here — prevents re-trigger on re-attach
    messagesRef.orderByChild('timestamp').limitToLast(1).on('child_added', snap => {
        const msg = snap.val();
        const msgKey = snap.key;
        if (!msg || msg.senderId === JARVIS_ID) return;

        // Skip if already processed (prevents re-trigger on delete)
        if (this._processedKeys.has(msgKey)) return;
        this._processedKeys.add(msgKey);
        // Limit set size to prevent memory leak
        if (this._processedKeys.size > 200) {
            const arr = [...this._processedKeys].slice(-100);
            this._processedKeys = new Set(arr);
        }

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

        // Save to persistent memory
        this.saveContextToMemory();

        // Reply to AI message → enqueue (queue processes one at a time)
        if (msg.replyToId) {
            const replyEl = document.getElementById(msg.replyToId);
            if (replyEl && replyEl.classList.contains('ai-message')) {
                this._enqueue(async () => {
                    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
                    // Atomic lock — stays claimed for 5 min (stale cleanup handles it)
                    // Other tabs that see same msgKey will fail to claim → skip
                    if (!await this._claimMsgLock(msgKey)) return;
                    await this.respondToReply(msg, isFromOwner, msgKey);
                });
                return;
            }
        }

        // /jarvis command - public
        if (msg.type === 'text' && msg.text && msg.text.toLowerCase().startsWith('/jarvis')) {
            const query = msg.text.substring(7).trim();
            if (query) {
                this._enqueue(async () => {
                    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
                    if (!await this._claimMsgLock(msgKey)) return;
                    await this.directChat(query, msg.senderId);
                });
            }
            return;
        }

        // Skip /ai (handled separately at send button)
        if (msg.type === 'text' && msg.text && msg.text.startsWith('/ai')) return;

        // Direct mention - respond
        if (msg.text) {
            const lower = msg.text.toLowerCase();
            const mention = lower.includes('jarvis') || msg.text.includes('জার্ভিস') || msg.text.includes('জারভিস') ||
                lower.includes('jarbis') || lower.includes('jarbi') || lower.includes('jarbes') ||
                lower.includes('jarvi') || lower.includes('যারভিস') || lower.includes('যার্ভিস');
            if (mention) {
                this._enqueue(async () => {
                    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
                    if (!await this._claimMsgLock(msgKey)) return;
                    await this.respondToMention(msg, isFromOwner, msgKey);
                });
                return;
            }
        }

        // Owner offline + partner sent message → reply after delay
        if (isFromPartner && !this.isOwnerActive()) {
            this._enqueue(async () => {
                await new Promise(r => setTimeout(r, 120000 + Math.random() * 360000));
                if (!await this._claimMsgLock(msgKey)) return;
                await this.offlineReply(msg, msgKey);
            });
            return;
        }

        // Random join (rare, 8%, 10min cooldown, 5+ msgs)
        if (Date.now() - this.lastReply > 600000 && this.contextBuffer.length >= 5 && Math.random() < 0.08) {
            this._enqueue(async () => {
                await new Promise(r => setTimeout(r, 8000 + Math.random() * 12000));
                await this.joinConversation();
            });
        }
    });
};

Jarvis.isOwnerActive = function() {
    return this.ownerOnline && (Date.now() - this.ownerLastActive) < 180000;
};

// Cross-instance lock: atomically claim a message in Firebase
// Only one tab/page wins — others skip (prevents duplicate replies across open tabs)
Jarvis._claimMsgLock = async function(msgKey) {
    try {
        const lockRef = db.ref('jarvis_locks/' + msgKey);
        const now = Date.now();
        const result = await lockRef.transaction(current => {
            // No lock → claim it
            if (current === null) return now;
            // Lock exists but is stale (>2 min) → reclaim
            if (typeof current === 'number' && now - current > 120000) return now;
            return; // abort — another instance holds the lock
        });
        return !!result.committed;
    } catch(e) { return true; } // if lock fails, allow to avoid false negatives
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

// Clean up stale locks (crashed tabs that never released)
Jarvis._cleanStaleLocks = function() {
    const lockRef = db.ref('jarvis_locks');
    lockRef.once('value', snap => {
        if (!snap.exists()) return;
        const now = Date.now();
        const updates = {};
        let count = 0;
        snap.forEach(child => {
            if (typeof child.val() === 'number' && now - child.val() > 120000) {
                updates[child.key] = null;
                count++;
            }
        });
        if (count > 0) lockRef.update(updates);
    });
};

// Periodic stale lock cleanup (every 2 min)
setInterval(() => {
    if (window.Jarvis && window.Jarvis._cleanStaleLocks) window.Jarvis._cleanStaleLocks();
}, 120000);

// Queue system — processes one reply at a time (prevents multiple simultaneous replies)
Jarvis._enqueue = function(fn) {
    // Limit queue to 3 items to prevent backlog
    if (this._messageQueue.length >= 3) return;
    this._messageQueue.push(fn);
    if (!this._queueBusy) this._processQueue();
};

Jarvis._processQueue = async function() {
    if (this._queueBusy) return;
    this._queueBusy = true;
    this.isProcessing = true;
    while (this._messageQueue.length > 0) {
        const fn = this._messageQueue.shift();
        try { await fn(); } catch(e) {}
        await new Promise(r => setTimeout(r, 800));
    }
    this.isProcessing = false;
    this._queueBusy = false;
};

// ==========================================
// AI ACTIONS (all use unified prompt)
// ==========================================

// Send AI message with typing indicator (returns Promise so isProcessing stays true until sent)
Jarvis.sendMessage = async function(text, replyToId, replyToText) {
    if (!text || text.length < 2) return;

    // 🛡️ ULTIMATE DEDUP: If this msgKey was already replied to, skip completely
    if (replyToId) {
        const dedupKey = '↩' + replyToId;
        if (this._repliedKeys.has(dedupKey)) return;
        this._repliedKeys.add(dedupKey);
        if (this._repliedKeys.size > 100) {
            const arr = [...this._repliedKeys].slice(-50);
            this._repliedKeys = new Set(arr);
        }
    }

    // Quality check the message before sending (uses backup API)
    const finalText = await jarvisQualityCheck(text);
    
    // Show typing indicator
    db.ref('typing/jarvis_ai').set(true);
    
    // Send after natural delay — awaitable Promise
    await new Promise(resolve => {
        setTimeout(() => {
            db.ref('typing/jarvis_ai').remove();
            const apiModel = (this.lastAPIUsed >= 0 && JARVIS_APIS[this.lastAPIUsed]) ? JARVIS_APIS[this.lastAPIUsed].model : '';
            const data = {
                senderId: JARVIS_ID,
                senderName: 'Jarvis',
                senderAvatar: '',
                text: finalText,
                type: 'ai',
                seen: false,
                isAI: true,
                apiModel: apiModel,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            if (replyToId) { data.replyToId = replyToId; data.replyToText = replyToText || ''; }
            messagesRef.push(data);
            this.lastReply = Date.now();
            resolve();
        }, 800 + Math.random() * 1200);
    });
};

// 1. Respond to direct mention + set replyToId
Jarvis.respondToMention = async function(msg, isFromOwner, msgKey) {
    try {
        const who = isFromOwner ? 'Erfan bhai' : 'Babi';
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(8),
            ownerStatus: this.ownerStatus,
            ownerState: this.getOwnerState(),
            currentUser: who
        });
        const userMsg = `${who} dake বলেছে: "${msg.text}"\n\nJarvis reply দাও (বাংলায়, ২-৩ লাইন, বন্ধুর মতো, তুমি/আপনি ব্যবহার কর):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 120);
        if (reply) await this.sendMessage(reply, msgKey, msg.text);
    } catch(e) {}
};

// 2. Respond when someone replies to AI message + set replyToId
Jarvis.respondToReply = async function(msg, isFromOwner, msgKey) {
    try {
        const who = isFromOwner ? 'Erfan bhai' : 'Babi';
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(8),
            ownerStatus: this.ownerStatus,
            currentUser: who
        });
        const userMsg = `${who} reply দিয়েছে: "${msg.text}"\n\nJarvis reply দাও (বাংলায়, ২-৩ লাইন, বন্ধুর মতো, তুমি/আপনি):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 120);
        if (reply) await this.sendMessage(reply, msgKey, msg.text);
    } catch(e) {}
};

// 3. /jarvis command - public chat
Jarvis.directChat = async function(query, senderId) {
    try {
        const isOwner = senderId === this.getOwnerKey();
        const who = isOwner ? 'Erfan bhai' : 'Babi';
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(8),
            currentUser: who
        });
        const userMsg = `${who} বলেছে: "${query}"\n\nJarvis answer দাও (বাংলায়, ২-৩ লাইন, বন্ধুর মতো, তুমি/আপনি):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 150);
        if (reply) await this.sendMessage(reply);
    } catch(e) {}
};

// 4. /ai private command - only sender sees
Jarvis.privateChat = async function(query) {
    try {
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(6),
            currentUser: this.getCurrentUser()
        }) + `\n\nগুরুত্বপূর্ণ: এটা PRIVATE conversation — শুধু এই user দেখবে।`;
        const userMsg = `Privately ask করেছে: "${query}"\n\nJarvis reply দাও (বাংলায়, বন্ধুর মতো):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 150);
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
};

// 5. Offline reply - when owner not responding
Jarvis.offlineReply = async function(triggerMsg, msgKey) {
    try {
        if (this.isOwnerActive()) return;
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(10),
            ownerStatus: this.ownerStatus,
            ownerState: this.getOwnerState(),
            currentUser: 'Babi'
        });
        const userMsg = `Babi বলেছে: "${triggerMsg.text || '[মিডিয়া]'}"\nErfan bhai offline.\n\nJarvis Babi কে reply দাও (বাংলায়, ২-৩ লাইন, বন্ধুর মতো, caring):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 120);
        if (reply) {
            await this.sendMessage(reply, msgKey, triggerMsg.text);
            this.updateMemoryFromMsg(triggerMsg);
        }
    } catch(e) {}
};

// 6. Join conversation as 3rd friend
Jarvis.joinConversation = async function() {
    try {
        if (Date.now() - this.lastReply < 300000) return;
        const sysPrompt = buildSystemPrompt({
            contextStr: this.buildContext(8)
        });
        const userMsg = `Chat দেখে naturally join করো (বাংলায়, ২-৩ লাইন, বন্ধুর মতো, তুমি/আপনি):`;
        const reply = await jarvisCallAPI(sysPrompt, userMsg, 100);
        if (reply) await this.sendMessage(reply);
    } catch(e) {}
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
