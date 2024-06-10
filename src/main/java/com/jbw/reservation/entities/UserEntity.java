package com.jbw.reservation.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "email")
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {
    private String email;
    private String password;
    private String name;
    private String gender;
    private String nickname;
    private String ssnBirth;
    private LocalDateTime createdAt;
    private boolean isDeleted;
    private boolean isSuspended;
    private boolean isAdmin;
    private boolean isAgree;
}
