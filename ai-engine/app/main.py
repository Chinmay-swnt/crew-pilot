from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import traceback

from app.graph import crew_graph
from app.schemas.api import AssemblyResponse, EventRequest


app = FastAPI(
    title="Crew Assembly Multi-Agent AI API",
    version="1.0.0",
    description=(
        "Multi-agent orchestration pipeline using Gemini, "
        "LangGraph, pgvector, and Supabase."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "Crew Assembly AI Agent System",
    }


@app.post(
    "/api/v1/assemble-crew",
    response_model=AssemblyResponse,
)
async def assemble_crew(request: EventRequest):
    try:
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
            "overall_match_score": 0.0,
        }

        final_state = crew_graph.invoke(initial_state)

        return AssemblyResponse(
            event_requirements=final_state.get(
                "event_requirements",
                {}
            ),
            budget_warning=final_state.get(
                "budget_warning"
            ),
            discovery_logs=final_state.get(
                "discovery_logs",
                []
            ),
            primary_crew=final_state.get(
                "primary_crew",
                []
            ),
            backup_crew=final_state.get(
                "backup_crew",
                []
            ),
            total_cost=final_state.get(
                "total_cost",
                0.0
            ),
            overall_match_score=final_state.get(
                "overall_match_score",
                0.0
            ),
            team_explanation=final_state.get(
                "team_explanation",
                ""
            ),
        )

    except Exception as exc:
        print("\n" + "=" * 80)
        print("CREWPILOT AI ENGINE ERROR")
        print("=" * 80)
        traceback.print_exc()
        print("=" * 80 + "\n")

        raise HTTPException(
            status_code=500,
            detail=f"{type(exc).__name__}: {exc}",
        ) from exc