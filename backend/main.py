from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from core.geolocation import extract_client_ip
from models import TriageRequest, TriageResponse
from orchestrator import run_triage

app = FastAPI(title="AI-Powered Medical Symptom Triage System")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/agents")
def list_agents():
    return [
        {"name": "Symptom Analyzer", "pattern": "ReAct", "role": "Breaks symptoms into structured medical attributes"},
        {"name": "Medical Knowledge", "pattern": "RAG", "role": "Retrieves possible conditions from local knowledge base"},
        {"name": "Risk Assessor", "pattern": "Chain-of-Thought", "role": "Evaluates urgency with step-by-step justification"},
        {"name": "Doctor Finder", "pattern": "Tool Use", "role": "Searches Tavily for hospitals near the patient"},
        {"name": "Orchestrator", "pattern": "Planner", "role": "Synthesizes all agent outputs into the final triage report"},
    ]

@app.post("/triage", response_model=TriageResponse)
async def triage(request: TriageRequest, http_request: Request):
    client_ip = extract_client_ip(http_request)
    if client_ip:
        request = request.model_copy(update={"client_ip": client_ip})
    return await run_triage(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
