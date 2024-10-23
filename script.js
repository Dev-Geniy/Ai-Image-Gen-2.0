document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("generate");
    const generateMultipleButton = document.getElementById("generate-multiple");
    const textInput = document.getElementById("text-input");
    const loadingSpinner = document.getElementById("loading-spinner");
    const modal = document.getElementById("modal");
    const generatedImagesContainer = document.getElementById("generated-images-container");
    const downloadButton = document.getElementById("download");
    const closeButton = document.querySelector(".close");

    // Обработчик события для кнопки генерации одного изображения
generateButton.addEventListener("click", function () {
        generateImage(1); // Генерируем одно изображение
    });

    // Обработчик события для кнопки генерации 5 изображений
    generateMultipleButton.addEventListener("click", function () {
        generateImage(5); // Генерируем 5 изображений
    });

    // Обработчик события для кнопки закрытия модального окна
    closeButton.onclick = function() {
        modal.style.display = "none"; // Закрыть модальное окно
        generatedImagesContainer.innerHTML = ''; // Очистить контейнер изображений
    }

    // Закрыть модальное окно при нажатии на область вне модального окна
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            generatedImagesContainer.innerHTML = ''; // Очистить контейнер изображений
        }
    }

    // Функция генерации изображения (или изображений)
    function generateImage(count) {
        const description = textInput.value.trim(); // Получаем значение из поля ввода
        if (!description) {
            alert("Пожалуйста, введите описание для генерации изображения."); // Предупреждение, если поле пустое
            return; // Выход из функции, если поле пустое
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
                        throw new Error("Сетевой ответ был не ок");
                    }
                    return response.blob();
                })
                .then((blob) => {
                    return URL.createObjectURL(blob); // Создание URL для изображения
                })
            );
        }

        Promise.all(promises)
            .then(urls => {
                displayGeneratedImages(urls); // Отображение всех изображений
            })
            .catch((error) => {
                alert("Не удалось сгенерировать изображения. Попробуйте еще раз.");
                console.error("Ошибка:", error);
            })
            .finally(() => {
                displayLoadingState(false);
            });
    }

    // Создание описания на основе ввода текста
    function createDescription(inputText) {
        return inputText || "просто изображение"; // Если ничего не введено, генерируем стандартное изображение
    }

    // Генерация случайного числа для seed
    function generateRandomSeed() {
        return Math.floor(Math.random() * 1e9);
    }

    // Отображение состояния загрузки
    function displayLoadingState(isLoading) {
        loadingSpinner.style.display = isLoading ? "block" : "none";
        generateButton.disabled = isLoading; // Заблокировать кнопку, пока идет загрузка
        generateMultipleButton.disabled = isLoading; // Заблокировать кнопку, пока идет загрузка
        if (isLoading) {
            modal.style.display = "none"; // Закрыть модальное окно, если оно открыто
        }
    }

    // Отображение сгенерированных изображений в модальном окне
    function displayGeneratedImages(urls) {
        generatedImagesContainer.innerHTML = ''; // Очистить контейнер изображений
        urls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.style.width = "100%"; // Установка ширины изображения
            img.style.borderRadius = "5px"; // Скругление углов
            img.style.marginBottom = "10px"; // Отступ между изображениями
            generatedImagesContainer.appendChild(img); // Добавление изображения в контейнер
        });
        modal.style.display = "block"; // Открыть модальное окно
    }
});

