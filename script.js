body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: url('https://i.ibb.co/SVt9NyF/d1627e64-2186-42c1-95f9-4fb005a1e8a3.jpg') no-repeat center center fixed;
    background-size: cover;
}

/*Анимация заголовка*/
header {
    width: 100%;
    background-color: rgba(13, 13, 13, 0.8);
    padding: 15px 0;
    text-align: center;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
    box-shadow: 0 5px 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-animation {
    width: 50px;
    height: auto;
    margin-left: 10px;
    opacity: 0;
    animation: fade-in 1.3s forwards 3.2s;
}

.animated-title {
    font-size: 36px;
    font-family: 'Arial Black', sans-serif;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    animation: wave 1.5s forwards;
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes typing {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}

.animated-title span {
    display: inline-block;
    animation: appear 0.5s forwards;
}

@keyframes appear {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}


.animated-title::before {
    content: attr(data-title);
    display: inline-block;
}

h1 {
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.9);
}

.container {
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

textarea {
    width: 100%;
    height: 50px;
    margin-bottom: 20px;
    padding: 10px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background: rgba(0, 255, 255, 0.4);
    color: white;
    font-size: 1.8rem;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: rgba(0, 255, 255, 0.7);
}

.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.8);
}

.modal-content {
    background-color: rgba(13, 13, 13, 0.9);
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    text-align: center;
    border-radius: 10px;
}

.modal-content img {
    width: 100%;
    border-radius: 10px;
}

.close {
    color: white;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: #bbb;
    text-decoration: none;
    cursor: pointer;
}

.loading {
    text-align: center;
    color: white;
    font-size: 1.5rem;
}

 .container-2 {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.vertical-containers {
    display: flex;
    width: 100%;
    opacity: 0.8;
}

.left-container,
.right-container {
  
    width: 50%;
    padding: 20px;
}

#historyTable {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    border-collapse: collapse;
}

#historyTable th,
#historyTable td {
    padding: 8px;
    border: 1px solid #ccc;
    text-align: center;
}

#historyTable th {
  color: 4444;
  padding: 24px;
  color: white;
  font-size: 22px; 
}

/* Стили для ячеек таблицы с запросами */
#historyTable td {
    transition: all 0.3s ease;
    padding: 10px;
}

#historyTable td:hover {
    font-size: 1.2em;
    font-weight: bold; 
    background-color: rgba(200, 200, 200, 0.2);
    cursor: pointer;
}

/* ==============ЖЕСТЬ !!!============== */
.bottom-container {
    width: 85%;
    padding: 15px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    margin: 20px;
}

.news-item {
    animation: slideDown 0.5s forwards;
    opacity: 0;
}

.news-icon {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}

.news-text {
    font-family: 'Arial Black', sans-serif; /* Подберите шрифт по вашему вкусу */
    font-size: 18px;
    color: black;
    text-shadow: 0 0 20px lightblue; /* Неоновый эффект */
    line-height: 1.5;
}

.subscribe {
    text-align: center;
    margin-top: 20px;
}

.subscribe-text {
    font-family: 'Arial Black', sans-serif;
    font-size: 24px;
    color: black;
    text-shadow: 0 0 10px lightblue;
    margin-bottom: 10px;
}

.social-icons {
    display: flex;
    justify-content: center;
}

.social-icon {
    width: 50px;
    height: 50px;
    margin: 0 10px;
    opacity: 0.8;
    transition: transform 0.3s;
    border: 2px solid black; /* Черный контур */
    border-radius: 50%; /* Круглая форма */
    cursor: pointer;
}

.social-icon:hover {
    transform: scale(1.6); /* Увеличение при наведении */
}

@keyframes slideDown {
    0% {
        transform: translateY(-20px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

/* ==============КОНЕЦ ЖЕСТИ !!!============== */

/* Загрузка */
.loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    display: none;
}

.loading-gif {
    width: 150px;
    height: 150px;
}

/*КНОПКИ*/
.donation-button {
    text-align: center;
    margin-top: 20px;
}

.donation-button button {
    padding: 10px 20px;
    background-color: #4444;
    color: Black;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    font-size: 18px;
}

.donation-button button:hover {
    background: none;
    transform: scale(1.1); /* Увеличение */
}

/* Фильтры */
select {
    width: 100%;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.2);
    color: black;
    font-size: 16px;
    border-radius: 5px;
    margin-bottom: 15px;
    cursor: pointer;
}

h2 {
    color: white;
    margin-bottom: 10px;
}

label {
    display: block;
    color: white;
    margin-bottom: 5px;
}

/* Кнопка загрузки фона */
.upload-label {
    display: inline-flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 10px 15px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
    font-size: 16px;
}

/* Иконка загрузки */
.upload-icon {
    width: 34px; /* Установите желаемый размер */
    height: 34px; /* Установите желаемый размер */
    fill: white; /* Изменяет цвет, если это SVG */
    margin-right: 20px; /* Отступ справа для пространства между иконкой и текстом */
     margin-right: 20px; /* Отступ слева*/
}

/* КРЕСТИК*/
.input-wrapper {
    position: relative;
    width: 90%;
}

#text-input {
    width: 100%;
    padding: 20px;
    padding-right: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: 1;
    box-sizing: border-box;
}

.clear-icon {
    position: absolute;
    right: 15px;
    top: 40%;
    transform: translateY(-50%);
    font-size: 70px;
    color: white;
    cursor: pointer;
    display: none;
}

.clear-icon:hover {
    color: Red;
}

/* Стили textarea */
#text-input {
    width: 100%;
    padding: 50px;
    padding-right: 50px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 20px;
    color: white;
    background-color: rgba(0, 0, 0, 0.2); /* Полупрозрачный фон для textarea */
    overflow-y: scroll;
    scrollbar-width: none;
    transition: border 0.3s ease; /* Плавный переход для рамки */
}

#text-input::-webkit-scrollbar {
    display: none;
}

/* Эффект светового импульса для рамки */
@keyframes borderPulse {
    0%, 100% {
        border-color: transparent;
        box-shadow: 0 0 0 rgba(255, 255, 255, 0); /* Без света */
    }
    50% {
        border-color: white; /* Цвет рамки */
        box-shadow: 0 0 10px white, 0 0 20px white; /* Подсветка рамки */
    }
}

/* Эффект светового импульса для внутреннего поля */
@keyframes innerPulse {
    0%, 100% {
        background-color: rgba(0, 0, 0, 0.1); /* Исходный цвет */
    }
    50% {
        background-color: rgba(255, 255, 255, 0.1); /* Слабо светящийся цвет */
    }
}

/* Стили для активного состояния рамки */
.pulsing {
    animation: borderPulse 1s infinite; /* Бесконечная анимация для рамки */
}

.pulsing-inner {
    animation: innerPulse 1s infinite; /* Бесконечная анимация для внутреннего поля */
}

/* Г А Л Е Р Е Я */

#gallery img {
    width: 80px; /* Ширина маленьких иконок */
    height: auto; /* Высота будет подстраиваться */
    border-radius: 5px; /* Закругление углов */
    cursor: pointer; /* Указатель на курсор при наведении */
    transition: transform 0.2s; /* Плавное увеличение при наведении */
}

#gallery img:hover {
    transform: scale(1.1); /* Увеличение при наведении */
}
