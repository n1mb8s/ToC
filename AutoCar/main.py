from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from Backend.api import (brands_router,models_router)
from Backend.config.cons import PROJECT_NAME, VERSION, ENVIRONMENT

app = FastAPI(title=PROJECT_NAME, version=VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(brands_router, tags=["brands"])
app.include_router(models_router, tags=["models"])

if ENVIRONMENT == "production":
    app.mount("/assets", StaticFiles(directory="src/static/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        return FileResponse("src/static/index.html")