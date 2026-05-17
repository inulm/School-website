// =============================================
// POLICE LINE SECONDARY SCHOOL — JASHORE
// Main JS (GitHub Pages + Supabase)
// =============================================

// ---- CONFIG: Replace with your Supabase credentials ----
const SUPABASE_URL      = 'https://phhejwewkjsxtoxkacjo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_U86ibVW4oB4Z1r3Hc9JRIg_fW6lJZk2';

// Admin password (change this!)
const ADMIN_PASSWORD = 'plss@admin2025';

// =============================================
// INIT SUPABASE
// =============================================
let db;
try {
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.warn('Supabase not connected. Running in demo mode.');
  db = null;
}

// =============================================
// DEMO DATA (used when Supabase is not connected)
// =============================================
const DEMO_NOTES = [
  {
    id: 1,
    name: 'রাহেলা পারভীন',
    batch: "SSC '২৩",
    message: 'এই বিদ্যালয় আমার জীবনের সেরা সময়গুলো দিয়েছে। প্রতিটি শিক্ষকের ভালোবাসা চিরকাল মনে থাকবে।',
    created_at: '2023-05-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'সাইফুল ইসলাম',
    batch: "SSC '২৪",
    message: 'পুলিশ লাইন স্কুল শুধু পড়াশোনা না, জীবনে কীভাবে এগিয়ে যেতে হয় তা শিখিয়েছে।',
    created_at: '2024-05-20T11:30:00Z'
  },
  {
    id: 3,
    name: 'নুসরাত জাহান',
    batch: "SSC '২৪",
    message: 'এই স্কুলের প্রতিটি কোণে আমার স্মৃতি জড়িয়ে আছে। বিদায়ের দিনে চোখে জল এসেছিল।',
    created_at: '2024-05-22T09:00:00Z'
  },
];

const DEMO_PRODUCTS = [
  { id: 1, name: 'স্কুল ইউনিফর্ম (ছেলে)', category: 'পোশাক', price: 650, in_stock: true, emoji: '👕' },
  { id: 2, name: 'স্কুল ইউনিফর্ম (মেয়ে)', category: 'পোশাক', price: 700, in_stock: true, emoji: '👗' },
  { id: 3, name: 'স্কুল ব্যাগ', category: 'স্টেশনারি', price: 850, in_stock: true, emoji: '🎒' },
  { id: 4, name: 'বই সেট (Class IX)', category: 'বই', price: 1200, in_stock: true, emoji: '📚' },
  { id: 5, name: 'বই সেট (Class X)', category: 'বই', price: 1200, in_stock: false, emoji: '📖' },
  { id: 6, name: 'জ্যামিতি বক্স', category: 'স্টেশনারি', price: 180, in_stock: true, emoji: '📐' },
  { id: 7, name: 'কলম সেট (১২টি)', category: 'স্টেশনারি', price: 120, in_stock: true, emoji: '✏️' },
  { id: 8, name: 'স্কুল টাই', category: 'পোশাক', price: 150, in_stock: true, emoji: '👔' },
];

// In-memory store for pending notes (when Supabase not connected)
let pendingNotes = [];
let approvedNotes = [...DEMO_NOTES];
let adminLoggedIn = false;

// =============================================
// NAV — scroll effect + mobile menu
// =============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// =============================================
// BATCH TABS
// =============================================
function switchBatch(id) {
  document.querySelectorAll('.batch-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.batch-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + id)?.classList.add('active');
  document.querySelector(`[data-batch="${id}"]`)?.classList.add('active');
  document.getElementById('batches')?.scrollIntoView({ behavior: 'smooth' });
}

// Generate student cards
function genStudents(containerId, names, emojis) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  names.forEach((name, i) => {
    const div = document.createElement('div');
    div.className = 'student-card';
    div.innerHTML = `<div class="student-icon">${emojis[i % emojis.length]}</div><div class="student-name">${name}</div>`;
    div.addEventListener('click', () => alert(`${name}\nSSC ব্যাচের শিক্ষার্থী`));
    c.appendChild(div);
  });
}

