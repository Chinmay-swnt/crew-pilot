'use client';

import { X } from 'lucide-react';
import EventForm from './EventForm';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindOptimalCrew: (eventId: number) => void;
  organizerId: number;
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onFindOptimalCrew,
  organizerId,
}: CreateEventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-slate-900 mb-4">Create Event</h2>

        <EventForm
          organizerId={organizerId}
          onCreated={(eventId) => {
  onFindOptimalCrew(eventId);
  onClose();
}}
        />
      </div>
    </div>
  );
}