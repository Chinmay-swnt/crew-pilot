from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class CrewRepository:
    def __init__(self):
        self.client = get_supabase_client()

    def match_crew_by_vector(self, embedding: list[float], role_name: str, match_count: int = 10):
        """Calls the RPC match_crew function in Supabase."""
        response = self.client.rpc(
            "match_crew",
            {
                "query_embedding": embedding,
                "role_name": role_name,
                "match_count": match_count
            }
        ).execute()
        return response.data

    def check_availability(self, crew_id: int, event_date: str) -> bool:
        """Checks if a crew member is available on a specific date."""
        res = self.client.table("availability") \
            .select("is_available") \
            .eq("crew_member_id", crew_id) \
            .eq("date", event_date) \
            .execute()
        if res.data:
            return res.data[0].get("is_available", True)
        return True  # Default to available if no record exists

    def get_performance_reviews(self, crew_id: int) -> list[str]:
        """Fetches client feedback from performance_history for Agent 3."""
        res = self.client.table("performance_history") \
            .select("client_feedback") \
            .eq("crew_member_id", crew_id) \
            .not_null("client_feedback") \
            .execute()
        return [row["client_feedback"] for row in res.data if row.get("client_feedback")]