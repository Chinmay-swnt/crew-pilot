import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { scoreCrewMember, CrewCandidate } from '@/lib/scoring';

export async function POST(req: NextRequest) {
  const { event_id } = await req.json();
  if (!event_id) {
    return NextResponse.json({ error: 'event_id is required' }, { status: 400 });
  }

  const { data: event, error: eventErr } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', event_id)
    .single();

  if (eventErr || !event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const { data: requirements, error: reqErr } = await supabaseAdmin
    .from('event_requirements')
    .select('*, event_requirement_skills(skill_id)')
    .eq('event_id', event_id);

  if (reqErr || !requirements) {
    return NextResponse.json({ error: 'No requirements found' }, { status: 404 });
  }

  const { data: recommendation, error: recErr } = await supabaseAdmin
    .from('recommendations')
    .insert({ event_id })
    .select()
    .single();

  if (recErr || !recommendation) {
    return NextResponse.json({ error: 'Failed to create recommendation' }, { status: 500 });
  }

  const result: any[] = [];
  let totalCost = 0;
  let reliabilitySum = 0;
  let count = 0;

  for (const req of requirements) {
    const requiredSkillIds = (req.event_requirement_skills || []).map(
      (s: any) => s.skill_id
    );

    const { data: eligibleCrew } = await supabaseAdmin
      .from('crew_members')
      .select('*, crew_skills(skill_id, proficiency_level)')
      .eq('role_id', req.role_id)
      .eq('status', 'ACTIVE');

    if (!eligibleCrew || eligibleCrew.length === 0) continue;

    const candidates: CrewCandidate[] = eligibleCrew.map((c: any) => {
      const crewSkillIds = (c.crew_skills || []).map((s: any) => s.skill_id);
      const matched = requiredSkillIds.filter((id: number) =>
        crewSkillIds.includes(id)
      ).length;
      const skillMatchRatio =
        requiredSkillIds.length > 0 ? matched / requiredSkillIds.length : 1;

      return {
        id: c.id,
        name: c.name,
        rating: c.rating ?? 0,
        reliability: c.reliability ?? 0,
        base_price: c.base_price ?? c.base_rate ?? 0,
        experience_years: c.experience_years ?? 0,
        total_events: c.total_events ?? 0,
        successful_events: c.successful_events ?? 0,
        cancellations: c.cancellations ?? 0,
        skillMatchRatio,
      };
    });

    const budgetPerRole = event.budget
      ? event.budget / requirements.length / (req.quantity || 1)
      : 0;

    const scored = candidates
      .map((c) => scoreCrewMember(c, budgetPerRole))
      .sort((a, b) => b.score - a.score);

    const primaryCount = req.quantity || 1;
    const primary = scored.slice(0, primaryCount);
    const backup = scored.slice(primaryCount, primaryCount + 2);

    for (const p of primary) {
      totalCost += p.base_price;
      reliabilitySum += p.predictedReliability;
      count++;
      result.push({
        recommendation_id: recommendation.id,
        crew_member_id: p.id,
        role_id: req.role_id,
        priority: 'PRIMARY',
        individual_score: p.score,
        predicted_reliability: p.predictedReliability,
        estimated_cost: p.base_price,
      });
    }
    for (const b of backup) {
      result.push({
        recommendation_id: recommendation.id,
        crew_member_id: b.id,
        role_id: req.role_id,
        priority: 'BACKUP',
        individual_score: b.score,
        predicted_reliability: b.predictedReliability,
        estimated_cost: b.base_price,
      });
    }
  }

  await supabaseAdmin.from('recommended_crew').insert(result);

  const overallScore =
    result.filter((r) => r.priority === 'PRIMARY').reduce((s, r) => s + r.individual_score, 0) /
    Math.max(result.filter((r) => r.priority === 'PRIMARY').length, 1);

  await supabaseAdmin
    .from('recommendations')
    .update({
      overall_score: overallScore,
      total_cost: totalCost,
      predicted_reliability: count > 0 ? reliabilitySum / count : 0,
    })
    .eq('id', recommendation.id);

  return NextResponse.json({
    recommendation_id: recommendation.id,
    overall_score: overallScore,
    total_cost: totalCost,
    crew: result,
  });
}