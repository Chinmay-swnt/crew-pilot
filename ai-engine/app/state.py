from typing import TypedDict, Optional, List, Dict, Any


class CrewAssemblyState(TypedDict, total=False):

    # Input
    raw_description: str

    # AI progress shown to frontend
    progress: List[str]

    # Agent 1 output
    event_requirements: Optional[Dict[str, Any]]
    budget_warning: Optional[str]

    # Agent 2 output
    candidates: Optional[
        Dict[str, List[Dict[str, Any]]]
    ]
    discovery_logs: Optional[List[str]]

    # Agent 3 output
    review_scores: Optional[
        Dict[str, Dict[str, Any]]
    ]

    # Agent 4 output
    primary_crew: Optional[
        List[Dict[str, Any]]
    ]

    backup_crew: Optional[
        List[Dict[str, Any]]
    ]

    team_explanation: Optional[str]

    total_cost: Optional[float]

    overall_match_score: Optional[float]