from typing import Dict, Any

from app.db.supabase import CrewRepository
from app.core.config import get_llm
from app.state import CrewAssemblyState


def review_intel_agent(
    state: CrewAssemblyState,
) -> CrewAssemblyState:

    repo = CrewRepository()

    llm = get_llm(
        temperature=0.1
    )

    candidates_by_role = state.get(
        "candidates",
        {}
    )

    review_scores: Dict[
        str,
        Dict[str, Any]
    ] = {}

    # Analyze crew reliability and performance
    progress = state.get(
        "progress",
        []
    ).copy()

    progress.append(
        "🧠 Reviewing crew reliability and performance..."
    )

    for role_name, candidates in (
        candidates_by_role.items()
    ):

        progress.append(
            f"📊 Evaluating {len(candidates)} "
            f"{role_name.lower()} candidates..."
        )

        for candidate in candidates:

            crew_id = candidate["id"]

            feedbacks = (
                repo.get_performance_reviews(
                    crew_id
                )
            )

            reliability = candidate.get(
                "reliability",
                0.85
            )

            rating = candidate.get(
                "rating",
                4.0
            )

            if feedbacks:

                feedback_str = (
                    "\n- ".join(
                        feedbacks
                    )
                )

                prompt = (
                    f"Analyze the following event "
                    f"client reviews for "
                    f"{candidate.get('name', 'Crew Member')}:\n"
                    f"- {feedback_str}\n\n"
                    "Extract:\n"
                    "1. Any behavioral red flags "
                    "(e.g., late arrival, poor attitude, "
                    "unresponsiveness).\n"
                    "2. Key strengths.\n"
                    "3. Sentiment score from 0.0 "
                    "to 1.0.\n\n"
                    "Respond briefly in 2 sentences."
                )

                analysis_response = (
                    llm.invoke(
                        prompt
                    ).content
                )

            else:

                analysis_response = (
                    "No written client feedback available."
                )

            composite_score = round(
                (
                    rating / 5.0 * 0.4
                )
                +
                (
                    reliability * 0.6
                ),
                2
            )

            review_scores[
                str(crew_id)
            ] = {
                "candidate_id": crew_id,
                "name": candidate.get(
                    "name"
                ),
                "composite_score":
                    composite_score,
                "reliability":
                    reliability,
                "rating":
                    rating,
                "review_summary":
                    analysis_response
            }

    progress.append(
        "✓ Reliability and performance analysis completed"
    )

    return {
        "review_scores": review_scores,
        "progress": progress,
    }