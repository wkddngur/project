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
public class ContractorEntity {
    private String email;
    private String password;
    private String contractorName;
    private String contactFirst;
    private String contactSecond;
    private String contactThird;
    private String tinFirst;
    private String tinSecond;
    private String tinThird;
    private LocalDateTime createdAt;
    private boolean isDeleted;
    private boolean isSuspended;
    private boolean isAgree;
}
