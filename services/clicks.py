from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.clicks import Click
from datetime import datetime

from utils.get_user_info import get_client_ip, get_geolocation


async def get_click_by_id(db: AsyncSession, click_id: int):
    result = await db.execute(
        select(Click).where(
            (Click.id == click_id) & (Click.ip.is_not(None))
        )
    )
    return result.scalar_one_or_none()


async def get_click_by_uuid(db: AsyncSession, uuid_link: str):
    result = await db.execute(select(Click).where(Click.uuid_link == uuid_link))
    return result.scalar_one_or_none()


async def create_click(db: AsyncSession, uuid_link: str, **extra_kwargs):
    now = datetime.utcnow()
    click = Click(
        ip=None,  # 🔹 залишаємо поле IP порожнім
        uuid_link=uuid_link,
        created_at=now,
        updated_at=now,
        total_clicks=0,
        **extra_kwargs
    )
    db.add(click)
    await db.commit()
    await db.refresh(click)
    return click


async def add_click(db: AsyncSession, request: Request, click: Click, ):
    ip = get_client_ip(request)
    geo = await get_geolocation(ip)
    click.ip = ip
    click.country = geo["country"]
    click.region = geo["region"]
    click.city = geo["city"]
    click.zip = geo.get("zip")
    click.lat = geo.get("lat")
    click.lon = geo.get("lon")
    click.timezone = geo.get("timezone")
    click.isp = geo.get("isp")
    click.org = geo.get("org")
    click.total_clicks += 1
    click.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(click)
    return click


async def update_last_click(db: AsyncSession, click: Click, ip: str = None):
    click.updated_at = datetime.utcnow()
    click.total_clicks += 1  # збільшуємо лічильник

    # Якщо IP ще немає, оновлюємо
    if ip and not click.ip:
        click.ip = ip

    db.add(click)          # додати об’єкт у сесію
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
