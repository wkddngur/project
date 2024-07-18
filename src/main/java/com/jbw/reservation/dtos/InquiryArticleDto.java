package com.jbw.reservation.dtos;

import com.jbw.reservation.entities.InquiryArticleEntity;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InquiryArticleDto extends InquiryArticleEntity {
    private String userName;
}
