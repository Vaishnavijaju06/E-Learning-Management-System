package com.skillforge.backend.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillforge.backend.entity.User;

@Service
public class JwtService {

    private static final Base64.Encoder ENCODER =
        Base64.getUrlEncoder().withoutPadding();

    private static final Base64.Decoder DECODER =
        Base64.getUrlDecoder();

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long expirationMs;

    public JwtService(
        ObjectMapper objectMapper,
        @Value("${app.jwt.secret}") String secret,
        @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        if (secret.length() < 32) {
            throw new IllegalArgumentException(
                "JWT secret must contain at least 32 characters"
            );
        }

        this.objectMapper = objectMapper;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationMs = expirationMs;
    }

    public String generateToken(User user) {
        try {
            long issuedAt = Instant.now().getEpochSecond();
            long expiresAt = issuedAt + (expirationMs / 1000);

            Map<String, Object> header = Map.of(
                "alg", "HS256",
                "typ", "JWT"
            );

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", user.getEmail());
            payload.put("role", user.getRole().name());
            payload.put("iat", issuedAt);
            payload.put("exp", expiresAt);

            String headerPart = encode(
                objectMapper.writeValueAsBytes(header)
            );

            String payloadPart = encode(
                objectMapper.writeValueAsBytes(payload)
            );

            String unsignedToken = headerPart + "." + payloadPart;
            String signature = encode(sign(unsignedToken));

            return unsignedToken + "." + signature;
        } catch (Exception exception) {
            throw new IllegalStateException(
                "Could not generate authentication token",
                exception
            );
        }
    }

    public String extractUsername(String token) {
        return String.valueOf(parsePayload(token).get("sub"));
    }

    public boolean isTokenValid(String token, String username) {
        try {
            Map<String, Object> payload = parsePayload(token);
            String subject = String.valueOf(payload.get("sub"));
            long expiration = ((Number) payload.get("exp")).longValue();

            return subject.equalsIgnoreCase(username)
                && expiration > Instant.now().getEpochSecond();
        } catch (Exception exception) {
            return false;
        }
    }

    private Map<String, Object> parsePayload(String token) {
        try {
            String[] parts = token.split("\\.");

            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid JWT");
            }

            String unsignedToken = parts[0] + "." + parts[1];
            byte[] expectedSignature = sign(unsignedToken);
            byte[] receivedSignature = DECODER.decode(parts[2]);

            if (!MessageDigest.isEqual(
                expectedSignature,
                receivedSignature
            )) {
                throw new IllegalArgumentException(
                    "Invalid JWT signature"
                );
            }

            byte[] payloadBytes = DECODER.decode(parts[1]);

            return objectMapper.readValue(
                payloadBytes,
                new TypeReference<>() {
                }
            );
        } catch (Exception exception) {
            throw new IllegalArgumentException(
                "Invalid authentication token",
                exception
            );
        }
    }

    private byte[] sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
    }

    private String encode(byte[] value) {
        return ENCODER.encodeToString(value);
    }
}
