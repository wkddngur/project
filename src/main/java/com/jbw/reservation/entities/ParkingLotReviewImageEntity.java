package com.jbw.reservation.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(of = "index")
@AllArgsConstructor
@NoArgsConstructor
public class ParkingLotReviewImageEntity {
    private int index;
    private int parkingLotReviewIndex;
    private byte[] data;
    private String name;
    private String contentType;
}
