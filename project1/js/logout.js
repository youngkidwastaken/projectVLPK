document.addEventListener('DOMContentLoaded', function() {
    // Отправляем запрос на сервер для завершения сессии
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Удаляем локальные данные сессии
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            
            // Удаляем все куки, связанные с сессией
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            
            console.log('Выход выполнен успешно');
        } else {
            console.error('Ошибка при выходе из системы');
        }
    })
    .catch(error => {
        console.error('Ошибка при отправке запроса на выход:', error);
    });
});
