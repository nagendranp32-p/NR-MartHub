package com.npsoftworks.catalog;

import com.npsoftworks.catalog.model.Product;
import com.npsoftworks.catalog.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CatalogApplication {

    public static void main(String[] args) {
        SpringApplication.run(CatalogApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(ProductRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Product(null, "Decorative Hexagon Wall Mirror", "Wall Mirrors", 799.0, "18 x 18 cm", "Engineered Wood & Glass", "Modern geometric wall mirror perfect for living rooms.", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600", true));
                repo.save(new Product(null, "Minimalist Wooden Photo Frame Set", "Frames", 499.0, "A4 Size (Set of 3)", "Pine Wood", "Sleek wall photo frame set to showcase prints and art.", "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=600", true));
                repo.save(new Product(null, "Classic Round Accent Mirror", "Wall Mirrors", 1199.0, "24 x 24 Inch", "Metallic Gold Rim", "Premium finish circular mirror crafted for bedroom dressers.", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600", true));
            }
        };
    }
}