from fastapi import Request, HTTPException
import aiohttp

# ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================


def get_client_ip(request: Request) -> str:
    """
    Отримує реальну IP-адресу клієнта
    Враховує проксі-сервери (X-Forwarded-For header)
    """
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host


async def get_geolocation(ip: str) -> dict[str, str | None]:
    url = f"http://ip-api.com/json/{ip}?fields=status,country,regionName,city,zip,lat,lon,timezone,isp,org"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=3) as response:
                data = await response.json()
                if data.get("status") == "success":
                    return {
                        "country": data.get("country"),
                        "region": data.get("regionName"),
                        "city": data.get("city"),
                        "zip": data.get("zip"),
                        "lat": data.get("lat"),
                        "lon": data.get("lon"),
                        "timezone": data.get("timezone"),
                        "isp": data.get("isp"),
                        "org": data.get("org"),
                    }
    except Exception:
        raise HTTPException(
            status_code=500, detail="Error fetching geolocation data"
        )
    return {
        "country": None,
        "region": None,
        "city": None,
        "zip": None,
        "lat": None,
        "lon": None,
        "timezone": None,
        "isp": None,
        "org": None
    }
