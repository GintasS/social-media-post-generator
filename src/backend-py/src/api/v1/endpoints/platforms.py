from fastapi import APIRouter, HTTPException
from src.utilities.config_helper import load_config, save_config
from src.schemas.platform import Platform

router = APIRouter(tags=["Platforms v1"])

@router.get("/")
async def get_platforms():
    """Get available platforms for social media posts.

    Returns:
        dict: The available platforms.
    """

    config = load_config()
    platforms = config.get("platforms", {})

    return {
        "platforms": list(platforms.keys()),
        "details": platforms
    }


@router.post("/")
async def create_platform(platform: Platform):
    """Add a new platform if it doesn't already exist.

    Args:
        platform (Platform): The platform to add.

    Raises:
        HTTPException: If the platform name is not valid.
        HTTPException: If the platform already exists.

    Returns:
        dict: The added platform.
    """
    config = load_config()
    platforms = config.get("platforms", {})
    if not platform.name.isascii() or not platform.name.isalpha():
        raise HTTPException(status_code=400, detail="Platform name must contain only English letters")
    if platform.name.lower() in platforms:
        raise HTTPException(status_code=409, detail=f"Platform '{platform.name}' already exists")
    platforms[platform.name.lower()] = {
        "maxLength": platform.max_length,
        "hashtagLimit": platform.hashtag_limit,
        "name": platform.display_name
    }
    save_config(config)

    return {
        "message": f"Platform '{platform.name}' added successfully",
        "platform": {
            "name": platform.name.lower(),
            "maxLength": platform.max_length,
            "hashtagLimit": platform.hashtag_limit,
            "displayName": platform.display_name
        }
    }

