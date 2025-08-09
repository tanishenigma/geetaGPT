# main.py
import logging
import uuid

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage
from langgraph_backend import chatbot

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Geeta GPT API", description="Krishna AI Chatbot API")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

def generateThreadId() -> str:
    """Generate a unique thread ID"""
    thread_id = str(uuid.uuid4())
    logger.info(f"Generated new thread ID: {thread_id}")
    return thread_id

@app.get("/health")
async def health_check():
    """Health check endpoint to verify backend is running"""
    logger.info("Health check requested")
    return {"status": "healthy", "message": "Backend is online", "timestamp": str(uuid.uuid4())}

@app.post("/chat")
async def chat(request: Request):
    """Main chat endpoint that handles conversation with Krishna AI"""
    try:
        body = await request.json()
        user_message = body.get("message", "").strip()
        thread_id = body.get("thread_id", generateThreadId())
        
        logger.info(f"Chat request - Thread: {thread_id[:8]}..., Message: {user_message[:50]}...")

        if not user_message:
            logger.warning("Empty message received")
            return {"reply": "Please enter a valid message.", "thread_id": thread_id}

        # Configure LangGraph with thread ID for memory
        config = {
            "configurable": {
                "thread_id": thread_id
            }
        }

        # Prepare input for LangGraph
        inputs = {
            "messages": [HumanMessage(content=user_message)]
        }
        
        # Process with Krishna AI
        logger.info(f"Processing message with LangGraph for thread: {thread_id[:8]}...")
        result = chatbot.invoke(inputs, config=config)

        # Extract response
        reply = result["messages"][-1].content if "messages" in result else "No response generated."
        
        logger.info(f"Generated reply for thread {thread_id[:8]}...: {reply[:100]}...")
        
        return {
            "reply": reply,
            "thread_id": thread_id,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/conversations/{thread_id}/history")
async def get_conversation_history(thread_id: str):
    """Get conversation history for a specific thread"""
    logger.info(f"History requested for thread: {thread_id[:8]}...")
    # Note: LangGraph MemorySaver doesn't expose history directly
    # You'd need to implement custom storage for this feature
    return {
        "thread_id": thread_id,
        "message": "History feature not implemented yet",
        "status": "info"
    }
