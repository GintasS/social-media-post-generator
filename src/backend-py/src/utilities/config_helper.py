import json
from pathlib import Path

import os

CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(os.path.dirname(CONFIG_DIR), "static", "config.json")


def load_config():
    """Load config from JSON file.

    Returns:
        dict: The loaded config.
    """
    with open(CONFIG_FILE, "r") as f:
        return json.load(f)


def save_config(data: dict):
    """Save config to JSON file.

    Args:
        data (dict): The data to save to the config file.
    """
    with open(CONFIG_FILE, "w") as f:
        json.dump(data, f, indent=2)
