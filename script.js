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

        // Получаем значения из всех выпадающих списков
        const styleValue = document.getElementById("style-select").value;
        const formatValue = document.getElementById("format-select").value;
        const toneValue = document.getElementById("tone-select").value;
        const themeValue = document.getElementById("theme-select").value;
        const filterValue = document.getElementById("filter-select").value;
        const characterValue = document.getElementById("character-select").value;
        const placeValue = document.getElementById("place-select").value;

        // Формируем полный промт
        const fullPrompt = [promptText, styleValue, formatValue, toneValue, themeValue, filterValue, characterValue, placeValue]
            .filter(item => item) // Убираем пустые строки
            .join(', '); // Объединяем значения через запятую
        
        textInput.value = fullPrompt; // Обновляем текстовое поле
    }

    // Добавляем обработчики событий для всех селекторов
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener("change", updatePrompt);
    });

    // Кнопка для генерации 1 изображения
    generateButton.addEventListener("click", function () {
        generateImage(1);
    });

    // Кнопка для генерации 5 изображений
    generateMultipleButton.addEventListener("click", function () {
        generateImage(5);
    });

    // Закрытие модального окна
    closeButton.onclick = function () {
        modal.style.display = "none";
        generatedImagesContainer.innerHTML = '';
    };

    // Закрытие модального окна при нажатии на область вне модального окна
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            generatedImagesContainer.innerHTML = '';
        }
    };

    // Функция генерации изображений
    function generateImage(count) {
        const description = textInput.value.trim();
        if (!description) {
            alert("🤷‍♂️ Пожалуйста, введите описание для генерации изображения ✏️");
            return;
        }

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
                displayGeneratedImages(urls); // Отображение всех изображений
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

// КАРТОЧКИ ПРОКРУТКА = = = = = =
const appPanel = document.querySelector('.app-panel');
let isDragging = false;
let startX;
let scrollLeft;

appPanel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - appPanel.offsetLeft;
    scrollLeft = appPanel.scrollLeft;
    appPanel.style.cursor = 'grabbing';
});

appPanel.addEventListener('mouseleave', () => {
    isDragging = false;
    appPanel.style.cursor = 'grab';
});

appPanel.addEventListener('mouseup', () => {
    isDragging = false;
    appPanel.style.cursor = 'grab';
});

appPanel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  
    const x = e.pageX - appPanel.offsetLeft;
    const walk = (x - startX) * 1;
    appPanel.scrollLeft = scrollLeft - walk;
});

// Обработка сенсорных событий для мобильных устройств
appPanel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - appPanel.offsetLeft;
    scrollLeft = appPanel.scrollLeft;
});

appPanel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    e.preventDefault(); // Предотвращаем прокрутку страницы
    const x = e.touches[0].pageX - appPanel.offsetLeft;
    const walk = (x - startX) * 1;
    appPanel.scrollLeft = scrollLeft - walk;
});

// Добавьте обработчик для touchend
appPanel.addEventListener('touchend', (e) => {
    isDragging = false;

    // Если был свайп, разрешаем прокрутку страницы
    if (Math.abs(e.changedTouches[0].pageX - startX) < 30) {
        e.stopPropagation();
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const donationButton = document.querySelector(".donation-button");

    if (donationButton) {
        donationButton.addEventListener("click", function () {
            alert("AiImage: Спасибо за поддержку!");
        });
    }
});

// Бесконечная прокрутка карточек
function setupInfiniteScroll(appPanel) {
    const cardCount = appPanel.children.length;

    appPanel.addEventListener('scroll', () => {
        const scrollPosition = appPanel.scrollLeft;
        const panelWidth = appPanel.scrollWidth - appPanel.clientWidth;

        // Если достигли конца, прокручиваем к началу
        if (scrollPosition >= panelWidth) {
            appPanel.scrollLeft = 0; // Прокрутка к началу
        }
    });
}

setupInfiniteScroll(appPanel);

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
