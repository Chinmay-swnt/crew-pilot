from typing import Dict, Any, List
from app.db.supabase import CrewRepository
from app.core.config import get_llm
from app.state import CrewAssemblyState

def review_intel_agent(state: CrewAssemblyState) -> CrewAssemblyState:
    repo = CrewRepository()
    llm = get_llm(temperature=0.1)
    candidates_by_role = state.get("candidates", {})
    review_scores: Dict[str, Dict[str, Any]] = {}

    for role_name, candidates in candidates_by_role.items():
        for candidate in candidates:
            crew_id = candidate["id"]
            feedbacks = repo.get_performance_reviews(crew_id)
            
            reliability = candidate.get("reliability", 0.85)
            rating = candidate.get("rating", 4.0)

            if feedbacks:
                feedback_str = "\n- ".join(feedbacks)
                prompt = (
                    f"Analyze the following event client reviews for {candidate.get('name', 'Crew Member')}:\n"
                    f"- {feedback_str}\n\n"
                    "Extract:\n"
                    "1. Any behavioral red flags (e.g., late arrival, poor attitude, unresponsiveness).\n"
                    "2. Key strengths.\n"
                    "3. Sentiment score from 0.0 (very negative) to 1.0 (highly positive).\n\n"
                    "Respond briefly in 2 sentences."
                )
                analysis_response = llm.invoke(prompt).content
            else:
                analysis_response = "No written client feedback available."

            composite_score = round((rating / 5.0 * 0.4) + (reliability * 0.6), 2)

            review_scores[str(crew_id)] = {
                "candidate_id": crew_id,
                "name": candidate.get("name"),
                "composite_score": composite_score,
                "reliability": reliability,
                "rating": rating,
                "review_summary": analysis_response
            }

    return {"review_scores": review_scores}