// И Н О В А Ц И И ==========================
document.addEventListener('DOMContentLoaded', () => {
    // Функция для обновления таблицы истории запросов
    function updateHistoryTable() {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const tableBody = document.querySelector('#historyTable tbody');
        tableBody.innerHTML = ''; // Очищаем таблицу

        history.forEach(item => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = item;
            cell.style.cursor = 'pointer'; // Меняем курсор на указатель при наведении

            // Добавляем обработчик клика
            cell.onclick = () => {
                document.querySelector('#text-input').value = item; // Заполнение поля ввода
            };

            row.appendChild(cell);
            tableBody.appendChild(row);
        });
    }

    // Функция для добавления запроса в историю
    function addToHistory(request) {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        
        // Удаляем запрос, если он уже есть, чтобы добавить его в конец
        const filteredHistory = history.filter(item => item !== request);
        filteredHistory.push(request); // Добавляем новый запрос

        // Сохраняем только последние 5 запросов
        localStorage.setItem('history', JSON.stringify(filteredHistory.slice(-5)));
        updateHistoryTable();
    }

    // Проверяем наличие кнопок и добавляем обработчики событий
    const generateButton = document.querySelector('#generate');
    const generateMultipleButton = document.querySelector('#generate-multiple');

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            const request = document.querySelector('#text-input').value;
            if (request) {
                addToHistory(request);
                // Ваша логика для генерации изображения здесь
            } else {
                console.warn('Пожалуйста, введите текст запроса.');
            }
        });
    } else {
        console.error("Кнопка с ID 'generate' не найдена.");
    }

    if (generateMultipleButton) {
        generateMultipleButton.addEventListener('click', () => {
            const request = document.querySelector('#text-input').value;
            if (request) {
                for (let i = 0; i < 5; i++) {
                    addToHistory(`${request} - Запрос ${i + 1}`); // Добавляем вариации запроса
                    // Ваша логика для генерации нескольких изображений здесь
                }
            } else {
                console.warn('Пожалуйста, введите текст запроса.');
            }
        });
    } else {
        console.error("Кнопка с ID 'generate-multiple' не найдена.");
    }

    // Инициализация таблицы при загрузке страницы
    updateHistoryTable();
});

// ГАЛЕРЕЯ МИНИАТЮР ============================== 
// З А Т У Х А Н И Е =============================
document.addEventListener("DOMContentLoaded", function () {
    const loadingSpinner = document.getElementById('loading-spinner');

    // Функция для показа анимации загрузки
    function showLoading() {
        loadingSpinner.style.display = 'flex'; // Отображаем элемент как flex
    }

    // Функция для скрытия анимации загрузки
    function hideLoading() {
        loadingSpinner.style.display = 'none'; // Скрываем элемент
    }

    // Обновление анимации загрузки для кнопок генерации
    const generateButton = document.getElementById('generate');
    const generateMultipleButton = document.getElementById('generate-multiple');

    generateButton.addEventListener('click', () => {
        showLoading(); // Показываем загрузку
        generateImage(1); // Генерация одного изображения
        hideLoading(); // Скрываем загрузку после генерации
    });

    generateMultipleButton.addEventListener('click', () => {
        showLoading(); // Показываем загрузку
        generateImage(5); // Генерация нескольких изображений
        hideLoading(); // Скрываем загрузку после генерации
    });
});

