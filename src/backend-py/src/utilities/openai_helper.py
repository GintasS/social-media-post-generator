import os
import json

from openai import AsyncOpenAI
from src.schemas.openai_settings import OpenAISettings

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def get_response_from_openai(prompt: str, openai_settings: OpenAISettings) -> list:
    """Get a response from the OpenAI API.

    Args:
        prompt (str): The prompt to send to the OpenAI API.
        openai_settings (OpenAISettings): The OpenAI settings to use.

    Returns:
        list: The API response.
    """

    tools = [{ "type": "web_search_preview" }] if openai_settings.web_search else []
    response = await client.responses.create(
        model=openai_settings.model_name,
        temperature=openai_settings.temperature,
        tools=tools,
        input=prompt,
    )
    content = response.output[0].content[0].text
    if content:
        return json.loads(content)["posts"]

    return []