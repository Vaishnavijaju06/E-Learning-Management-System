from uuid import uuid4

from groq import AsyncGroq

from app.config import Settings
from app.models import ChatRequest, ChatResponse
from app.prompt import SYSTEM_PROMPT


class ChatService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = (
            AsyncGroq(api_key=settings.groq_api_key)
            if settings.groq_api_key
            else None
        )
        self.conversations: dict[
            str, list[dict[str, str]]
        ] = {}

    async def reply(self, request: ChatRequest) -> ChatResponse:
        if self.client is None:
            return self._demo_reply(request)

        instructions = SYSTEM_PROMPT
        context_parts = []

        if request.course_title:
            context_parts.append(
                f"Current course: {request.course_title}"
            )

        if request.lesson_title:
            context_parts.append(
                f"Current lesson: {request.lesson_title}"
            )

        if context_parts:
            instructions += (
                "\n\nUse this page context when useful:\n"
                + "\n".join(context_parts)
            )

        conversation_id = (
            request.conversation_id or f"groq-{uuid4()}"
        )
        history = self.conversations.get(
            conversation_id, []
        )
        user_message = {
            "role": "user",
            "content": request.message,
        }
        messages = [
            {"role": "system", "content": instructions},
            *history,
            user_message,
        ]

        completion = await self.client.chat.completions.create(
            model=self.settings.groq_model,
            messages=messages,
            temperature=0.5,
            max_completion_tokens=(
                self.settings.max_output_tokens
            ),
        )
        answer = completion.choices[0].message.content

        if not answer:
            answer = (
                "I could not generate an answer. "
                "Please ask the question again."
            )

        assistant_message = {
            "role": "assistant",
            "content": answer,
        }

        # Retain only the latest six user/assistant exchanges.
        self.conversations[conversation_id] = [
            *history,
            user_message,
            assistant_message,
        ][-12:]

        return ChatResponse(
            answer=answer,
            conversation_id=conversation_id,
            model=self.settings.groq_model,
        )

    def _demo_reply(self, request: ChatRequest) -> ChatResponse:
        topic = request.message.strip()
        answer = (
            "Demo tutor mode is active because GROQ_API_KEY is not "
            "configured.\n\n"
            f"Your question was: “{topic}”\n\n"
            "A useful learning approach is:\n"
            "1. Define the main concept in one sentence.\n"
            "2. Work through one small practical example.\n"
            "3. Explain it back in your own words.\n"
            "4. Test yourself with two questions.\n\n"
            "Add GROQ_API_KEY to the environment to receive a "
            "generated, topic-specific answer."
        )

        return ChatResponse(
            answer=answer,
            conversation_id=f"demo-{uuid4()}",
            model="demo-mode",
        )
