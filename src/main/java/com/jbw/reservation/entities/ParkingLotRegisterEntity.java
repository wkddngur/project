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
public class ParkingLotRegisterEntity {
    private int index;
    private String contractorEmail;
    private String contractorName;
    private byte[] thumbnail;
    private String thumbnailFileName;
    private String thumbnailContentType;
    private String name;
    private String categoryCode;
    private String contactFirst;
    private String contactSecond;
    private String contactThird;
    private String addressPostal;
    private String addressPrimary;
    private String addressSecondary;
    private double latitude;
    private double longitude;
    private int generalCarNumber;
    private int dpCarNumber;
    private String description;
    //private String schedule;
    private double price;
    private double dayMaxPrice;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
