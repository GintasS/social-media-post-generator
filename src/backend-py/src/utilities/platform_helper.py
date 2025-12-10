from src.utilities.config_helper import load_config

def add_platform_names_to_prompt(platforms: list[str]) -> str:
    """Add platform names to the prompt.

    Args:
        platforms (list[str]): The platforms to add to the prompt.

    Returns:
        str: The formatted platforms list.
    """

    platforms_list = [platform.lower() for platform in platforms]
    platforms_list_str = ", ".join(platforms_list)
    return platforms_list_str

def add_platform_rules_to_prompt(user_selected_platforms: list[str]) -> str:
    """Add platform rules to the prompt.

    Args:
        user_selected_platforms (list[str]): The platforms to add rules for.

    Returns:
        str: The formatted platform rules.
    """

    config = load_config()
    platforms = config.get("platforms", {})
    platforms_rules_list = []
    for platform, rules in platforms.items():
        if platform not in user_selected_platforms:
            continue

        for rule_name, rule_value in rules.items():

            if rule_name == "name":
                continue
            full_rule = "{0}: {1}".format(rule_name, rule_value)
            print(full_rule)
            platforms_rules_list.append("For {0} platform, post rule is: {1} \n".format(platform, full_rule))
    
    print(platforms_rules_list)
    return "\n".join(platforms_rules_list)
