"""
FastAPI Backend для трекінгу кліків
Документація: Основний файл серверу з API endpoints
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.click_routes import router as click_router

from dependencies.db_deps import init_db

load_dotenv()  # Завантаження змінних оточення з .env файлу

BASE_URL = os.getenv("BASE_URL")
DATABASE_URL = os.getenv("DATABASE_URL")

# ==================== LIFESPAN (старт/завершення) ====================


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Асинхронний менеджер життєвого циклу додатку"""
    print("🚀 App starting...")
    await init_db()
    print("✅ Database initialized")
    yield
    print("🛑 App shutting down...")


# ==================== FASTAPI ДОДАТОК ====================

app = FastAPI(
    lifespan=lifespan,
    title="Click Tracker API",
    description="API для відстеження IP-адрес та кліків",
    version="1.0.0",
)

# CORS конфігурація (дозволяє запити з фронтенду)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # У продакшені вкажіть конкретний домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==================== ІМПОРТ РОУТЕРІВ ====================

app.include_router(click_router)

# Підключаємо React build
client_path = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "client/dist"))

# Статичні файли (JS, CSS)
app.mount("/static", StaticFiles(directory=client_path), name="static")


@app.get("/", include_in_schema=False)
async def root():
    return FileResponse(os.path.join(client_path, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0",
                port=os.getenv("PORT"), reload=True)
