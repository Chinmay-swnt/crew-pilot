export interface AIEventRequirement {
  event_type: string;
  tier?: string;
  location: string;
  budget: number;
  guest_count: number;
  date?: string | null;
  roles: Array<{
    role: string;
    count: number;
  }>;
  priority: string;
  budget_warning?: string | null;
}

export interface AICrewAssignment {
  crew_member_id: number;
  role: string;
  agreed_rate: number;
}

export interface AIAssemblyResponse {
  event_requirements: AIEventRequirement;
  budget_warning?: string | null;
  discovery_logs: string[];
  primary_crew: AICrewAssignment[];
  backup_crew: AICrewAssignment[];
  total_cost: number;
  overall_match_score: number;
  team_explanation: string;
}

const AI_ENGINE_URL =
  process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://localhost:8000";

export async function assembleCrewWithAI(
  rawDescription: string,
): Promise<AIAssemblyResponse> {
  const response = await fetch(`${AI_ENGINE_URL}/api/v1/assemble-crew`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw_description: rawDescription,
    }),
  });

  if (!response.ok) {
    let message = "AI engine request failed.";

    try {
      const errorBody = await response.json();

      if (typeof errorBody?.detail === "string") {
        message = errorBody.detail;
      }
    } catch {
      // Keep fallback message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function checkAIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${AI_ENGINE_URL}/health`, {
      method: "GET",
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}
