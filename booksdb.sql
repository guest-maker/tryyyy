-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 
-- 伺服器版本： 8.0.17
-- PHP 版本： 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `booksdb`
--

-- --------------------------------------------------------

--
-- 資料表結構 `account`
--

CREATE TABLE `account` (
  `account` varchar(50) NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `level` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `account`
--

INSERT INTO `account` (`account`, `password`, `level`) VALUES
('123456', '$2b$12$2YMgaKkqhrTh9z2C184hHetEgxgQJB61r3tGx1bkYtFcCbfuK4SvO', 2),
('p', '$2b$12$smUN4oasJtziDvk29mJ.8eJ7oGN.Izp2.fyV3vDVgUjWwiewdq1sG', 1);

-- --------------------------------------------------------

--
-- 資料表結構 `book`
--

CREATE TABLE `book` (
  `id` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `introduction` text,
  `context` text,
  `account` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `book`
--

INSERT INTO `book` (`id`, `image`, `title`, `author`, `introduction`, `context`, `account`) VALUES
(2, 'http://localhost:8000/static/2_img.jpg', '書名', '我人', '這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字這是一段說明文字', '殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊\n\n殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊殊', NULL),
(7, 'http://localhost:8000/static/7_img.jpg', 'f', 'f', 'f', 'fffff', NULL),
(8, 'http://localhost:8000/static/8_img.jpeg', 'ff', 'ffffff', 'ff', 'f', NULL),
(20, 'http://localhost:8000/static/20_img.jpg', 'ss', 'ss', 'ss', 'ss', NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `like`
--

CREATE TABLE `like` (
  `account_id` varchar(255) NOT NULL,
  `book_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account`);

--
-- 資料表索引 `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `like`
--
ALTER TABLE `like`
  ADD PRIMARY KEY (`account_id`,`book_id`),
  ADD KEY `book_id` (`book_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `book`
--
ALTER TABLE `book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `like`
--
ALTER TABLE `like`
  ADD CONSTRAINT `like_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`account`),
  ADD CONSTRAINT `like_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
