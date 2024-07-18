package com.jbw.reservation.mappers;

import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.EmailAuthEntity;
import com.jbw.reservation.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AccessMapper {

    //모든 정규화 및 확인을 완료한 User 의 내용을 insert 하기위핸 Mapper 이다
    int insertUser(UserEntity user);

    int insertContractor(ContractorEntity contractor);

    int insertEmailAuth(EmailAuthEntity emailAuth);

    int updateEmailAuth(EmailAuthEntity emailAuth);

    int updateUser(UserEntity user);

    int updateContractor(ContractorEntity contractor);

    EmailAuthEntity selectEmailAuthEmailCodeSalt(@Param("email") String email,
                                                 @Param("code") String code,
                                                 @Param("salt") String salt);

    // email 값으로 user 을 select 하기위한 메퍼
    UserEntity selectUserByEmail(@Param("email") String email);

    UserEntity selectUserByNickname(@Param("nickname") String nickname);

    UserEntity selectUserByNameGenderSsnBirth(@Param("name") String name,
                                              @Param("gender") String gender,
                                              @Param("ssnBirth") String ssnBirth);

    // email 값으로 contractor 을 select 하기위한 메퍼
    ContractorEntity selectContractorByEmail(@Param("email") String email);

    ContractorEntity selectContractorByContact(@Param("contactFirst") String contactFirst,
                                               @Param("contactSecond") String contactSecond,
                                               @Param("contactThird") String contactThird);

    ContractorEntity selectContractorByTin(@Param("tinFirst") String tinFirst,
                                           @Param("tinSecond") String tinSecond,
                                           @Param("tinThird") String tinThird);

    ContractorEntity selectContractorByName(@Param("name") String name);

    ContractorEntity selectContractorByNameContactTin(@Param("name") String name,
                                                      @Param("contactFirst") String contactFirst,
                                                      @Param("contactSecond") String contactSecond,
                                                      @Param("contactThird") String contactThird,
                                                      @Param("tinFirst") String tinFirst,
                                                      @Param("tinSecond") String tinSecond,
                                                      @Param("tinThird") String tinThird);

    ContractorEntity[] selectContractors();
}
