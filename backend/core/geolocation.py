"""
IP geolocation fallback when the user leaves city or country blank.

Uses the free IP-API service (no API key): http://ip-api.com/json/{ip}
"""

from __future__ import annotations

import ipaddress
import logging
from typing import NamedTuple

import httpx
from fastapi import Request

logger = logging.getLogger(__name__)

IP_API_URL = "http://ip-api.com/json/{ip}"
IP_API_FIELDS = "status,message,country,city,query"
DEFAULT_FALLBACK = "Not specified"
REQUEST_TIMEOUT_SECONDS = 5.0


class ResolvedLocation(NamedTuple):
    city: str
    country: str
    location_string: str
    source: str  # "user" | "ip-api" | "default"


def _is_blank(value: str | None) -> bool:
    return not (value or "").strip()


def _format_location_string(city: str, country: str) -> str:
    city = city.strip()
    country = country.strip()
    if city and country and city != DEFAULT_FALLBACK and country != DEFAULT_FALLBACK:
        return f"{city}, {country}"
    if city and city != DEFAULT_FALLBACK:
        return city
    if country and country != DEFAULT_FALLBACK:
        return country
    return DEFAULT_FALLBACK


def extract_client_ip(request: Request) -> str | None:
    """Return the most likely client IP, preferring proxy headers."""
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        for candidate in forwarded_for.split(","):
            ip = candidate.strip()
            if ip:
                return ip

    for header_name in ("x-real-ip", "cf-connecting-ip", "true-client-ip", "forwarded"):
        header_value = request.headers.get(header_name, "").strip()
        if not header_value:
            continue
        if header_name == "forwarded":
            for item in header_value.split(";"):
                if item.lower().startswith("for="):
                    ip = item.split("=", 1)[1].strip().strip('"')
                    if ip:
                        return ip
            continue
        return header_value

    if request.client and request.client.host:
        return request.client.host
    return None


def _is_public_ip(ip: str) -> bool:
    try:
        address = ipaddress.ip_address(ip.strip())
    except ValueError:
        return False
    return not (
        address.is_private
        or address.is_loopback
        or address.is_link_local
        or address.is_reserved
    )


async def fetch_location_from_ip(ip: str) -> dict[str, str] | None:
    """Query IP-API for city/country. Returns None on failure or non-public IPs."""
    if not _is_public_ip(ip):
        logger.debug("Skipping geolocation for non-public IP: %s", ip)
        return None

    url = IP_API_URL.format(ip=ip.strip())
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.get(url, params={"fields": IP_API_FIELDS})
            response.raise_for_status()
            data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        logger.warning("IP-API request failed for %s: %s", ip, exc)
        return None

    if data.get("status") != "success":
        logger.warning("IP-API returned non-success for %s: %s", ip, data.get("message"))
        return None

    city = (data.get("city") or "").strip()
    country = (data.get("country") or "").strip()
    if not city and not country:
        return None

    return {"city": city, "country": country, "query": data.get("query", ip)}


async def resolve_location(
    city: str = "",
    country: str = "",
    client_ip: str | None = None,
) -> ResolvedLocation:
    """
    Resolve city, country, and a display location_string.

    - If both city and country are provided, use them as-is.
    - If either is blank and client_ip is a public IP, call IP-API.
    - Otherwise fall back to "Not specified".
    """
    city = (city or "").strip()
    country = (country or "").strip()

    if not _is_blank(city) and not _is_blank(country):
        return ResolvedLocation(
            city=city,
            country=country,
            location_string=_format_location_string(city, country),
            source="user",
        )

    if client_ip:
        geo = await fetch_location_from_ip(client_ip)
        if geo:
            resolved_city = city or geo.get("city", "") or DEFAULT_FALLBACK
            resolved_country = country if not _is_blank(country) else geo.get("country", DEFAULT_FALLBACK)
            if _is_blank(resolved_city) and _is_blank(resolved_country):
                resolved_country = DEFAULT_FALLBACK
            return ResolvedLocation(
                city=resolved_city,
                country=resolved_country,
                location_string=_format_location_string(resolved_city, resolved_country),
                source="ip-api",
            )

    if _is_blank(city):
        city = DEFAULT_FALLBACK

    return ResolvedLocation(
        city=city,
        country=country or DEFAULT_FALLBACK,
        location_string=_format_location_string(city, country or DEFAULT_FALLBACK),
        source="default",
    )
