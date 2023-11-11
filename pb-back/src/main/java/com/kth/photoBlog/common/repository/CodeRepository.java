package com.kth.photoBlog.common.repository;

import com.kth.photoBlog.common.entity.Code;
import com.kth.photoBlog.common.entity.CodeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CodeRepository extends JpaRepository<Code, CodeId> {

    List<Code> findByClassCodeOrderByOrders(String classCode);
    
}