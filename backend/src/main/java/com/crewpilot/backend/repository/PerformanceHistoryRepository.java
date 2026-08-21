package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.PerformanceHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceHistoryRepository
  extends JpaRepository<PerformanceHistory, Long> {

  List<PerformanceHistory> findByCrewMemberId(Long crewMemberId);

  List<PerformanceHistory> findByCrewMemberIdAndEventType(
    Long crewMemberId,
    String eventType
  );

  List<PerformanceHistory> findByCrewMemberIdAndNoShow(
    Long crewMemberId,
    Boolean noShow
  );
}
