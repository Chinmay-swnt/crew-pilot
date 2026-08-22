from typing import List, Dict, Any

from app.core.config import get_llm
from app.state import CrewAssemblyState


def team_assembly_agent(
    state: CrewAssemblyState,
) -> CrewAssemblyState:

    llm = get_llm(
        temperature=0.2
    )

    requirements = state.get(
        "event_requirements",
        {}
    )

    candidates_by_role = state.get(
        "candidates",
        {}
    )

    review_scores = state.get(
        "review_scores",
        {}
    )

    total_budget = requirements.get(
        "budget",
        0
    )

    # Find the best primary and backup team
    progress = state.get(
        "progress",
        []
    ).copy()

    progress.append(
        "🤖 Finding the best team combination..."
    )

    context_lines = [
        f"Event Budget: ₹{total_budget:,.2f}",
        "\nCandidates by Role:"
    ]

    for role, crew_list in (
        candidates_by_role.items()
    ):

        context_lines.append(
            f"\nRole: {role}"
        )

        for candidate in crew_list:

            cid = str(
                candidate["id"]
            )

            intel = review_scores.get(
                cid,
                {}
            )

            context_lines.append(
                f"  - ID: {candidate['id']} "
                f"| Name: {candidate['name']} "
                f"| Base Rate: ₹{candidate['base_rate']} "
                f"| Rating: {candidate['rating']} "
                f"| Score: "
                f"{intel.get('composite_score', 0)} "
                f"| Feedback: "
                f"{intel.get('review_summary', 'N/A')}"
            )

    assembly_prompt = "\n".join(
        context_lines
    )

    structured_llm = llm.with_structured_output(
        schema={
            "title": "TeamAssemblyOutput",
            "type": "object",
            "properties": {
                "primary_crew": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "crew_member_id": {
                                "type": "integer"
                            },
                            "role": {
                                "type": "string"
                            },
                            "agreed_rate": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "crew_member_id",
                            "role",
                            "agreed_rate"
                        ]
                    }
                },
                "backup_crew": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "crew_member_id": {
                                "type": "integer"
                            },
                            "role": {
                                "type": "string"
                            },
                            "agreed_rate": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "crew_member_id",
                            "role",
                            "agreed_rate"
                        ]
                    }
                },
                "team_explanation": {
                    "type": "string"
                },
                "total_cost": {
                    "type": "number"
                },
                "overall_match_score": {
                    "type": "number"
                }
            },
            "required": [
                "primary_crew",
                "backup_crew",
                "team_explanation",
                "total_cost",
                "overall_match_score"
            ]
        }
    )

    system_instruction = (
        "You are an AI Event Operations Manager. "
        "Select a primary crew and backup crew "
        "matching all requested roles. "
        "Ensure the total cost of the primary crew "
        "stays within or close to the total event "
        "budget while maximizing review scores "
        "and reliability."
    )

    result = structured_llm.invoke(
        [
            (
                "system",
                system_instruction
            ),
            (
                "human",
                assembly_prompt
            )
        ]
    )

    progress.append(
        "✓ Primary crew selected"
    )

    progress.append(
        "✓ Backup crew ranked"
    )

    progress.append(
        "✓ Final recommendation ready"
    )

    return {
        "primary_crew": result.get(
            "primary_crew",
            []
        ),
        "backup_crew": result.get(
            "backup_crew",
            []
        ),
        "team_explanation": result.get(
            "team_explanation",
            ""
        ),
        "total_cost": result.get(
            "total_cost",
            0.0
        ),
        "overall_match_score": result.get(
            "overall_match_score",
            0.0
        ),
        "progress": progress,
    }