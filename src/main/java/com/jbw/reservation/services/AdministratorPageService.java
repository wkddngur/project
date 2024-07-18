package com.jbw.reservation.services;

import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.mappers.AccessMapper;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdministratorPageService {
    private final AccessMapper accessMapper;

    @Autowired
    public AdministratorPageService(AccessMapper accessMapper) {
        this.accessMapper = accessMapper;
    }

    public ContractorEntity[] ContractorList(UserEntity user) {
        if (user == null) {
            return null;
        }

        UserEntity dbUser = this.accessMapper.selectUserByEmail(user.getEmail());

        if (dbUser == null) {
            return null;
        }

        if (!dbUser.isAdmin()) {
            return null;
        }

        return this.accessMapper.selectContractors();
    }

    public Result ApprovedConfirm(UserEntity user,
                                  String email) {
        if (user == null || email == null) {
            return CommonResult.FAILURE;
        }

        if (!user.isAdmin()) {
            return CommonResult.FAILURE;
        }

        ContractorEntity dbContractor = this.accessMapper.selectContractorByEmail(email);

        if (dbContractor == null) {
            return CommonResult.FAILURE;
        }

        dbContractor.setApproved(true);

        int updateResult = this.accessMapper.updateContractor(dbContractor);

        if (updateResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }

}
