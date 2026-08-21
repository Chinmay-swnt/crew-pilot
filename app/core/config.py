import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

# Check both ai-engine directory and root directory for .env
CURRENT_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = CURRENT_DIR.parent

if (CURRENT_DIR / ".env").exists():
    load_dotenv(dotenv_path=CURRENT_DIR / ".env")
elif (ROOT_DIR / ".env").exists():
    load_dotenv(dotenv_path=ROOT_DIR / ".env")
else:
    load_dotenv()

api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""

if api_key:
    os.environ["GOOGLE_API_KEY"] = api_key
    os.environ["GEMINI_API_KEY"] = api_key

class Settings:
    GEMINI_API_KEY: str = api_key
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

settings = Settings()

def get_llm(temperature: float = 0.2):
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY is not set in environment variables.")
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=temperature
    )

def get_embeddings():
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY is not set in environment variables.")
    return GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=settings.GEMINI_API_KEY,
        output_dimensionality=768
    )