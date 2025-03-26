-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : jeu. 20 mars 2025 à 17:52
-- Version du serveur : 8.0.35
-- Version de PHP : 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `VSJ_natation_back`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int NOT NULL,
  `roles` json NOT NULL,
  `nom_admin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom_admin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_admin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_admin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id_admin`, `roles`, `nom_admin`, `prenom_admin`, `email_admin`, `password_admin`) VALUES
(1, '[\"ROLE_ADMIN\"]', 'Moulino', 'Valentin', 'Valentin.moulino@example.com', '$2y$12$BwGMzic3Y4GbPn2v2jW3bOTHwwymxAfg9NvUQS1seFcra3BYrxkwm');

-- --------------------------------------------------------

--
-- Structure de la table `attendance`
--

CREATE TABLE `attendance` (
  `id_attendance` int NOT NULL,
  `id_swimmer` int NOT NULL,
  `id_training` int NOT NULL,
  `historic` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_attendance` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `attendance`
--

INSERT INTO `attendance` (`id_attendance`, `id_swimmer`, `id_training`, `historic`, `is_attendance`) VALUES
(1, 4, 2, 'Présent', 1);

-- --------------------------------------------------------

--
-- Structure de la table `coach`
--

CREATE TABLE `coach` (
  `id_coach` int NOT NULL,
  `nom_coach` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom_coach` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel_coach` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_coach` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_coach` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `coach`
--

INSERT INTO `coach` (`id_coach`, `nom_coach`, `prenom_coach`, `tel_coach`, `email_coach`, `password_coach`, `roles`) VALUES
(1, 'Leszek', 'Romain', '0606060606', 'romain.leszek@example.com', '$2y$13$KfYyd36cVn.V0A2Nrew3ie3vWiespan0DYEQRTdsuEMzc2xKRtyNm', '[\"ROLE_COACH\"]');

-- --------------------------------------------------------

--
-- Structure de la table `coach_groups`
--

CREATE TABLE `coach_groups` (
  `id_coach` int NOT NULL,
  `groups_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `coach_groups`
--

INSERT INTO `coach_groups` (`id_coach`, `groups_id`) VALUES
(1, 1),
(1, 3),
(1, 5);

-- --------------------------------------------------------

--
-- Structure de la table `competition`
--

CREATE TABLE `competition` (
  `id_competition` int NOT NULL,
  `groups_id` int DEFAULT NULL,
  `title_competition` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `day_competition` date NOT NULL,
  `hour_competition` time NOT NULL,
  `duration_competition` int NOT NULL,
  `address_competition` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_competition` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description_competition` longtext COLLATE utf8mb4_unicode_ci,
  `is_defined_competition` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Déchargement des données de la table `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250217161200', '2025-02-17 16:12:09', 94),
('DoctrineMigrations\\Version20250218091327', '2025-02-18 09:13:34', 51),
('DoctrineMigrations\\Version20250218092229', '2025-02-18 09:22:34', 42),
('DoctrineMigrations\\Version20250218094501', '2025-02-18 09:45:06', 33),
('DoctrineMigrations\\Version20250218103624', '2025-02-18 10:36:29', 20),
('DoctrineMigrations\\Version20250218132533', '2025-02-18 13:50:08', 60),
('DoctrineMigrations\\Version20250218140025', '2025-02-18 14:00:32', 50),
('DoctrineMigrations\\Version20250222105541', '2025-02-22 10:55:47', 35),
('DoctrineMigrations\\Version20250226182055', '2025-02-26 18:21:04', 37);

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

CREATE TABLE `groups` (
  `groups_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `discipline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `groups`
--

INSERT INTO `groups` (`groups_id`, `name`, `created_at`, `updated_at`, `discipline`) VALUES
(1, 'Bébé nageur (3 mois - 3 ans)', '2025-02-18 11:39:42', '2025-02-18 11:39:42', 'Natation'),
(2, 'Jardin aquatique (3 ans - 4 ans)', '2025-02-18 11:39:42', '2025-02-18 11:39:42', 'Natation'),
(3, 'Enfants (5 ans - 10 ans)', '2025-02-18 11:39:42', '2025-02-18 11:39:42', 'Natation'),
(4, 'Adolescents (11 - 17 ans)', '2025-02-18 11:39:42', '2025-02-18 11:39:42', 'Natation'),
(5, 'Adultes (Nageurs confirmés)', '2025-02-18 11:39:42', '2025-02-18 11:39:42', 'Natation'),
(6, 'Aquagym (Adultes uniquement)', '2025-02-18 11:39:42', '2025-02-18 11:39:42', 'Aquagym'),
(7, 'Aquabike (Adultes uniquement)', '2025-02-18 11:39:42', '2025-02-18 11:39:42', 'Aquabike');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id_message` int NOT NULL,
  `sender_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id_message`, `sender_id`, `receiver_id`, `content`, `created_at`, `subject`) VALUES
(1, 4, 3, 'Salut, comment vas-tu ?', '2025-02-18 16:15:48', 'Message de test'),
(2, 5, 4, 'Salut, comment vas-tu ?', '2025-02-22 19:59:12', 'J\'ai fini la piscine Erwan !'),
(3, 6, 4, 'Salut, comment vas-tu ?', '2025-02-22 20:00:14', 'Désolé, j\'ai FIDI ce week-end je ne pourrai pas bosser sur la SAE.'),
(4, 7, 4, 'Salut, comment vas-tu ?', '2025-02-22 20:01:36', 'Oui effectivement j\'ai fini la vidéo !'),
(5, 8, 4, 'Salut, comment vas-tu ?', '2025-02-22 20:02:54', 'J\'ai pas encore fini la landing page'),
(8, 4, 6, 'Ça va et toi ?', '2025-02-27 11:53:14', NULL),
(9, 4, 6, 'Yooo', '2025-03-03 12:38:23', NULL),
(10, 4, 6, 'Daluy', '2025-03-03 12:57:26', NULL),
(11, 4, 8, 'Oiui', '2025-03-03 12:59:42', NULL),
(12, 4, 8, 'Hey', '2025-03-04 08:36:56', NULL),
(13, 4, 8, 'Non', '2025-03-18 13:38:06', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `performance`
--

CREATE TABLE `performance` (
  `id_performance` int NOT NULL,
  `id_swimmer` int NOT NULL,
  `id_competition` int NOT NULL,
  `historic` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int NOT NULL,
  `time` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `swimmer`
--

CREATE TABLE `swimmer` (
  `id_swimmer` int NOT NULL,
  `groups_id` int DEFAULT NULL,
  `nom_swimmer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prenom_swimmer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_naissance_swimmer` date DEFAULT NULL,
  `email_swimmer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password_swimmer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse_swimmer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code_postal_swimmer` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ville_swimmer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone_swimmer` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` int DEFAULT NULL,
  `crawl` int DEFAULT NULL,
  `papillon` int DEFAULT NULL,
  `dos_crawl` int DEFAULT NULL,
  `brasse` int DEFAULT NULL,
  `bio` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `swimmer`
--

INSERT INTO `swimmer` (`id_swimmer`, `groups_id`, `nom_swimmer`, `prenom_swimmer`, `date_naissance_swimmer`, `email_swimmer`, `roles`, `password_swimmer`, `adresse_swimmer`, `code_postal_swimmer`, `ville_swimmer`, `telephone_swimmer`, `level`, `crawl`, `papillon`, `dos_crawl`, `brasse`, `bio`) VALUES
(1, NULL, NULL, NULL, NULL, 'test@example.com', '[\"ROLE_USER\"]', '$2y$13$rlN/HDnMFMQh86onoDcineo7LNUIeOMjRtaZYsjeiFIVzvF.VKMtO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, NULL, NULL, NULL, NULL, 'test000@example.com', '[\"ROLE_USER\"]', '$2y$13$CeC.aymhF0IXsfcyvnks8OQ4ceTXdnvuzo9mKnuTSQ88Xal8F5k1m', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 7, 'Dupont', 'Jean', '1990-06-15', 'test007@example.com', '[\"ROLE_USER\"]', '$2y$13$ZKFgCO7uiPDCCvbe3mPtN.BbDk/qA5SA/NBrpzY3AxbwzLVoCAjcS', '123 rue Exemple', '75001', 'Paris', '0123456789', NULL, NULL, NULL, NULL, NULL, NULL),
(4, 3, 'Erwan', 'Marega', '2009-02-07', 'erwan.marega@example.com', '[\"ROLE_USER\"]', '$2y$13$M7cP8faE.E8b4h3cAnKSK.J5eK3LJRR.EiKKrgnySi9r6y5thRd5y', '12 impasse du port', '77440', 'Paris', '0707070707', NULL, NULL, NULL, NULL, NULL, 'Je nage aussi vite que Leon'),
(5, NULL, NULL, NULL, NULL, 'valentin.fontaine@example.com', '[\"ROLE_USER\"]', '$2y$13$gUPLBCAJ/WlXSE9rQLWFi.F3sKCmy9bOi0Ng.Hn8Z7hE0YdJ9L.Z.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, NULL, NULL, NULL, NULL, 'antoine.moulin@example.com', '[\"ROLE_USER\"]', '$2y$13$5r7PToZgAKWMiWjVDuxilupoI1fWzaIumscJHnX.UqgrMEwd11Sb.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, NULL, NULL, NULL, NULL, 'romain.so@example.com', '[\"ROLE_USER\"]', '$2y$13$nm3GqXBE1XwuYDDkBE8mrONnbwmbsk8aixuoRHAJmUTLZG2rNBlPK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, NULL, NULL, NULL, NULL, 'alan.leszek@example.com', '[\"ROLE_USER\"]', '$2y$13$mxZjkEVmekyV2RgJruvOMuaH01n/Y7AMgXu5xGZBPnAmevyu7/So2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `training`
--

CREATE TABLE `training` (
  `id_training` int NOT NULL,
  `groups_id` int DEFAULT NULL,
  `title_training` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_training` datetime NOT NULL,
  `duration_training` int NOT NULL,
  `intensity_training` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_training` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description_training` longtext COLLATE utf8mb4_unicode_ci,
  `is_defined_training` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `training`
--

INSERT INTO `training` (`id_training`, `groups_id`, `title_training`, `date_training`, `duration_training`, `intensity_training`, `category_training`, `description_training`, `is_defined_training`) VALUES
(2, 4, 'Entraînement intensif', '2025-02-20 18:00:00', 90, 'Élevée', 'Cardio', 'Entraînement spécifique pour améliorer la vitesse', 1),
(3, 4, 'Entraînement Hebdomadaire', '2025-03-01 10:00:00', 120, 'Moyenne', 'Natation', NULL, 0),
(16, 4, 'Entraînement Hebdomadaire', '2025-03-01 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(17, 4, 'Entraînement Hebdomadaire', '2025-03-08 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(18, 4, 'Entraînement Hebdomadaire', '2025-03-15 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(19, 4, 'Entraînement Hebdomadaire', '2025-03-22 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(20, 4, 'Entraînement Hebdomadaire', '2025-03-29 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(21, 4, 'Entraînement Hebdomadaire', '2025-04-05 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(22, 4, 'Entraînement Hebdomadaire', '2025-04-12 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(23, 4, 'Entraînement Hebdomadaire', '2025-04-19 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(24, 4, 'Entraînement Hebdomadaire', '2025-04-26 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(25, 4, 'Entraînement Hebdomadaire', '2025-05-03 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(26, 4, 'Entraînement Hebdomadaire', '2025-05-10 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(27, 4, 'Entraînement Hebdomadaire', '2025-05-17 10:00:00', 120, 'Moyenne', 'Natation', NULL, 1),
(28, 3, 'Entraînement Hebdomadaire', '2025-02-24 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(29, 3, 'Entraînement Hebdomadaire', '2025-03-03 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(30, 3, 'Entraînement Hebdomadaire', '2025-03-10 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(31, 3, 'Entraînement Hebdomadaire', '2025-03-17 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(32, 3, 'Entraînement Hebdomadaire', '2025-03-24 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(33, 3, 'Entraînement Hebdomadaire', '2025-03-31 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(34, 3, 'Entraînement Hebdomadaire', '2025-04-07 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(35, 3, 'Entraînement Hebdomadaire', '2025-04-14 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(36, 3, 'Entraînement Hebdomadaire', '2025-04-21 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(37, 3, 'Entraînement Hebdomadaire', '2025-04-28 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(38, 3, 'Entraînement Hebdomadaire', '2025-05-05 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(39, 3, 'Entraînement Hebdomadaire', '2025-05-12 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(40, 3, 'Entraînement Hebdomadaire', '2025-05-19 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(41, 3, 'Entraînement Hebdomadaire', '2025-02-26 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(42, 3, 'Entraînement Hebdomadaire', '2025-03-05 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(43, 3, 'Entraînement Hebdomadaire', '2025-03-12 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(44, 3, 'Entraînement Hebdomadaire', '2025-03-19 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(45, 3, 'Entraînement Hebdomadaire', '2025-03-26 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(46, 3, 'Entraînement Hebdomadaire', '2025-04-02 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(47, 3, 'Entraînement Hebdomadaire', '2025-04-09 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(48, 3, 'Entraînement Hebdomadaire', '2025-04-16 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(49, 3, 'Entraînement Hebdomadaire', '2025-04-23 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(50, 3, 'Entraînement Hebdomadaire', '2025-04-30 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(51, 3, 'Entraînement Hebdomadaire', '2025-05-07 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(52, 3, 'Entraînement Hebdomadaire', '2025-05-14 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(53, 3, 'Entraînement Hebdomadaire', '2025-05-21 09:45:00', 60, 'Moyenne', 'Natation', NULL, 1),
(54, 3, 'Entraînement Hebdomadaire', '2025-02-26 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(55, 3, 'Entraînement Hebdomadaire', '2025-03-05 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(56, 3, 'Entraînement Hebdomadaire', '2025-03-12 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(57, 3, 'Entraînement Hebdomadaire', '2025-03-19 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(58, 3, 'Entraînement Hebdomadaire', '2025-03-26 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(59, 3, 'Entraînement Hebdomadaire', '2025-04-02 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(60, 3, 'Entraînement Hebdomadaire', '2025-04-09 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(61, 3, 'Entraînement Hebdomadaire', '2025-04-16 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(62, 3, 'Entraînement Hebdomadaire', '2025-04-23 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(63, 3, 'Entraînement Hebdomadaire', '2025-04-30 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(64, 3, 'Entraînement Hebdomadaire', '2025-05-07 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(65, 3, 'Entraînement Hebdomadaire', '2025-05-14 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1),
(66, 3, 'Entraînement Hebdomadaire', '2025-05-21 18:30:00', 60, 'Moyenne', 'Natation', NULL, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `UNIQ_880E0D7615434CF9` (`email_admin`);

--
-- Index pour la table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id_attendance`),
  ADD KEY `IDX_6DE30D9133B66CA2` (`id_swimmer`),
  ADD KEY `IDX_6DE30D9185C9661A` (`id_training`);

--
-- Index pour la table `coach`
--
ALTER TABLE `coach`
  ADD PRIMARY KEY (`id_coach`),
  ADD UNIQUE KEY `UNIQ_3F596DCCA2142C43` (`email_coach`);

--
-- Index pour la table `coach_groups`
--
ALTER TABLE `coach_groups`
  ADD PRIMARY KEY (`id_coach`,`groups_id`),
  ADD KEY `IDX_2BC272C5D1DC2CFC` (`id_coach`),
  ADD KEY `IDX_2BC272C5F373DCF` (`groups_id`);

--
-- Index pour la table `competition`
--
ALTER TABLE `competition`
  ADD PRIMARY KEY (`id_competition`),
  ADD KEY `IDX_B50A2CB1F373DCF` (`groups_id`);

--
-- Index pour la table `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Index pour la table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`groups_id`);

--
-- Index pour la table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `IDX_B6BD307FF624B39D` (`sender_id`),
  ADD KEY `IDX_B6BD307FCD53EDB6` (`receiver_id`);

--
-- Index pour la table `performance`
--
ALTER TABLE `performance`
  ADD PRIMARY KEY (`id_performance`),
  ADD KEY `IDX_82D7968133B66CA2` (`id_swimmer`),
  ADD KEY `IDX_82D79681AD18E146` (`id_competition`);

--
-- Index pour la table `swimmer`
--
ALTER TABLE `swimmer`
  ADD PRIMARY KEY (`id_swimmer`),
  ADD UNIQUE KEY `UNIQ_ED2BC5D250EBAD1D` (`email_swimmer`),
  ADD KEY `IDX_ED2BC5D2F373DCF` (`groups_id`);

--
-- Index pour la table `training`
--
ALTER TABLE `training`
  ADD PRIMARY KEY (`id_training`),
  ADD KEY `IDX_D5128A8FF373DCF` (`groups_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id_attendance` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `coach`
--
ALTER TABLE `coach`
  MODIFY `id_coach` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `competition`
--
ALTER TABLE `competition`
  MODIFY `id_competition` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `groups`
--
ALTER TABLE `groups`
  MODIFY `groups_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id_message` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `performance`
--
ALTER TABLE `performance`
  MODIFY `id_performance` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `swimmer`
--
ALTER TABLE `swimmer`
  MODIFY `id_swimmer` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `training`
--
ALTER TABLE `training`
  MODIFY `id_training` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `FK_6DE30D9133B66CA2` FOREIGN KEY (`id_swimmer`) REFERENCES `swimmer` (`id_swimmer`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_6DE30D9185C9661A` FOREIGN KEY (`id_training`) REFERENCES `training` (`id_training`) ON DELETE CASCADE;

--
-- Contraintes pour la table `coach_groups`
--
ALTER TABLE `coach_groups`
  ADD CONSTRAINT `FK_2BC272C5D1DC2CFC` FOREIGN KEY (`id_coach`) REFERENCES `coach` (`id_coach`),
  ADD CONSTRAINT `FK_2BC272C5F373DCF` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`groups_id`);

--
-- Contraintes pour la table `competition`
--
ALTER TABLE `competition`
  ADD CONSTRAINT `FK_B50A2CB1F373DCF` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`groups_id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `FK_B6BD307FCD53EDB6` FOREIGN KEY (`receiver_id`) REFERENCES `swimmer` (`id_swimmer`),
  ADD CONSTRAINT `FK_B6BD307FF624B39D` FOREIGN KEY (`sender_id`) REFERENCES `swimmer` (`id_swimmer`);

--
-- Contraintes pour la table `performance`
--
ALTER TABLE `performance`
  ADD CONSTRAINT `FK_82D7968133B66CA2` FOREIGN KEY (`id_swimmer`) REFERENCES `swimmer` (`id_swimmer`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_82D79681AD18E146` FOREIGN KEY (`id_competition`) REFERENCES `competition` (`id_competition`) ON DELETE CASCADE;

--
-- Contraintes pour la table `swimmer`
--
ALTER TABLE `swimmer`
  ADD CONSTRAINT `FK_ED2BC5D2F373DCF` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`groups_id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `training`
--
ALTER TABLE `training`
  ADD CONSTRAINT `FK_D5128A8FF373DCF` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`groups_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
