package com.jbw.reservation.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Builder
@Data
@EqualsAndHashCode(of = "index")
@AllArgsConstructor
public class ParkingLotImageEntity {
    @Builder.Default
    private int index = 0;
    @Builder.Default
    private int parkingLotIndex = 0;
    private byte[] data;
    private String name;
    private String contentType;

    public ParkingLotImageEntity() {
        this.index = 0;
        this.parkingLotIndex = 0;
    }
}
