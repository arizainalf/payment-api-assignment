-- --------------------------------------------------------
-- Host:                         mysql-f1e7cb6-arzznlfzh.g.aivencloud.com
-- Server version:               8.0.35 - Source distribution
-- Server OS:                    Linux
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for defaultdb
DROP DATABASE IF EXISTS `defaultdb`;
CREATE DATABASE IF NOT EXISTS `defaultdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `defaultdb`;

-- Dumping structure for table defaultdb.banners
DROP TABLE IF EXISTS `banners`;
CREATE TABLE IF NOT EXISTS `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.banners: ~5 rows (approximately)
INSERT INTO `banners` (`id`, `banner_name`, `banner_image`, `description`, `created_at`, `updated_at`) VALUES
	(7, 'Banner 1', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-1.png', 'Lerem Ipsum Dolor sit amet', '2025-10-31 22:30:56', '2025-10-31 22:30:56'),
	(8, 'Banner 2', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-2.png', 'Lerem Ipsum Dolor sit amet', '2025-10-31 22:30:56', '2025-10-31 22:30:56'),
	(9, 'Banner 3', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-3.png', 'Lerem Ipsum Dolor sit amet', '2025-10-31 22:30:56', '2025-10-31 22:30:56'),
	(10, 'Banner 4', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-4.png', 'Lerem Ipsum Dolor sit amet', '2025-10-31 22:30:56', '2025-10-31 22:30:56'),
	(11, 'Banner 5', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-5.png', 'Lerem Ipsum Dolor sit amet', '2025-10-31 22:30:56', '2025-10-31 22:30:56');

-- Dumping structure for table defaultdb.services
DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_tariff` double NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_code` (`service_code`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.services: ~0 rows (approximately)
INSERT INTO `services` (`id`, `service_code`, `service_name`, `service_icon`, `service_tariff`, `created_at`, `updated_at`) VALUES
	(13, 'PAJAK', 'Pajak PBB', 'https://minio.nutech-integrasi.com/take-home-test/services/PBB.png', 40000, '2025-10-31 15:35:06', '2025-10-31 15:35:06'),
	(14, 'PLN', 'Listrik', 'https://minio.nutech-integrasi.com/take-home-test/services/Listrik.png', 10000, '2025-10-31 15:35:06', '2025-10-31 15:35:06'),
	(15, 'PDAM', 'PDAM Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/PDAM.png', 40000, '2025-10-31 15:35:06', '2025-10-31 15:35:06'),
	(16, 'PULSA', 'Pulsa', 'https://minio.nutech-integrasi.com/take-home-test/services/Pulsa.png', 40000, '2025-10-31 15:35:07', '2025-10-31 15:35:07'),
	(17, 'PGN', 'PGN Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/PGN.png', 50000, '2025-10-31 15:35:07', '2025-10-31 15:35:07'),
	(18, 'MUSIK', 'Musik Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/Musik.png', 50000, '2025-10-31 15:35:07', '2025-10-31 15:35:07'),
	(19, 'TV', 'TV Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/Televisi.png', 50000, '2025-10-31 15:35:07', '2025-10-31 15:35:07'),
	(20, 'PAKET_DATA', 'Paket Data', 'https://minio.nutech-integrasi.com/take-home-test/services/Paket-Data.png', 50000, '2025-10-31 15:35:07', '2025-10-31 15:35:07'),
	(21, 'VOUCHER_GAME', 'Voucher Game', 'https://minio.nutech-integrasi.com/take-home-test/services/Game.png', 100000, '2025-10-31 15:35:07', '2025-10-31 15:35:07'),
	(22, 'VOUCHER_MAKANAN', 'Voucher Makanan', 'https://minio.nutech-integrasi.com/take-home-test/services/Voucher-Makanan.png', 100000, '2025-10-31 15:35:07', '2025-10-31 15:35:07'),
	(23, 'QURBAN', 'Qurban', 'https://minio.nutech-integrasi.com/take-home-test/services/Qurban.png', 200000, '2025-10-31 15:35:07', '2025-10-31 15:35:07'),
	(24, 'ZAKAT', 'Zakat', 'https://minio.nutech-integrasi.com/take-home-test/services/Zakat.png', 300000, '2025-10-31 15:35:07', '2025-10-31 15:35:07');

-- Dumping structure for table defaultdb.transactions
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `service_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_type` enum('TOPUP','PAYMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` double NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `fk_transactions_service` (`service_code`),
  KEY `idx_transactions_user_id` (`user_id`),
  KEY `idx_transactions_created_on` (`created_at`),
  KEY `idx_transactions_invoice_number` (`invoice_number`),
  CONSTRAINT `fk_transactions_service` FOREIGN KEY (`service_code`) REFERENCES `services` (`service_code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.transactions: ~2 rows (approximately)
INSERT INTO `transactions` (`id`, `invoice_number`, `user_id`, `service_code`, `transaction_type`, `description`, `total_amount`, `created_at`, `updated_at`) VALUES
	(1, 'INV20251030-642', 1, NULL, 'TOPUP', 'Top Up balance', 1000000, '2025-10-30 14:29:10', '2025-10-30 14:29:10'),
	(2, 'INV20251030-416', 1, NULL, 'TOPUP', 'Top Up balance', 2000000, '2025-10-30 14:45:04', '2025-10-30 14:45:04'),
	(3, 'INV20251030-195', 1, NULL, 'PAYMENT', 'Pulsa', 40000, '2025-10-30 14:45:33', '2025-10-30 14:45:33'),
	(4, 'INV20251031-336', 2, NULL, 'TOPUP', 'Top Up balance', 1000000, '2025-10-31 15:40:32', '2025-10-31 15:40:32'),
	(5, 'INV20251031-508', 2, 'PLN', 'PAYMENT', 'Listrik', 10000, '2025-10-31 15:46:31', '2025-10-31 15:46:31'),
	(6, 'INV20251031-254', 2, 'PULSA', 'PAYMENT', 'Pulsa', 40000, '2025-10-31 15:49:46', '2025-10-31 15:49:46');

-- Dumping structure for table defaultdb.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balance` double NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.users: ~1 rows (approximately)
INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `password`, `profile_image`, `balance`, `created_at`, `updated_at`) VALUES
	(1, 'user@nutech-integrasi.com', 'User Edited bro', 'Nutech', '$2b$12$0qyF5ClQgpLGPKOkhO9TTO/C0iMCERD4QFRz8cG3q2Cz.Guy84xum', 'profile-1761839213926-11047137.png', 2960000, '2025-10-30 14:25:37', '2025-10-30 15:46:52'),
	(2, 'arizainalf@gmail.com', 'Ari Zain', 'Fauz', '$2b$12$69ZUEM5MQ3JZo/jBUSsTAe1rO48cFmFEpkNfAfd/15cvYnOBDSYmK', 'profile-1761924098162-96405243.png', 950000, '2025-10-31 13:59:31', '2025-10-31 15:49:45'),
	(3, 'yatirohayati@gmail.com', 'first name', 'last name', '$2b$12$QdUJNtekD9MM7iHIgSlRN.t1T7orjYXDMl0Z7L2scer8K2X/lIM5.', NULL, 0, '2025-10-31 15:58:56', '2025-10-31 16:09:04');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
