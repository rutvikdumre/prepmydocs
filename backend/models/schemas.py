from pydantic import BaseModel


class ConvertResponse(BaseModel):
    markdown: str
    filename: str
    tokens_before: int
    tokens_after: int
    tokens_saved: int
    savings_percent: int


class HealthResponse(BaseModel):
    status: str
