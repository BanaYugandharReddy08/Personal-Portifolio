package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EncryptionService {

    private static final String ALGORITHM = "AES";
    private final SecretKeySpec keySpec;

    public EncryptionService(@Value("${encryption.key:0123456789abcdef}") String key) {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        byte[] key16 = new byte[16];
        System.arraycopy(keyBytes, 0, key16, 0, Math.min(keyBytes.length, 16));
        this.keySpec = new SecretKeySpec(key16, ALGORITHM);
    }

    public String encrypt(String input) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (GeneralSecurityException e) {
            throw new RuntimeException("Unable to encrypt", e);
        }
    }

    public String decrypt(String input) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decoded = Base64.getDecoder().decode(input);
            return new String(cipher.doFinal(decoded), StandardCharsets.UTF_8);
        } catch (GeneralSecurityException e) {
            throw new RuntimeException("Unable to decrypt", e);
        }
    }
}
