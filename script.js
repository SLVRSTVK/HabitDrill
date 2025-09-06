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

// Расширяем приложение на весь экран
tg.expand();

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
                    // Открываем модальное окно для добавления привычки
                    openAddHabitModal();
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
        // Всегда предотвращаем стандартное поведение и всплытие
        e.preventDefault();
        e.stopPropagation();
        
        // Проверяем, что касание не по интерактивным элементам
        const target = e.target;
        const isInteractive = target.closest('.habit-checkbox') || 
                             target.closest('.habit-skip') || 
                             target.closest('button') || 
                             target.closest('input') ||
                             target.closest('.emoji-option');
        
        if (isInteractive) {
            isDragging = false;
            return;
        }
        
        startY = e.touches[0].clientY;
        isDragging = true;
        contentBlock.style.transition = 'none';
    });
    
    contentBlock.addEventListener('touchmove', (e) => {
        // Всегда предотвращаем стандартное поведение и всплытие
        e.preventDefault();
        e.stopPropagation();
        
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
        // Всегда предотвращаем стандартное поведение и всплытие
        e.preventDefault();
        e.stopPropagation();
        
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

// Массив для хранения привычек
let habits = [
    {
        id: 1,
        name: 'Бегать',
        emoji: '🏃',
        completed: false,
        createdAt: new Date()
    },
    {
        id: 2,
        name: 'Кушать',
        emoji: '🍎',
        completed: false,
        createdAt: new Date()
    }
];
let selectedEmoji = '🏃'; // По умолчанию

// Функция для создания карточки привычки
function createHabitCard(habit) {
    const habitCard = document.createElement('div');
    habitCard.className = 'habit-item';
    habitCard.innerHTML = `
        <div class="habit-left">
            <div class="habit-checkbox ${habit.completed ? 'checked' : ''}" data-id="${habit.id}"></div>
            <div class="habit-info">
                <div class="habit-emoji">${habit.emoji}</div>
                <div class="habit-name">${habit.name}</div>
            </div>
        </div>
        <div class="habit-right">
            <button class="habit-skip" data-id="${habit.id}">Пропустить</button>
        </div>
    `;
    
    // Обработчик для чекбокса
    const checkbox = habitCard.querySelector('.habit-checkbox');
    checkbox.addEventListener('click', () => {
        const habitId = parseInt(checkbox.dataset.id);
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
            habit.completed = !habit.completed;
            checkbox.classList.toggle('checked');
        }
    });
    
    // Обработчик для кнопки "Пропустить"
    const skipBtn = habitCard.querySelector('.habit-skip');
    skipBtn.addEventListener('click', () => {
        const habitId = parseInt(skipBtn.dataset.id);
        // Логика пропуска привычки
        console.log(`Пропущена привычка с ID: ${habitId}`);
    });
    
    return habitCard;
}

// Функция для отображения привычек
function renderHabits() {
    const container = document.getElementById('habitsContainer');
    container.innerHTML = '';
    
    habits.forEach(habit => {
        const card = createHabitCard(habit);
        container.appendChild(card);
    });
    
    // Если нет привычек, показываем заглушку
    if (habits.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #666; padding: 40px 20px;">
                <p>Пока нет привычек</p>
                <p style="font-size: 14px;">Нажмите на кнопку "+" чтобы добавить первую привычку</p>
            </div>
        `;
    }
}

// Функция для открытия модального окна
function openAddHabitModal() {
    const modal = document.getElementById('addHabitModal');
    const habitName = document.getElementById('habitName');
    const saveBtn = document.getElementById('saveBtn');
    
    // Сбрасываем форму
    habitName.value = '';
    selectedEmoji = '🏃';
    saveBtn.disabled = true;
    
    // Выбираем первый эмодзи по умолчанию
    document.querySelectorAll('.emoji-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector('[data-emoji="🏃"]').classList.add('selected');
    
    modal.style.display = 'flex';
    setTimeout(() => habitName.focus(), 100);
}

// Функция для закрытия модального окна
function closeAddHabitModal() {
    const modal = document.getElementById('addHabitModal');
    modal.style.display = 'none';
}

// Функция для сохранения привычки
function saveHabit() {
    const habitName = document.getElementById('habitName').value.trim();
    
    if (habitName && selectedEmoji) {
        const newHabit = {
            id: Date.now(), // Простой ID на основе времени
            name: habitName,
            emoji: selectedEmoji,
            completed: false,
            createdAt: new Date()
        };
        
        habits.push(newHabit);
        renderHabits();
        closeAddHabitModal();
        
        console.log('Добавлена новая привычка:', newHabit);
    }
}

// Инициализация модального окна
function initHabitsModal() {
    const modal = document.getElementById('addHabitModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const habitName = document.getElementById('habitName');
    
    // Закрытие модального окна
    closeBtn.addEventListener('click', closeAddHabitModal);
    cancelBtn.addEventListener('click', closeAddHabitModal);
    
    // Закрытие по клику на фон
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAddHabitModal();
        }
    });
    
    // Сохранение привычки
    saveBtn.addEventListener('click', saveHabit);
    
    // Валидация поля ввода
    habitName.addEventListener('input', () => {
        const isValid = habitName.value.trim().length > 0;
        saveBtn.disabled = !isValid;
    });
    
    // Обработка Enter в поле ввода
    habitName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !saveBtn.disabled) {
            saveHabit();
        }
    });
    
    // Выбор эмодзи
    document.querySelectorAll('.emoji-option').forEach(option => {
        option.addEventListener('click', () => {
            // Убираем выделение с других эмодзи
            document.querySelectorAll('.emoji-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Выделяем выбранный эмодзи
            option.classList.add('selected');
            selectedEmoji = option.dataset.emoji;
        });
    });
}

// Готовность приложения
tg.ready();

// Инициализируем модальное окно и отображаем привычки
initHabitsModal();
renderHabits();
