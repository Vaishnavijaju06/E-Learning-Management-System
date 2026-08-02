import asyncio
from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.chat_service import ChatService
from app.config import Settings
from app.main import app
from app.models import ChatRequest

client = TestClient(app)


def test_health_reports_demo_mode() -> None:
    response = client.get("/api/chatbot/health")

    assert response.status_code == 200
    assert response.json()["status"] == "UP"
    assert response.json()["mode"] == "demo"


def test_chat_rejects_missing_internal_key() -> None:
    response = client.post(
        "/api/chatbot/chat",
        json={"message": "Explain dependency injection"},
    )

    assert response.status_code == 401


def test_chat_works_without_groq_key_in_demo_mode() -> None:
    response = client.post(
        "/api/chatbot/chat",
        headers={
            "X-Internal-Api-Key": "skillforge-chatbot-internal-key"
        },
        json={"message": "Explain dependency injection"},
    )

    assert response.status_code == 200
    assert response.json()["model"] == "demo-mode"
    assert response.json()["conversationId"].startswith(
        "demo-"
    )


def test_groq_chat_keeps_conversation_context() -> None:
    class FakeCompletions:
        def __init__(self) -> None:
            self.calls: list[dict] = []

        async def create(self, **arguments):
            self.calls.append(arguments)
            answer = (
                "First answer"
                if len(self.calls) == 1
                else "Follow-up answer"
            )
            return SimpleNamespace(
                choices=[
                    SimpleNamespace(
                        message=SimpleNamespace(
                            content=answer
                        )
                    )
                ]
            )

    completions = FakeCompletions()
    fake_client = SimpleNamespace(
        chat=SimpleNamespace(completions=completions)
    )
    service = ChatService(
        Settings(groq_api_key="")
    )
    service.client = fake_client

    first = asyncio.run(
        service.reply(
            ChatRequest(message="Explain dependency injection")
        )
    )
    second = asyncio.run(
        service.reply(
            ChatRequest(
                message="Give me an example",
                conversation_id=first.conversation_id,
            )
        )
    )

    assert second.answer == "Follow-up answer"
    assert second.conversation_id == first.conversation_id
    assert {
        "role": "assistant",
        "content": "First answer",
    } in completions.calls[1]["messages"]
