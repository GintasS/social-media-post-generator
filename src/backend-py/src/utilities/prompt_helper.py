from pathlib import Path

from src.utilities.openai_helper import get_response_from_openai
from src.schemas.post import SocialMediaPost
from src.utilities.config_helper import load_config
from src.utilities.platform_helper import add_platform_names_to_prompt, add_platform_rules_to_prompt

platforms = load_config().get("platforms", {})

PROMPT_FILE = Path(__file__).parent.parent / "static" / "default_prompt.txt"

async def generate_social_media_posts(post: SocialMediaPost) -> list:
    """Generate social media posts for a given product.

    Args:
        post (SocialMediaPost): The product to generate posts for.

    Returns:
        list: The generated posts.
    """


    prompt = build_prompt(post)
    posts = await get_response_from_openai(prompt, post.openai_settings)

    return posts

def build_prompt(post: SocialMediaPost) -> str:
    """Build the prompt for the social media post generator.

    Args:
        post (SocialMediaPost): The product to generate posts for.

    Returns:
        str: Formatted prompt
    """

    template = PROMPT_FILE.read_text()
    user_selected_platforms = add_platform_names_to_prompt(post.generate_options.platforms)

    formatted_prompt = template.format(
        post.generate_options.number_of_posts, post.name, post.description, post.price, post.category,
        user_selected_platforms,
        add_platform_rules_to_prompt(user_selected_platforms)
    )

    return formatted_prompt
