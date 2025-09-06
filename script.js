// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Создаем календарь
function createCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Получаем количество дней в месяце
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Массив названий месяцев
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    
    // Создаем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        
        const dayMonth = document.createElement('div');
        dayMonth.className = 'day-month';
        dayMonth.textContent = months[currentMonth];
        
        dayElement.appendChild(dayNumber);
        dayElement.appendChild(dayMonth);
        
        // Выделяем сегодняшний день
        if (day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        calendar.appendChild(dayElement);
    }
    
    // Прокручиваем к сегодняшнему дню
    setTimeout(() => {
        const todayElement = calendar.querySelector('.today');
        if (todayElement) {
            todayElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }, 100);
}

// Расширяем приложение на весь экран
tg.expand();

// Включаем главную кнопку
tg.MainButton.text = "Готово";
tg.MainButton.show();
tg.MainButton.onClick(() => {
    tg.sendData("Hello from HabitDrill!");
});

// Создаем календарь после загрузки страницы
createCalendar();

// Готовность приложения
tg.ready();