// Generate farewell cards
function genFarewell(containerId, count, farewellEmojis) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'farewell-card';
    div.innerHTML = farewellEmojis[i % farewellEmojis.length];
    div.title = `বিদায় অনুষ্ঠানের ছবি ${i + 1}`;
    c.appendChild(div);
  }
}

const peopleEmojis = ['👦', '👧', '🧑', '🙋', '🙋‍♂️', '😊', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🤗', '😁', '🥰'];
const partyEmojis  = ['🎉', '🎊', '🥂', '🎓', '🌟', '✨', '🎈', '📸', '🌸', '🎗️', '🏆', '🎭'];

const BATCH_DATA = {
  ssc25: {
    students: ['আরিফ হোসেন','মিম আক্তার','রবিউল ইসলাম','সুমাইয়া খানম','তানভীর আহমেদ','নিলুফার ইয়াসমিন','সজীব করিম','মাহফুজা বেগম','তামিম ইসলাম','রিনা আক্তার','শাকিল মাহমুদ','পারভীন সুলতানা','ইমরান হোসেন','শিরিন আক্তার','জাহিদ হাসান','রেহানা বেগম','মাসুদ রানা','সানজিদা পারভীন','রাফি আহমেদ','নাদিয়া ইসলাম'],
  },
  ssc26: {
    students: ['করিম উদ্দিন','আনিকা হোসেন','মাহমুদ হাসান','তামান্না আক্তার','রাকিব ইসলাম','মুনমুন বেগম','সিফাত আলী','বৃষ্টি আক্তার','শাহেদ করিম','নাজিয়া ইসলাম','ফারহান আহমেদ','মিথিলা সাহা','আবির হোসেন','ঊর্মি আক্তার','সাকিব মাহমুদ','মেঘনা বেগম','নাফিজ রহমান','অনামিকা দাস','জয় হোসেন','লিমা আক্তার'],
  },
  ssc27: {
    students: ['তুহিন আলী','তারিন ইসলাম','আরমান হোসেন','সেতু আক্তার','রিয়াদ করিম','মৌসুমী বেগম','শিহাব উদ্দিন','প্রিয়া দাস','ইফতি হোসেন','রাফি ইসলাম','তানজিল আহমেদ','সাবরিনা আক্তার','অমিত সাহা','কনিকা রানী','মিহির বসু','চাঁদনী আক্তার','সোহান মাহমুদ','মাইশা হোসেন','তৌহিদ ইসলাম','পিংকি বেগম'],
  }
};

// Initialize all batch content
Object.keys(BATCH_DATA).forEach(key => {
  genStudents(`students-${key}`, BATCH_DATA[key].students, peopleEmojis);
  genFarewell(`farewell-${key}`, 10, partyEmojis);
});

// =============================================
// PRODUCTS — load from Supabase or demo
// =============================================
async function loadProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let products = [];

  if (db) {
    try {
      const { data, error } = await db.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      products = data || [];
    } catch (e) {
      console.warn('Products fetch failed, using demo data:', e.message);
      products = DEMO_PRODUCTS;
    }
  } else {
    products = DEMO_PRODUCTS;
  }

  if (products.length === 0) {
    grid.innerHTML = '<div class="loading-products"><p style="color:var(--muted)">এখনো কোনো পণ্য যোগ করা হয়নি।</p></div>';
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-img">
        <span style="font-size:4rem;opacity:0.6">${p.emoji || '📦'}</span>
        <div class="product-img-overlay">
          <button class="product-quick-add" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">
            + কার্টে যোগ করুন
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.category || 'পণ্য'}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-bottom">
          <div class="product-price">৳ ${p.price?.toLocaleString('bn-BD') || '০'}</div>
          <span class="product-stock ${p.in_stock ? 'in-stock' : 'out-stock'}">
            ${p.in_stock ? 'স্টকে আছে' : 'স্টক শেষ'}
          </span>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(id, name, price) {
  // Simple cart notification — extend as needed
  const msg = document.createElement('div');
  msg.style.cssText = `position:fixed;bottom:90px;right:28px;background:#1a1a1a;border:1px solid var(--border);border-radius:10px;padding:14px 20px;color:#fff;font-size:0.85rem;font-family:'Syne',sans-serif;z-index:999;animation:fadeUp 0.3s ease;`;
  msg.innerHTML = `✅ <strong>${name}</strong> কার্টে যোগ হয়েছে`;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}

// =============================================
// LEAVE NOTES — Supabase integration
// =============================================
async function loadApprovedNotes() {
  if (db) {
    try {
      const { data, error } = await db
        .from('notes')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        approvedNotes = data;
      }
    } catch (e) {
      console.warn('Notes fetch failed, using demo data:', e.message);
    }
  }
  renderNoteWall();
}

