import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const { event_id, crew_member_id, role_id, agreed_price } = await req.json();

  if (!event_id || !crew_member_id || !role_id) {
    return NextResponse.json(
      { error: 'event_id, crew_member_id, role_id are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      event_id,
      crew_member_id,
      role_id,
      agreed_price: agreed_price ?? null,
      status: 'CONFIRMED',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const event_id = searchParams.get('event_id');

  let query = supabaseAdmin.from('bookings').select('*, crew_members(name), roles(name)');
  if (event_id) query = query.eq('event_id', event_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ bookings: data });
}