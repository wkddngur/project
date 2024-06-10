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
public class ParkingLotReviewEntity {
    private int index;
    private int parkingLotIndex;
    private String userEmail;
    private int rating;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
