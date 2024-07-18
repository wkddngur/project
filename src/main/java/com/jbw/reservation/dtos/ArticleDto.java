package com.jbw.reservation.dtos;

import com.jbw.reservation.entities.ArticleEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArticleDto extends ArticleEntity {
    private String userName;
}
