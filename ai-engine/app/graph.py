from langgraph.graph import StateGraph, END
from app.state import CrewAssemblyState
from app.agents.event_intent import event_intent_agent
from app.agents.crew_discovery import crew_discovery_agent
from app.agents.review_intel import review_intel_agent
from app.agents.team_assembly import team_assembly_agent

# Initialize workflow graph
workflow = StateGraph(CrewAssemblyState)

# Add Agent Nodes
workflow.add_node("event_intent", event_intent_agent)
workflow.add_node("crew_discovery", crew_discovery_agent)
workflow.add_node("review_intelligence", review_intel_agent)
workflow.add_node("team_assembly", team_assembly_agent)

# Set Entry Point and Sequential Edges
workflow.set_entry_point("event_intent")
workflow.add_edge("event_intent", "crew_discovery")
workflow.add_edge("crew_discovery", "review_intelligence")
workflow.add_edge("review_intelligence", "team_assembly")
workflow.add_edge("team_assembly", END)

# Compile Executable Graph
crew_graph = workflow.compile()