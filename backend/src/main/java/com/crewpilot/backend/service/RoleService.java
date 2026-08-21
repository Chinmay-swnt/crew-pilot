package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.Role;
import com.crewpilot.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

  private final RoleRepository roleRepository;

  public List<Role> getAllRoles() {
    return roleRepository.findAll();
  }

  public Role getRoleById(Long id) {
    return roleRepository.findById(id)
      .orElseThrow(() ->
        new RuntimeException("Role not found: " + id));
  }

  public Role createRole(Role role) {
    return roleRepository.save(role);
  }

  public Role updateRole(Long id, Role updatedRole) {
    Role existing = getRoleById(id);

    existing.setName(updatedRole.getName());

    return roleRepository.save(existing);
  }

  public void deleteRole(Long id) {
    Role existing = getRoleById(id);
    roleRepository.delete(existing);
  }
}
