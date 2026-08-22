from typing import Dict, List, Any
from app.tools.discovery_tools import search_available_crew
from app.state import CrewAssemblyState

MIN_CANDIDATES_THRESHOLD = 3

def crew_discovery_agent(state: CrewAssemblyState) -> CrewAssemblyState:
    """
    Retrieves matching crew candidates using pgvector similarity search.
    Implements a self-healing retry/relaxation loop if matching candidates < 3.
    """
    requirements = state.get("event_requirements", {})
    roles_required = requirements.get("roles", [])
    event_type = requirements.get("event_type", "event")
    location = requirements.get("location", "")
    event_date = requirements.get("date")

    event_context = f"{event_type} in {location}"
    candidates_by_role: Dict[str, List[Dict[str, Any]]] = {}
    logs: List[str] = []

    for role_item in roles_required:
        role_name = role_item.get("role")
        needed_count = role_item.get("count", 1)

        # Attempt 1: Strict search (high similarity threshold, exact role matching)
        similarity_threshold = 0.60
        match_count = 10
        
        candidates = search_available_crew(
            role_name=role_name,
            event_context=event_context,
            event_date=event_date,
            match_count=match_count,
            min_similarity=similarity_threshold
        )

        # Agentic Loop: Constraint Relaxation
        attempts = 1
        while len(candidates) < MIN_CANDIDATES_THRESHOLD and attempts < 3:
            attempts += 1
            logs.append(
                f"[Agent 2 Warning] Found only {len(candidates)} candidates for '{role_name}'. "
                f"Relaxing constraints (Attempt {attempts})..."
            )
            
            # Step-down similarity requirements and increase search pool depth
            similarity_threshold -= 0.15
            match_count += 10
            
            candidates = search_available_crew(
                role_name=role_name,
                event_context=event_context,
                event_date=event_date,
                match_count=match_count,
                min_similarity=max(0.20, similarity_threshold)
            )

        candidates_by_role[role_name] = candidates
        logs.append(
            f"[Agent 2 Success] Retrieved {len(candidates)} candidates for '{role_name}' "
            f"(Target quantity: {needed_count})."
        )

    return {
        "candidates": candidates_by_role,
        "discovery_logs": logs
    }