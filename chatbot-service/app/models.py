from pydantic import BaseModel, ConfigDict, Field


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

    model_config = ConfigDict(populate_by_name=True)


class ChatResponse(BaseModel):
    answer: str
    conversation_id: str = Field(alias="conversationId")
    model: str

    model_config = ConfigDict(
        populate_by_name=True,
        serialize_by_alias=True,
    )
