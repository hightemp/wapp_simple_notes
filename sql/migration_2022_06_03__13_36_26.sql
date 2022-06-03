CREATE TABLE `tcategories` ( id INTEGER PRIMARY KEY AUTOINCREMENT );
ALTER TABLE `tcategories` ADD `name` TEXT;
ALTER TABLE `tcategories` ADD `description` TEXT;
ALTER TABLE `tcategories` ADD `tcategories_id` INTEGER;
CREATE TEMPORARY TABLE tmp_backup(`id`,`name`,`description`,`tcategories_id`);;
CREATE TABLE `tcategories` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`name` TEXT ,`description` TEXT ,`tcategories_id` INTEGER    );;
CREATE INDEX index_foreignkey_tcategories_tcategories ON `tcategories` (tcategories_id) ;
CREATE TEMPORARY TABLE tmp_backup(`id`,`name`,`description`,`tcategories_id`);;
CREATE TABLE `tcategories` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`name` TEXT ,`description` TEXT ,`tcategories_id` INTEGER   , FOREIGN KEY(`tcategories_id`)
						 REFERENCES `tcategories`(`id`)
						 ON DELETE SET NULL ON UPDATE SET NULL );;
CREATE INDEX index_foreignkey_tcategories_tcategories ON `tcategories` (tcategories_id) ;
CREATE TABLE `tnotes` ( id INTEGER PRIMARY KEY AUTOINCREMENT );
ALTER TABLE `tnotes` ADD `created_at` NUMERIC;
ALTER TABLE `tnotes` ADD `updated_at` NUMERIC;
ALTER TABLE `tnotes` ADD `timestamp` INTEGER;
ALTER TABLE `tnotes` ADD `name` TEXT;
ALTER TABLE `tnotes` ADD `description` TEXT;
ALTER TABLE `tnotes` ADD `content` TEXT;
ALTER TABLE `tnotes` ADD `tcategories_id` INTEGER;
CREATE TEMPORARY TABLE tmp_backup(`id`,`created_at`,`updated_at`,`timestamp`,`name`,`description`,`content`,`tcategories_id`);;
CREATE TABLE `tnotes` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`created_at` NUMERIC ,`updated_at` NUMERIC ,`timestamp` INTEGER ,`name` TEXT ,`description` TEXT ,`content` TEXT ,`tcategories_id` INTEGER    );;
CREATE INDEX index_foreignkey_tnotes_tcategories ON `tnotes` (tcategories_id) ;
CREATE TEMPORARY TABLE tmp_backup(`id`,`created_at`,`updated_at`,`timestamp`,`name`,`description`,`content`,`tcategories_id`);;
CREATE TABLE `tnotes` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`created_at` NUMERIC ,`updated_at` NUMERIC ,`timestamp` INTEGER ,`name` TEXT ,`description` TEXT ,`content` TEXT ,`tcategories_id` INTEGER   , FOREIGN KEY(`tcategories_id`)
						 REFERENCES `tcategories`(`id`)
						 ON DELETE SET NULL ON UPDATE SET NULL );;
CREATE INDEX index_foreignkey_tnotes_tcategories ON `tnotes` (tcategories_id) ;
