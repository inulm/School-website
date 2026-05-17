# 🏫 Police Line Secondary School — Jashore
## Website Setup Guide (GitHub Pages + Supabase)

---

## 📁 File Structure

```
plss-website/
├── index.html              ← Main website (সব section এখানে)
├── css/
│   └── style.css           ← সব CSS (dark cinematic theme)
├── js/
│   └── main.js             ← সব JavaScript + Supabase logic
├── supabase-schema.sql     ← Database setup (একবার run করতে হবে)
└── README.md               ← এই ফাইল
```

---

## 🚀 STEP 1 — Supabase Setup

1. **[supabase.com](https://supabase.com)** এ যাও → Sign up / Login
2. **New Project** বানাও
   - Name: `plss-website`
   - Database Password: যেকোনো strong password
   - Region: `Southeast Asia (Singapore)`
3. Project তৈরি হলে → **SQL Editor** এ যাও
4. `supabase-schema.sql` ফাইলের সব content copy করো → Paste করো → **Run** করো
5. তোমার credentials নাও:
   - Settings → API → **Project URL** (copy করো)
   - Settings → API → **anon / public** key (copy করো)

---

## 🔑 STEP 2 — Credentials বসাও

`js/main.js` ফাইল খোলো, উপরে এই দুইটা line পাবে:

```javascript
const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';
```

তোমার actual URL ও key দিয়ে replace করো।

### Admin Password পরিবর্তন:
```javascript
const ADMIN_PASSWORD = 'plss@admin2025'; // এটা পরিবর্তন করো
```

---

## 🐙 STEP 3 — GitHub এ Upload

### Option A: GitHub Desktop (Easy)
1. [desktop.github.com](https://desktop.github.com) — Download ও install করো
2. **New Repository** → Name: `plss-website` → Create
3. পুরো `plss-website` folder এর content → repository folder এ copy করো
4. **Commit to main** → **Push origin**

### Option B: Command Line
```bash
cd plss-website
git init
git add .
git commit -m "Initial commit - PLSS Website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/plss-website.git
git push -u origin main
```

---

## 🌐 STEP 4 — GitHub Pages Enable করো

1. GitHub এ তোমার repository যাও
2. **Settings** → **Pages** (বাম sidebar এ)
3. **Source**: `Deploy from a branch`
4. **Branch**: `main` → **/ (root)** → **Save**
5. কিছুক্ষণ পর তোমার site live হবে:
   ```
   https://YOUR_USERNAME.github.io/plss-website/
   ```

---

## ✏️ STEP 5 — তোমার তথ্য Update করো

### শিক্ষকের তথ্য পরিবর্তন:
`index.html` এ `teachers` section খোঁজো → নাম, বিষয়, পদ পরিবর্তন করো।

### শিক্ষার্থীর নাম পরিবর্তন:
`js/main.js` এ এই array গুলো পরিবর্তন করো:
```javascript
const BATCH_DATA = {
  ssc25: { students: ['নাম ১', 'নাম ২', ...] },
  ssc26: { students: [...] },
  ssc27: { students: [...] },
};
```

### ছবি যোগ করতে:
`gallery-item` div গুলোতে `<img>` tag যোগ করো:
```html
<img src="images/school.jpg" alt="বিদ্যালয়" style="width:100%;height:100%;object-fit:cover">
```
`images/` folder বানিয়ে সেখানে ছবি রাখো।

### Admin password পরিবর্তন:
`js/main.js` এ:
```javascript
const ADMIN_PASSWORD = 'তোমার_নতুন_password';
```

---

## 🛒 Products Supabase থেকে Manage করো

Supabase Dashboard → **Table Editor** → `products` table:
- **Insert row** → নতুন পণ্য যোগ করো
- Fields: `name`, `category`, `price`, `in_stock` (true/false), `emoji`

---

## 📝 Notes Admin Panel

1. Website এ ⚙️ button (নিচে ডানে) click করো
2. Password দিয়ে login করো
3. Pending নোট গুলো দেখো → Approve বা Reject করো

---

## ❓ Common Problems

| সমস্যা | সমাধান |
|--------|--------|
| Supabase কাজ করছে না | URL ও key ঠিক আছে কিনা দেখো |
| Site দেখা যাচ্ছে না | GitHub Pages enable হতে ৫-১০ মিনিট লাগে |
| Products load হচ্ছে না | `supabase-schema.sql` run করেছো? |
| Note submit হচ্ছে না | Demo mode এ locally save হচ্ছে, Supabase connect করো |

---

## 📞 Help

Website নিয়ে যেকোনো সমস্যায় repository এ **Issue** খোলো।

---

*Made with ❤️ for Police Line Secondary School, Jashore*
