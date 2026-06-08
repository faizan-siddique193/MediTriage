import csv
import os

import chromadb
from chromadb.utils import embedding_functions


def _normalize(value: str) -> str:
    return value.strip().replace("_", " ")


def _load_csv(path: str) -> list[dict[str, str]]:
    with open(path, "r", encoding="utf-8", newline="") as file:
        return list(csv.DictReader(file))


def _build_documents_from_dataset(data_dir: str) -> tuple[list[str], list[str]]:
    dataset_path = os.path.join(data_dir, "dataset.csv")
    description_path = os.path.join(data_dir, "symptom_Description.csv")
    precaution_path = os.path.join(data_dir, "symptom_precaution.csv")
    severity_path = os.path.join(data_dir, "Symptom-severity.csv")

    if not os.path.exists(dataset_path):
        return [], []

    descriptions: dict[str, str] = {}
    if os.path.exists(description_path):
        for row in _load_csv(description_path):
            disease = row.get("Disease", "").strip()
            if disease:
                descriptions[disease] = row.get("Description", "").strip()

    precautions: dict[str, list[str]] = {}
    if os.path.exists(precaution_path):
        for row in _load_csv(precaution_path):
            disease = row.get("Disease", "").strip()
            if not disease:
                continue
            values = [
                _normalize(value)
                for key, value in row.items()
                if key.startswith("Precaution_") and value and value.strip()
            ]
            precautions[disease] = values

    symptom_weights: dict[str, str] = {}
    if os.path.exists(severity_path):
        for row in _load_csv(severity_path):
            symptom = row.get("Symptom", "").strip().lower().replace("_", " ")
            if symptom:
                symptom_weights[symptom] = row.get("weight", "").strip()

    disease_symptoms: dict[str, set[str]] = {}
    dataset_rows = _load_csv(dataset_path)
    for row in dataset_rows:
        disease = row.get("Disease", "").strip()
        if not disease:
            continue

        disease_symptoms.setdefault(disease, set())
        for key, value in row.items():
            if key.startswith("Symptom_") and value and value.strip():
                disease_symptoms[disease].add(_normalize(value))

    documents: list[str] = []
    ids: list[str] = []
    for disease in sorted(disease_symptoms.keys()):
        symptoms = sorted(disease_symptoms[disease])
        weighted = []
        for symptom in symptoms:
            weight = symptom_weights.get(symptom.lower())
            if weight:
                weighted.append(f"{symptom} (weight: {weight})")

        description = descriptions.get(disease, "")
        precaution_list = precautions.get(disease, [])

        text = "\n".join(
            [
                f"Condition: {disease}",
                f"Symptoms: {', '.join(symptoms)}",
                f"Description: {description}" if description else "Description: Not available",
                (
                    f"Precautions: {', '.join(precaution_list)}"
                    if precaution_list
                    else "Precautions: Not available"
                ),
                (
                    f"Symptom severity signals: {', '.join(weighted)}"
                    if weighted
                    else "Symptom severity signals: Not available"
                ),
            ]
        )

        documents.append(text)
        ids.append(f"disease_{disease.lower().replace(' ', '_')}")

    return documents, ids


def create_knowledge_base():
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    db_dir = os.path.join(os.path.dirname(__file__), 'chroma_db')
    
    # Initialize chroma client
    client = chromadb.PersistentClient(path=db_dir)
    
    # Use sentence-transformers embedding function
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    
    try:
        client.delete_collection(name="medical_conditions")
    except Exception:
        pass

    collection = client.get_or_create_collection(name="medical_conditions", embedding_function=sentence_transformer_ef)
    
    documents = []
    ids = []

    dataset_docs, dataset_ids = _build_documents_from_dataset(data_dir)
    documents.extend(dataset_docs)
    ids.extend(dataset_ids)
    
    for filename in os.listdir(data_dir):
        if filename.endswith(".txt"):
            filepath = os.path.join(data_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Simple chunking by splitting on double newlines
                chunks = content.split('\n\n')
                for i, chunk in enumerate(chunks):
                    if chunk.strip():
                        documents.append(chunk.strip())
                        ids.append(f"{filename}_{i}")
    
    if documents:
        collection.upsert(
            documents=documents,
            ids=ids
        )
        print(f"Ingested {len(documents)} document chunks into ChromaDB at {db_dir}")
    else:
        print("No documents found to ingest.")

if __name__ == "__main__":
    create_knowledge_base()
