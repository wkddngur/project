package com.jbw.reservation.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PageSetDto {
    private int countPerPage = 10; // 한 페이지당 보여줄 게시글의 개수
    private int requestPage; // 사용자가 요청한 페이지 번호
    private int totalCount;  // 전체 게시글의 개수
    private int maxPage;     // 조회 할 수 있는 최대 페이지
    private int minPage = 1; // 조화 할 수 있는 최소 페이지
    private int offset; // 거를 게시글 수
}
