package com.mango.backend.domain.userphoto.controller;


import com.mango.backend.domain.userphoto.service.PhotoFileService;
import com.mango.backend.domain.userphoto.service.UserPhotoService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/photos")
@RequiredArgsConstructor
public class UserPhotoController extends BaseController {

  private final UserPhotoService userPhotoService;
  private final PhotoFileService photoFileService;

  @Operation(summary = "사용자 사진 목록 조회", description = "사용자가 업로드한 사진 목록을 조회합니다.")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "조회 성공")
  })
  @GetMapping("/{userId}")
  public ResponseEntity<BaseResponse> getUserPhotos(@PathVariable Long userId) {
    return toResponseEntity(userPhotoService.getUserPhotos(userId), "사진 목록 조회 성공");
  }

  @Operation(summary = "사용자 사진 업로드", description = "사용자가 사진을 업로드합니다.")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "업로드 성공"),
      @ApiResponse(responseCode = "400", description = "파일 업로드 실패")
  })
  @PostMapping("/{userId}")
  public ResponseEntity<BaseResponse> uploadPhoto(
      @RequestHeader("Authorization") String token,
      @PathVariable Long userId,
      @Parameter(description = "업로드할 이미지 파일", required = true)
      @RequestPart("files") List<MultipartFile> files
  ) {
    return toResponseEntity(userPhotoService.uploadPhoto(token, userId, files),
        "이미지 업로드가 완료되었습니다.");
  }

  @Operation(summary = "사용자 사진 삭제", description = "사용자가 업로드한 사진을 삭제합니다.")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "삭제 성공"),
      @ApiResponse(responseCode = "404", description = "사진을 찾을 수 없음")
  })
  @DeleteMapping("/{userId}/{photoId}")
  public ResponseEntity<BaseResponse> deletePhoto(
      @RequestHeader("Authorization") String token,
      @PathVariable Long userId,
      @Parameter(description = "삭제할 사진 ID", required = true)
      @PathVariable Long photoId
  ) {
    return toResponseEntity(userPhotoService.deletePhoto(token, userId, photoId), "사진 삭제 성공");
  }

  @Operation(
      summary = "사용자 사진 조회",
      description = "파일명을 기반으로 사용자가 업로드한 사진을 반환합니다."
  )
  @ApiResponse(responseCode = "200", description = "사진 조회 성공")
  @GetMapping("/{domain}/{filename}")
  public ResponseEntity<byte[]> getPhoto(
      @Parameter(description = "사진이 저장된 도메인(profile, thumbnail 등)", required = true)
      @PathVariable String domain,
      @Parameter(description = "조회할 파일명", required = true)
      @PathVariable String filename
  ) {
    return photoFileService.getPhoto(filename, domain);
  }
}
