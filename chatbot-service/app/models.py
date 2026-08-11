from pydantic import BaseModel, ConfigDict, Field


class ChatbotContext(BaseModel):
    """
    Mirrors the Java ChatbotContext DTO ({"data": {...}}). The shape
    of `data` varies by intent (enrollments, certificates, payments,
    or a course catalog list) - it's kept as a free-form dict here
    rather than modeled field-by-field, since the backend is the
    source of truth for what goes in it.
    """

    data: dict[str, object] | None = None


class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=2000)
    conversation_id: str | None = Field(
        default=None,
        alias="conversationId",
        max_length=200,
    )
    course_title: str | None = Field(
        default=None,
        alias="courseTitle",
        max_length=200,
    )
    lesson_title: str | None = Field(
        default=None,
        alias="lessonTitle",
        max_length=200,
    )

    # Sent by the Java backend (ChatbotOrchestratorService) on every
    # request. Previously undeclared here, so Pydantic silently
    # dropped them - role/intent/context never reached the model.
    role: str | None = Field(default=None)
    user_name: str | None = Field(
        default=None,
        alias="userName",
        max_length=120,
    )
    intent: str | None = Field(default=None)
    context: ChatbotContext | None = Field(default=None)

    model_config = ConfigDict(populate_by_name=True)


class ChatResponse(BaseModel):
    answer: str
    conversation_id: str = Field(alias="conversationId")
    model: str

    model_config = ConfigDict(
        populate_by_name=True,
        serialize_by_alias=True,
    )