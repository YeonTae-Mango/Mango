package com.mango.backend.domain.user.controller;


import com.mango.backend.domain.user.dto.request.UserUpdateRequest;
import com.mango.backend.domain.user.dto.response.MyInfoResponse;
import com.mango.backend.domain.user.dto.response.UserInfoResponse;
import com.mango.backend.domain.user.dto.response.UserUpdateResponse;
import com.mango.backend.domain.user.service.UserService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import com.mango.backend.global.common.api.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController extends BaseController {

  private final UserService userService;

  @Operation(summary = "회원 탈퇴", description = "JWT 토큰을 이용해 본인 계정을 탈퇴합니다.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "회원 탈퇴 성공",
          content = @Content),
      @ApiResponse(responseCode = "403", description = "본인 계정만 탈퇴 가능",
          content = @Content),
      @ApiResponse(responseCode = "400", description = "잘못된 입력값",
          content = @Content)
  })
  @DeleteMapping("/{userId}")
  public ResponseEntity<BaseResponse> deleteUser(
      @PathVariable Long userId,
      @RequestHeader("Authorization") String token) {
    return toResponseEntity(userService.deleteUser(userId, token), "회원 탈퇴에 성공했습니다.");
  }

  @Operation(
      summary = "사용자 단건 조회",
      description = "사용자 ID를 통해 단일 사용자 정보를 조회합니다.",
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "조회 성공",
              content = @Content(schema = @Schema(
                  oneOf = {MyInfoResponse.class, UserInfoResponse.class}
              ))
          ),
          @ApiResponse(
              responseCode = "400",
              description = "잘못된 입력값 (존재하지 않는 사용자)",
              content = @Content(schema = @Schema(implementation = ErrorResponse.class))
          )
      }
  )
  @GetMapping("/{userId}")
  public ResponseEntity<BaseResponse> getUserById(
      @Parameter(description = "조회할 사용자 ID", required = true)
      @PathVariable Long userId,
      @RequestHeader("Authorization") String token) {
    return toResponseEntity(userService.getUserById(userId, token), "사용자 조회에 성공하였습니다.");
  }

  @Operation(
      summary = "사용자 정보 수정",
      description = "JWT 토큰을 이용해 본인 계정의 정보를 수정합니다.",
      requestBody = @RequestBody(
          description = "수정할 사용자 정보",
          required = true,
          content = @Content(schema = @Schema(implementation = UserUpdateRequest.class))
      ),
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "수정 성공",
              content = @Content(schema = @Schema(implementation = UserUpdateResponse.class))
          ),
          @ApiResponse(
              responseCode = "400",
              description = "잘못된 입력값(닉네임 등)",
              content = @Content(schema = @Schema(implementation = ErrorResponse.class))
          ),
          @ApiResponse(
              responseCode = "403",
              description = "본인 계정만 수정 가능",
              content = @Content(schema = @Schema(implementation = ErrorResponse.class))
          )
      }
  )
  @PutMapping("/{userId}")
  public ResponseEntity<BaseResponse> updateUser(
      @PathVariable Long userId,
      @RequestHeader("Authorization") String token,
      @RequestPart("request") UserUpdateRequest request,
      @RequestPart(value = "files", required = false) List<MultipartFile> files,
      @RequestPart(value = "orders", required = false) List<Byte> orders
  ) {
    UserUpdateRequest req = UserUpdateRequest.of(request, files, orders);
    return toResponseEntity(userService.updateUser(userId, token, req),
        "사용자 정보가 수정 되었습니다.");
  }
}