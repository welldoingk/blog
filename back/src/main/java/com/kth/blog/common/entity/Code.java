package com.kth.blog.common.entity;

import com.kth.blog.util.Timestamped;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@IdClass(CodeId.class)
public class Code extends Timestamped {
    @Id
    private String classCode;
    @Id
    private String codeNo;
    private String codeName;

    private String remark;

    private Long orders;


    @Builder
    public Code(String classCode, String codeNo, String codeName, Long orders){
        this.classCode = classCode;
        this.codeNo = codeNo;
        this.codeName = codeName;
        this.orders = orders;
    }
}
