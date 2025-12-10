from dotenv import load_dotenv

load_dotenv()

import os

from fastapi import FastAPI, Request
from src.api.v1.api import api_router as api_router_v1
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Social Media Post Generator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router_v1, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 3001))

    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=True)
