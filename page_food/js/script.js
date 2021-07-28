window.addEventListener('DOMContentLoaded', function() {

// Tabs

    let tabs = document.querySelectorAll('.tabheader__item'), 
          tabsContent = document.querySelectorAll('.tabcontent'), 
          tabsParent = document.querySelector('.tabheader__items'); 

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    
    hideTabContent();
    showTabContent();
    
    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {     
                if(target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


//Timer

    const deadline = '2021-09-15';
    
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()), 
              days = Math.floor( t / (1000 * 60 * 60 * 24) ),
              hours = Math.floor( t / (1000 * 60 * 60)  % 24),
              minutes = Math.floor( (t / 1000 / 60) % 60),
              seconds = Math.floor( (t / 1000) % 60);

        return {
            'total': t, 
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) { 
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector), 
              days = timer.querySelector('#days'), 
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000); 
              
        updateClock(); 
        
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);


// Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimeId);
    }
    
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === "") { 
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimeId = setTimeout(openModal, 500000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1 ) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);


// Использование классов для карточек
// Использование rest-оператора и параметров по умолчанию

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 74; 
            this.changeToRUB();
            
        }

        changeToRUB() {
            this.price *= this.transfer;
        }

        render(){
            const element = document.createElement('div');
            
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    // 4 - Ф-ция для получения карточек
    const getResourse = async (url) => { // нет data, т.к. мы только получаем данные
        const res = await fetch(url); // получение данных

        if (!res.ok) { // когда данные не приходят - ошибка
            // throw - выкидываем ошибку
            // если выкидываем ошибку в ручном режиме, то сработает блок кода catch
        throw new Error(`Could not fetch ${url}, status: ${res.status}`); // объект ошибки с текстом
        }

        return await res.json(); // обработка данных в объект JS
    };

    // 5 - Построение карточек
    getResourse('http://localhost:3000/menu') // запуск запроса
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => { // синтаксис деструктуризации объекта ({св-во})
                // будет создаваться столько раз, сколько объектов внутри массива
                // внутри нужные св-ва объекта и родитель, в который всё будет записываться
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

                // // 2 вариант динамического создания элементов на странице
                // // Используется когда не нужна шаблонизация и нужно один раз что-то построить

                // getResourse('http://localhost:3000/menu')
                //     .then(data => createCard(data));

                // // Ф-ция построения карточек
                // function createCard(data) { // принимает данные с сервера (массив из db)
                //     data.forEach(({img, altimg, title, descr, price}) => { // перебор массива
                //         // создание эл-тов без шаблона
                //         const element = document.createElement('div');
                //         // добавляем класс
                //         element.classList.add('menu__item');

                //         // внутри этого эл-та помещается вёрстка
                //         element.innerHTML = `
                //             <img src=${img} alt=${altimg}>
                //             <h3 class="menu__item-subtitle">${title}</h3>
                //             <div class="menu__item-descr">${descr}</div>
                //             <div class="menu__item-divider"></div>
                //             <div class="menu__item-price">
                //                 <div class="menu__item-cost">Цена:</div>
                //                 <div class="menu__item-total"><span>${price}</span> руб/день</div>
                //             </div>
                //         `;

                //         // помещение эл-та на страницу
                //         document.querySelector('.menu .container').append(element);
                //     });
                // }

// Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item); // переимнование ф-ции
    });

    // 1 - Вынос функционала по общению с сервером в отдельную ф-цию

    // Function Expression - создается в потоке кода и присваивается в переменную
    const postData = async (url, data) => { // отвечает за постинг данных (когда отпр. на сервер)
                                            // async - внутри асинхронный код

        // в переменную помещаем промис, который возвращается от fetch
        const res = await fetch(url, { // await - парный оператор, ставим перед теми операциями, кот. нужно дождаться
            method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
        });

        // обработка res(промиса) в JS-объект
        return await res.json();
    };

    function bindPostData(form) { // переименование ф-ции (отвечает за привязку постинга)
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText  = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            // 3 - Новый метод преобразования данных из формы в json
                // entries - возвращает массив собственных перечисляемых св-в указанного объекта (массивы в массиве), (обращение к formData, а не object)
                // + преобразование массива с массивами обратно в объект (обращение к объекту, а не formData)
                // + объект превращается в JSON
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            // 2 - Использование ф-ции постинга данных
            postData('http://localhost:3000/requests', json) // адрес json-server, переменная json
                    // модификация данных перенесена в ф-цию
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => { 
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        }); 
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('.modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
});

// Запуск json-server в терминале:
// npx json-server db.json