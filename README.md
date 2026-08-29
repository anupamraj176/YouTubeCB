<div align="center">
  
# 🎥 YouTube AI Chat
**Chat with any YouTube video instantly.**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38B2AC.svg)](https://tailwindcss.com/)

A full-stack, microservice architecture application that allows users to paste a YouTube URL and instantly chat with an AI about the video's content, extracting summaries, facts, and insights without watching the whole thing.

</div>

---

## ✨ Features

- **🧠 Instant AI Summarization**: Uses RAG (Retrieval-Augmented Generation) with Groq and FAISS to instantly index video transcripts and answer questions.
- **🎨 Premium Monochrome UI**: A stunning, ultra-minimal "Zinc" aesthetic with seamless Light and Dark mode transitions.
- **🛡️ Guest & Authenticated Modes**: 
  - **Guest Mode**: Jump right in and ask questions instantly without an account.
  - **Logged In**: Secure JWT authentication that saves your chat history permanently to MongoDB.
- **🏗️ Modern Microservice Architecture**: Separation of concerns between a React frontend, Node.js security gateway, and a Python AI processing engine.

---

## 🏗️ Architecture

This project is broken down into three independent microservices:

1. **`frontend/` (React + Vite + Tailwind)**
   - The user interface. Features a beautiful chat UI and authentication screens.
2. **`backend/` (Node.js + Express + MongoDB)**
   - The API Gateway. Handles user authentication (JWT), stores chat histories in MongoDB, and acts as a secure proxy to the Python AI service.
3. **`ai-service/` (Python + FastAPI)**
   - The AI brain. Downloads YouTube transcripts, chunks them, generates embeddings, stores them in a FAISS vector database, and uses Groq's LLMs to generate answers.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB running locally on port `27017`
- A [Groq API Key](https://console.groq.com/) for the AI models.

### 1. Setup the AI Service (Python)
Open a terminal in the `ai-service` directory:
```bash
cd ai-service
python -m venv venv
# Activate the virtual environment (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
```
Create a `.env` file in `ai-service`:
```env
GROQ_API_KEY=your_groq_api_key_here
```
Run the server:
```bash
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Setup the Backend Gateway (Node.js)
Open a new terminal in the `backend` directory:
```bash
cd backend
npm install
```
Create a `.env` file in `backend`:
```env
PORT=5000
MONGODB_URL=mongodb://127.0.0.1:27017/youtube_ai
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES=30d
```
Run the server:
```bash
npm run dev
```

### 3. Setup the Frontend (React)
Open a third terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser!

---

## 🔮 Future Roadmap
- **Chrome Extension Integration**: Port the React UI into a Chrome Extension Side Panel to interact with videos directly on `youtube.com`.
- **Chat History Dashboard**: A dedicated page for logged-in users to review all their past video summaries.
- **Multi-language Support**: Process transcripts and chat in different languages.
