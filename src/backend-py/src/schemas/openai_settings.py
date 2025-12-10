from pydantic import BaseModel, Field
from typing import Optional

class OpenAISettings(BaseModel):
    model_name: str = Field(..., min_length=1, max_length=100)
    temperature: float = Field(..., ge=0, le=1)
    web_search: bool = Field(default=True)
