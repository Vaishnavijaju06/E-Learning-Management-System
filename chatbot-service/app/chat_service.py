import json
from uuid import uuid4

from groq import AsyncGroq

from app.config import Settings
from app.models import ChatRequest, ChatResponse
from app.prompt import SYSTEM_PROMPT


class ChatService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = (
            AsyncGroq(
                api_key=settings.groq_api_key,
                timeout=settings.groq_timeout_seconds,
                max_retries=settings.groq_max_retries,
            )
            if settings.groq_api_key
            else None
        )
        self.conversations: dict[
            str, list[dict[str, str]]
        ] = {}

    def _build_context_block(
        self, request: ChatRequest
    ) -> str:
        """
        Turns the role / user name / detected intent / backend
        context (enrollments, certificates, payments, course
        catalog) into plain-language lines the model can use, so
        answers are grounded in the student's real data instead of
        generic guesses.
        """
        lines: list[str] = []

        if request.user_name:
            lines.append(f"User's name: {request.user_name}")

        if request.role:
            lines.append(f"User's role: {request.role}")

        if request.intent:
            lines.append(
                f"Detected question type: {request.intent}"
            )

        if request.course_title:
            lines.append(
                f"Current course: {request.course_title}"
            )

        if request.lesson_title:
            lines.append(
                f"Current lesson: {request.lesson_title}"
            )

        if request.context and request.context.data:
            data = request.context.data

            if "message" in data and len(data) == 1:
                # e.g. "not logged in" placeholder from the backend
                lines.append(str(data["message"]))
            else:
                lines.append(
                    "Backend data relevant to this question "
                    "(use it directly, do not invent numbers "
                    "that aren't here):"
                )
                lines.append(
                    json.dumps(data, default=str, indent=2)
                )

        return "\n".join(lines)

    async def reply(self, request: ChatRequest) -> ChatResponse:
        if self.client is None:
            return self._demo_reply(request)

        instructions = SYSTEM_PROMPT

        context_block = self._build_context_block(request)
        if context_block:
            instructions += (
                "\n\nContext for this specific request:\n"
                + context_block
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
        greeting = (
            f"Hi {request.user_name}! " if request.user_name else ""
        )

        context_note = ""
        if request.context and request.context.data:
            data = request.context.data
            if "courses" in data:
                context_note = (
                    f" I can see {len(data['courses'])} course(s) "
                    "in the catalog for this."
                )
            elif "enrollments" in data:
                context_note = (
                    f" I can see {len(data['enrollments'])} "
                    "enrollment(s) on your account."
                )
            elif "certificates" in data:
                context_note = (
                    f" I can see {len(data['certificates'])} "
                    "certificate(s) on your account."
                )
            elif "payments" in data:
                context_note = (
                    f" I can see {len(data['payments'])} "
                    "payment(s) on your account."
                )

        answer = (
            f"{greeting}Demo assistant mode is active because "
            "GROQ_API_KEY is not configured, so I can't generate a "
            f"real answer yet.\n\n"
            f"Your question was: \u201c{topic}\u201d\n\n"
            f"{('Behind the scenes,' + context_note) if context_note else ''}"
            "\n\nAdd GROQ_API_KEY to the environment to get a real, "
            "data-grounded answer to platform questions like this."
        )

        return ChatResponse(
            answer=answer,
            conversation_id=(
                request.conversation_id or f"demo-{uuid4()}"
            ),
            model="demo-mode",
        )