function renderNoteWall() {
  const wall = document.getElementById('notes-wall');
  if (!wall) return;

  if (approvedNotes.length === 0) {
    wall.innerHTML = '<p style="color:var(--muted);font-size:0.88rem;padding:24px 0;">এখনো কোনো অনুমোদিত বার্তা নেই।</p>';
    return;
  }

  wall.innerHTML = approvedNotes.map(n => {
    const date = new Date(n.created_at);
    const dateStr = isNaN(date) ? '' : date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
      <div class="note-card">
        <div class="note-card-top">
          <div class="note-author-info">
            <div class="note-av">${(n.name || '?')[0]}</div>
            <div>
              <div class="note-name">${n.name || 'অজানা'}</div>
              <div class="note-batch-tag">${n.batch || ''}</div>
            </div>
          </div>
          <div class="note-date">${dateStr}</div>
        </div>
        <p class="note-body">${n.message || n.text || ''}</p>
      </div>
    `;
  }).join('');
}

async function submitNote() {
  const name = document.getElementById('note-name')?.value.trim();
  const batch = document.getElementById('note-batch')?.value;
  const message = document.getElementById('note-message')?.value.trim();
  const successMsg = document.getElementById('note-success');

  if (!name || !batch || !message) {
    alert('অনুগ্রহ করে সমস্ত তথ্য পূরণ করুন।');
    return;
  }

  const noteData = {
    name,
    batch,
    message,
    approved: false,
    created_at: new Date().toISOString()
  };

  if (db) {
    try {
      const { error } = await db.from('notes').insert([noteData]);
      if (error) throw error;
    } catch (e) {
      console.warn('Note insert failed, saving locally:', e.message);
      pendingNotes.push({ ...noteData, id: Date.now() });
    }
  } else {
    pendingNotes.push({ ...noteData, id: Date.now() });
  }

  document.getElementById('note-name').value = '';
  document.getElementById('note-batch').value = '';
  document.getElementById('note-message').value = '';
  if (successMsg) {
    successMsg.style.display = 'block';
    setTimeout(() => successMsg.style.display = 'none', 5000);
  }
}

// =============================================
// ADMIN PANEL
// =============================================
function openAdminPanel() {
  document.getElementById('admin-modal')?.classList.add('open');
  if (adminLoggedIn) renderAdminContent();
}
function closeAdminPanel() {
  document.getElementById('admin-modal')?.classList.remove('open');
}
document.getElementById('admin-modal')?.addEventListener('click', function(e) {
  if (e.target === this) closeAdminPanel();
});

async function adminLogin() {
  const pw = document.getElementById('admin-pw')?.value;
  const err = document.getElementById('pw-error');
  if (pw === ADMIN_PASSWORD) {
    adminLoggedIn = true;
    document.getElementById('admin-login-section').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    await loadPendingNotes();
  } else {
    if (err) err.textContent = '❌ ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।';
  }
}

async function loadPendingNotes() {
  let pending = [];

  if (db) {
    try {
      const { data, error } = await db
        .from('notes')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: true });
      if (error) throw error;
      pending = [...(data || []), ...pendingNotes];
    } catch (e) {
      pending = pendingNotes;
    }
  } else {
    pending = pendingNotes;
  }

  renderAdminContent(pending);
}

function renderAdminContent(pending = pendingNotes) {
  const list = document.getElementById('pending-list');
  if (!list) return;

  if (pending.length === 0) {
    list.innerHTML = '<div class="no-pending">✅ কোনো অনুমোদন বাকি নেই।</div>';
    return;
  }

  list.innerHTML = pending.map((n, i) => `
    <div class="pending-item" id="pi-${n.id || i}">
      <div class="pi-header">
        <div>
          <div class="pi-name">${n.name}</div>
          <div class="pi-meta">${n.batch} · ${new Date(n.created_at).toLocaleDateString('bn-BD')}</div>
        </div>
      </div>
      <p class="pi-text">${n.message}</p>
      <div class="pi-actions">
        <button class="pi-approve" onclick="approveNote('${n.id || i}', ${i})">✅ অনুমোদন</button>
        <button class="pi-reject" onclick="rejectNote('${n.id || i}', ${i})">❌ বাতিল</button>
      </div>
    </div>
  `).join('');
}

async function approveNote(id, index) {
  const note = pendingNotes[index] || pendingNotes.find(n => n.id == id);

  if (db) {
    try {
      const { error } = await db.from('notes').update({ approved: true }).eq('id', id);
      if (error) throw error;
    } catch (e) {
      // fallback to local
      if (note) {
        approvedNotes.unshift({ ...note, approved: true });
        pendingNotes = pendingNotes.filter((_, i) => i !== index);
      }
    }
  } else {
    if (note) {
      approvedNotes.unshift({ ...note, approved: true });
      pendingNotes = pendingNotes.filter((_, i) => i !== index);
    }
  }

  renderNoteWall();
  await loadPendingNotes();
}

async function rejectNote(id, index) {
  if (db) {
    try {
      await db.from('notes').delete().eq('id', id);
    } catch (e) {
      pendingNotes = pendingNotes.filter((_, i) => i !== index);
    }
  } else {
    pendingNotes = pendingNotes.filter((_, i) => i !== index);
  }
  await loadPendingNotes();
}

// =============================================
// CONTACT FORM
// =============================================
async function submitContact() {
  const name = document.getElementById('cf-name')?.value.trim();
  const email = document.getElementById('cf-email')?.value.trim();
  const subject = document.getElementById('cf-subject')?.value.trim();
  const message = document.getElementById('cf-message')?.value.trim();

  if (!name || !message) { alert('নাম ও বার্তা আবশ্যক।'); return; }

  if (db) {
    try {
      await db.from('contact_messages').insert([{ name, email, subject, message }]);
    } catch (e) {
      console.warn('Contact insert failed:', e.message);
    }
  }

  alert('✅ আপনার বার্তা পাঠানো হয়েছে! ধন্যবাদ।');
  ['cf-name','cf-email','cf-subject','cf-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// =============================================
// HERO EMAIL FORM
// =============================================
function joinWaitlist() {
  const email = document.getElementById('hero-email')?.value.trim();
  if (!email) return;
  alert(`✅ ${email} — নিবন্ধিত হয়েছে! শীঘ্রই আপডেট পাবেন।`);
  document.getElementById('hero-email').value = '';
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  loadApprovedNotes();
  loadProducts();
});

// Expose to HTML
window.switchBatch = switchBatch;
window.submitNote = submitNote;
window.openAdminPanel = openAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.adminLogin = adminLogin;
window.approveNote = approveNote;
window.rejectNote = rejectNote;
window.submitContact = submitContact;
window.joinWaitlist = joinWaitlist;
window.addToCart = addToCart;
