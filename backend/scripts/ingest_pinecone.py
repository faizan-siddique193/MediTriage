"""
Ingest Kaggle CSV medical data and supplementary text chunks into Pinecone.

Prerequisites (Pinecone console):
  - Index dimension: 384
  - Metric: cosine
  - Embedding model used here: sentence-transformers/all-MiniLM-L6-v2

Environment (backend/.env):
  - PINECONE_API_KEY
  - PINECONE_INDEX_NAME (default: medical-conditions)

Run from the backend directory:
  python -m scripts.ingest_pinecone
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import dotenv_values, load_dotenv
from pinecone import Pinecone
from pinecone.exceptions import UnauthorizedException
from sentence_transformers import SentenceTransformer

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from knowledge_base.ingest import _build_documents_from_dataset

EMBEDDING_MODEL = "all-MiniLM-L6-v2"
EMBEDDING_DIMENSION = 384
DEFAULT_INDEX_NAME = "medical-conditions"
UPSERT_BATCH_SIZE = 100
METADATA_TEXT_MAX_CHARS = 35_000


def _clean_env(value: str | None) -> str:
    if not value:
        return ""
    return value.strip().strip('"').strip("'").strip("\r\n")


def _load_pinecone_config() -> tuple[str, str]:
    env_path = BACKEND_ROOT / ".env"
    load_dotenv(env_path, override=True)
    file_values = dotenv_values(env_path)
    api_key = _clean_env(file_values.get("PINECONE_API_KEY") or os.getenv("PINECONE_API_KEY"))
    index_name = _clean_env(
        file_values.get("PINECONE_INDEX_NAME") or os.getenv("PINECONE_INDEX_NAME")
    ) or DEFAULT_INDEX_NAME
    return api_key, index_name


def _verify_pinecone(api_key: str, index_name: str) -> None:
    pc = Pinecone(api_key=api_key)
    try:
        index_names = [item.name for item in pc.list_indexes()]
    except UnauthorizedException as exc:
        raise ValueError(
            "Pinecone rejected PINECONE_API_KEY (401 Unauthorized). "
            "Create a new API key in the Pinecone console, paste the full pcsk_... value "
            "into backend/.env (no quotes), save the file, then run again."
        ) from exc

    if index_name not in index_names:
        raise ValueError(
            f"Index '{index_name}' was not found. Available indexes: {index_names}. "
            f"Set PINECONE_INDEX_NAME in backend/.env (e.g. meditriage-index)."
        )


def _data_dir() -> Path:
    return BACKEND_ROOT / "knowledge_base" / "data"


def collect_documents(data_dir: Path) -> tuple[list[str], list[str]]:
    """Build document texts and stable IDs from CSVs and .txt chunks."""
    documents: list[str] = []
    ids: list[str] = []

    dataset_docs, dataset_ids = _build_documents_from_dataset(str(data_dir))
    documents.extend(dataset_docs)
    ids.extend(dataset_ids)

    if not data_dir.is_dir():
        return documents, ids

    for filepath in sorted(data_dir.glob("*.txt")):
        content = filepath.read_text(encoding="utf-8")
        for i, chunk in enumerate(content.split("\n\n")):
            if chunk.strip():
                documents.append(chunk.strip())
                ids.append(f"{filepath.name}_{i}")

    return documents, ids


def embed_documents(model: SentenceTransformer, documents: list[str]) -> list[list[float]]:
    vectors = model.encode(documents, show_progress_bar=True, convert_to_numpy=True)
    return vectors.tolist()


def upsert_batches(index, ids: list[str], embeddings: list[list[float]], documents: list[str]) -> int:
    total = 0
    for start in range(0, len(ids), UPSERT_BATCH_SIZE):
        end = start + UPSERT_BATCH_SIZE
        batch_vectors = []
        for doc_id, values, text in zip(ids[start:end], embeddings[start:end], documents[start:end]):
            batch_vectors.append(
                {
                    "id": doc_id,
                    "values": values,
                    "metadata": {"text": text[:METADATA_TEXT_MAX_CHARS]},
                }
            )
        index.upsert(vectors=batch_vectors)
        total += len(batch_vectors)
    return total


def ingest_pinecone() -> None:
    api_key, index_name = _load_pinecone_config()
    if not api_key:
        raise ValueError("PINECONE_API_KEY is not set in backend/.env")

    print(f"Verifying Pinecone API key and index '{index_name}'...")
    _verify_pinecone(api_key, index_name)

    data_dir = _data_dir()
    documents, ids = collect_documents(data_dir)
    if not documents:
        print(f"No documents found under {data_dir}. Add Kaggle CSVs or .txt files first.")
        return

    print(f"Loaded {len(documents)} document chunks from {data_dir}")

    pc = Pinecone(api_key=api_key)
    index = pc.Index(index_name)

    print(f"Embedding with {EMBEDDING_MODEL} (dimension {EMBEDDING_DIMENSION})...")
    model = SentenceTransformer(EMBEDDING_MODEL)
    embeddings = embed_documents(model, documents)

    if embeddings and len(embeddings[0]) != EMBEDDING_DIMENSION:
        raise ValueError(
            f"Embedding dimension is {len(embeddings[0])}, expected {EMBEDDING_DIMENSION}. "
            "Recreate your Pinecone index with dimension 384 and metric cosine."
        )

    print(f"Upserting into Pinecone index '{index_name}'...")
    upserted = upsert_batches(index, ids, embeddings, documents)
    stats = index.describe_index_stats()
    print(f"Upserted {upserted} vectors. Index stats: {stats}")


if __name__ == "__main__":
    ingest_pinecone()
