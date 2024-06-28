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
    private int parkingLotIndex;
    private int paymentIndex;
    private Integer refundIndex;
    private String userEmail;
    private String userContact;
    private double amount;
    private String carNumber;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private boolean isDeleted;
}
