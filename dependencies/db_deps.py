from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from models.clicks import Base  # 🔹 Імпортуємо Base з models.py
import os

# URL бази даних (SQLite з aiosqlite)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./clicks.db")

# Створюємо асинхронний engine
engine = create_async_engine(DATABASE_URL)  # <- echo=True, future=True

# Сесія для роботи з БД
async_session = sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

# Ініціалізація таблиць


async def init_db():
    async with engine.begin() as conn:
        print("🔹 Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Tables ready.")

# Dependency для FastAPI


async def get_db():
    async with async_session() as session:
        yield session
