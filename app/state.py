from typing import TypedDict, Optional, List, Dict, Any

class CrewAssemblyState(TypedDict, total=False):
    # Input
    raw_description: str
    
    # Agent 1 output (Event Intent)
    event_requirements: Optional[Dict[str, Any]]
    budget_warning: Optional[str]
    
    # Agent 2 output (Crew Discovery)
    candidates: Optional[Dict[str, List[Dict[str, Any]]]]  # role -> candidates
    discovery_logs: Optional[List[str]]
    
    # Agent 3 output (Review Intelligence)
    review_scores: Optional[Dict[str, Dict[str, Any]]]    # candidate_id -> analysis
    
    # Agent 4 output (Team Assembly)
    primary_crew: Optional[List[Dict[str, Any]]]
    backup_crew: Optional[List[Dict[str, Any]]]
    team_explanation: Optional[str]
    total_cost: Optional[float]
    overall_match_score: Optional[float]