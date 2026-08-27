import os
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate

#Step 1a: Indexing
video_id = "LPZh9B0jkQs"  # only the ID, not full URL

try:
    # If you don’t care which language, this returns the “best” one
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=["en"])

    # Flatten it to plain text
    transcript = " ".join(chunk["text"] for chunk in transcript_list)
    print(transcript)

except TranscriptsDisabled:
    print("No captions available for this video.")

#Step 1b : Text Splitting

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.create_documents([transcript])

#Step 1c and 1d : Text Embedding and Vector Store
# Groq doesn't have an embeddings API, so we use a free HuggingFace model locally
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = FAISS.from_documents(chunks, embeddings)
print("Vector Store Created Successfully")


#Step 2: Retrieving
retriver = vector_store.as_retriever(search_type = "similarity",search_kwargs = {'k':4})


docs = retriver.invoke('What is this video about?')

#Step 3: Setup LLM using Groq
load_dotenv() # Load variables from .env

llm = ChatGroq(
    groq_api_key=os.environ.get("GROQ_API_KEY"),
    model_name="llama3-8b-8192", # You can also use mixtral-8x7b-32768
    temperature=0.3
)

#step 3 : Augmentation
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

question = "is the topic of aliens discussed in this video? if yes then what was discussed"
retrieved_docs = retriever.invoke(question)

context_text = "\n\n".join(doc.page_content for doc in retrieved_docs)

final_prompt = prompt.invoke({"context": context_text, "question": question})



#Step 4: Genration
answer = llm.invoke(final_prompt)
print(answer.content)