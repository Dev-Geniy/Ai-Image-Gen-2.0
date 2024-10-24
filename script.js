document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("generate");
    const generateMultipleButton = document.getElementById("generate-multiple");
    const textInput = document.getElementById("text-input");
    const loadingSpinner = document.getElementById("loading-spinner");
    const modal = document.getElementById("modal");
    const generatedImagesContainer = document.getElementById("generated-images-container");
    const closeButton = document.querySelector(".close");

    function updatePrompt() {
        let promptText = textInput.value.trim();

        const styleValue = document.getElementById("style-select").value;
        const formatValue = document.getElementById("format-select").value;
        const toneValue = document.getElementById("tone-select").value;
        const themeValue = document.getElementById("theme-select").value;
        const filterValue = document.getElementById("filter-select").value;
        const characterValue = document.getElementById("character-select").value;
        const placeValue = document.getElementById("place-select").value;

        // Формируем полный промт
        const fullPrompt = [promptText, styleValue, formatValue, toneValue, themeValue, filterValue, characterValue, placeValue]
            .filter(item => item) 
            .join(', ');
        
        textInput.value = fullPrompt;
    }

    document.querySelectorAll('select').forEach(select => {
        select.addEventListener("change", updatePrompt);
    });

    generateButton.addEventListener("click", function () {
        generateImage(1);
    });

    generateMultipleButton.addEventListener("click", function () {
        generateImage(5);
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

    function generateImage(count) {
        const description = textInput.value.trim();
        if (!description) {
            alert("⚠️ Пожалуйста, введите описание для генерации изображения 😉✨");
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
                .then((blob) => URL.createObjectURL(blob)) // Создание URL для изображения
            );
        }

        Promise.all(promises)
            .then(urls => {
                displayGeneratedImages(urls);
            })
            .catch((error) => {
                alert("⚠️ Не удалось сгенерировать изображения. Попробуйте еще раз! У вас всё получиться 😉✨");
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

        currentImageUrl = url;
    });
      
        modal.style.display = "block";
    }
});

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
                console.warn('Пожалуйста, введите текст запроса.');
            }
        });
    }

    updateHistoryTable();
});

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
                alert('Изображение успешно загружено! URL: ' + imageUrl);
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

const textInput = document.getElementById('text-input');
const clearTextButton = document.getElementById('clear-text');

textInput.addEventListener('input', () => {
    clearTextButton.style.display = textInput.value ? 'block' : 'none';
});

clearTextButton.style.display = textInput.value ? 'block' : 'none';

clearTextButton.addEventListener('click', () => {
    textInput.value = '';
    clearTextButton.style.display = 'none';
});

document.addEventListener("DOMContentLoaded", function() {
    const titleElement = document.querySelector('.animated-title');
    const titleText = titleElement.textContent;
    
    titleElement.textContent = '';

    titleText.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        span.style.animationDelay = `${index * 0.2}s`;
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
        document.body.style.backgroundImage = `url(${savedBackground})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
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
            saveBackgroundUrl(imageUrl);
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
