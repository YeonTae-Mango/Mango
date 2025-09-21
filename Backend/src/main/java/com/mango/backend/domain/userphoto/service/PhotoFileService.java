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
      // 파일이 없을 때: body에 null을 넣고 http code를 404 Not Found로 설정
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (IOException e) {
      // 기타 I/O 오류: body에 null을 넣고 http code를 500 Internal Server Error로 설정
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }
}
