package com.npsoftworks.catalog.controller;

import com.npsoftworks.catalog.model.CustomerLead;
import com.npsoftworks.catalog.repository.CustomerLeadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*")
public class CustomerLeadController {

    private final CustomerLeadRepository customerLeadRepository;

    public CustomerLeadController(CustomerLeadRepository customerLeadRepository) {
        this.customerLeadRepository = customerLeadRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<CustomerLead> registerLead(@RequestBody CustomerLead lead) {
        if (lead.getName() == null || lead.getPhoneNumber() == null || lead.getPhoneNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        CustomerLead savedLead = customerLeadRepository.save(lead);
        return ResponseEntity.ok(savedLead);
    }

    @GetMapping
    public List<CustomerLead> getAllLeads() {
        return customerLeadRepository.findAll();
    }
}