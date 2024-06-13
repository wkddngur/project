package com.jbw.reservation.dtos;

import com.jbw.reservation.entities.ParkingLotEntity;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ParkingLotDto extends ParkingLotEntity {
    private String parkingLotCategoryText;
    private int[] imageIndexes;
    private int favoriteCount; // 즐겨찾기 갯수
    private int reviewCount; // 리뷰 갯수
    private boolean isSigned; // 로그인 여부
    private boolean isMine; // 해당 맛집 등록자 == 로그인한 사람(로그인 안 했으면 false)
    private boolean isSaved; // 즐겨찾기 여부
}
