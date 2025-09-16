package com.mango.backend.domain.userphoto.service;

import com.mango.backend.global.util.FileUtil;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PhotoFileService {

  private final FileUtil fileUtil;

  public ResponseEntity<byte[]> getPhoto(String filename, String domain) {
    try {
      byte[] fileBytes = fileUtil.getFile(filename, domain);

      String contentType = URLConnection.guessContentTypeFromName(filename);
      return ResponseEntity.ok()
          .header(HttpHeaders.CONTENT_TYPE,
              contentType != null ? contentType : "application/octet-stream")
          .body(fileBytes);

    } catch (FileNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .header(HttpHeaders.CONTENT_TYPE, "text/plain; charset=UTF-8")
          .body(("파일을 찾을 수 없습니다: " + filename).getBytes(StandardCharsets.UTF_8));
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .header(HttpHeaders.CONTENT_TYPE, "text/plain; charset=UTF-8")
          .body(("파일 처리 중 오류가 발생했습니다: " + filename).getBytes(StandardCharsets.UTF_8));
    }
  }
}
