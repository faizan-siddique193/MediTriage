import os
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in the .env file")

client = AsyncGroq(api_key=GROQ_API_KEY)

async def chat_async(prompt: str, json_mode: bool = False) -> str:
    messages = [{"role": "user", "content": prompt}]
    args = {
        "messages": messages,
        "model": "llama-3.3-70b-versatile",
        "temperature": 0.1,
    }
    if json_mode:
        args["response_format"] = {"type": "json_object"}
        
    completion = await client.chat.completions.create(**args)
    return completion.choices[0].message.content
