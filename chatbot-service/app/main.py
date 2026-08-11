import logging

from fastapi import Depends, FastAPI, HTTPException, status
from groq import (
    APIConnectionError,
    APIStatusError,
    AuthenticationError,
    BadRequestError,
    NotFoundError,
    PermissionDeniedError,
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
        "model": settings.groq_model,
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
    except AuthenticationError as error:
        logger.error("Groq rejected GROQ_API_KEY: %s", error)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "The AI provider rejected GROQ_API_KEY. "
                "Create a current key in Groq Console and recreate "
                "the chatbot container."
            ),
        ) from error
    except PermissionDeniedError as error:
        logger.error("Groq denied this request: %s", error)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "The configured Groq key cannot use this model. "
                "Check GROQ_MODEL and the key permissions."
            ),
        ) from error
    except (BadRequestError, NotFoundError) as error:
        logger.error("Invalid Groq model/request configuration: %s", error)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "Groq rejected the configured model or request. "
                "Check GROQ_MODEL in the root .env file."
            ),
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
