from fastapi import APIRouter
from pydantic import BaseModel

from routes.upload import rag

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
async def chat(data: ChatRequest):

    result = rag.ask(data.question)

    return {
        "question": result["question"],
        "answer": result["answer"]
    }
