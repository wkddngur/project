package com.jbw.reservation.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(of = {"parkingLotIndex","userEmail"})
@AllArgsConstructor
@NoArgsConstructor
public class ParkingLotFavoriteEntity {
    private int parkingLotIndex;
    private String userEmail;
    private LocalDateTime createdAt;
}
