from typing import Any, Dict, List, Optional

from app.core.config import get_embeddings
from app.db.supabase import CrewRepository


def _safe_float(
    value: Any,
    default: float = 0.0,
) -> float:
    """
    Safely convert an arbitrary value to float.
    """
    if value is None:
        return default

    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def generate_embedding(text: str) -> List[float]:
    """
    Generate an embedding for the search query.
    """
    embeddings = get_embeddings()
    return embeddings.embed_query(text)


def search_available_crew(
    role_name: str,
    event_context: str,
    event_date: Optional[str] = None,
    match_count: int = 10,
    min_similarity: float = 0.50,
) -> List[Dict[str, Any]]:
    """
    Search for crew members matching the requested role and
    event context, then filter by similarity and availability.
    """

    repo = CrewRepository()

    search_prompt = (
        f"Role: {role_name}. "
        f"Context: {event_context}"
    )

    query_vector = generate_embedding(
        search_prompt
    )

    raw_results = repo.match_crew_by_vector(
        embedding=query_vector,
        role_name=role_name,
        match_count=match_count,
    )

    valid_candidates: List[
        Dict[str, Any]
    ] = []

    # Be defensive in case the database function
    # returns None instead of a list.
    if not raw_results:
        return valid_candidates

    # Normalize the threshold too.
    safe_min_similarity = _safe_float(
        min_similarity,
        0.50,
    )

    for candidate in raw_results:
        if not isinstance(candidate, dict):
            continue

        # IMPORTANT:
        # candidate.get("similarity", 0) can still return None
        # when the key exists with a None value.
        similarity = _safe_float(
            candidate.get("similarity"),
            0.0,
        )

        # Store the normalized value so downstream
        # agents don't receive None again.
        candidate["similarity"] = similarity

        if similarity < safe_min_similarity:
            continue

        crew_id = candidate.get("id")

        if crew_id is None:
            continue

        if (
            event_date
            and not repo.check_availability(
                crew_id,
                event_date,
            )
        ):
            continue

        valid_candidates.append(
            candidate
        )

    return valid_candidates