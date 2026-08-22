from typing import Any, Dict

from app.core.config import get_llm
from app.db.supabase import CrewRepository
from app.state import CrewAssemblyState


def _safe_float(
    value: Any,
    default: float,
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


def review_intel_agent(
    state: CrewAssemblyState,
) -> CrewAssemblyState:
    repo = CrewRepository()
    llm = get_llm(temperature=0.1)

    candidates_by_role = state.get(
        "candidates",
        {}
    ) or {}

    review_scores: Dict[
        str,
        Dict[str, Any]
    ] = {}

    for role_name, candidates in candidates_by_role.items():
        if not isinstance(candidates, list):
            continue

        for candidate in candidates:
            if not isinstance(candidate, dict):
                continue

            crew_id = candidate.get("id")

            if crew_id is None:
                continue

            feedbacks = repo.get_performance_reviews(
                crew_id
            ) or []

            # Database values may be NULL.
            # candidate.get("x", default) does NOT protect
            # against an existing key whose value is None.

            reliability = _safe_float(
                candidate.get("reliability"),
                0.85,
            )

            rating = _safe_float(
                candidate.get("rating"),
                4.0,
            )

            # Keep values inside their expected ranges.
            reliability = max(
                0.0,
                min(1.0, reliability)
            )

            rating = max(
                0.0,
                min(5.0, rating)
            )

            if feedbacks:
                feedback_str = "\n- ".join(
                    str(feedback)
                    for feedback in feedbacks
                    if feedback is not None
                )

                if not feedback_str:
                    analysis_response = (
                        "No usable written client feedback available."
                    )
                else:
                    prompt = (
                        "Analyze the following event client reviews "
                        f"for {candidate.get('name') or 'Crew Member'}:\n"
                        f"- {feedback_str}\n\n"
                        "Extract:\n"
                        "1. Any behavioral red flags "
                        "(e.g., late arrival, poor attitude, "
                        "unresponsiveness).\n"
                        "2. Key strengths.\n"
                        "3. Sentiment score from 0.0 "
                        "(very negative) to 1.0 "
                        "(highly positive).\n\n"
                        "Respond briefly in 2 sentences."
                    )

                    analysis_response = (
                        llm.invoke(prompt).content
                    )
            else:
                analysis_response = (
                    "No written client feedback available."
                )

            composite_score = round(
                (rating / 5.0 * 0.4)
                + (reliability * 0.6),
                2,
            )

            review_scores[str(crew_id)] = {
                "candidate_id": crew_id,
                "name": candidate.get("name"),
                "role": role_name,
                "composite_score": composite_score,
                "reliability": reliability,
                "rating": rating,
                "review_summary": analysis_response,
            }

    return {
        "review_scores": review_scores
    }