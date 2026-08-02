from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SkillForge Chatbot Service"
    internal_api_key: str = "skillforge-chatbot-internal-key"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    max_output_tokens: int = 800

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
