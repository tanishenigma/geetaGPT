# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage
from langgraph_backend import chatbot

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint to verify backend is running"""
    return {"status": "healthy", "message": "Backend is online"}

@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    user_message = body.get("message", "")
    thread_id = body.get("thread_id", "default-session")

    if not user_message.strip():
        return {"reply": "Please enter a valid message."}
    config = {
        "configurable": {
            "thread_id": thread_id
        }
    }

    inputs = {
        "messages": [HumanMessage(content=user_message)]
    }
    
    result = chatbot.invoke(inputs, config=config)

    reply = result["messages"][-1].content if "messages" in result else "No response."
    return {"reply": reply}
