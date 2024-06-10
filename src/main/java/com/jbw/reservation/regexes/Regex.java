package com.jbw.reservation.regexes;

public class Regex {
    //멤버변수 expression은 정규 표현식을 저장하는 변수
    public final String expression;

    // 생성자 : Regex객체를 만들때 정규 표현식을 문자열로 전달하면 expression저장
    public Regex(String expression) {
        this.expression = expression;
    }
    //메서드 : 입력된 문자열 input이 정규표현식과 일치하는지 확인, allowNullOrEmpty인자를 false로 설정하여 입력 문자열이 null 이거나 비어있는경우 false를 반환
    public boolean tests(String input){
        return this.tests(input, false);
    }

    //메서드 오버로딩: public boolean tests(String input, boolean allowNullOrEmpty)
    //
    //이 메서드는 두 번째 인자로 allowNullOrEmpty를 받습니다.
    //입력 문자열 input이 null이거나 비어 있는 경우 allowNullOrEmpty가 true이면 true를 반환하고, 그렇지 않으면 false를 반환합니다.
    //입력 문자열이 비어 있지 않으면, 정규 표현식과 일치하는지 확인합니다.
    public boolean tests(String input, boolean allowNullOrEmpty){
        if (input == null || input.isEmpty()) {
            return allowNullOrEmpty;
        }
        return input.matches(this.expression);// 입력문자열이 정규 표현식과 일치하는지 검사
    }
}