// СТРАНИЦА ПОЖЕРТВОВАНИЙ ===================================================
function openDonationPage() {
    window.open('https://example.com/donate', '_blank'); // Замените на вашу страницу пожертвований
}
// ====================================== СТИЛИ ==================================
function generateImage(numberOfImages = 1) {
    // Получаем значения из полей ввода и списков
    const prompt = document.getElementById('text-input').value;
    const style = document.getElementById('style-select').value;
    const format = document.getElementById('format-select').value;
    const tone = document.getElementById('tone-select').value;
    const theme = document.getElementById('theme-select').value;
    const filter = document.getElementById('filter-select').value;
    const character = document.getElementById('character-select').value;
    const place = document.getElementById('place-select').value;

    // Проверка на наличие текста в поле ввода
    if (!prompt) {
        alert('Пожалуйста, введите описание картинки.');
        return;
    }

    // Формирование полного запроса
    let fullPrompt = prompt.trim(); // Удаляем лишние пробелы
    if (style) fullPrompt += ` в стиле ${style}`;
    if (format) fullPrompt += ` в формате ${format}`;
    if (tone) fullPrompt += ` с тонами ${tone}`;
    if (theme) fullPrompt += ` на тему ${theme}`;
    if (filter) fullPrompt += ` с фильтром ${filter}`;
    if (character) fullPrompt += ` с персонажем ${character}`;
    if (place) fullPrompt += ` в ${place}`;

    // Генерация изображений
    for (let i = 0; i < numberOfImages; i++) {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?nologo=1&seed=${generateRandomSeed()}&height=512&width=512`;

        // Вызов функции для отображения изображения
        addGeneratedImage(imageUrl);
    }
}

// Функция для генерации случайного числа
function generateRandomSeed() {
    return Math.floor(Math.random() * 1000000); // Генерирует случайное число от 0 до 999999
}

function addGeneratedImage(imageUrl) {
    const gallery = document.getElementById("gallery"); // Предполагаем, что у вас есть элемент с id "gallery"
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.alt = "Сгенерированное изображение";
    imgElement.className = "generated-image"; // Добавьте класс для стилей

    // Добавление кнопок "Скачать" и "Поделиться"
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const downloadButton = document.createElement("a");
    downloadButton.href = imageUrl;
    downloadButton.download = "generated_image.png"; // Имя файла для скачивания
    downloadButton.innerText = "Скачать";
    downloadButton.className = "download-button";

    const shareButton = document.createElement("button");
    shareButton.innerText = "Поделиться";
    shareButton.className = "share-button";
    shareButton.onclick = () => {
        navigator.clipboard.writeText(imageUrl)
            .then(() => alert('Ссылка скопирована!'))
            .catch(err => alert('Не удалось скопировать ссылку: ', err));
    };

    // Добавление кнопок в контейнер
    buttonContainer.appendChild(downloadButton);
    buttonContainer.appendChild(shareButton);

    // Объединяем изображение и кнопки
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper";
    imageWrapper.appendChild(imgElement);
    imageWrapper.appendChild(buttonContainer);

    gallery.appendChild(imageWrapper); // Добавляем изображение и кнопки в галерею
}

// Слушаем изменения в каждом выпадающем списке и обновляем промт
document.querySelectorAll('select').forEach(select => {
    select.addEventListener("change", updatePrompt);
});

// Функция для обновления промта
function updatePrompt() {
    let promptText = document.getElementById("text-input").value;

    // Добавляем значения из выпадающих списков
    const styleValue = document.getElementById("style-select").value ? `Стиль: ${document.getElementById("style-select").value}` : '';
    const formatValue = document.getElementById("format-select").value ? `Формат: ${document.getElementById("format-select").value}` : '';
    const toneValue = document.getElementById("tone-select").value ? `Тон: ${document.getElementById("tone-select").value}` : '';
    const themeValue = document.getElementById("theme-select").value ? `Тема: ${document.getElementById("theme-select").value}` : '';
    const filterValue = document.getElementById("filter-select").value ? `Фильтр: ${document.getElementById("filter-select").value}` : '';
    const characterValue = document.getElementById("character-select").value ? `Персонаж: ${document.getElementById("character-select").value}` : '';
    const placeValue = document.getElementById("place-select").value ? `Место: ${document.getElementById("place-select").value}` : '';

    // Создаем итоговый промт
    const fullPrompt = `${promptText} ${styleValue} ${formatValue} ${toneValue} ${themeValue} ${filterValue} ${characterValue} ${placeValue}`.trim();
    
    // Обновляем поле ввода промта
    document.getElementById("text-input").value = fullPrompt;
}
// ========== ФОН =================================================================

document.getElementById('background-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file) {
        // Создаем FormData и добавляем файл в него
        const formData = new FormData();
        formData.append('image', file); // 'image' - это ключ, который ожидает API Imgbb

        uploadToImgbb(formData); // Передаем FormData в функцию загрузки
    }
});

function uploadToImgbb(formData) {
    const apiKey = '776322487f852a2b3752cd6e0a88e7ad'; // Ваш API ключ

    fetch('https://api.imgbb.com/1/upload?key=' + apiKey, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const imageUrl = data.data.url; // Получаем URL загруженного изображения
            alert('Изображение успешно загружено! URL: ' + imageUrl);
            
            // Устанавливаем изображение как фон
            document.body.style.backgroundImage = `url(${imageUrl})`;
            document.body.style.backgroundSize = 'cover'; // Покрытие всего фона
            document.body.style.backgroundPosition = 'center'; // Центрирование фона
        } else {
            alert('Ошибка при загрузке изображения: ' + data.error.message);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при загрузке изображения.');
    });
}

//=================== КРЕСТИК =========================================
const textInput = document.getElementById('text-input');
const clearTextButton = document.getElementById('clear-text');

// Показываем или скрываем крестик в зависимости от содержимого текстового поля
textInput.addEventListener('input', () => {
    if (textInput.value) {
        clearTextButton.style.display = 'block'; // Показываем крестик, если есть текст
    } else {
        clearTextButton.style.display = 'none'; // Скрываем крестик, если нет текста
    }
});

// Функция для очистки текстового поля
clearTextButton.addEventListener('click', () => {
    textInput.value = ''; // Очищаем текстовое поле
    clearTextButton.style.display = 'none'; // Скрываем крестик
});
