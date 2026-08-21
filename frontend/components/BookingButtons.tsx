'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface BookingButtonProps {
  eventId: number;
  crewMemberId: number;
  roleId: number;
  agreedPrice?: number;
}

export default function BookingButton({
  eventId,
  crewMemberId,
  roleId,
  agreedPrice,
}: BookingButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'booked' | 'error'>('idle');

  const handleBook = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          crew_member_id: crewMemberId,
          role_id: roleId,
          agreed_price: agreedPrice,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('booked');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'booked') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
        <Check className="w-3.5 h-3.5" /> Booked
      </span>
    );
  }

  return (
    <button
      onClick={handleBook}
      disabled={status === 'loading'}
      className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg"
    >
      {status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {status === 'loading' ? 'Booking...' : 'Confirm Booking'}
      {status === 'error' && <span className="text-red-200 ml-1">retry</span>}
    </button>
  );
}