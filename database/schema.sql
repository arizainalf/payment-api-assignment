-- ==============================================
-- Database Schema (DDL) for Payment API
-- Generated based on prisma/schema.prisma
-- ==============================================

-- Table: users
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NULL,
  `password` VARCHAR(255) NOT NULL,
  `profile_image` VARCHAR(255) NULL,
  `balance` DOUBLE NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: banners
CREATE TABLE `banners` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `banner_name` VARCHAR(255) NOT NULL,
  `banner_image` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: services
CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_code` VARCHAR(100) NOT NULL UNIQUE,
  `service_name` VARCHAR(255) NOT NULL,
  `service_icon` VARCHAR(255) NOT NULL,
  `service_tariff` DOUBLE NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enum-like constraint for transaction type
-- (Note: MySQL 8.0+ supports ENUM natively)
-- Table: transactions
CREATE TABLE `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(100) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `service_code` VARCHAR(100) NULL,
  `transaction_type` ENUM('TOPUP', 'PAYMENT') NOT NULL,
  `description` TEXT NOT NULL,
  `total_amount` DOUBLE NOT NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT `fk_transactions_user`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT `fk_transactions_service`
    FOREIGN KEY (`service_code`) REFERENCES `services`(`service_code`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  INDEX `idx_transactions_user_id` (`user_id`),
  INDEX `idx_transactions_created_on_desc` (`created_on` DESC),
  INDEX `idx_transactions_invoice_number` (`invoice_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
