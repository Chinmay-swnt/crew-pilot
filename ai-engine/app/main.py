from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from app.graph import crew_graph

app = FastAPI(
    title="Crew Assembly Multi-Agent AI API",
    version="1.0.0",
    description="Multi-agent orchestration pipeline using Gemini, pgvector, and Supabase."
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EventRequest(BaseModel):
    raw_description: str = Field(
        ..., 
        example="We need 3 sound engineers, 2 stage managers, and 1 lighting tech for a 500-person music concert in Mumbai on 2026-11-15. Total budget is ₹2,500,000."
    )

class CrewMemberAssignment(BaseModel):
    crew_member_id: int
    role: str
    agreed_rate: float

class AssemblyResponse(BaseModel):
    event_requirements: Dict[str, Any]
    budget_warning: Optional[str] = None
    discovery_logs: List[str]
    primary_crew: List[CrewMemberAssignment]
    backup_crew: List[CrewMemberAssignment]
    total_cost: float
    overall_match_score: float
    team_explanation: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Crew Assembly AI Agent System"}

@app.post("/api/v1/assemble-crew", response_model=AssemblyResponse)
async def assemble_crew(request: EventRequest):
    try:
        # Initialize graph execution state
        initial_state = {
            "raw_description": request.raw_description,
            "event_requirements": {},
            "budget_warning": None,
            "candidates": {},
            "discovery_logs": [],
            "review_scores": {},
            "primary_crew": [],
            "backup_crew": [],
            "team_explanation": "",
            "total_cost": 0.0,
            "overall_match_score": 0.0
        }

        # Run the full LangGraph pipeline
        final_state = crew_graph.invoke(initial_state)

        return AssemblyResponse(
            event_requirements=final_state.get("event_requirements", {}),
            budget_warning=final_state.get("budget_warning"),
            discovery_logs=final_state.get("discovery_logs", []),
            primary_crew=final_state.get("primary_crew", []),
            backup_crew=final_state.get("backup_crew", []),
            total_cost=final_state.get("total_cost", 0.0),
            overall_match_score=final_state.get("overall_match_score", 0.0),
            team_explanation=final_state.get("team_explanation", "")
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))