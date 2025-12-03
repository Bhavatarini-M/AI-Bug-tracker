# 🚀 AI BUG TRACKER - START HERE

## ⚡ FASTEST START (2 MINUTES)

### First Time ONLY (Do Once):

**Step 1: Install Backend Dependencies**
```powershell
cd backend
pip install -r requirements.txt
```

**Step 2: Configure API Key**
- Open `backend/.env`
- Replace `OPENAI_API_KEY=your-openai-api-key-here` with your actual key
- Get key from: https://platform.openai.com/api-keys

**Step 3: Install Frontend Dependencies**
```powershell
cd frontend
npm install
```

---

## 🎯 EVERY TIME YOU RUN THE APP

### Terminal 1 - Start Backend
```powershell
cd backend
python -m uvicorn app.main:app --reload
```
✅ Wait for: `"Application startup complete"`

### Terminal 2 - Start Frontend (New Window)
```powershell
cd frontend
npm run dev
```
✅ Wait for: `"Local: http://localhost:5173"`

### Open Browser
👉 **http://localhost:5173**

---

## 📝 WHAT YOU CAN DO NOW

### Upload a Log File
1. Click the **"Upload Log"** tab
2. Drag & drop a file or click **"Select File"**
3. Try: `sample-error.log`, `sample-crash.txt`, or `sample-payment-error.json`
4. Click **"Upload & Analyze"**
5. Watch the magic happen! ✨

### View Results
1. Go to **"Dashboard"** tab
2. See your upload in the table
3. Status changes from "pending" → "completed" in 3-5 seconds
4. Click the **👁️ View** button to see:
   - **Issue Type**: What went wrong
   - **Root Cause**: Why it happened
   - **Suggested Fix**: How to fix it
   - **Severity**: How bad it is (1-5)

### Test Duplicate Detection
1. Upload the **same file again**
2. Frontend shows: "Identical log already exists"
3. Results appear **instantly** (cached!)

---

## 🔍 HOW IT WORKS (Simplified)

```
Your Log File
     ↓
[Redact sensitive data]
(IPs, passwords, API keys → [REDACTED])
     ↓
[Send to OpenAI AI]
(GPT-4o analyzes)
     ↓
[Get Results]
• Issue Type
• Root Cause
• Fix
• Severity (1-5)
     ↓
[See in Dashboard]
```

---

## 📋 SAMPLE FILES PROVIDED

You can test with these files in the project root:

| File | Content | Good For Testing |
|------|---------|------------------|
| `sample-error.log` | Database error | Connection issues |
| `sample-crash.txt` | Memory crash | System failures |
| `sample-payment-error.json` | Payment failure | API errors |

---

## 🐛 SOMETHING NOT WORKING?

### Backend won't start?
```powershell
# Make sure you're in backend folder
cd backend

# Check Python is installed
python --version

# Try installing again
pip install -r requirements.txt

# Start server
python -m uvicorn app.main:app --reload
```

### Frontend won't load?
```powershell
# Make sure you're in frontend folder
cd frontend

# Check Node.js is installed
node --version

# Try installing again
npm install

# Start dev server
npm run dev
```

### API key error when uploading?
```
1. Check backend/.env has your actual OpenAI API key
2. Get a key from: https://platform.openai.com/api-keys
3. Restart backend server
```

### File upload fails?
```
• Only .log, .txt, .json files allowed
• Max file size is 5MB
• Check your network connection
```

---

## 🎨 VISUAL ARCHITECTURE

```
┌─────────────────────────────────────────┐
│     BROWSER (http://localhost:5173)     │
├─────────────────────────────────────────┤
│   Upload Page  |  Dashboard Page        │
│   • Drag Drop  |  • File Table          │
│   • Upload Box |  • Status Progress     │
│                |  • Severity Ratings    │
├─────────────────────────────────────────┤
│           ↓ UPLOAD FILE ↓               │
├─────────────────────────────────────────┤
│  BACKEND (http://localhost:8000)        │
│  FastAPI Server                         │
├─────────────────────────────────────────┤
│  Background Processing:                 │
│  1. Redact sensitive data (regex)       │
│  2. Call OpenAI API                     │
│  3. Cache results                       │
│  4. Save to database                    │
├─────────────────────────────────────────┤
│  DATABASE (SQLite)                      │
│  • Store uploads + results              │
│  • Cache for duplicate detection        │
├─────────────────────────────────────────┤
│  OPENAI API                             │
│  Analyzes redacted logs                 │
└─────────────────────────────────────────┘
```

---

## ✅ VERIFICATION STEPS

After starting both servers, verify:

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend loads at http://localhost:8000
- [ ] Can upload a file
- [ ] Status changes to "completed"
- [ ] Results show in dashboard
- [ ] Severity rating displays
- [ ] Upload same file → shows "duplicate"
- [ ] Second upload is instant

---

## 🎯 NEXT STEPS

1. ✅ Start backend + frontend
2. ✅ Upload a sample log file
3. ✅ View results in dashboard
4. ✅ Test duplicate detection
5. ✅ Read full docs for advanced features

---

## 📚 FULL DOCUMENTATION

- **README.md** - Complete feature overview
- **STEP_BY_STEP_GUIDE.md** - Detailed walkthrough
- **QUICK_REFERENCE.md** - Command reference
- **PROJECT_STRUCTURE.md** - File inventory

---

## 🔑 KEY COMMANDS

```powershell
# Start Backend
cd backend
python -m uvicorn app.main:app --reload

# Start Frontend
cd frontend
npm run dev

# Install dependencies (first time)
pip install -r requirements.txt        # Backend
npm install                            # Frontend
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 💡 TIPS

1. **Keep both terminals open** - one for backend, one for frontend
2. **Check the sample files** - they contain sensitive data examples
3. **Watch the network tab** - see the redaction happening
4. **Test with different files** - .log, .txt, .json all supported
5. **Monitor the console** - see processing steps in real-time

---

## 🎓 WHAT YOU'LL LEARN

✅ How to build a full-stack web app  
✅ How to redact sensitive data securely  
✅ How to integrate with OpenAI API  
✅ How to implement caching & deduplication  
✅ How to build responsive UIs with React  
✅ How to create REST APIs with FastAPI  

---

## 🚀 YOU'RE READY!

Everything is already set up and ready to go.

```
1. Start backend ✓
2. Start frontend ✓
3. Open browser ✓
4. Upload a file ✓
5. View results ✓
```

**Happy debugging! 🎉**

---

**Need help?** Check the troubleshooting section above or read the full guides.

**Version:** 1.0.0 | **Status:** Production Ready | **Dec 2024**
