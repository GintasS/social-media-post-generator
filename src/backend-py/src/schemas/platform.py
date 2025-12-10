from typing import Optional
from pydantic import BaseModel, Field

class Platform(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    max_length: int = Field(..., gt=0)
    hashtag_limit: int = Field(..., ge=0)
    display_name: str = Field(..., min_length=1, max_length=100)