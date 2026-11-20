# 💖 Coco & Chiku - Romantic Couple App

A beautiful, private, and aesthetic couple app specially built for **Coco & Chiku** using **JavaScript, React, Node.js, and Tailwind CSS**.

All your data is saved directly in your browser's **LocalStorage** — meaning **zero database setup**, complete privacy, and lightning-fast loading!

---

## 🌟 Key Features

### 1. 🔍 Find & Connect With Partner (No Auth / Passwords)
- **Zero Login / Password**: Simply enter your name (e.g. `Coco`) and your partner's name (e.g. `Chiku`).
- **Live Sync Pairing**: Instant peer pairing through Node.js Socket.io.
- **LocalStorage Synced**: Every task, schedule, and relationship date is persisted locally in each person's browser.
- **1-Click Share Link**: Send the invite link to your partner to pair up instantly on phone or laptop.

### 2. 📋 Everyday Tasks (My Tasks & Given Tasks)
- **Manual Task Add**: Set your custom daily goals, habits, and sweet promises.
- **Set Timing**: Specify target times (e.g. `09:30 AM`, `02:00 PM`, `10:00 PM`).
- **Two-Way Assignment**:
  - **My Tasks**: Tasks you need to complete today.
  - **Tasks Given by / to Partner**: Assign loving tasks to each other.
- **Milestone Celebration**:
  - 🎉 **All Tasks Done**: Loving celebration banner with confetti explosion!
  - 💔 **Pending Tasks**: Cute heartbreak warning emoji (`💔`) reminding you to finish tasks together!

### 3. 🛋️ Our Room (Free Time & Call Schedule)
- **Daily Free Time Planner**:
  - Manually add slots for when you or your partner will be free (e.g., `Coco is free: 01:30 PM - 03:00 PM (Lunch break)`).
- **Scheduled Call Timings**:
  - Plan your video calls 📹, voice calls 📞, or sweet night talks 🌙 with exact timings and reminders.
- **Love Wall**:
  - Pin cute sticky notes for each other inside your shared room!
- **Instant Love Interactions**:
  - Send virtual kisses 💋, warm hugs 🫂, heartbeats 💓, or "I miss you" alerts with instant animated popups!

### 4. ⏳ Relationship Day Score & Counter
- **"When Did Our Relation Start?" Button**:
  - Pick your anniversary / special start date.
- **Live Score Counter**:
  - Main dashboard displays total days together (`Day 120 Together ❤️`), with live ticking hours, minutes, and seconds!
  - Milestone badges (1 Month, 100 Days, 6 Months, 1 Year Anniversary).

### 5. 🎨 Aesthetic Theme (Dark & Light)
- **Dark Mode**: Purple-black palette with frosted glassmorphism (`glass-matte`), glowing purple buttons, and soft neon accents.
- **Light Mode**: Purple-white clean aesthetic with lavender pastels, crisp typography, and frosted glass cards.
- **Fully Responsive**: Optimized for smartphones, tablets, and desktops.

---

## 🚀 How to Run the App

### Option A: 1-Click Launch (Easiest)
Simply double-click the **`start-app.bat`** file located inside `C:\Users\jagruti\Desktop\coco-chiku`. It will start the server and automatically open the app in your browser!

### Option B: Terminal Command
1. Open PowerShell or Command Prompt.
2. Navigate to the project:
   ```bash
   cd C:\Users\jagruti\Desktop\coco-chiku
   ```
3. Run:
   ```bash
   npm start
   ```
4. Open your browser at:
   **[http://localhost:5000](http://localhost:5000)**

---

## 📱 Opening on Both Phones (Mobile & Wi-Fi)
Since the app runs on Node.js on your local network:
1. Ensure both your PC and your phone (or your partner's phone) are connected to the same Wi-Fi.
2. Find your PC's IP address (run `ipconfig` in cmd, e.g. `192.168.1.15`).
3. Open `http://<YOUR-IP>:5000` on your phone browser.
4. Enter `Coco` and `Chiku` to sync together in real time!
