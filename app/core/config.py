import os
from pathlib import Path
from dotenv import load_dotenv

current_file = Path(__file__).resolve()
possible_env_paths = [
    current_file.parents[2] / ".env",
    current_file.parents[3] / ".env",
    Path.cwd() / ".env",
]

for env_path in possible_env_paths:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
        break

raw_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""

if raw_key:
    os.environ["GOOGLE_API_KEY"] = raw_key
    os.environ["GEMINI_API_KEY"] = raw_key

class Settings:
    @property
    def GEMINI_API_KEY(self) -> str:
        return os.getenv("GOOGLE_API_KEY", "")

    @property
    def SUPABASE_URL(self) -> str:
        return os.getenv("SUPABASE_URL", "")

    @property
    def SUPABASE_SERVICE_ROLE_KEY(self) -> str:
        return os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

settings = Settings()

def get_llm(temperature: float = 0.2):
    from langchain_google_genai import ChatGoogleGenerativeAI
    key = settings.GEMINI_API_KEY
    if not key:
        raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY is not set.")
    return ChatGoogleGenerativeAI(
        model="gemini-3.6-flash",
        api_key=key,
        temperature=temperature
    )

def get_embeddings():
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    key = settings.GEMINI_API_KEY
    if not key:
        raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY is not set.")
    return GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-2-preview",
        api_key=key,
        output_dimensionality=768
    )