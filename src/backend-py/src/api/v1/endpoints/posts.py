from datetime import datetime
import os

from fastapi import APIRouter
from src.schemas.post import SocialMediaPost
from src.utilities.prompt_helper import generate_social_media_posts

router = APIRouter(tags=["Posts v1"])

@router.post("/")
async def generate_posts(request: SocialMediaPost):
    """Generate social media posts for a given product.

    Args:
        request (SocialMediaPost): The product to generate posts for.

    Returns:
        dict: The generated posts.
    """

    posts = []
    isError = False
    try:
        posts = await generate_social_media_posts(request)

    except Exception as e:
        print("Exception in generate_posts: ", e)
        posts = []
        isError = True
    finally:
        return {
            "posts": posts,
            "generated_at": datetime.now().isoformat(),
            "count": len(posts),
            "isError": isError
        }
