import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const organizerId = searchParams.get('organizer_id');

  if (!organizerId) {
    return NextResponse.json({ error: 'organizer_id is required' }, { status: 400 });
  }

  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id, name, date, status')
    .eq('organizer_id', organizerId)
    .order('date', { ascending: true });

  if (!events || events.length === 0) {
    return NextResponse.json({
      stats: {
        upcomingEventsCount: 0,
        activeEventsCount: 0,
        totalCrewBooked: 0,
        avgReliability: 0,
        budgetSaved: '₹0',
        budgetSavedPercent: '+0%',
      },
      upcomingEvents: [],
      recommendations: [],
    });
  }

  const eventIds = events.map((e) => e.id);
  const today = new Date().toISOString().split('T')[0];

  const { data: requirements } = await supabaseAdmin
    .from('event_requirements')
    .select('event_id, quantity')
    .in('event_id', eventIds);

  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('event_id, status')
    .in('event_id', eventIds)
    .eq('status', 'CONFIRMED');

  const { data: recommended } = await supabaseAdmin
    .from('recommended_crew')
    .select('crew_member_id, role_id, priority, individual_score, predicted_reliability, crew_members(name), roles(name)')
    .in(
      'recommendation_id',
      (
        await supabaseAdmin
          .from('recommendations')
          .select('id')
          .in('event_id', eventIds)
      ).data?.map((r: any) => r.id) ?? []
    )
    .eq('priority', 'PRIMARY')
    .order('individual_score', { ascending: false })
    .limit(3);

  const needCountByEvent: Record<number, number> = {};
  (requirements ?? []).forEach((r: any) => {
    needCountByEvent[r.event_id] = (needCountByEvent[r.event_id] ?? 0) + r.quantity;
  });

  const bookedCountByEvent: Record<number, number> = {};
  (bookings ?? []).forEach((b: any) => {
    bookedCountByEvent[b.event_id] = (bookedCountByEvent[b.event_id] ?? 0) + 1;
  });

  const upcoming = events.filter((e) => e.date >= today);
  const active = events.filter((e) => ['PLANNING', 'CONFIRMED'].includes(e.status));
  const totalCrewBooked = (bookings ?? []).length;

  const reliabilityScores = (recommended ?? []).map((r: any) => r.predicted_reliability ?? 0);
  const avgReliability =
    reliabilityScores.length > 0
      ? Math.round(reliabilityScores.reduce((a: number, b: number) => a + b, 0) / reliabilityScores.length)
      : 0;

  return NextResponse.json({
    stats: {
      upcomingEventsCount: upcoming.length,
      activeEventsCount: active.length,
      totalCrewBooked,
      avgReliability,
      budgetSaved: '₹0',
      budgetSavedPercent: '+0%',
    },
    upcomingEvents: upcoming.slice(0, 3).map((e) => ({
      id: String(e.id),
      title: e.name,
      dateRange: e.date,
      crewedCount: bookedCountByEvent[e.id] ?? 0,
      totalCrewNeeded: needCountByEvent[e.id] ?? 0,
    })),
    recommendations: (recommended ?? []).map((r: any) => ({
      id: String(r.crew_member_id),
      name: r.crew_members?.name ?? 'Unknown',
      role: r.roles?.name ?? '',
      matchScore: Math.round(r.individual_score ?? 0),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${r.crew_members?.name ?? 'X'}`,
    })),
  });
}