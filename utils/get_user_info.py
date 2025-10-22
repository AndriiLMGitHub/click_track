from fastapi import Request
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
    url = f"http://ip-api.com/json/{ip}?fields=status,country,regionName,city"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=3) as response:
                data = await response.json()
                if data.get("status") == "success":
                    return {
                        "country": data.get("country"),
                        "region": data.get("regionName"),
                        "city": data.get("city"),
                    }
    except Exception:
        pass
    return {"country": None, "region": None, "city": None}
