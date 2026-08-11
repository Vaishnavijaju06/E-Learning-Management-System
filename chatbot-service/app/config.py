from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SkillForge Chatbot Service"
    internal_api_key: str = Field(default="", min_length=16)
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    max_output_tokens: int = Field(default=800, ge=1, le=8192)
    groq_timeout_seconds: float = Field(
        default=60.0, gt=0, le=300
    )
    groq_max_retries: int = Field(default=2, ge=0, le=5)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
