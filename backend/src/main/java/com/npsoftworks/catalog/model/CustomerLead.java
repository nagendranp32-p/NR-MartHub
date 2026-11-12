package com.npsoftworks.catalog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_leads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerLead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phoneNumber;

    private LocalDateTime visitedAt;

    @PrePersist
    protected void onCreate() {
        this.visitedAt = LocalDateTime.now();
    }
}