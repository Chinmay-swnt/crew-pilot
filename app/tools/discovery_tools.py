from app.core.config import get_embeddings
from app.db.supabase import CrewRepository
from typing import List, Dict, Any

def generate_embedding(text: str) -> List[float]:
    embeddings = get_embeddings()
    return embeddings.embed_query(text)

def search_available_crew(
    role_name: str,
    event_context: str,
    event_date: str = None,
    match_count: int = 10,
    min_similarity: float = 0.50
) -> List[Dict[str, Any]]:
    repo = CrewRepository()
    search_prompt = f"Role: {role_name}. Context: {event_context}"
    query_vector = generate_embedding(search_prompt)

    raw_results = repo.match_crew_by_vector(
        embedding=query_vector,
        role_name=role_name,
        match_count=match_count
    )

    valid_candidates = []
    for candidate in raw_results:
        if candidate.get("similarity", 0) < min_similarity:
            continue

        crew_id = candidate["id"]
        if event_date and not repo.check_availability(crew_id, event_date):
            continue

        valid_candidates.append(candidate)

    return valid_candidates