# YouTube AI Application (Full-Stack)

This is the main repository for the YouTube AI Chat application. Currently, this README documents the **Python AI Microservice**. Later, it will be updated to include the React Frontend and Node.js Backend.

---

## 1. AI Microservice (Python)

This service is the backend engine built using **FastAPI** and uses **LangChain** alongside **Groq** to enable high-speed LLM conversations over YouTube transcripts.

### Features
- **Automatic Transcript Extraction**: Fetches the English transcript from a provided YouTube Video ID or URL.
- **RAG Architecture**: Uses Retrieval-Augmented Generation (RAG) by splitting the transcript into chunks and embedding them into a local FAISS vector store using HuggingFace embeddings.
- **High-Speed AI**: Powered by Groq's lightning-fast inference API (`groq/compound-mini`) to answer user questions based exclusively on the video's content.

### Tech Stack
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **LLM Orchestration**: [LangChain](https://python.langchain.com/)
- **LLM Provider**: [Groq](https://groq.com/)
- **Embeddings**: HuggingFace (`all-MiniLM-L6-v2`)
- **Vector Database**: FAISS (In-Memory)
- **Transcript Fetcher**: [youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api)

### Prerequisites
1. Python 3.9+ installed on your machine.
2. A free API key from [Groq Console](https://console.groq.com/keys).

### Installation
1. Navigate to the `ai-service` directory:
   ```bash
   cd ai-service
   ```
2. Ensure you have installed the required dependencies from the `requirements.txt` file:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root of the `ai-service` folder and add your Groq API key:
   ```env
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```

### Running the Server
Start the development server using Uvicorn:

```bash
python -m uvicorn app.main:app --reload
```

The API will now be running on `http://127.0.0.1:8000`. 
You can view the interactive API documentation (Swagger UI) by navigating to `http://127.0.0.1:8000/docs` in your browser.

### API Endpoints

#### 1. Process Video
**`POST /api/process-video`**
Processes a video and stores its transcript in the FAISS vector database. You must call this before chatting.

**Request Body:**
```json
{
  "video_id": "1-SvuFIQjK8" 
}
```
*(Note: You can pass either the 11-character video ID or the full YouTube URL)*

#### 2. Chat
**`POST /api/chat`**
Ask a question about a video that has already been processed.

**Request Body:**
```json
{
  "video_id": "1-SvuFIQjK8",
  "question": "What is the main topic of this video?"
}
```

### Note on Memory
Currently, the FAISS vector stores are saved in an **in-memory dictionary**. This means that if you restart the FastAPI server, the memory is wiped and you must call `/api/process-video` again before attempting to chat.

---

## 2. Frontend (React)
*(To be added)*

---

## 3. Backend (Node.js)
*(To be added)*
