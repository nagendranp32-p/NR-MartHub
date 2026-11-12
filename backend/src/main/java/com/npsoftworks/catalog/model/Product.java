package com.npsoftworks.catalog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    private Double price;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    private String dimensions;

    private String material;

    @Column(length = 2000)
    private String description;

    private Boolean isAvailable = true;
}