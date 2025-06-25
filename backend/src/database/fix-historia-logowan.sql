-- Naprawa nazw kolumn w auth_historia_logowan

ALTER TABLE `auth_historia_logowan`
CHANGE COLUMN `id_history` `id_wpisu` int NOT NULL AUTO_INCREMENT,
CHANGE COLUMN `user_login` `id_logowania` varchar(20) NOT NULL,
CHANGE COLUMN `login_timestamp` `data_proby_logowania` timestamp NOT NULL,
CHANGE COLUMN `status` `status_logowania` enum('success','failed') NOT NULL,
CHANGE COLUMN `session_start` `poczatek_sesji` timestamp NULL DEFAULT NULL,
CHANGE COLUMN `session_end` `koniec_sesji` timestamp NULL DEFAULT NULL;

SELECT 'Naprawiono nazwy kolumn w auth_historia_logowan!' as Status; 