import os
import re
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser

load_dotenv() # Load variables from .env

# Initialize LLM once
llm = ChatGroq(
    groq_api_key=os.environ.get("GROQ_API_KEY"),
    model_name="groq/compound-mini",
    temperature=0.3
)

# Initialize Embeddings once
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


def process_video(video_id: str):
    """
    Fetches transcript for a YouTube video, chunks it, and creates a FAISS vector store.
    """
    try:
        # Extract ID if user provided a full URL
        match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', video_id)
        if match:
            video_id = match.group(1)
            
        # Fetch Transcript
        api = YouTubeTranscriptApi()
        transcript_obj = api.fetch(video_id, languages=["en"])
        transcript_list = transcript_obj.to_raw_data()
        
        transcript = " ".join(chunk["text"] for chunk in transcript_list)
        
        # Text Splitting
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.create_documents([transcript])
        
        # Create Vector Store
        vector_store = FAISS.from_documents(chunks, embeddings)
        return vector_store

    except TranscriptsDisabled:
        raise ValueError("No captions available for this video.")
    except Exception as e:
        raise ValueError(f"Error processing video: {str(e)}")


def format_docs(retrieved_docs):
    return "\n\n".join(doc.page_content for doc in retrieved_docs)


def ask_question(vector_store, question: str):
    """
    Takes an existing vector store and a user's question, and returns the LLM's answer.
    """
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={'k': 4})

    prompt = PromptTemplate(
        template="""
        You are a helpful assistant.
        Answer ONLY from the provided transcript context.
        If the context is insufficient, just say you don't know.

        {context}

        Question: {question}
        """,
        input_variables=['context', 'question']
    )

    parallel_chain = RunnableParallel({
        'context': retriever | RunnableLambda(format_docs),
        'question': RunnablePassthrough()
    })

    parser = StrOutputParser()

    # Create and run the full LCEL chain
    main_chain = parallel_chain | prompt | llm | parser
    
    answer = main_chain.invoke(question)
    return answer