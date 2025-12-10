from fastapi import APIRouter, HTTPException
import os
import json as _json

router = APIRouter(tags=["Products v1"])

products_base_dir = os.path.dirname(os.path.abspath(__file__))
products_json_path = os.path.join(products_base_dir, "..", "..", "..", "static", "product.json")

@router.get("/default-product")
async def get_default_product():
    """Get the default product for the social media post generator.

    Raises:
        HTTPException: If there is an error getting the default product.

    Returns:
        dict: The default product.
    """


    try:
        with open(products_json_path, encoding="utf-8") as f:
            product_data = f.read()
        
        return _json.loads(product_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error getting default product.")