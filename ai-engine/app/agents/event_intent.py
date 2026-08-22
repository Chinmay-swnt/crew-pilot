from typing import Any, Dict

from langchain_core.prompts import ChatPromptTemplate

from app.core.config import get_llm
from app.state import CrewAssemblyState
from app.tools.intent_tools import (
    classify_event_tier,
    validate_budget,
)


def _safe_float(
    value: Any,
    default: float = 0.0,
) -> float:
    """
    Safely convert a value to float.

    Handles:
    - None
    - strings
    - invalid values
    """
    if value is None:
        return default

    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _safe_int(
    value: Any,
    default: int = 0,
) -> int:
    """
    Safely convert a value to int.
    """
    if value is None:
        return default

    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _normalize_roles(
    roles: Any,
) -> list[dict[str, Any]]:
    """
    Normalize the extracted roles into a predictable structure.
    """
    if not isinstance(roles, list):
        return []

    normalized_roles: list[dict[str, Any]] = []

    for item in roles:
        if not isinstance(item, dict):
            continue

        role_name = item.get("role")

        if not role_name:
            continue

        normalized_roles.append(
            {
                "role": str(role_name).strip(),
                "count": max(
                    1,
                    _safe_int(
                        item.get("count"),
                        1,
                    ),
                ),
            }
        )

    return normalized_roles


def event_intent_agent(
    state: CrewAssemblyState,
) -> CrewAssemblyState:

    raw_description = state.get(
        "raw_description",
        "",
    ).strip()

    if not raw_description:
        raise ValueError(
            "Event description cannot be empty."
        )

    llm = get_llm(
        temperature=0.1
    )

    tools = [
        classify_event_tier,
        validate_budget,
    ]

    llm_with_tools = llm.bind_tools(
        tools
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are an expert event planning strategist.

Extract the requirements from the user's event description.

Use the provided tools:
- classify_event_tier
- validate_budget

Extract and structure:

- event_type
- tier
- location
- budget in INR
- guest_count as an integer
- date in YYYY-MM-DD format if mentioned, otherwise null
- roles as a list of objects:
  - role
  - count
- priority:
  - quality > cost
  - cost > quality
  - balanced

Rules:
- Do not invent missing values.
- If budget is not provided, return 0.
- If guest count is not provided, return 0.
- If date is not provided, return null.
- Roles must have a positive integer count.
- Keep role names concise and human-readable.
""",
            ),
            (
                "human",
                "{raw_description}",
            ),
        ]
    )

    # Run the tool-capable reasoning pass.
    # The explicit structured-output pass below is still
    # responsible for producing the final normalized object.
    chain = prompt | llm_with_tools

    chain.invoke(
        {
            "raw_description": raw_description,
        }
    )

    structured_llm = llm.with_structured_output(
        schema={
            "title": "EventRequirements",
            "type": "object",
            "properties": {
                "event_type": {
                    "type": "string",
                },
                "tier": {
                    "type": "string",
                },
                "location": {
                    "type": "string",
                },
                "budget": {
                    "type": "number",
                },
                "guest_count": {
                    "type": "integer",
                },
                "date": {
                    "type": [
                        "string",
                        "null",
                    ],
                },
                "roles": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "role": {
                                "type": "string",
                            },
                            "count": {
                                "type": "integer",
                            },
                        },
                        "required": [
                            "role",
                            "count",
                        ],
                    },
                },
                "priority": {
                    "type": "string",
                },
                "budget_warning": {
                    "type": [
                        "string",
                        "null",
                    ],
                },
            },
            "required": [
                "event_type",
                "tier",
                "location",
                "budget",
                "guest_count",
                "date",
                "roles",
                "priority",
            ],
        }
    )

    requirements_raw = structured_llm.invoke(
        raw_description
    )

    # Normalize the LLM result.
    requirements: Dict[str, Any] = dict(
        requirements_raw
    )

    event_type = str(
        requirements.get(
            "event_type",
            "event",
        ) or "event"
    ).strip()

    tier = str(
        requirements.get(
            "tier",
            "standard",
        )
        or "standard"
    ).strip()

    location = str(
        requirements.get(
            "location",
            "",
        )
        or ""
    ).strip()

    budget = _safe_float(
        requirements.get("budget"),
        0.0,
    )

    guest_count = _safe_int(
        requirements.get("guest_count"),
        0,
    )

    date = requirements.get("date")

    if date is not None:
        date = str(date).strip()

        if not date:
            date = None

    priority = str(
        requirements.get(
            "priority",
            "balanced",
        )
        or "balanced"
    ).strip()

    roles = _normalize_roles(
        requirements.get("roles")
    )

    requirements["event_type"] = event_type
    requirements["tier"] = tier
    requirements["location"] = location
    requirements["budget"] = budget
    requirements["guest_count"] = guest_count
    requirements["date"] = date
    requirements["roles"] = roles
    requirements["priority"] = priority

    # IMPORTANT:
    # Validate the normalized values, not raw LLM output.
    budget_check = validate_budget.invoke(
        {
            "budget": budget,
            "guest_count": guest_count,
            "tier": tier,
            "roles": roles,
        }
    )

    budget_warning = budget_check.get(
        "warning"
    )

    requirements["budget_warning"] = (
        budget_warning
    )

    return {
        "event_requirements": requirements,
        "budget_warning": budget_warning,
    }