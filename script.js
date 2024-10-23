document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("generate");
    const generateMultipleButton = document.getElementById("generate-multiple");
    const textInput = document.getElementById("text-input");
    const loadingSpinner = document.getElementById("loading-spinner");
    const modal = document.getElementById("modal");
    const generatedImagesContainer = document.getElementById("generated-images-container");
    const downloadButton = document.getElementById("download");
    const closeButton = document.querySelector(".close");

    //Кнопка 1 изображение
generateButton.addEventListener("click", function () {
        generateImage(1);
    });

    //Кнопка 5 изображений
generateMultipleButton.addEventListener("click", function () {
        generateImage(5);
    });

    //Закрыть модальное окно
    closeButton.onclick = function() {
        modal.style.display = "none";
        generatedImagesContainer.innerHTML = '';
    }

    // Закрыть при нажатии на область вне модального окна
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            generatedImagesContainer.innerHTML = '';
        }
    }

    // Функция генерации
    function generateImage(count) {
        const description = textInput.value.trim();
        if (!description) {
            alert("Пожалуйста, введите описание для генерации изображения.");
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

//Дополнения версии 2.0
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
    } else {
        console.error("Кнопка с ID 'generate' не найдена.");
    }

    if (generateMultipleButton) {
        generateMultipleButton.addEventListener('click', () => {
            const request = document.querySelector('#text-input').value;
            if (request) {
                for (let i = 0; i < 5; i++) {
                    addToHistory(`${request} - Запрос ${i + 1}`);
                }
            } else {
                console.warn('Пожалуйста, введите текст запроса.');
            }
        });
    } else {
        console.error("Кнопка с ID 'generate-multiple' не найдена.");
    }

    updateHistoryTable();
});

// Заставка, анимация и затухание
document.addEventListener("DOMContentLoaded", function () {
    const loadingSpinner = document.getElementById('loading-spinner');


    function showLoading() {
        loadingSpinner.style.display = 'flex';
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
    }

    const generateButton = document.getElementById('generate');
    const generateMultipleButton = document.getElementById('generate-multiple');

    generateButton.addEventListener('click', () => {
        showLoading();
        generateImage(1);
        hideLoading();
    });

    generateMultipleButton.addEventListener('click', () => {
        showLoading();
        generateImage(5);
        hideLoading();
    });
});

// СТРАНИЦА ПОДДЕРЖКИ ПРОЕКТА
function openDonationPage() {
    window.open('https://example.com/donate', '_blank');
}
//Списки фильтров и дополнений промта
function generateImage(numberOfImages = 1) {
    
    const prompt = document.getElementById('text-input').value;
    const style = document.getElementById('style-select').value;
    const format = document.getElementById('format-select').value;
    const tone = document.getElementById('tone-select').value;
    const theme = document.getElementById('theme-select').value;
    const filter = document.getElementById('filter-select').value;
    const character = document.getElementById('character-select').value;
    const place = document.getElementById('place-select').value;

    if (!prompt) {
        alert('Пожалуйста, введите описание картинки.');
        return;
    }

    let fullPrompt = prompt.trim();
    if (style) fullPrompt += ` в стиле ${style}`;
    if (format) fullPrompt += ` в формате ${format}`;
    if (tone) fullPrompt += ` с тонами ${tone}`;
    if (theme) fullPrompt += ` на тему ${theme}`;
    if (filter) fullPrompt += ` с фильтром ${filter}`;
    if (character) fullPrompt += ` с персонажем ${character}`;
    if (place) fullPrompt += ` в ${place}`;

    for (let i = 0; i < numberOfImages; i++) {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?nologo=1&seed=${generateRandomSeed()}&height=512&width=512`;

        addGeneratedImage(imageUrl);
    }
}

//С ЭТОГО МОМЕНТА НЕПОНЯТНО ЧТО ДАЛЬШЕ В КОДЕ ПРОИСХОДИТ ЧТО НУЖНО А ЧТО НЕТ, ЧТО РАБОТАЕТ А ЧТО НЕТ:

function generateRandomSeed() {
    return Math.floor(Math.random() * 1000000); // Генерирует случайное число от 0 до 999999
}

function addGeneratedImage(imageUrl) {
    const gallery = document.getElementById("gallery"); // Предполагаем, что у вас есть элемент с id "gallery"
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.alt = "Сгенерированное изображение";
    imgElement.className = "generated-image";

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
//ФОН 

document.getElementById('background-upload').addEventListener('change', function(event) {
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
            alert('Изображение успешно загружено! URL: ' + imageUrl);
            
// Устанавливаем изображение как фон
document.body.style.backgroundImage = `url(${imageUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        } else {
            alert('Ошибка при загрузке изображения: ' + data.error.message);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при загрузке изображения.');
    });
}

//КРЕСТИК ДЛЯ УДАЛЕНИЯ
const textInput = document.getElementById('text-input');
const clearTextButton = document.getElementById('clear-text');

textInput.addEventListener('input', () => {
    if (textInput.value) {
        clearTextButton.style.display = 'block';
    } else {
        clearTextButton.style.display = 'none';
    }
});

clearTextButton.addEventListener('click', () => {
    textInput.value = '';
    clearTextButton.style.display = 'none';
});

//АНИМАЦИЯ НАЗВАНИЯ
document.addEventListener("DOMContentLoaded", function() {
    const titleElement = document.querySelector('.animated-title');
    const titleText = titleElement.textContent;
    
    // Очищаем текст заголовка
    titleElement.textContent = '';

    // Разбиваем текст на буквы и добавляем в заголовок
    titleText.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter; // Заменяем пробел на неразрывный пробел
        span.style.animationDelay = `${index * 0.2}s`; // Задержка для каждой буквы
        titleElement.appendChild(span);
    });
});

// СВЕЧЕНИЕ ТЕКСТЕРА //

const clearText = document.getElementById('clear-text');

// Функция для проверки состояния текстового поля
function checkInput() {
    if (textInput.value.trim() === '') {
        textInput.classList.add('pulsing'); // Добавляем класс для рамки
        textInput.classList.add('pulsing-inner'); // Добавляем класс для внутреннего поля
    } else {
        textInput.classList.remove('pulsing'); // Убираем класс, если есть текст
        textInput.classList.remove('pulsing-inner'); // Убираем класс для внутреннего поля
    }
}

// Проверяем состояние при загрузке страницы
checkInput();

// Проверяем состояние при вводе текста
textInput.addEventListener('input', checkInput);

// Обработчик для кнопки очистки текста
clearText.addEventListener('click', function() {
    textInput.value = ''; // Очищаем текстовое поле
    checkInput(); // Проверяем состояние
});
