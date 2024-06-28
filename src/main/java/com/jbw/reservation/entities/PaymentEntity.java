package com.jbw.reservation.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = "index")
@AllArgsConstructor
@NoArgsConstructor
public class PaymentEntity {
    private int index;
    private int parkingLotIndex;
    private String userEmail;
    private double amount;
    private LocalDateTime createdAt;
    private boolean isAgree;
}
