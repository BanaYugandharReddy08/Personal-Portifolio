package com.example.demo.controller;

import com.example.demo.model.UserEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EncryptionService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private EncryptionService encryptionService;

    @Test
    void getUserReturnsData() throws Exception {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setFullName("John Doe");
        user.setEmail("enc");
        user.setProfilePicture("photo.png");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(encryptionService.decrypt("enc")).thenReturn("john@example.com");

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.fullName").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"))
                .andExpect(jsonPath("$.profilePicture").value("photo.png"));
    }

    @Test
    void updateUserUpdatesFields() throws Exception {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setEmail("old");
        user.setPassword("oldp");
        user.setFullName("Old");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(encryptionService.encrypt("new@example.com")).thenReturn("newenc");
        when(encryptionService.encrypt("secret")).thenReturn("encpass");
        when(userRepository.save(any(UserEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"New\",\"email\":\"new@example.com\",\"password\":\"secret\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.fullName").value("New"))
                .andExpect(jsonPath("$.email").value("new@example.com"));

        assertThat(user.getFullName()).isEqualTo("New");
        assertThat(user.getEmail()).isEqualTo("newenc");
        assertThat(user.getPassword()).isEqualTo("encpass");
    }

    @Test
    void uploadPhotoStoresFile() throws Exception {
        UserEntity user = new UserEntity();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(UserEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        MockMultipartFile file = new MockMultipartFile("file", "photo.png", "image/png", "img".getBytes());

        mockMvc.perform(multipart("/api/users/1/photo").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").exists());

        ArgumentCaptor<UserEntity> captor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(captor.capture());
        UserEntity saved = captor.getValue();
        String stored = saved.getProfilePicture();
        Path path = Path.of("uploads", stored);
        assertThat(Files.exists(path)).isTrue();
        Files.deleteIfExists(path);
    }
}
