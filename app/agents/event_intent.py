from langchain_core.prompts import ChatPromptTemplate
from app.core.config import get_llm
from app.tools.intent_tools import classify_event_tier, validate_budget
from app.state import CrewAssemblyState

def event_intent_agent(state: CrewAssemblyState) -> CrewAssemblyState:
    llm = get_llm(temperature=0.1)
    tools = [classify_event_tier, validate_budget]
    llm_with_tools = llm.bind_tools(tools)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert event planning strategist.
Extract the requirements from the user's event description.
Use the provided tools `classify_event_tier` and `validate_budget` to analyze constraints.

Extract and structure:
- event_type (e.g., wedding, corporate, concert)
- location (city/region)
- budget (in INR)
- guest_count (integer)
- date (YYYY-MM-DD format if mentioned, else null)
- roles required (list of objects with role name and count)
- priority ("quality > cost", "cost > quality", or "balanced")
"""),
        ("human", "{raw_description}")
    ])

    chain = prompt | llm_with_tools
    response = chain.invoke({"raw_description": state["raw_description"]})

    # Fallback/Structured parsing via LLM with Structured Output
    structured_llm = llm.with_structured_output(schema={
        "title": "EventRequirements",
        "type": "object",
        "properties": {
            "event_type": {"type": "string"},
            "tier": {"type": "string"},
            "location": {"type": "string"},
            "budget": {"type": "number"},
            "date": {"type": "string", "nullable": True},
            "roles": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "role": {"type": "string"},
                        "count": {"type": "integer"}
                    },
                    "required": ["role", "count"]
                }
            },
            "priority": {"type": "string"},
            "budget_warning": {"type": "string", "nullable": True}
        },
        "required": ["event_type", "tier", "location", "budget", "roles", "priority"]
    })

    requirements = structured_llm.invoke(state["raw_description"])
    
    # Run budget check explicitly
    budget_check = validate_budget.invoke({
        "budget": requirements.get("budget", 0),
        "guest_count": 200,
        "tier": requirements.get("tier", "standard"),
        "roles": requirements.get("roles", [])
    })

    requirements["budget_warning"] = budget_check.get("warning")

    return {
        "event_requirements": requirements,
        "budget_warning": budget_check.get("warning")
    }