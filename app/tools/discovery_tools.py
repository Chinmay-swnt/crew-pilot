from app.core.config import settings, get_embeddings
from app.db.supabase import CrewRepository
from typing import List, Dict, Any

repo = CrewRepository()

def generate_embedding(text: str) -> List[float]:
    """Generates a 768-dim vector embedding using Gemini text-embedding-004."""
    embeddings = get_embeddings()
    return embeddings.embed_query(text)

def search_available_crew(
    role_name: str,
    event_context: str,
    event_date: str = None,
    match_count: int = 10,
    min_similarity: float = 0.50
) -> List[Dict[str, Any]]:
    """
    Generates embedding for the role/context, performs pgvector cosine similarity search,
    and filters out unavailable crew members based on the availability table.
    """
    search_prompt = f"Role: {role_name}. Context: {event_context}"
    query_vector = generate_embedding(search_prompt)

    # RPC Call to Supabase pgvector function
    raw_results = repo.match_crew_by_vector(
        embedding=query_vector,
        role_name=role_name,
        match_count=match_count
    )

    valid_candidates = []
    for candidate in raw_results:
        # Check similarity threshold
        if candidate.get("similarity", 0) < min_similarity:
            continue

        # Check availability on date
        crew_id = candidate["id"]
        if event_date and not repo.check_availability(crew_id, event_date):
            continue

        valid_candidates.append(candidate)

    return valid_candidates