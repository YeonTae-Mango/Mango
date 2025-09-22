package com.mango.backend.global.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class FinAnalysisApiClient {
    @Value("${external.api.base-url}")
    private String externalApiBaseUrl;

    public RestClient createRestClient() {
        return RestClient.builder()
                .baseUrl(externalApiBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
