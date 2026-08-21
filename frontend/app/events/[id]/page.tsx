'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RecommendationResult from '@/components/RecommendationResult';
import { Calendar, MapPin, Users, DollarSign, Loader2 } from 'lucide-react';

interface EventDetail {
  id: number;
  name: string;
  event_type: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  guest_count: number;
  budget: number;
  status: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = Number(params.id);

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setEvent(data.event);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !event) {
    return <p className="text-sm text-red-600 p-8">{error ?? 'Event not found'}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
          {event.status}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-3">{event.name}</h1>
        <p className="text-sm text-slate-500 mt-1">{event.description}</p>

        <div className="flex flex-wrap gap-5 mt-4 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> {event.date}
            {event.start_time && ` · ${event.start_time}–${event.end_time}`}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {event.location}
            </span>
          )}
          {event.guest_count && (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {event.guest_count} guests
            </span>
          )}
          {event.budget && (
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> ₹{event.budget.toLocaleString()} budget
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Crew Recommendation</h2>
        <RecommendationResult eventId={event.id} />
      </div>
    </div>
  );
}