'use client';

import { useState } from 'react';
import { Loader2, Star, ShieldCheck, DollarSign } from 'lucide-react';
import BookingButton from './BookingButtons';

interface CrewResult {
  crew_member_id: number;
  role_id: number;
  priority: 'PRIMARY' | 'BACKUP';
  individual_score: number;
  predicted_reliability: number;
  estimated_cost: number;
}

interface RecommendationResponse {
  recommendation_id: number;
  overall_score: number;
  total_cost: number;
  crew: CrewResult[];
}

export default function RecommendationResult({ eventId }: { eventId: number }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate recommendation');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const primary = result?.crew.filter((c) => c.priority === 'PRIMARY') ?? [];
  const backup = result?.crew.filter((c) => c.priority === 'BACKUP') ?? [];

  return (
    <div className="space-y-6">
      {!result && (
        <button
          onClick={generate}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Optimizing crew...' : 'Generate AI Recommendation'}
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="space-y-6">
          <div className="flex gap-6 text-sm">
            <span>
              Overall score:{' '}
              <strong className="text-indigo-600">{result.overall_score.toFixed(1)}</strong>
            </span>
            <span>
              Total cost: <strong>₹{result.total_cost.toLocaleString()}</strong>
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Primary Crew</h3>
            <div className="grid gap-3">
              {primary.map((c) => (
                <CrewResultCard key={c.crew_member_id} crew={c} />
              ))}
            </div>
          </div>

          {backup.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Backup Options</h3>
              <div className="grid gap-3">
                {backup.map((c) => (
                  <CrewResultCard key={c.crew_member_id} crew={c} muted />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CrewResultCard({
  crew,
  eventId,
  muted,
}: {
  crew: CrewResult;
  eventId?: number;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between border rounded-xl p-4 ${
        muted ? 'border-slate-200 bg-slate-50' : 'border-indigo-200 bg-indigo-50/40'
      }`}
    >
      <div>
        <p className="text-sm font-medium text-slate-800">Crew #{crew.crew_member_id}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" /> {crew.individual_score.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> {crew.predicted_reliability.toFixed(0)}% reliable
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> ₹{crew.estimated_cost.toLocaleString()}
          </span>
        </div>
      </div>
      {!muted && eventId && (
        <BookingButton
          eventId={eventId}
          crewMemberId={crew.crew_member_id}
          roleId={crew.role_id}
          agreedPrice={crew.estimated_cost}
        />
      )}
    </div>
  );
}