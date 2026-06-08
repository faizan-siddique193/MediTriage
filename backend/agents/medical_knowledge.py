"""Design Pattern: RAG"""

from __future__ import annotations

import logging
import os
from functools import lru_cache
from pathlib import Path
from typing import Any

from dotenv import dotenv_values, load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

from agents._utils import parse_json_object
from groq_client import chat_async
from models import Condition, MedicalKnowledgeOutput

logger = logging.getLogger(__name__)

DESIGN_PATTERN = "RAG"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
TOP_K = 3
BACKEND_ROOT = Path(__file__).resolve().parents[1]


def _clean_env(value: str | None) -> str:
    return (value or "").strip().strip('"').strip("'")


def _pinecone_config() -> tuple[str, str]:
    env_path = BACKEND_ROOT / ".env"
    load_dotenv(env_path, override=True)
    values = dotenv_values(env_path)
    api_key = _clean_env(values.get("PINECONE_API_KEY") or os.getenv("PINECONE_API_KEY"))
    index_name = _clean_env(values.get("PINECONE_INDEX_NAME") or os.getenv("PINECONE_INDEX_NAME")) or "meditriage-index"
    return api_key, index_name


@lru_cache(maxsize=1)
def _embedding_model() -> SentenceTransformer:
    return SentenceTransformer(EMBEDDING_MODEL)


def _query_pinecone(symptoms_text: str) -> tuple[list[str], list[str]]:
    api_key, index_name = _pinecone_config()
    if not api_key:
        logger.warning("PINECONE_API_KEY missing; RAG context empty")
        return [], []

    model = _embedding_model()
    vector = model.encode(symptoms_text, convert_to_numpy=True).tolist()

    pc = Pinecone(api_key=api_key)
    index = pc.Index(index_name)
    results = index.query(vector=vector, top_k=TOP_K, include_metadata=True)

    chunks: list[str] = []
    ids: list[str] = []
    for match in results.get("matches") or []:
        metadata = match.get("metadata") or {}
        text = metadata.get("text", "")
        if text:
            chunks.append(text)
            ids.append(match.get("id", ""))
    return chunks, ids


async def retrieve_medical_knowledge(symptoms_text: str) -> dict[str, Any]:
    """
    Embed symptoms, query Pinecone, synthesize conditions JSON for
    TriageState['medical_knowledge']. Uses response_format json_object.
    """
    rag_chunks, rag_ids = _query_pinecone(symptoms_text)
    context = "\n\n---\n\n".join(rag_chunks) if rag_chunks else "No local knowledge base matches found."

    prompt = f"""
You are a medical knowledge agent using Retrieval-Augmented Generation (RAG).

Retrieved knowledge base excerpts:
{context}

Patient symptoms: {symptoms_text}

Using ONLY the retrieved context plus general medical reasoning, return:
- Top 3 matching conditions with brief explanations
- The most appropriate specialist type to see (e.g. Cardiologist, General Physician)

Respond ONLY with valid JSON:
{{
  "conditions": [
    {{ "condition": "Name", "explanation": "Why it matches" }}
  ],
  "specialist": "Specialist type",
  "rag_sources": ["short source label 1", "short source label 2"]
}}
"""
    response_text = await chat_async(prompt, json_mode=True)
    data = parse_json_object(response_text)
    data.setdefault("rag_sources", rag_ids or [f"pinecone:{i}" for i in rag_ids if i])

    output = MedicalKnowledgeOutput.model_validate(
        {
            "conditions": data.get("conditions", []),
            "specialist": data.get("specialist", "General Physician"),
            "rag_sources": data.get("rag_sources", rag_ids),
        }
    )

    payload = output.model_dump()
    payload["design_pattern"] = DESIGN_PATTERN
    payload["retrieved_chunks"] = rag_chunks
    return payload


# Backward-compatible alias used before Step 3 refactor
async def retrieve_conditions(symptoms_text: str) -> list[Condition]:
    knowledge = await retrieve_medical_knowledge(symptoms_text)
    return [Condition(**item) for item in knowledge.get("conditions", [])]
