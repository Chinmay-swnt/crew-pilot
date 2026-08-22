from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class EventRequest(BaseModel):
    raw_description: str = Field(
        ...,
        min_length=10,
        description="Natural-language description of the event."
    )


class CrewMemberAssignment(BaseModel):
    crew_member_id: int
    role: str
    agreed_rate: float


class AssemblyResponse(BaseModel):
    event_requirements: Dict[str, Any]
    budget_warning: Optional[str] = None
    discovery_logs: List[str] = Field(default_factory=list)
    primary_crew: List[CrewMemberAssignment] = Field(default_factory=list)
    backup_crew: List[CrewMemberAssignment] = Field(default_factory=list)
    total_cost: float = 0.0
    overall_match_score: float = 0.0
    team_explanation: str = ""