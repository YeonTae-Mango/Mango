package com.mango.backend.domain.user.controller;


import com.mango.backend.domain.user.service.UserService;
import com.mango.backend.global.common.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  // 회원탈퇴
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long id) {
    return ResponseEntity.ok(userService.deleteUser(id));
  }
}
