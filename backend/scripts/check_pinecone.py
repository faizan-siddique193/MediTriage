"""Quick Pinecone auth check. Run: python -m scripts.check_pinecone"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

BACKEND_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_ROOT / ".env")


def _clean(value: str | None) -> str:
    if not value:
        return ""
    return value.strip().strip('"').strip("'")


def main() -> None:
    key = _clean(os.getenv("PINECONE_API_KEY"))
    index_name = _clean(os.getenv("PINECONE_INDEX_NAME")) or "meditriage-index"

    if not key:
        print("PINECONE_API_KEY is missing in backend/.env")
        sys.exit(1)

    print(f"Key length: {len(key)} (expect ~70+ for pcsk_ keys)")
    print(f"Target index: {index_name}")

    from pinecone import Pinecone
    from pinecone.exceptions import UnauthorizedException

    try:
        pc = Pinecone(api_key=key)
        indexes = [i.name for i in pc.list_indexes()]
    except UnauthorizedException:
        print(
            "\n401 Invalid API Key - fix backend/.env:\n"
            "  1. Pinecone console -> API Keys -> Create key\n"
            "  2. PINECONE_API_KEY=pcsk_... (full key, no quotes, save file)\n"
            "  3. python -m scripts.check_pinecone\n"
        )
        sys.exit(1)
    except Exception as exc:
        print(f"\nConnection error ({type(exc).__name__}): {exc}")
        sys.exit(1)

    print(f"Auth OK. Indexes in account: {indexes}")
    if index_name not in indexes:
        print(f"WARNING: '{index_name}' not found. Update PINECONE_INDEX_NAME in .env")
        sys.exit(1)

    stats = pc.Index(index_name).describe_index_stats()
    print(f"Index '{index_name}' stats: {stats}")


if __name__ == "__main__":
    main()
