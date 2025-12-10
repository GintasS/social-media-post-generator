from pydantic import BaseModel, Field
from typing import Optional
from src.schemas.openai_settings import OpenAISettings
from src.schemas.generate_options import GenerateOptions

class SocialMediaPost(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=400)
    price: float = Field(..., ge=0)
    category: Optional[str] = Field(default=None, max_length=100)
    generate_options: GenerateOptions = Field(default=GenerateOptions(number_of_posts=3, platforms=["twitter", "instagram", "linkedin"]))
    openai_settings: OpenAISettings = Field(default=OpenAISettings(model_name="gpt-5.1", temperature=0.7))
