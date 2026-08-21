package com.crewpilot.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Map<String, Object> handleNotFound(
    ResourceNotFoundException exception
  ) {
    return Map.of(
      "timestamp", LocalDateTime.now(),
      "status", 404,
      "error", "Not Found",
      "message", exception.getMessage()
    );
  }

  @ExceptionHandler(ConflictException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public Map<String, Object> handleConflict(
    ConflictException exception
  ) {
    return Map.of(
      "timestamp", LocalDateTime.now(),
      "status", 409,
      "error", "Conflict",
      "message", exception.getMessage()
    );
  }

  @ExceptionHandler(IllegalArgumentException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, Object> handleBadRequest(
    IllegalArgumentException exception
  ) {
    return Map.of(
      "timestamp", LocalDateTime.now(),
      "status", 400,
      "error", "Bad Request",
      "message", exception.getMessage()
    );
  }
}
