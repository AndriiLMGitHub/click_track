"""_summary_
    Main routes for click tracking API.

"""
from services.clicks import add_click, create_click, get_all_clicks, get_click_by_ip, get_click_by_id, get_click_by_uuid, update_last_click, delete_click
from utils.get_user_info import get_client_ip, get_geolocation
from schemas.click_shemas import ClickResponse
from dependencies.db_deps import get_db
from uuid import uuid4
from fastapi import Request, HTTPException, Depends, APIRouter
from fastapi.responses import RedirectResponse
from sqlalchemy import delete, select

from models.clicks import Click
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies.db_deps import get_db
from schemas.click_shemas import ClickResponse
from utils.get_user_info import get_client_ip, get_geolocation


router = APIRouter(
    prefix="/api/click",
    tags=["Click Tracking"],
)


@router.get("/stats", response_model=list[ClickResponse])
async def stats(db=Depends(get_db)):
    clicks = await get_all_clicks(db)
    return [ClickResponse.model_validate(click) for click in clicks]


@router.post("/", response_model=ClickResponse)
async def register_click(request: Request, db=Depends(get_db)):
    ip = get_client_ip(request)
    existing = await get_click_by_ip(db, ip)

    if existing:
        click = await update_last_click(db, existing)
        return ClickResponse.model_validate(click)

    user_uuid = str(uuid4())
    geo = await get_geolocation(ip)
    click = await create_click(db, ip, user_uuid, geo)
    return ClickResponse.model_validate(click)


@router.delete("/all")
async def delete_all_clicks_endpoint(db: AsyncSession = Depends(get_db)) -> dict:
    # Виконуємо одне SQL-видалення
    result = await db.execute(select(Click))
    count = len(result.scalars().all())

    await db.execute(delete(Click))
    await db.commit()

    return {
        "success": True,
        "message": "All clicks deleted successfully",
        "count_records": count
    }


@router.get("/{id}", response_model=ClickResponse)
async def get_click_endpoint(id: int, db=Depends(get_db)):
    click = await get_click_by_id(db, id)
    if not click:
        raise HTTPException(status_code=404, detail="Click not found")
    return ClickResponse.model_validate(click)


@router.get("/add/{uuid_click}", response_model=ClickResponse)
async def add_click_endpoint(uuid_click: str, request: Request, db=Depends(get_db)):
    click = await get_click_by_uuid(db, uuid_click)
    if not click:
        raise HTTPException(status_code=404, detail="UUID link not found")
    click = await add_click(db, request, click)
    # Замість example.com вставте потрібний URL
    return RedirectResponse(url="https://google.com", status_code=302)


@router.delete("/{id}")
async def delete_click_endpoint(id: int, db=Depends(get_db)):
    click = await get_click_by_id(db, id)
    if not click:
        raise HTTPException(status_code=404, detail="Click not found")
    return await delete_click(db, click, id)
