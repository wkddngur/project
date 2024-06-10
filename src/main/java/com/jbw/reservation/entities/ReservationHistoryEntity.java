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
public class ReservationHistoryEntity {
    private int index;
    private int paymentIndex;
    private int refundIndex;
    private String userEmail;
    private double amount;
    private String schedule;
    private String carNumber;
    private LocalDateTime createdAt;
    private boolean paymentStatus;
    private boolean refundStatus;
}
