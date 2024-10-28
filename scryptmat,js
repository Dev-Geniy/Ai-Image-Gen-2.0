document.addEventListener('DOMContentLoaded', function() {  
    const progressBar = document.getElementById('progress-bar');  
    const progressText = document.getElementById('progress-text'); // Элемент для отображения процента  

    // Обновление прогресс-бара прокрутки только в модальных окнах  
    window.onscroll = function() {  
        const modals = document.querySelectorAll('.modal');  
        modals.forEach(modal => {  
            if (modal.style.display === "block") {  
                const scrolled = (modal.scrollTop / (modal.scrollHeight - modal.clientHeight)) * 100;  
                progressBar.style.width = scrolled + '%';  
                progressText.innerText = Math.round(scrolled) + '%'; // Обновляем текст с процентом  
            }  
        });  
    };

    // Функция для открытия модального окна  
    window.openModal = function(modalId) {  
        const modal = document.getElementById(modalId);  
        modal.style.display = "block";  
    };  

    // Функция для закрытия модального окна  
    window.closeModal = function(modalId) {  
        const modal = document.getElementById(modalId);  
        modal.style.display = "none";  
    };  

    // Закрытие модального окна при клике вне его  
    window.onclick = function(event) {  
        const modals = document.querySelectorAll('.modal');  
        modals.forEach(modal => {  
            if (event.target == modal) {  
                modal.style.display = "none";  
            }  
        });  
    };  
});

// форма 
const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_56w1vlm';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});

const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = star.getAttribute('data-value');
    updateStarRating();
  });
});

function updateStarRating() {
  stars.forEach(star => {
    if (star.getAttribute('data-value') <= selectedRating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}
