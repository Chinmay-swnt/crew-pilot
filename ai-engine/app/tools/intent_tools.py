from typing import Any, Dict, List

from langchain_core.tools import tool


def _safe_float(value: Any, default: float = 0.0) -> float:
    """Safely convert a value to float."""
    if value is None:
        return default

    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _safe_int(value: Any, default: int = 0) -> int:
    """Safely convert a value to int."""
    if value is None:
        return default

    try:
        return int(value)
    except (TypeError, ValueError):
        return default


@tool
def classify_event_tier(
    guest_count: int,
    priority: str = "balanced",
) -> str:
    """
    Classifies an event into budget, standard, premium, or luxury
    based on guest count and priorities.
    """

    guest_count = _safe_int(
        guest_count,
        0,
    )

    priority = (
        str(priority).strip().lower()
        if priority is not None
        else "balanced"
    )

    if priority == "luxury" or guest_count > 1000:
        return "luxury"

    if (
        guest_count > 300
        or priority == "quality > cost"
    ):
        return "premium"

    if guest_count > 100:
        return "standard"

    return "budget"


@tool
def validate_budget(
    budget: float,
    guest_count: int,
    tier: str,
    roles: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Validates whether the provided INR budget is realistic
    for the requested crew size and event tier.
    """

    # Normalize primitive inputs first.
    safe_budget = _safe_float(
        budget,
        0.0,
    )

    safe_guest_count = _safe_int(
        guest_count,
        0,
    )

    safe_tier = (
        str(tier).strip().lower()
        if tier is not None
        else "standard"
    )

    # Never trust raw LLM output.
    # Normalize the role list and quantities.
    safe_roles = (
        roles
        if isinstance(roles, list)
        else []
    )

    num_roles = 0

    for role in safe_roles:
        if not isinstance(role, dict):
            continue

        count = _safe_int(
            role.get("count"),
            1,
        )

        # Crew quantity must never be below 1.
        num_roles += max(
            1,
            count,
        )

    # If the AI somehow returns no roles,
    # we don't want budget validation itself
    # to crash or invent crew.
    estimated_min = (
        num_roles * 15000
    )

    if safe_tier in {
        "premium",
        "luxury",
    }:
        estimated_min *= 2.5

    # Keep the guest count available for future
    # budget rules and make it explicit that the
    # parameter has been normalized.
    _ = safe_guest_count

    if safe_budget < estimated_min:
        return {
            "valid": False,
            "warning": (
                f"Budget ₹{safe_budget:,.0f} is tight for a "
                f"{safe_tier} event with "
                f"{num_roles} crew members. "
                f"Estimated minimum recommended is "
                f"₹{estimated_min:,.0f}."
            ),
        }

    return {
        "valid": True,
        "warning": None,
    }