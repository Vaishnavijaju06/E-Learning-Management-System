import secrets

from fastapi import Header, HTTPException, status

from app.config import get_settings


async def require_internal_api_key(
    x_internal_api_key: str | None = Header(default=None),
) -> None:
    expected = get_settings().internal_api_key

    if (
        x_internal_api_key is None
        or not secrets.compare_digest(
            x_internal_api_key,
            expected,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid internal API key",
        )
