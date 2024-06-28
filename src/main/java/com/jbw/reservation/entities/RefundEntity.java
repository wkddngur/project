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
public class RefundEntity {
    private int index;
    private int parkingLotIndex;
    private int paymentIndex;
    private String userEmail;
    private double amount;
    private String bankCode;
    private String bankAccountNumber;
    private LocalDateTime createdAt;
    private boolean isAgree;

}
