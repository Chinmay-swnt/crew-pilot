package com.crewpilot.backend.controller;

import com.crewpilot.backend.entity.Role;
import com.crewpilot.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@CrossOrigin
public class RoleController {

  private final RoleService roleService;

  @GetMapping
  public List<Role> getAllRoles() {
    return roleService.getAllRoles();
  }

  @GetMapping("/{id}")
  public Role getRole(@PathVariable Long id) {
    return roleService.getRoleById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Role createRole(@RequestBody Role role) {
    return roleService.createRole(role);
  }

  @PutMapping("/{id}")
  public Role updateRole(
    @PathVariable Long id,
    @RequestBody Role role
  ) {
    return roleService.updateRole(id, role);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteRole(@PathVariable Long id) {
    roleService.deleteRole(id);
  }
}
