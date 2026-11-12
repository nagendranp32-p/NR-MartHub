package com.npsoftworks.catalog.repository;

import com.npsoftworks.catalog.model.CustomerLead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerLeadRepository extends JpaRepository<CustomerLead, Long> {
}