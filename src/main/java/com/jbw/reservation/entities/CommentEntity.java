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
public class CommentEntity {
    private int index;
    private int articleIndex;
    private String userEmail;
    private String content;
    private LocalDateTime createdAt;
    private  LocalDateTime modifiedAt;
}
