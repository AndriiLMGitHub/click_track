from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional

# ==================== PYDANTIC МОДЕЛІ ====================


class ClickCreate(BaseModel):
    """Модель для створення нового запису кліку"""
    ip: Optional[str] = None
    uuid_link: str
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None


class ClickResponse(BaseModel):
    """Модель відповіді з інформацією про кліки"""
    id: int
    ip: Optional[str]
    uuid_link: str
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    zip: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    timezone: Optional[str] = None
    isp: Optional[str] = None
    org: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    total_clicks: Optional[int]

    model_config = ConfigDict(from_attributes=True)


class ClickResponseValidate(BaseModel):
    """Модель відповіді з інформацією про кліки з валідацією"""
    message: str
    data: ClickResponse
