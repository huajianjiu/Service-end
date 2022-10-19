# ************************************************************
# Antares - SQL Client
# Version 0.5.3
# 
# https://antares-sql.app/
# https://github.com/antares-sql/antares
# 
# Host: 47.100.242.112 (Source distribution 8.0.24)
# Database: bbs
# Generation time: 2022-10-19T22:14:50+08:00
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table admin
# ------------------------------------------------------------

CREATE TABLE `admin` (
  `adminID` int NOT NULL AUTO_INCREMENT COMMENT '管理员编号',
  `adminName` varchar(15) NOT NULL COMMENT '管理员账号',
  `adminPassword` varchar(15) NOT NULL COMMENT '管理员密码',
  PRIMARY KEY (`adminID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='管理员账号表';



# Dump of table announcement
# ------------------------------------------------------------

CREATE TABLE `announcement` (
  `aID` int NOT NULL AUTO_INCREMENT COMMENT '公告编号',
  `aTitle` varchar(100) NOT NULL COMMENT '公告标题',
  `aContents` text NOT NULL COMMENT '公告内容',
  `aTime` datetime NOT NULL COMMENT '发布时间',
  `aClickCount` int unsigned NOT NULL COMMENT '点击次数',
  PRIMARY KEY (`aID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='公告表';



# Dump of table email
# ------------------------------------------------------------

CREATE TABLE `email` (
  `email` varchar(50) NOT NULL,
  `code` varchar(15) NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='缓存邮箱验证码';



# Dump of table imglist
# ------------------------------------------------------------

CREATE TABLE `imglist` (
  `pID` int NOT NULL AUTO_INCREMENT COMMENT '图片编号',
  `topicTID` int NOT NULL COMMENT '图片所属帖子编号',
  `imgURL` varchar(255) DEFAULT NULL COMMENT '图片地址',
  PRIMARY KEY (`pID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;



# Dump of table reply
# ------------------------------------------------------------

CREATE TABLE `reply` (
  `rID` int NOT NULL AUTO_INCREMENT COMMENT '评论编号',
  `topicPID` int NOT NULL COMMENT '评论帖子编号',
  `userUID` int NOT NULL COMMENT '用户ID',
  `rContents` varchar(200) NOT NULL COMMENT '评论内容',
  `rTime` datetime NOT NULL COMMENT '评论时间',
  `rLikes` int unsigned NOT NULL COMMENT '评论点赞数',
  PRIMARY KEY (`rID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='评论信息表';



# Dump of table section
# ------------------------------------------------------------

CREATE TABLE `section` (
  `sID` int NOT NULL AUTO_INCREMENT COMMENT '板块编号',
  `sName` varchar(15) NOT NULL COMMENT '板块名',
  `sStatement` varchar(500) NOT NULL COMMENT '板块描述',
  `sClickCount` int unsigned NOT NULL DEFAULT '0' COMMENT '板块点击次数',
  `sTopicCount` int unsigned NOT NULL DEFAULT '0' COMMENT '板块帖子数',
  PRIMARY KEY (`sID`) USING BTREE,
  UNIQUE KEY `sName` (`sName`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='板块信息表';



# Dump of table topic
# ------------------------------------------------------------

CREATE TABLE `topic` (
  `tID` int NOT NULL AUTO_INCREMENT COMMENT '帖子编号',
  `sectionSID` int NOT NULL COMMENT '所属板块编号',
  `userUID` int NOT NULL COMMENT '用户编号',
  `tStatus` smallint unsigned NOT NULL COMMENT '帖子审核状态（未审核0，已审核1）',
  `tReplyCount` int unsigned NOT NULL COMMENT '回复数量',
  `tTitle` varchar(50) NOT NULL COMMENT '帖子标题',
  `tContents` varchar(2000) DEFAULT NULL COMMENT '帖子内容',
  `tTime` datetime NOT NULL COMMENT '帖子发布时间',
  `tClickCount` int unsigned NOT NULL COMMENT '帖子点击次数',
  `tCoverURL` varchar(255) DEFAULT NULL COMMENT '帖子封面图片',
  `tLike` int unsigned NOT NULL COMMENT '点赞数',
  PRIMARY KEY (`tID`) USING BTREE,
  KEY `sID` (`sectionSID`) USING BTREE,
  KEY `uID` (`userUID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='帖子信息表';



# Dump of table user
# ------------------------------------------------------------

CREATE TABLE `user` (
  `uID` int NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `userName` varchar(320) NOT NULL COMMENT '用户账号',
  `userPassword` varchar(20) NOT NULL COMMENT '用户密码',
  `userNickname` varchar(20) DEFAULT NULL COMMENT '用户昵称',
  `userEmail` varchar(320) DEFAULT NULL COMMENT '用户邮箱',
  `userAvatarUrl` varchar(100) DEFAULT NULL COMMENT '用户头像地址',
  `userBirthday` date DEFAULT NULL COMMENT '用户生日',
  `userGender` varchar(2) DEFAULT NULL COMMENT '用户性别',
  `userStatement` varchar(200) DEFAULT NULL COMMENT '用户个性签名',
  `userRegDate` date NOT NULL COMMENT '注册日期',
  `userStatus` int unsigned NOT NULL COMMENT '正常：0，封禁：1',
  `banBeginDate` datetime DEFAULT NULL COMMENT '封禁时间',
  PRIMARY KEY (`uID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='用户信息表';



# Dump of views
# ------------------------------------------------------------

# Creating temporary tables to overcome VIEW dependency errors


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

# Dump completed on 2022-10-19T22:14:50+08:00
