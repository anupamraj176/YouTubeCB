from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.llm_service import process_video, ask_question

app = FastAPI(title="YouTube AI Service")

# Add CORS Middleware to allow requests from the React frontend / Node backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory State to store the Vector Stores temporarily for testing
# Key = video_id, Value = vector_store
vector_stores = {}

class ProcessRequest(BaseModel):
    video_id: str

class ChatRequest(BaseModel):
    video_id: str
    question: str


@app.get("/")
def read_root():
    return {"message": "Welcome to the YouTube AI Service"}


@app.post("/api/process-video")
def process_video_endpoint(request: ProcessRequest):
    """
    Takes a video ID, generates a vector store from its transcript, and saves it in memory.
    """
    try:
        # Check if we already processed this video
        if request.video_id in vector_stores:
            return {"message": "Video already processed and ready."}
        
        # Process and store
        vector_store = process_video(request.video_id)
        vector_stores[request.video_id] = vector_store
        
        return {"message": "Video processed successfully!"}
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    """
    Takes a question and a video ID, and asks the LLM using the generated vector store.
    """
    # Check if the video has been processed
    if request.video_id not in vector_stores:
        raise HTTPException(
            status_code=400, 
            detail="Video not processed yet. Please call /api/process-video first."
        )
    
    try:
        # Get the vector store from memory
        vector_store = vector_stores[request.video_id]
        
        # Ask the question
        answer = ask_question(vector_store, request.question)
        return {"answer": answer}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
