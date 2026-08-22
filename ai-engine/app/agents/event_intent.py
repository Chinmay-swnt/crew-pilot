from typing import Any, Dict

from langchain_core.prompts import ChatPromptTemplate

from app.core.config import get_llm
from app.state import CrewAssemblyState
from app.tools.intent_tools import (
    classify_event_tier,
    validate_budget,
)


def event_intent_agent(
    state: CrewAssemblyState,
) -> CrewAssemblyState:

    llm = get_llm(temperature=0.1)

    tools = [
        classify_event_tier,
        validate_budget,
    ]

    llm_with_tools = llm.bind_tools(tools)

    # Understand and extract the event requirements
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

Do not invent missing values.
If a value is not provided, use a reasonable null/empty representation.
""",
            ),
            (
                "human",
                "{raw_description}",
            ),
        ]
    )

    chain = prompt | llm_with_tools

    chain.invoke(
        {
            "raw_description": state["raw_description"],
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
                    "type": "string",
                    "nullable": True,
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
                    "type": "string",
                    "nullable": True,
                },
            },
            "required": [
                "event_type",
                "tier",
                "location",
                "budget",
                "guest_count",
                "roles",
                "priority",
            ],
        }
    )

    requirements: Dict[str, Any] = structured_llm.invoke(
        state["raw_description"]
    )

    budget_check = validate_budget.invoke(
        {
            "budget": requirements.get(
                "budget",
                0,
            ),
            "guest_count": requirements.get(
                "guest_count",
                0,
            ),
            "tier": requirements.get(
                "tier",
                "standard",
            ),
            "roles": requirements.get(
                "roles",
                [],
            ),
        }
    )

    requirements["budget_warning"] = (
        budget_check.get("warning")
    )

    # Add safe AI activity messages
    progress = state.get(
        "progress",
        []
    ).copy()

    progress.append(
        "✓ Understanding your event requirements"
    )

    progress.append(
        f"✓ Identified {requirements.get('event_type', 'event')} "
        f"in {requirements.get('location', 'the selected location')}"
    )

    progress.append(
        f"✓ Identified {len(requirements.get('roles', []))} "
        "required crew roles"
    )

    progress.append(
        "✓ Event constraints analyzed"
    )

    return {
        "event_requirements": requirements,
        "budget_warning": budget_check.get(
            "warning"
        ),
        "progress": progress,
    }