# 🧠 Verant Test Mock – React Project

![React Badge](https://img.shields.io/badge/React-18.0+-blue?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)
![Deployed](https://img.shields.io/badge/Deployed%20on-Netlify-brightgreen?logo=netlify)

> 🎤 A fully interactive **Verant-style speaking test mock** built using **React + Web Speech API** that simulates a real verbal reasoning test environment.

---

## 🚀 Live Demo  
🔗 https://versant-test.netlify.app/

---

## 🧩 Overview

This project replicates the **Verant (spoken English) test experience**, including **voice playback, section timers, and randomized scoring** — all running 100% in the browser.

Each attempt loads a **fresh set of questions** for realistic practice.

---

## 🎯 Features

✅ **6 Sections Included**
- Reading  
- Repeats  
- Short Answer  
- Sentence Builds  
- Story Retelling  
- Open Questions  

✅ **Core Features**
- 🔊 **Speech Synthesis (TTS)** — questions read aloud automatically  
- ⏱️ **Smart Timers** — 15s for short and 45s for long questions  
- 🔁 **Replay Question** option  
- 🧠 **Dynamic Question Sets** on every retry  
- 📈 **Score out of 100** (randomized for demo purposes)  
- 💻 **Single Page React App** — no backend required  
- 🌈 **Clean, responsive UI** that feels like a real test  

---

## 🛠️ Tech Stack

| Tool / Library | Purpose |
|-----------------|----------|
| **React** | UI and state management |
| **Web Speech API (SpeechSynthesis)** | Voice playback |
| **CSS3** | Modern, responsive design |
| **Netlify** | Hosting and deployment |

---

## 🧪 How It Works

1. **Reading Section**  
   Displays text on screen with a voice reading it aloud.

2. **Repeat & Other Sections**  
   Text is *not visible* — question plays automatically via voice.  
   A **Replay Question** button is available.

3. **Timers**  
   Each question has a time limit:
   - ⏱️ Short sections: **15 seconds**
   - ⏱️ Long sections: **45 seconds**

4. **Scoring**  
   A **random score (0–100)** is shown with a descriptive result at the end.

---



---

## ⚙️ Installation & Setup

To run locally:

```bash
# 1️⃣ Clone this repo
git clone 
cd verant-test-mock

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the app
npm start
