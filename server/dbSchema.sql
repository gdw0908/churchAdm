# ************************************************************
# gdw Pro SQL dump
# 
#
# Host: 192.168.219.100 (MySQL 5.5.5-10.5.8-MariaDB-1:10.5.8+maria~focal)
# Database: ysgango
# Generation Time: 2021-12-16 16:31:04 +0000
# ************************************************************

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# Dump of table YS_MEMBER
# ------------------------------------------------------------

DROP TABLE IF EXISTS `YS_MEMBER`;

CREATE TABLE `YS_MEMBER` (
  `MEMBER_SEQ` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '식별자',
  `MEMBER_ID` varchar(128) NOT NULL DEFAULT '' COMMENT '아이디',
  `MEMBER_PW` varchar(100) NOT NULL DEFAULT '' COMMENT '패스워드',
  `MEMBER_NM` varchar(32) DEFAULT '' COMMENT '이름',
  `GROUP_SEQ` varchar(1) DEFAULT '' COMMENT '회원등급(1:관리자,2:일반사용자)',
  `EMAIL` varchar(100) DEFAULT '' COMMENT '이메일',
  `REG_ID` varchar(32) DEFAULT '' COMMENT '등록자',
  `REG_DT` datetime NULL COMMENT '등록일자',
  `MOD_ID` varchar(32) DEFAULT '' COMMENT '수정자',
  `MOD_DT` datetime NULL COMMENT '수정일자',
  `DEL_YN` varchar(32) DEFAULT 'N' COMMENT '삭제여부',
  `DEL_ID` varchar(32) DEFAULT '' COMMENT '삭제자',
  `DEL_DT` datetime NULL COMMENT '삭제일자',
  PRIMARY KEY (`MEMBER_SEQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO YS_MEMBER (MEMBER_SEQ, MEMBER_ID, MEMBER_PW, MEMBER_NM, GROUP_SEQ, EMAIL, REG_ID, REG_DT)
VALUES
(1,'admin','$2a$10$k7ISBB..wOwuNL6lrocOaupstWpwOWbo4x.FZ1M5eVSfOwy3yI7Na','관리자','1','test@test.com','admin',current_timestamp());

DROP TABLE IF EXISTS `YS_BOARD`;

CREATE TABLE `YS_BOARD` (
  `BOARD_SEQ` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '식별자',
  `GUBUN` varchar(4000) NOT NULL DEFAULT '' COMMENT '1-공지사항, 2-갤러리',
  `SUBJECT` varchar(300) NOT NULL DEFAULT '' COMMENT '제목',
  `CONTENTS` varchar(4000) NOT NULL DEFAULT '' COMMENT '내용',
  `REG_ID` varchar(32) DEFAULT '' COMMENT '등록자',
  `REG_DT` datetime NULL COMMENT '등록일자',
  `MOD_ID` varchar(32) DEFAULT '' COMMENT '수정자',
  `MOD_DT` datetime NULL COMMENT '수정일자',
  `DEL_YN` varchar(32) DEFAULT 'N' COMMENT '삭제여부',
  `DEL_ID` varchar(32) DEFAULT '' COMMENT '삭제자',
  `DEL_DT` datetime NULL COMMENT '삭제일자',
  `VIEW_CNT` int(10) NULL COMMENT '조회수',
  `FILE_NM` varchar(150) NULL DEFAULT '',
  PRIMARY KEY (`BOARD_SEQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Dump of table YS_IMAGE
# ------------------------------------------------------------
DROP TABLE IF EXISTS `YS_FILE`;

CREATE TABLE `YS_FILE` (
  `SEQ` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `BOARD_SEQ` int(11) unsigned NOT NULL,
  `GUBUN` int(1) NOT NULL DEFAULT 1 COMMENT '1-공지사항, 2-갤러리, 3-문의사항',
  `FILE_NM` varchar(150) NOT NULL DEFAULT '',
  PRIMARY KEY (`SEQ`),
  KEY `BOARD_SEQ` (`BOARD_SEQ`),
  CONSTRAINT `YS_IMAGE_FK_1` FOREIGN KEY (`BOARD_SEQ`) REFERENCES `YS_BOARD` (`BOARD_SEQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `YS_QNA`;

CREATE TABLE `YS_QNA` (
  `QNA_SEQ` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '식별자',
  `PARENT_SEQ` int(11) NULL DEFAULT 0 COMMENT '부모글식별자',
  `SUBJECT` varchar(300) NOT NULL DEFAULT '' COMMENT '제목',
  `WRITER` varchar(100) NOT NULL DEFAULT '' COMMENT '작성자',
  `PASSWORD` varchar(300) NOT NULL DEFAULT '' COMMENT '패스워드',
  `PUBLIC_YN` varchar(1) DEFAULT 'N' COMMENT '공개여부',
  `CONTENTS` varchar(4000) NOT NULL DEFAULT '' COMMENT '내용',
  `VIEW_CNT` int(10) NULL COMMENT '조회수',
  `FILE_NM` varchar(150) NULL DEFAULT '파일명',
  `LVL` int(1) NULL DEFAULT 0 COMMENT '레벨',
  `REG_ID` varchar(32) DEFAULT '' COMMENT '등록자',
  `REG_DT` datetime NULL COMMENT '등록일자',
  `MOD_ID` varchar(32) DEFAULT '' COMMENT '수정자',
  `MOD_DT` datetime NULL COMMENT '수정일자',
  `DEL_YN` varchar(32) DEFAULT 'N' COMMENT '삭제여부',
  `DEL_ID` varchar(32) DEFAULT '' COMMENT '삭제자',
  `DEL_DT` datetime NULL COMMENT '삭제일자',  
  PRIMARY KEY (`QNA_SEQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO YS_QNA (`PARENT_SEQ`, `SUBJECT`,`WRITER`,`PASSWORD`,`PUBLIC_YN`,`CONTENTS`,`VIEW_CNT`,`FILE_NM`,`LVL`,`REG_ID`,`REG_DT`)
VALUES (1, 'TEST 제목 1','TESTER','1111','Y','콘텐츠 내용 테스트22',0,'',0,'admin',sysdate());

CREATE TABLE `t_image` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(11) unsigned NOT NULL,
  `type` int(1) NOT NULL DEFAULT 1 COMMENT '1-썸네일, 2-제품이미지, 3-제품설명이미지',
  `path` varchar(150) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `t_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `t_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


LOCK TABLES `t_image` WRITE;
/*!40000 ALTER TABLE `t_image` DISABLE KEYS */;

INSERT INTO `t_image` (`id`, `product_id`, `type`, `path`)
VALUES
	(10,1,1,'keyboard1.jpg'),
	(11,1,2,'keyboard1.jpg'),
	(12,1,2,'keyboard2.jpg'),
	(14,1,3,'detail.jpg'),
	(15,2,1,'mouse1.jpg'),
	(16,2,2,'mouse1.jpg'),
	(17,2,3,'detail.jpg'),
	(18,1,2,'keyboard3.jpg'),
	(20,8,1,'mousepad1.jpg'),
	(22,8,2,'mousepad1.jpg'),
	(23,8,2,'mousepad2.jpg'),
	(24,8,2,'mousepad3.jpg'),
	(25,8,3,'detail.jpg');

/*!40000 ALTER TABLE `t_image` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_product
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_product`;

CREATE TABLE `t_product` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_name` varchar(200) NOT NULL DEFAULT '',
  `product_price` int(11) NOT NULL DEFAULT 0,
  `delivery_price` int(11) NOT NULL DEFAULT 0,
  `add_delivery_price` int(11) NOT NULL DEFAULT 0,
  `tags` varchar(100) DEFAULT NULL,
  `outbound_days` int(2) NOT NULL DEFAULT 5,
  `seller_id` int(11) unsigned NOT NULL,
  `category_id` int(11) unsigned NOT NULL,
  `active_yn` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `t_product_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `t_seller` (`id`),
  CONSTRAINT `t_product_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `t_category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_product` WRITE;
/*!40000 ALTER TABLE `t_product` DISABLE KEYS */;

INSERT INTO `t_product` (`id`, `product_name`, `product_price`, `delivery_price`, `add_delivery_price`, `tags`, `outbound_days`, `seller_id`, `category_id`, `active_yn`, `created_date`)
VALUES
	(1,'K70 RGB MK.2 BROWN 기계식 게이밍 키보드 갈축',219000,2500,5000,'키보드,기계식,게이밍',5,1,1,'Y','2021-01-10 00:00:00'),
	(2,'로지텍 MX VERTICAL 인체공학 무선 마우스',11900,2500,5000,'마우스',5,1,1,'Y','2021-01-10 00:00:00'),
	(8,'테스트 제품 AAA',23000,5000,2500,'테스트,노트북,악세사리',5,1,1,'Y','2021-01-21 00:41:14'),
	(9,'제품 테스트2',30000,5000,5000,'',5,1,6,'Y','2021-01-21 01:19:28');

/*!40000 ALTER TABLE `t_product` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_seller
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_seller`;

CREATE TABLE `t_seller` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `phone` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_seller` WRITE;
/*!40000 ALTER TABLE `t_seller` DISABLE KEYS */;

INSERT INTO `t_seller` (`id`, `name`, `email`, `phone`)
VALUES
	(1,'개발자의품격','seungwon.go@gmail.com','010-1111-1111');

/*!40000 ALTER TABLE `t_seller` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
  `email` varchar(50) NOT NULL DEFAULT '',
  `type` int(1) NOT NULL DEFAULT 1 COMMENT '1-buyer, 2-seller',
  `nickname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_user` WRITE;
/*!40000 ALTER TABLE `t_user` DISABLE KEYS */;

INSERT INTO `t_user` (`email`, `type`, `nickname`)
VALUES
	('seungwon.go@gmail.com',1,'고승원');

/*!40000 ALTER TABLE `t_user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;