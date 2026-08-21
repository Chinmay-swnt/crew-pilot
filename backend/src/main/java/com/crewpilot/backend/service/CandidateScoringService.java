package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.Availability;
import com.crewpilot.backend.entity.CrewMember;
import com.crewpilot.backend.entity.CrewRole;
import com.crewpilot.backend.entity.CrewSkill;
import com.crewpilot.backend.entity.Event;
import com.crewpilot.backend.entity.EventRequirement;
import com.crewpilot.backend.entity.EventRequirementSkill;
import com.crewpilot.backend.entity.PerformanceHistory;
import com.crewpilot.backend.repository.AvailabilityRepository;
import com.crewpilot.backend.repository.CrewRoleRepository;
import com.crewpilot.backend.repository.CrewSkillRepository;
import com.crewpilot.backend.repository.EventRequirementSkillRepository;
import com.crewpilot.backend.repository.PerformanceHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateScoringService {

  private final CrewRoleRepository crewRoleRepository;
  private final CrewSkillRepository crewSkillRepository;
  private final AvailabilityRepository availabilityRepository;
  private final PerformanceHistoryRepository performanceHistoryRepository;
  private final EventRequirementSkillRepository requirementSkillRepository;

  public CandidateScore score(
    CrewMember crewMember,
    Event event,
    EventRequirement requirement
  ) {

    BigDecimal roleFit = calculateRoleFit(
      crewMember,
      requirement
    );

    BigDecimal skillFit = calculateSkillFit(
      crewMember,
      requirement
    );

    BigDecimal reliability = calculateReliability(
      crewMember,
      event
    );

    BigDecimal availability = calculateAvailability(
      crewMember,
      event
    );

    BigDecimal proximity = calculateProximity(
      crewMember,
      event
    );

    BigDecimal costFit = calculateCostFit(
      crewMember,
      event
    );

    BigDecimal overallScore =
      roleFit.multiply(BigDecimal.valueOf(0.25))
        .add(skillFit.multiply(BigDecimal.valueOf(0.20)))
        .add(reliability.multiply(BigDecimal.valueOf(0.20)))
        .add(availability.multiply(BigDecimal.valueOf(0.15)))
        .add(proximity.multiply(BigDecimal.valueOf(0.10)))
        .add(costFit.multiply(BigDecimal.valueOf(0.10)));

    BigDecimal estimatedCost =
      crewMember.getBasePrice() != null
        ? crewMember.getBasePrice()
        : BigDecimal.ZERO;

    return new CandidateScore(
      crewMember,
      requirement,
      roleFit,
      skillFit,
      reliability,
      availability,
      proximity,
      costFit,
      overallScore.setScale(2, RoundingMode.HALF_UP),
      estimatedCost
    );
  }

  private BigDecimal calculateRoleFit(
    CrewMember crewMember,
    EventRequirement requirement
  ) {

    if (requirement.getRole() == null) {
      return BigDecimal.ZERO;
    }

    Long requiredRoleId =
      requirement.getRole().getId();

    /*
     * First check the crew member's primary role.
     */
    if (
      crewMember.getRole() != null &&
        requiredRoleId.equals(
          crewMember.getRole().getId()
        )
    ) {

      BigDecimal experience =
        crewMember.getExperienceYears() != null
          ? crewMember.getExperienceYears()
          : BigDecimal.ZERO;

      BigDecimal requiredExperience =
        requirement.getRequiredExperience() != null
          ? requirement.getRequiredExperience()
          : BigDecimal.ZERO;

      BigDecimal experienceScore =
        requiredExperience.compareTo(BigDecimal.ZERO) <= 0
          ? BigDecimal.ONE
          : experience
          .divide(
            requiredExperience,
            4,
            RoundingMode.HALF_UP
          )
          .min(BigDecimal.ONE);

      return experienceScore
        .multiply(BigDecimal.valueOf(100))
        .setScale(2, RoundingMode.HALF_UP);
    }

    /*
     * Then check additional roles.
     */
    List<CrewRole> crewRoles =
      crewRoleRepository.findByCrewMemberIdAndRoleId(
        crewMember.getId(),
        requiredRoleId
      );

    if (crewRoles.isEmpty()) {
      return BigDecimal.ZERO;
    }

    CrewRole crewRole = crewRoles.get(0);

    BigDecimal proficiency =
      crewRole.getProficiency() != null
        ? crewRole.getProficiency()
        : BigDecimal.ZERO;

    BigDecimal experience =
      crewRole.getExperienceYears() != null
        ? crewRole.getExperienceYears()
        : BigDecimal.ZERO;

    BigDecimal requiredExperience =
      requirement.getRequiredExperience() != null
        ? requirement.getRequiredExperience()
        : BigDecimal.ZERO;

    BigDecimal experienceScore =
      requiredExperience.compareTo(BigDecimal.ZERO) <= 0
        ? BigDecimal.ONE
        : experience
        .divide(
          requiredExperience,
          4,
          RoundingMode.HALF_UP
        )
        .min(BigDecimal.ONE);

    BigDecimal proficiencyScore =
      proficiency
        .divide(
          BigDecimal.valueOf(100),
          4,
          RoundingMode.HALF_UP
        )
        .min(BigDecimal.ONE);

    return proficiencyScore
      .multiply(BigDecimal.valueOf(0.5))
      .add(experienceScore.multiply(BigDecimal.valueOf(0.5)))
      .multiply(BigDecimal.valueOf(100))
      .setScale(2, RoundingMode.HALF_UP);
  }

  private BigDecimal calculateSkillFit(
    CrewMember crewMember,
    EventRequirement requirement
  ) {

    List<EventRequirementSkill> requiredSkills =
      requirementSkillRepository.findByEventRequirementId(
        requirement.getId()
      );

    if (requiredSkills.isEmpty()) {
      return BigDecimal.valueOf(100);
    }

    List<CrewSkill> crewSkills =
      crewSkillRepository.findByCrewMemberId(
        crewMember.getId()
      );

    if (crewSkills.isEmpty()) {
      return BigDecimal.ZERO;
    }

    BigDecimal total = BigDecimal.ZERO;

    for (EventRequirementSkill requiredSkill : requiredSkills) {

      Long requiredSkillId =
        requiredSkill.getSkill().getId();

      CrewSkill matchingSkill =
        crewSkills.stream()
          .filter(skill ->
            skill.getSkill() != null &&
              skill.getSkill().getId().equals(requiredSkillId)
          )
          .findFirst()
          .orElse(null);

      if (matchingSkill != null) {

        BigDecimal proficiency =
          matchingSkill.getProficiencyLevel();

        if (proficiency == null) {
          proficiency = BigDecimal.ZERO;
        }

        total = total.add(
          proficiency.min(BigDecimal.valueOf(100))
        );
      }
    }

    return total
      .divide(
        BigDecimal.valueOf(requiredSkills.size()),
        4,
        RoundingMode.HALF_UP
      )
      .setScale(2, RoundingMode.HALF_UP);
  }

  private BigDecimal calculateReliability(
    CrewMember crewMember,
    Event event
  ) {

    List<PerformanceHistory> history =
      performanceHistoryRepository.findByCrewMemberIdAndEventType(
        crewMember.getId(),
        event.getEventType()
      );

    /*
     * Prefer event-type-specific history.
     */
    if (!history.isEmpty()) {
      return calculateAverageReliability(history);
    }

    /*
     * Fall back to all historical events.
     */
    history =
      performanceHistoryRepository.findByCrewMemberId(
        crewMember.getId()
      );

    if (!history.isEmpty()) {
      return calculateAverageReliability(history);
    }

    /*
     * No historical data.
     *
     * If the CrewMember already has a reliability score,
     * use it. Otherwise treat reliability as UNKNOWN,
     * not as zero.
     */
    if (crewMember.getReliabilityScore() != null) {
      return BigDecimal.valueOf(
        crewMember.getReliabilityScore()
      ).min(BigDecimal.valueOf(100));
    }

    return BigDecimal.valueOf(50);
  }


  private BigDecimal calculateAverageReliability(
    List<PerformanceHistory> history
  ) {

    BigDecimal total = BigDecimal.ZERO;

    for (PerformanceHistory record : history) {

      if (record.getPerformanceScore() != null) {
        total = total.add(
          record.getPerformanceScore()
            .min(BigDecimal.valueOf(100))
        );
      } else {
        total = total.add(
          calculateHistoryRecordScore(record)
        );
      }
    }

    return total
      .divide(
        BigDecimal.valueOf(history.size()),
        4,
        RoundingMode.HALF_UP
      )
      .setScale(2, RoundingMode.HALF_UP);
  }
  private BigDecimal calculateHistoryRecordScore(
    PerformanceHistory record
  ) {

    BigDecimal score = BigDecimal.ZERO;

    if (Boolean.TRUE.equals(record.getArrivedOnTime())) {
      score = score.add(BigDecimal.valueOf(40));
    }

    if (Boolean.TRUE.equals(record.getCompletedSuccessfully())) {
      score = score.add(BigDecimal.valueOf(40));
    }

    if (Boolean.FALSE.equals(record.getNoShow())) {
      score = score.add(BigDecimal.valueOf(20));
    }

    return score;
  }

  private BigDecimal calculateAvailability(
    CrewMember crewMember,
    Event event
  ) {

    List<Availability> availability =
      availabilityRepository.findByCrewMemberIdAndDate(
        crewMember.getId(),
        event.getDate()
      );

    /*
     * No availability record means we don't know.
     * Do not automatically reject the crew member.
     */
    if (availability.isEmpty()) {
      return BigDecimal.valueOf(50);
    }

    for (Availability slot : availability) {

      if (!Boolean.TRUE.equals(slot.getAvailable())) {
        continue;
      }

      if (isTimeOverlap(
        slot.getStartTime(),
        slot.getEndTime(),
        event.getStartTime(),
        event.getEndTime()
      )) {
        return BigDecimal.valueOf(100);
      }
    }

    return BigDecimal.ZERO;
  }

  private boolean isTimeOverlap(
    LocalTime availabilityStart,
    LocalTime availabilityEnd,
    LocalTime eventStart,
    LocalTime eventEnd
  ) {

    if (
      availabilityStart == null ||
        availabilityEnd == null ||
        eventStart == null ||
        eventEnd == null
    ) {
      return true;
    }

    return availabilityStart.isBefore(eventEnd)
      && availabilityEnd.isAfter(eventStart);
  }

  private BigDecimal calculateProximity(
    CrewMember crewMember,
    Event event
  ) {

    if (
      crewMember.getLatitude() != null &&
        crewMember.getLongitude() != null &&
        event.getLatitude() != null &&
        event.getLongitude() != null
    ) {

      double distance = calculateDistance(
        crewMember.getLatitude(),
        crewMember.getLongitude(),
        event.getLatitude(),
        event.getLongitude()
      );

      if (distance <= 5) {
        return BigDecimal.valueOf(100);
      }

      if (distance <= 10) {
        return BigDecimal.valueOf(90);
      }

      if (distance <= 25) {
        return BigDecimal.valueOf(75);
      }

      if (distance <= 50) {
        return BigDecimal.valueOf(55);
      }

      if (distance <= 100) {
        return BigDecimal.valueOf(30);
      }

      return BigDecimal.valueOf(10);
    }

    /*
     * GPS unavailable: fall back to city/location match.
     */
    if (
      crewMember.getLocation() != null &&
        event.getLocation() != null &&
        crewMember.getLocation()
          .equalsIgnoreCase(event.getLocation())
    ) {
      return BigDecimal.valueOf(90);
    }

    /*
     * Location data exists but doesn't match.
     */
    if (
      crewMember.getLocation() != null &&
        event.getLocation() != null
    ) {
      return BigDecimal.valueOf(20);
    }

    /*
     * No location information.
     */
    return BigDecimal.valueOf(50);
  }

  private double calculateDistance(
    double lat1,
    double lon1,
    double lat2,
    double lon2
  ) {

    final double earthRadiusKm = 6371.0;

    double latDistance =
      Math.toRadians(lat2 - lat1);

    double lonDistance =
      Math.toRadians(lon2 - lon1);

    double a =
      Math.sin(latDistance / 2)
        * Math.sin(latDistance / 2)
        +
        Math.cos(Math.toRadians(lat1))
          * Math.cos(Math.toRadians(lat2))
          * Math.sin(lonDistance / 2)
          * Math.sin(lonDistance / 2);

    double c =
      2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadiusKm * c;
  }

  private BigDecimal calculateCostFit(
    CrewMember crewMember,
    Event event
  ) {

    if (crewMember.getBasePrice() == null) {
      return BigDecimal.ZERO;
    }

    if (
      event.getBudget() == null ||
        event.getBudget().compareTo(BigDecimal.ZERO) <= 0
    ) {
      return BigDecimal.valueOf(50);
    }

    BigDecimal ratio =
      crewMember.getBasePrice()
        .divide(
          event.getBudget(),
          4,
          RoundingMode.HALF_UP
        );

    if (ratio.compareTo(BigDecimal.valueOf(0.05)) <= 0) {
      return BigDecimal.valueOf(100);
    }

    if (ratio.compareTo(BigDecimal.valueOf(0.10)) <= 0) {
      return BigDecimal.valueOf(90);
    }

    if (ratio.compareTo(BigDecimal.valueOf(0.20)) <= 0) {
      return BigDecimal.valueOf(75);
    }

    if (ratio.compareTo(BigDecimal.valueOf(0.30)) <= 0) {
      return BigDecimal.valueOf(55);
    }

    if (ratio.compareTo(BigDecimal.valueOf(0.50)) <= 0) {
      return BigDecimal.valueOf(30);
    }

    return BigDecimal.valueOf(10);
  }
}
