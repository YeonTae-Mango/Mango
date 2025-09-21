package com.mango.backend.domain.visited.controller;

import com.mango.backend.domain.visited.dto.request.VisitedRequest;
import com.mango.backend.domain.visited.service.VisitedService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.common.api.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/visited")
@RequiredArgsConstructor
public class VisitedController extends BaseController {

}
