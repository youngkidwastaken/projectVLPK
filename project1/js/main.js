// main.js

document.addEventListener('DOMContentLoaded', function() {
    // Функция для проверки аутентификации пользователя
    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            // Пользователь авторизован
            updateNavigation(true);
        } else {
            // Пользователь не авторизован
            updateNavigation(false);
        }
    }

    // Функция для обновления навигации в зависимости от статуса аутентификации
    function updateNavigation(isAuthenticated) {
        const nav = document.querySelector('nav ul');
        if (isAuthenticated) {
            nav.innerHTML = `
                <li><a href="index.html">Главная</a></li>
                <li><a href="catalog.html">Каталог</a></li>
                <li><a href="my_books.html">Мои книги</a></li>
                <li><a href="profile.html">Профиль</a></li>
                <li><a href="#" id="logout-link">Выход</a></li>
            `;
            document.getElementById('logout-link').addEventListener('click', logout);
        } else {
            nav.innerHTML = `
                <li><a href="index.html">Главная</a></li>
                <li><a href="catalog.html">Каталог</a></li>
                <li><a href="about.html">О нас</a></li>
                <li><a href="login.html">Вход</a></li>
                <li><a href="register.html">Регистрация</a></li>
            `;
        }
    }

    // Функция для выхода из системы
    function logout(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        // Удаляем все куки, связанные с сессией
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        window.location.href = 'logout.html';
    }

    // Функция для отправки API запросов
    async function apiRequest(url, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            options.headers['Authorization'] = `Bearer ${user.token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Что-то пошло не так');
            }
            return result;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    // Функция для отображения уведомлений
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Инициализация при загрузке страницы
    checkAuth();

    // Экспорт функций для использования в других скриптах
    window.bookBuddy = {
        apiRequest: apiRequest,
        showNotification: showNotification
    };
});
