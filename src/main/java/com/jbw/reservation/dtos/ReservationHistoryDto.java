package com.jbw.reservation.dtos;

import com.jbw.reservation.entities.ReservationHistoryEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReservationHistoryDto extends ReservationHistoryEntity {
    private boolean isAgreePayment;
    private LocalDateTime createdAtPayment;
    private boolean isAgreeRefund;
    private LocalDateTime createdAtRefund;
    private String bankCode;
    private String bankAccountNumber;
}
