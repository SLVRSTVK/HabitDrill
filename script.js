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
    
    // Массив дней недели
    const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    // Создаем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(currentYear, currentMonth, day);
        const dayOfWeek = dayDate.getDay();
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayWeek = document.createElement('div');
        dayWeek.className = 'day-week';
        dayWeek.textContent = weekDays[dayOfWeek];
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        
        dayElement.appendChild(dayWeek);
        dayElement.appendChild(dayNumber);
        
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

// Адаптация заголовка под размер экрана
function adaptHeaderPosition() {
    const header = document.querySelector('h1');
    const isExpanded = tg.isExpanded;
    const viewportHeight = tg.viewportHeight || window.innerHeight;
    
    if (isExpanded || viewportHeight > 650) {
        // Полноэкранный режим - заголовок ниже
        header.style.marginTop = '80px';
    } else {
        // Мини-приложение - заголовок выше
        header.style.marginTop = '40px';
    }
}

// Расширяем приложение на весь экран
tg.expand();

// Отслеживаем изменения размера окна
window.addEventListener('resize', adaptHeaderPosition);
tg.onEvent('viewportChanged', adaptHeaderPosition);

// Обработка нижних табов
function initTabsHandler() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            
            // Убираем active с всех табов
            tabItems.forEach(t => t.classList.remove('active'));
            
            // Добавляем active к текущему табу
            if (tabType !== 'add') {
                tab.classList.add('active');
            }
            
            // Обработка кликов по табам
            switch(tabType) {
                case 'habits':
                    console.log('Открыт таб привычек');
                    break;
                case 'add':
                    console.log('Нажата кнопка добавления');
                    // Возвращаем active к предыдущему активному табу
                    const activeTab = document.querySelector('.tab-item[data-tab="habits"]');
                    if (activeTab) activeTab.classList.add('active');
                    break;
                case 'stats':
                    console.log('Открыт таб статистики');
                    break;
            }
        });
    });
}

// Создаем календарь после загрузки страницы
createCalendar();

// Обработка свайпов для content-block
function initSwipeHandler() {
    const contentBlock = document.getElementById('contentBlock');
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    contentBlock.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
        contentBlock.style.transition = 'none';
    });
    
    contentBlock.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        // Ограничиваем перемещение
        if (deltaY > 0) {
            const translateY = Math.min(deltaY, window.innerHeight * 0.5);
            contentBlock.style.transform = `translateY(${translateY}px)`;
        }
    });
    
    contentBlock.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        contentBlock.style.transition = 'transform 0.3s ease';
        
        const deltaY = currentY - startY;
        const threshold = window.innerHeight * 0.2; // 20% от высоты экрана
        
        if (deltaY > threshold) {
            // Сворачиваем
            contentBlock.classList.add('collapsed');
            contentBlock.style.transform = '';
        } else {
            // Возвращаем на место
            contentBlock.classList.remove('collapsed');
            contentBlock.style.transform = '';
        }
    });
    
    // Обработка клика по ручке
    const dragHandle = document.querySelector('.drag-handle');
    dragHandle.addEventListener('click', () => {
        contentBlock.classList.toggle('collapsed');
    });
}

// Инициализируем обработку свайпов и табов
initSwipeHandler();
initTabsHandler();

// Адаптируем позицию заголовка
setTimeout(adaptHeaderPosition, 200);

// Готовность приложения
tg.ready();
