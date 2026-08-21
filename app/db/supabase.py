from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class CrewRepository:
    def __init__(self):
        self.client = get_supabase_client()

    def match_crew_by_vector(self, embedding: list[float], role_name: str, match_count: int = 10) -> list[dict]:
        try:
            response = self.client.rpc(
                "match_crew",
                {
                    "p_query_embedding": embedding,
                    "p_role_name": role_name,
                    "p_match_count": match_count
                }
            ).execute()
            if response.data:
                return response.data
        except Exception as e:
            print(f"[Supabase RPC Notice] RPC 'match_crew' warning/error: {e}. Executing table fallback...")

        # Fallback query matching database schema
        try:
            role_res = self.client.table("roles").select("id, name").ilike("name", role_name).execute()
            if role_res.data:
                role_id = role_res.data[0]["id"]
                crew_res = self.client.table("crew_members").select("*").eq("role_id", role_id).eq("status", "ACTIVE").limit(match_count).execute()
            else:
                crew_res = self.client.table("crew_members").select("*").eq("status", "ACTIVE").limit(match_count).execute()
            
            candidates = []
            for item in (crew_res.data or []):
                item["role_name"] = role_name
                item["similarity"] = 0.85
                candidates.append(item)
            return candidates
        except Exception as fallback_err:
            print(f"[Supabase Fallback Error] {fallback_err}")
            return []

    def check_availability(self, crew_id: int, event_date: str) -> bool:
        try:
            res = self.client.table("availability") \
                .select("is_available") \
                .eq("crew_member_id", crew_id) \
                .eq("date", event_date) \
                .execute()
            if res.data:
                return res.data[0].get("is_available", True)
            return True
        except Exception:
            return True

    def get_performance_reviews(self, crew_id: int) -> list[str]:
        try:
            res = self.client.table("performance_history") \
                .select("client_feedback") \
                .eq("crew_member_id", crew_id) \
                .not_.is_("client_feedback", "null") \
                .execute()
            return [row["client_feedback"] for row in (res.data or []) if row.get("client_feedback")]
        except Exception:
            return []