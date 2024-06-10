package com.jbw.reservation.entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = {"parkingLotReviewIndex","userEmail"})
@AllArgsConstructor
@NoArgsConstructor
public class ParkingLotReviewReportEntity {
    private int parkingLotReviewIndex;
    private String userEmail;
    private LocalDateTime createdAt;
}
