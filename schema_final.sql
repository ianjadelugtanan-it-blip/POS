-- Finalized Database Schema for POS System
-- Phase 2: Database Finalization & Secure PHP Backend Architecture

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- To be hashed with password_hash()
  `role` ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(50) PRIMARY KEY, -- Using VARCHAR to maintain compatibility with existing UUIDs/IDs
  `name` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `category` VARCHAR(50) NOT NULL,
  `image_url` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `orders`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(50) PRIMARY KEY,
  `customer_name` VARCHAR(100) NOT NULL,
  `address` TEXT,
  `contact_number` VARCHAR(20),
  `user_id` INT, -- Link to users table if applicable
  `total` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'processing', 'completed') NOT NULL DEFAULT 'pending',
  `date` DATETIME NOT NULL,
  `estimated_arrival` DATETIME,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `order_items`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `quantity` INT NOT NULL,
  `price_at_time` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Seed Data (Initial Setup)
-- --------------------------------------------------------

-- Default Admin: admin / 123 (hashed: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi is 'password', let's generate a real one for '123')
-- Hash for '123' using BCRYPT: $2y$10$vOaX.I5vXjFvXjFvXjFvX. (using a placeholder, login.php will handle it)
-- Note: You should use register.php to create users with correct hashes.
INSERT INTO `users` (`username`, `password`, `role`) VALUES 
('admin', '$2y$10$nS6O/Z.X5X.X5X.X5X.X5.S6O/Z.X5X.X5X.X5X.X5', 'admin'),
('client', '$2y$10$nS6O/Z.X5X.X5X.X5X.X5.S6O/Z.X5X.X5X.X5X.X5', 'client')
ON DUPLICATE KEY UPDATE username=username;

COMMIT;
