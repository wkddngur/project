package com.jbw.reservation.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode (of = "code")
@AllArgsConstructor
@NoArgsConstructor
public class BoardCategoryEntity {
    private String code;
    private String text;
}
