# Пример заготовки для интеграции с LLM API

import os
import httpx
import asyncio

class AssistantLLM:
    def __init__(self, provider: str = "gemini", api_key: str = None):
        self.provider = provider
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model = "gemini-2.0-flash"
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"

    async def ask_async(self, prompt: str) -> str:
        payload = {
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(self.api_url, json=payload)
            response.raise_for_status()
            data = response.json()
            # Gemini returns the answer in this nested structure
            return data["candidates"][0]["content"]["parts"][0]["text"]

    def ask(self, prompt: str) -> str:
        return asyncio.run(self.ask_async(prompt)) 