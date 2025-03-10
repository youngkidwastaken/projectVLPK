<?php
// config.php

// Режим отладки
define('DEBUG', true);

// Настройки базы данных
define('DB_HOST', 'localhost');
define('DB_NAME', 'bookbuddy');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');

// Настройки API
define('API_KEY', 'your_api_key');
define('API_SECRET', 'your_api_secret');

// URL сайта
define('SITE_URL', 'http://localhost/bookbuddy');

// Настройки почты
define('MAIL_HOST', 'smtp.example.com');
define('MAIL_PORT', 587);
define('MAIL_USERNAME', 'your_email@example.com');
define('MAIL_PASSWORD', 'your_email_password');
define('MAIL_FROM', 'noreply@bookbuddy.com');
define('MAIL_FROM_NAME', 'BookBuddy');

// Настройки сессии
ini_set('session.cookie_lifetime', 60 * 60 * 24 * 7);  // 1 неделя
ini_set('session.gc_maxlifetime', 60 * 60 * 24 * 7);  // 1 неделя

// Настройки безопасности
define('SALT', 'your_random_salt_string');

// Функция для обработки ошибок
function customErrorHandler($errno, $errstr, $errfile, $errline) {
    if (DEBUG) {
        echo "Ошибка [$errno] $errstr<br />\n";
        echo "Файл: $errfile, строка $errline<br />\n";
    } else {
        error_log("Ошибка [$errno] $errstr в файле $errfile, строка $errline");
    }
}

// Установка пользовательского обработчика ошибок
set_error_handler("customErrorHandler");

// Функция для подключения к базе данных
function dbConnect() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        if (DEBUG) {
            die("Ошибка подключения к базе данных: " . $e->getMessage());
        } else {
            die("Произошла ошибка при подключении к базе данных. Пожалуйста, попробуйте позже.");
        }
    }
}

// Функция для очистки пользовательского ввода
function cleanInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

// Функция для генерации случайного токена
function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

// Инициализация сессии
session_start();
