from langchain_core.tools import tool
from typing import Dict, Any, List

@tool
def classify_event_tier(guest_count: int, priority: str = "balanced") -> str:
    """Classifies an event into budget, standard, premium, or luxury based on guest count and priorities."""
    if priority == "luxury" or guest_count > 1000:
        return "luxury"
    elif guest_count > 300 or priority == "quality > cost":
        return "premium"
    elif guest_count > 100:
        return "standard"
    return "budget"

@tool
def validate_budget(budget: float, guest_count: int, tier: str, roles: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Validates if the provided budget in INR (₹) is realistic for the required crew and guest count."""
    num_roles = sum(r.get("count", 1) for r in roles)
    estimated_min = num_roles * 15000  # Baseline ~₹15k average per crew member
    
    if tier in ["premium", "luxury"]:
        estimated_min *= 2.5

    if budget < estimated_min:
        return {
            "valid": False,
            "warning": f"Budget ₹{budget:,.0f} is tight for a {tier} event with {num_roles} crew members. Estimated minimum recommended is ₹{estimated_min:,.0f}."
        }
    return {"valid": True, "warning": None}