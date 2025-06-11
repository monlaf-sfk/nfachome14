from fastapi import APIRouter
from .llm import AssistantLLM
from pydantic import BaseModel

router = APIRouter(prefix="/assistant", tags=["Assistant"])

class PromptRequest(BaseModel):
    prompt: str

# Пример эндпоинта для общения с ассистентом
@router.post("/ask")
async def ask_assistant(request: PromptRequest):
    llm = AssistantLLM()
    answer = await llm.ask_async(request.prompt)
    return {"answer": answer} 