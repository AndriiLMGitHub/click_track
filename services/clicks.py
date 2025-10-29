from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.clicks import Click
from datetime import datetime

from utils.get_user_info import get_client_ip, get_geolocation


async def get_click_by_ip(db: AsyncSession, ip: str):
    result = await db.execute(select(Click).where(Click.ip == ip))
    return result.scalar_one_or_none()


async def get_click_by_id(db: AsyncSession, id: int):
    result = await db.execute(select(Click).where(Click.id == id))
    return result.scalar_one_or_none()


async def get_click_by_uuid(db: AsyncSession, uuid_link: str):
    result = await db.execute(select(Click).where(Click.uuid_link == uuid_link))
    return result.scalar_one_or_none()


async def create_click(db: AsyncSession, ip: str | None, uuid_link: str, geo: dict):
    now = datetime.utcnow()
    click = Click(
        ip=None,  # 🔹 залишаємо поле IP порожнім
        uuid_link=uuid_link,
        country=geo["country"],
        region=geo["region"],
        city=geo["city"],
        created_at=now,
        updated_at=now,
        total_clicks=0,
    )
    db.add(click)
    await db.commit()
    await db.refresh(click)
    return click


async def add_click(db: AsyncSession, request: Request, click: Click, ):
    ip = get_client_ip(request)
    geo = await get_geolocation(ip)
    click.country = geo["country"]
    click.region = geo["region"]
    click.city = geo["city"]
    click.total_clicks += 1
    click.ip = ip
    click.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(click)
    return click


async def update_last_click(db: AsyncSession, click: Click):
    click.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(click)
    return click


async def get_all_clicks(db: AsyncSession):
    result = await db.execute(select(Click))
    return result.scalars().all()


async def delete_click(db: AsyncSession, click: Click, id: int):
    await db.delete(click)
    await db.commit()
    return {"detail": "Click deleted successfully"}
