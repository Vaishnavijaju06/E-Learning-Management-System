import logging

from fastapi import Depends, FastAPI, HTTPException, status
from groq import (
    APIConnectionError,
    APIStatusError,
    RateLimitError,
)

from app.chat_service import ChatService
from app.config import get_settings
from app.models import ChatRequest, ChatResponse
from app.security import require_internal_api_key

settings = get_settings()
logger = logging.getLogger(__name__)
chat_service = ChatService(settings)

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
)


@app.get("/api/chatbot/health")
async def health() -> dict[str, str]:
    return {
        "status": "UP",
        "service": "skillforge-chatbot-service",
        "mode": (
            "groq" if settings.groq_api_key else "demo"
        ),
    }


@app.post(
    "/api/chatbot/chat",
    response_model=ChatResponse,
    dependencies=[Depends(require_internal_api_key)],
)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        return await chat_service.reply(request)
    except RateLimitError as error:
        logger.warning("Groq rate limit reached: %s", error)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="The AI tutor is busy. Please try again shortly.",
        ) from error
    except APIConnectionError as error:
        logger.error("Could not connect to Groq: %s", error)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI provider is currently unavailable.",
        ) from error
    except APIStatusError as error:
        logger.error(
            "Groq returned status %s",
            error.status_code,
        )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI provider could not complete the request.",
        ) from error
