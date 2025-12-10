from pydantic import BaseModel, Field
from typing import Optional

class GenerateOptions(BaseModel):
    number_of_posts: int = Field(default=3, ge=1, le=10)
    platforms: list[str] = Field(default=["twitter", "instagram", "linkedin"])