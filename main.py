from fastapi import FastAPI, Request
from app.api import recipes 
from app.api import routes
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from fastapi.middleware.cors import CORSMiddleware
import os

# Initialize FastAPI app
app = FastAPI()

app.include_router(recipes.router)
app.include_router(routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Mount static files directory
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")