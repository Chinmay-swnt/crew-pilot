import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    organizer_id,
    name,
    event_type,
    description,
    date,
    start_time,
    end_time,
    location,
    guest_count,
    budget,
    requirements, // [{ role_id, quantity, required_experience, skill_ids: [] }]
  } = body;

  if (!organizer_id || !name || !date) {
    return NextResponse.json({ error: 'organizer_id, name, date are required' }, { status: 400 });
  }

  const { data: event, error: eventErr } = await supabaseAdmin
    .from('events')
    .insert({
      organizer_id,
      name,
      event_type,
      description,
      date,
      start_time,
      end_time,
      location,
      guest_count,
      budget,
      status: 'PLANNING',
    })
    .select()
    .single();

  if (eventErr || !event) {
    return NextResponse.json({ error: eventErr?.message ?? 'Failed to create event' }, { status: 500 });
  }

  if (requirements && requirements.length > 0) {
    for (const r of requirements) {
      const { data: reqRow, error: reqErr } = await supabaseAdmin
        .from('event_requirements')
        .insert({
          event_id: event.id,
          role_id: r.role_id,
          quantity: r.quantity ?? 1,
          required_experience: r.required_experience ?? null,
        })
        .select()
        .single();

      if (reqErr || !reqRow) continue;

      if (r.skill_ids && r.skill_ids.length > 0) {
        const skillRows = r.skill_ids.map((skill_id: number) => ({
          event_requirement_id: reqRow.id,
          skill_id,
        }));
        await supabaseAdmin.from('event_requirement_skills').insert(skillRows);
      }
    }
  }

  return NextResponse.json({ event }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const organizer_id = searchParams.get('organizer_id');

  let query = supabaseAdmin.from('events').select('*').order('date', { ascending: true });
  if (organizer_id) query = query.eq('organizer_id', organizer_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ events: data });
}