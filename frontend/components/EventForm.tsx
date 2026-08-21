'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Role {
  id: number;
  name: string;
}
interface Skill {
  id: number;
  name: string;
}
interface RequirementRow {
  role_id: number;
  quantity: number;
  required_experience: number;
  skill_ids: number[];
}

export default function EventForm({
  organizerId,
  onCreated,
}: {
  organizerId: number;
  onCreated: (eventId: number) => void;
}) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState('');
  const [requirements, setRequirements] = useState<RequirementRow[]>([
    { role_id: 0, quantity: 1, required_experience: 0, skill_ids: [] },
  ]);

  useEffect(() => {
    fetch('/api/roles').then((r) => r.json()).then((d) => setRoles(d.roles ?? []));
    fetch('/api/skills').then((r) => r.json()).then((d) => setSkills(d.skills ?? []));
  }, []);

  const addRequirement = () => {
    setRequirements((r) => [...r, { role_id: 0, quantity: 1, required_experience: 0, skill_ids: [] }]);
  };

  const removeRequirement = (idx: number) => {
    setRequirements((r) => r.filter((_, i) => i !== idx));
  };

  const updateRequirement = (idx: number, patch: Partial<RequirementRow>) => {
    setRequirements((r) => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  };

  const toggleSkill = (idx: number, skillId: number) => {
    setRequirements((r) =>
      r.map((row, i) => {
        if (i !== idx) return row;
        const has = row.skill_ids.includes(skillId);
        return {
          ...row,
          skill_ids: has ? row.skill_ids.filter((s) => s !== skillId) : [...row.skill_ids, skillId],
        };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizer_id: organizerId,
          name,
          event_type: eventType,
          date,
          start_time: startTime || null,
          end_time: endTime || null,
          location,
          guest_count: guestCount ? Number(guestCount) : null,
          budget: budget ? Number(budget) : null,
          requirements: requirements.filter((r) => r.role_id !== 0),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');
      onCreated(data.event.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Event name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Event type</label>
          <input
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="Wedding, Corporate..."
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Start time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">End time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Guest count</label>
          <input
            type="number"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Budget (₹)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-600">Crew requirements</label>
          <button
            type="button"
            onClick={addRequirement}
            className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3 h-3" /> Add role
          </button>
        </div>

        <div className="space-y-3">
          {requirements.map((row, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex gap-2">
                <select
                  value={row.role_id}
                  onChange={(e) => updateRequirement(idx, { role_id: Number(e.target.value) })}
                  className="flex-1 px-2 py-2 text-sm rounded-lg border border-slate-200"
                >
                  <option value={0}>Select role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) => updateRequirement(idx, { quantity: Number(e.target.value) })}
                  className="w-16 px-2 py-2 text-sm rounded-lg border border-slate-200"
                  title="Quantity"
                />
                <input
                  type="number"
                  min={0}
                  value={row.required_experience}
                  onChange={(e) =>
                    updateRequirement(idx, { required_experience: Number(e.target.value) })
                  }
                  className="w-20 px-2 py-2 text-sm rounded-lg border border-slate-200"
                  title="Min experience (years)"
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(idx)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSkill(idx, s.id)}
                    className={`text-xs px-2 py-1 rounded-full border ${
                      row.skill_ids.includes(s.id)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}