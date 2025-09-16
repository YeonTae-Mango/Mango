package com.mango.backend.global.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Component
@Slf4j
public class FileUtil {

  @Value("${upload.dir}")
  private String uploadDir;

  @Value("${upload.base-url}")
  private String baseUrl;

  private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
      ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"
  );

  /**
   * 디스크에 MultipartFile을 저장하고 파일명을 반환합니다.
   *
   * @param multipartFile 파일 객체
   * @param domain        이미지가 저장될 곳의 디렉토리(profile, thumbnail)
   * @return 저장된 파일명
   */
  public String saveFile(MultipartFile multipartFile, String domain) throws IOException {
    log.info("업로드 DIR : {}", uploadDir);
    if (multipartFile.isEmpty()) {
      throw new IllegalArgumentException("업로드할 파일이 없습니다.");
    }
    String originalFilename = multipartFile.getOriginalFilename();
    if (originalFilename == null) {
      throw new IllegalArgumentException("파일 원본 이름이 없습니다.");
    }
    validateFileExtension(originalFilename);

    byte[] fileBytes = multipartFile.getBytes();

    String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
    String storedFileName = UUID.randomUUID() + extension;

    Path targetPath = Paths.get(uploadDir, domain, storedFileName);
    Files.createDirectories(targetPath.getParent());
    Files.write(targetPath, fileBytes);
    log.info("파일 저장 완료 : {}", storedFileName);
    log.info("저장할 경로 : {}", String.join("/", baseUrl.replaceAll("/$", ""), domain, storedFileName));
    return String.join("/", baseUrl.replaceAll("/$", ""), domain, storedFileName);
  }

  /**
   * 디스크에 저장된 파일을 byte[] 배열로 반환합니다.
   *
   * @param filename 저장된 파일명 (UUID)
   * @param domain   파일이 저장된 하위 디렉토리
   * @return 파일의 byte[]
   */
  public byte[] getFile(String filename, String domain) throws IOException {
    Path filePath = Paths.get(uploadDir, domain, filename);

    if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
      throw new FileNotFoundException("요청한 파일을 찾을 수 없거나 읽을 수 없습니다: " + filePath);
    }

    return Files.readAllBytes(filePath);
  }

  /**
   * 파일 확장자 검증 (Whitelist 방식)
   */
  private void validateFileExtension(String filename) {
    String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXTENSIONS.contains(extension)) {
      throw new IllegalArgumentException("허용되지 않는 파일 확장자입니다: " + extension);
    }
  }

  /**
   * 디스크에 저장된 파일을 삭제합니다.
   *
   * @param url    파일 호출 URL
   * @param domain 파일이 저장된 하위 디렉토리(profile, thumbnail)
   */
  public void deleteFile(String url, String domain) throws IOException {
    String filename = url.substring(url.lastIndexOf("/") + 1);
    Path filePath = Paths.get(uploadDir, domain, filename);

    try {
      Files.delete(filePath);
      log.info("파일 삭제 성공: {}", filePath);
    } catch (NoSuchFileException e) {
      log.warn("삭제할 파일을 찾을 수 없습니다: {}", filePath);
    }
  }
}