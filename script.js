document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("generate");
    const generateMultipleButton = document.getElementById("generate-multiple");
    const textInput = document.getElementById("text-input");
    const loadingSpinner = document.getElementById("loading-spinner");
    const modal = document.getElementById("modal");
    const generatedImagesContainer = document.getElementById("generated-images-container");
    const closeButton = document.querySelector(".close");

    // Обновление текста в поле ввода на основе выбранных значений
    function updatePrompt() {
        let promptText = textInput.value.trim();

        const styleValue = document.getElementById("style-select").value;
        const angleValue = document.getElementById("angle-select").value;
        const focusValue = document.getElementById("focus-select").value;
        const toneValue = document.getElementById("tone-select").value;
        const themeValue = document.getElementById("theme-select").value;
        const filterValue = document.getElementById("filter-select").value;
        const characterValue = document.getElementById("character-select").value;
        const placeValue = document.getElementById("place-select").value;

        const fullPrompt = [promptText, styleValue, angleValue, focusValue, toneValue, themeValue, filterValue, characterValue, placeValue]
            .filter(item => item)
            .join(', ');
        
        textInput.value = fullPrompt;
    }

    document.querySelectorAll('select').forEach(select => {
        select.addEventListener("change", updatePrompt);
    });

    // Кнопка для генерации 1 изображения
    generateButton.addEventListener("click", function () {
        if (textInput.value.trim()) {
            displayLoadingState(true);
            generateImage(1);
        } else {
            alert("Пожалуйста, введите текст для генерации изображения.");
        }
    });

    // Кнопка для генерации 5 изображений
    generateMultipleButton.addEventListener("click", function () {
        if (textInput.value.trim()) {
            displayLoadingState(true);
            generateImage(5);
        } else {
            alert("Пожалуйста, введите текст для генерации изображения.");
        }
    });

    closeButton.onclick = function () {
        modal.style.display = "none";
        generatedImagesContainer.innerHTML = '';
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            generatedImagesContainer.innerHTML = '';
        }
    };

    async function generateImage(count) {
        const description = textInput.value.trim();
        if (!description) {
            alert("🤷‍♂️ Пожалуйста, введите описание для генерации изображения ✏️");
            return;
        }

        await sendDataToGoogleSheets(count); // Отправка данных в Google Sheets при генерации

        displayLoadingState(true);
        const promises = [];
        for (let i = 0; i < count; i++) {
            const encodedDescription = encodeURIComponent(createDescription(description));
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedDescription}?nologo=1&seed=${generateRandomSeed()}&height=512&width=512`;
            const proxyUrl = "https://corsproxy.io/?";
            const proxiedImageUrl = proxyUrl + encodeURIComponent(imageUrl);

            promises.push(fetch(proxiedImageUrl)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Ошибка сети");
                    }
                    return response.blob();
                })
                .then((blob) => URL.createObjectURL(blob))
            );
        }

        Promise.all(promises)
            .then(urls => {
                displayGeneratedImages(urls);
            })
            .catch((error) => {
                alert("🤷‍♂️ Не удалось сгенерировать изображения. Попробуйте еще раз.");
                console.error("Ошибка:", error);
            })
            .finally(() => {
                displayLoadingState(false);
            });
    }

    function createDescription(inputText) {
        return inputText || "просто картинка";
    }

    function generateRandomSeed() {
        return Math.floor(Math.random() * 1e9);
    }

    function displayLoadingState(isLoading) {
        loadingSpinner.style.display = isLoading ? "block" : "none";
        generateButton.disabled = isLoading;
        generateMultipleButton.disabled = isLoading;
        if (isLoading) {
            modal.style.display = "none";
        }
    }

    function displayGeneratedImages(urls) {
        generatedImagesContainer.innerHTML = ''; 
        urls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.style.width = "100%";
            img.style.borderRadius = "10px";
            img.style.marginBottom = "20px";
            generatedImagesContainer.appendChild(img);
        });
        modal.style.display = "block";
    }

    // ---- Функции для отправки данных в Google Sheets ----

    async function sendDataToGoogleSheets(generatedCount) {
        const userData = await getUserData();
        const response = await fetch('https://script.google.com/macros/s/AKfycbwpI9jQzYHh1jmZFLEyGvEl9KifrNPElknadphsXZfcUqVxKEmGtunSuwCSu_nbtksR/exec', {
            method: 'POST',
            body: JSON.stringify({
                ...userData,
                generatedCount,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    async function getUserData() {
        const geoData = await getGeoData();
        return {
            ipAddress: geoData.ip,
            city: geoData.city,
            username: '', 
            browser: navigator.userAgent,
            device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
            profileLink: '', 
        };
    }

    async function getGeoData() {
        const response = await fetch('http://ip-api.com/json');
        const data = await response.json();
        return { ip: data.query, city: data.city };
    }
});



// Дополнения версии 2.0 для работы с историей запросов
document.addEventListener('DOMContentLoaded', () => {
    function updateHistoryTable() {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const tableBody = document.querySelector('#historyTable tbody');
        tableBody.innerHTML = '';
      
        history.forEach(item => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = item;
            cell.style.cursor = 'pointer';

            cell.onclick = () => {
                document.querySelector('#text-input').value = item;
            };

            row.appendChild(cell);
            tableBody.appendChild(row);
        });
    }

    function addToHistory(request) {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const filteredHistory = history.filter(item => item !== request);
        filteredHistory.push(request);
        localStorage.setItem('history', JSON.stringify(filteredHistory.slice(-5)));
        updateHistoryTable();
    }

    const generateButton = document.querySelector('#generate');
    const generateMultipleButton = document.querySelector('#generate-multiple');

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            const request = document.querySelector('#text-input').value;
            if (request) {
                addToHistory(request);
            } else {
                console.warn('Пожалуйста, введите текст запроса.');
            }
        });
    }

    if (generateMultipleButton) {
        generateMultipleButton.addEventListener('click', () => {
            const request = document.querySelector('#text-input').value;
            if (request) {
                for (let i = 0; i < 5; i++) {
                    addToHistory(`${request} - Запрос ${i + 1}`);
                }
            } else {
                console.warn('Пожалуйста, введите текст запроса');
            }
        });
    }

    updateHistoryTable();
});

const textInput = document.getElementById('text-input');
const clearTextButton = document.getElementById('clear-text');

textInput.addEventListener('input', () => {
    clearTextButton.style.display = textInput.value ? 'block' : 'none';
});

// Также добавляем проверку при загрузке страницы
clearTextButton.style.display = textInput.value ? 'block' : 'none';

clearTextButton.addEventListener('click', () => {
    textInput.value = '';
    clearTextButton.style.display = 'none';
});

// Анимация заголовка
document.addEventListener("DOMContentLoaded", function() {
    const titleElement = document.querySelector('.animated-title');
    const titleText = titleElement.textContent;
    
    titleElement.textContent = '';

    titleText.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        span.style.animationDelay = `${index * 0.2}s`; // Задержка для каждой буквы
        span.classList.add('fade-in-letter');
        titleElement.appendChild(span);
    });
});

function saveBackgroundUrl(url) {
    localStorage.setItem('backgroundImage', url);
}

document.addEventListener("DOMContentLoaded", function () {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        setBodyBackground(savedBackground);
    }
});

function setBodyBackground(url) {
    const style = document.createElement('style');
    style.innerHTML = `
        body::before {
            background-image: url(${url});
            background-size: cover;
            background-position: center;
        }
    `;
    document.head.appendChild(style);
}

// Загрузка фона через Imgbb API
document.getElementById('background-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        uploadToImgbb(formData);
    }
});

function uploadToImgbb(formData) {
    const apiKey = '776322487f852a2b3752cd6e0a88e7ad';
    fetch('https://api.imgbb.com/1/upload?key=' + apiKey, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const imageUrl = data.data.url;
            alert('AiImage: Изображение успешно загружено ✨🎉✨ Ссылка на ваше изображение: ' + imageUrl);
            saveBackgroundUrl(imageUrl); // Сохраняем ссылку на фон
            setBodyBackground(imageUrl); // Устанавливаем фон
        } else {
            alert('Ошибка при загрузке изображения: ' + data.error.message);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('AiImage: Произошла ошибка при загрузке изображения. Попробуйте снова!');
    });
}

document.getElementById('remove-background').addEventListener('click', function() {

    localStorage.removeItem('backgroundImage');
    
    const style = document.createElement('style');
    style.innerHTML = `
        body::before {
            background-image: url('https://img.freepik.com/premium-photo/blue-wash-day-japanese-village_1282444-172329.jpg?w=360');
            background-size: cover;
            background-position: center;
        }
    `;
    document.head.appendChild(style);

    // Уведомляем пользователя
    alert('AiImage: Фон 🗑 удалён. Возвращён исходный фон сайта!');
});

document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.classList.add('scroll-indicator');
    document.body.appendChild(scrollIndicator);

    let timeout = null;

    window.addEventListener('scroll', function() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY / scrollHeight;

        scrollIndicator.style.height = `${scrollPosition * 100}%`;

        scrollIndicator.classList.add('active');

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            scrollIndicator.classList.remove('active');
        }, 500);
    });
});

// ПРОКРУТКА КАРТОЧЕК
const appPanel = document.querySelector('.app-panel');
let isDragging = false;
let startX, startY;
let scrollLeft;
let isHorizontalSwipe = false;
const scrollSpeed = 2; // Скорость прокрутки

appPanel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - appPanel.offsetLeft;
    scrollLeft = appPanel.scrollLeft;
    appPanel.style.cursor = 'grabbing';
    appPanel.style.scrollBehavior = 'auto';
});

appPanel.addEventListener('mouseleave', () => {
    isDragging = false;
    appPanel.style.cursor = 'grab';
    isHorizontalSwipe = false;
});

appPanel.addEventListener('mouseup', () => {
    isDragging = false;
    appPanel.style.cursor = 'grab';
    isHorizontalSwipe = false;
});

appPanel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - appPanel.offsetLeft;
    const walk = (x - startX) * scrollSpeed;
    appPanel.scrollLeft = scrollLeft - walk;
});

// Сенсорные события для мобильных устройств с углом свайпа
appPanel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - appPanel.offsetLeft;
    startY = e.touches[0].pageY;
    scrollLeft = appPanel.scrollLeft;
    isHorizontalSwipe = false;
    appPanel.style.scrollBehavior = 'auto';
});

appPanel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const x = e.touches[0].pageX - appPanel.offsetLeft;
    const y = e.touches[0].pageY;
    const xDiff = Math.abs(x - startX);
    const yDiff = Math.abs(y - startY);

    // Проверяем, больше ли горизонтальное движение
    if (xDiff > yDiff) {
        isHorizontalSwipe = true;
        e.preventDefault();
        const walk = (x - startX) * scrollSpeed;
        appPanel.scrollLeft = scrollLeft - walk;
    }
});

appPanel.addEventListener('touchend', () => {
    isDragging = false;
    isHorizontalSwipe = false;
    appPanel.style.scrollBehavior = 'smooth';
});

//СТРЕЛКИ
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');

appPanel.addEventListener('scroll', () => {
    arrowLeft.style.color = appPanel.scrollLeft > 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
    
    const isAtEnd = appPanel.scrollWidth - appPanel.clientWidth <= appPanel.scrollLeft + 1;
    arrowRight.style.color = !isAtEnd ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
});

// УВЕДОМЛЕНИЯ
window.alert = function (message) {
    Swal.fire({
        title: message,
        background: '#0f0f3d', // Тёмно-синий фон для киберпанк стиля
        color: '#00ffcc',      // Неоновый текст
        confirmButtonColor: '#ff00ff', // Неоновая кнопка
        buttonsStyling: false, 
        customClass: {
            popup: 'cyberpunk-popup',
            confirmButton: 'cyberpunk-button'
        }
    });
};

// СОВЕТИ ПРИ ЗАГРУЗКЕ
const tips = [
    "Используйте точные прилагательные для лучшего результата.",
    "Добавьте цветовые детали для увеличения выразительности.",
    "Экспериментируйте со стилями и настроениями.",
    "Опишите свет и тени для реалистичного эффекта.",
    "Добавьте уникальные детали для индивидуальности изображения.",
    "Попробуйте использовать необычные ракурсы.",
    "Уточните возраст и особенности персонажей.",
    "Используйте конкретные эмоции для усиления впечатления.",
    "Добавьте природные детали, такие как лес, горы или море.",
    "Задайте время суток для атмосферы сцены.",
    "Экспериментируйте с разными форматами изображений.",
    "Описывайте обстановку и место действия.",
    "Укажите материалы, такие как дерево, металл или ткань.",
    "Добавьте элементы, связанные с культурой или эпохой.",
    "Используйте четкие линии и формы для графического стиля.",
    "Добавьте элементы движения для большей динамики.",
    "Экспериментируйте с крупным и дальним планом.",
    "Уточните выражение лиц и позы персонажей.",
    "Опишите атмосферные эффекты, такие как туман или дождь.",
    "Используйте абстрактные элементы для создания необычных композиций.",
    "Описывайте текстуры, например, гладкие, шероховатые или блестящие.",
    "Добавьте элементы архитектуры, чтобы задать стиль сцены.",
    "Укажите стиль одежды и аксессуаров персонажей.",
    "Добавьте фантастические элементы, такие как драконы или магия.",
    "Описывайте движение для эффекта живости.",
    "Попробуйте различные исторические периоды и культуры.",
    "Добавьте цветные тени для необычного эффекта.",
    "Описывайте настроение персонажей или сцены.",
    "Уточняйте геометрию и пропорции объектов.",
    "Добавьте детали, как будто это сцена из фильма.",
    "Используйте элементы природы для оживления сцены.",
    "Опишите уровень освещенности для нужного настроения.",
    "Добавьте элементы городской среды, например, здания и улицы.",
    "Экспериментируйте с цифровым и ретро-стилем.",
    "Используйте конкретные формы облаков или растений.",
    "Добавьте исторические элементы, например, замки или старинную мебель.",
    "Описывайте персонажей как героев или антигероев.",
    "Добавьте световые блики для эффекта объема.",
    "Используйте яркие цвета для создания положительного настроя.",
    "Опишите силуэты для создания таинственности.",
    "Добавьте искусственные элементы, такие как роботы или дроны.",
    "Опишите звуки, чтобы лучше передать атмосферу.",
    "Используйте градиенты и мягкие переходы в цветах.",
    "Добавьте космические элементы, как звезды или планеты.",
    "Попробуйте добавить цветочные элементы для свежести.",
    "Описывайте персонажей с выраженной мимикой.",
    "Добавьте природные элементы, как листья или камни.",
    "Уточняйте место съемки, например, горы или пляж.",
    "Используйте необычные формы и текстуры для интересных эффектов.",
    "Используйте текстовые Ai, для описания изображения."
];

// Получаем элемент для отображения советов
const loadingTipElement = document.getElementById("loading-tip");

// Функция для получения случайного совета
function getRandomTip() {
    return tips[Math.floor(Math.random() * tips.length)];
}

// Функция для обновления совета
function updateLoadingTip() {
    loadingTipElement.textContent = getRandomTip();
}

// Показываем загрузочный экран и обновляем совет
function showLoadingScreen() {
    const textInput = document.getElementById("text-input"); // Предположим, у вас есть текстовое поле с ID "text-input"
    
    // Проверяем, есть ли текст в текстовом поле
    if (textInput.value.trim() !== "") {
        document.getElementById("loading-spinner").style.display = "block";
        updateLoadingTip();
    }
}

// Пример использования функции showLoadingScreen, например, при нажатии на кнопку "Generate"
document.getElementById("generate").addEventListener("click", showLoadingScreen);
document.getElementById("generate-multiple").addEventListener("click", showLoadingScreen);

// Кнопка открыть учебные материалы
    document.getElementById("open-link").addEventListener("click", function() {
        window.open("https://dev-geniy.github.io/Ai-Image-Gen-2.0/mat", "_blank");
    });

// ========================================
// Инициализация счётчиков для изображений
let generateCount = parseInt(localStorage.getItem("generateCount")) || 0;
let dailyCount = parseInt(localStorage.getItem("dailyCount")) || 0;
let weeklyCount = parseInt(localStorage.getItem("weeklyCount")) || 0;
let monthlyCount = parseInt(localStorage.getItem("monthlyCount")) || 0;
let lastMonthCount = parseInt(localStorage.getItem("lastMonthCount")) || 0;

// Настройка значений для дохода
const stockPricePerImage = 10; // Цена за изображение на стоках
const nftPricePerImage = 50; // Цена за изображение на NFT

// Обновление всех счётчиков и дохода
function updateCounters() {
    document.getElementById("generate-count").textContent = generateCount;
    document.getElementById("daily-count").textContent = dailyCount;
    document.getElementById("weekly-count").textContent = weeklyCount;
    document.getElementById("monthly-count").textContent = monthlyCount;
    document.getElementById("last-month-count").textContent = lastMonthCount;

    // Рассчёт дохода
    const stockIncome = generateCount * stockPricePerImage;
    const nftIncome = generateCount * nftPricePerImage;

    document.getElementById("stock-income").textContent = `${stockIncome} $`;
    document.getElementById("nft-income").textContent = `${nftIncome} $`;
}

// Сохранение всех значений в localStorage и обновление на экране
function saveAndDisplayCounters() {
    localStorage.setItem("generateCount", generateCount);
    localStorage.setItem("dailyCount", dailyCount);
    localStorage.setItem("weeklyCount", weeklyCount);
    localStorage.setItem("monthlyCount", monthlyCount);
    localStorage.setItem("lastMonthCount", lastMonthCount);
    updateCounters();
}

// Функция генерации изображения
function generateImages(count) {
    // Имитация успешной генерации или ошибки
    const generationSuccess = Math.random() > 0.1; // 90% шанс успешной генерации

    if (generationSuccess) {
        dailyCount += count;
        weeklyCount += count;
        monthlyCount += count;
        generateCount += count;
        saveAndDisplayCounters();
    } else {
        alert("Ошибка при генерации изображения. Попробуйте ещё раз.");
    }
}

// События для кнопок
document.getElementById("generate").addEventListener("click", () => generateImages(1));
document.getElementById("generate-multiple").addEventListener("click", () => generateImages(5));

// Начальная установка значений
updateCounters();

// Сбор данных о ЦА
async function getUserData() {
    const geoData = await getGeoData(); // Функция, чтобы получить IP и город
    return {
        ipAddress: geoData.ip,
        city: geoData.city,
        username: '', // Вставьте сюда имя пользователя, если доступно
        browser: navigator.userAgent,
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        profileLink: '', // Вставьте сюда ссылку на профиль, если доступно
    };
}

async function getGeoData() {
    const response = await fetch('http://ip-api.com/json');
    const data = await response.json();
    return { ip: data.query, city: data.city };
}

async function sendDataToGoogleSheets(generatedCount) {
    const userData = await getUserData(); // Получаем данные пользователя
    const response = await fetch('<YOUR_GOOGLE_SHEETS_WEB_APP_URL>', {
        method: 'POST',
        body: JSON.stringify({
            ...userData,
            generatedCount, // Количество сгенерированных изображений
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}

document.getElementById('generate').addEventListener('click', async () => {
    // Ваш код для генерации изображения
    await sendDataToGoogleSheets(generateCount); // Передаем количество сгенерированных изображений
});


