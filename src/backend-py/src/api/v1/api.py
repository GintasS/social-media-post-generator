from fastapi import APIRouter
from .endpoints import posts
from .endpoints import products
from .endpoints import platforms

api_router = APIRouter()
api_router.include_router(posts.router, prefix="/posts")
api_router.include_router(products.router, prefix="/products")
api_router.include_router(platforms.router, prefix="/platforms")