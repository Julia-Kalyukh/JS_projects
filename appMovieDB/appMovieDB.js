// Задание на урок 1:
// 1) Создать переменную numberOfFilms и в неё поместить ответ от пользователя на вопрос: 'Сколько фильмов вы уже посмотрели?'
// 2) Создать объект personalMovieDB и в него поместить такие свойства:
//     - count - сюда передается ответ на первый вопрос
//     - movies - в это свойство поместить пустой объект
//     - actors - тоже поместить пустой объект
//     - genres - сюда поместить пустой массив
//     - privat - в это свойство поместить boolean(логическое) значение false
// 3) Задайте пользователю по два раза вопросы:
//       - 'Один из последних просмотренных фильмов?'
//       - 'На сколько оцените его?'
//    Ответы стоит поместить в отдельные переменные.


// Задание на урок 2:
// 1) Автоматизировать вопросы пользователю про фильмы при помощи цикла
// 2) Сделать так, чтобы пользователь не мог оставить ответ в виде пустой строки, отменить ответ или ввести название фильма длинее,
//    чем 50 символов. Если это происходит - возвращаем пользователя к вопросам опять.
// 3) При помощи условий проверить  personalMovieDB.count, и если он меньше 10 - вывести сообщение "Просмотрено довольно мало фильмов",
//    если от 10 до 30 - "Вы классический зритель", а если больше - "Вы киноман". А если не подошло ни к одному варианту - "Произошла ошибка"


// Задание на урок 3:
// 1) Первую часть задания повторить по уроку
// 2) Создать функцию showMyDB, которая будет проверять свойство privat. Если стоит в позиции false - выводит в консоль главный объект программы
// 3) Создать функцию writeYourGenres в которой пользователь будет 3 раза отвечать на вопрос "Ваш любимый жанр под номером ${номер по порядку}".
//    Каждый ответ записывается в массив данных

// Задание на урок 4:
// 1) Приложение, состоящее из отдельных функций, переписать так, чтобы все функции стали методами объекта personalMovieDB
// 2) Создать метод toggleVisibleMyDB, который при вызове будет проверять свойство privat. Если оно false - он
//    переключает его в true, если true - переключает в false. Протестировать вместе с showMyDB.
// 3) В методе writeYourGenres запретить пользователю нажать кнопку "отмена" или оставлять пустую строку. 
//    Если он это сделал - возвращать его к этому же вопросу.
// 4) После того, как все жанры введены - при помощи метода forEach вывести в консоль сообщения в таком виде:
//    "Любимый жанр #(номер по порядку, начиная с 1) - это (название из массива)"

'use strict';

const personalMovieDB = {
    count: 0,
    movies: {},
    actors: {},
    genres: [],
    privat: false,
    start: function() {
        personalMovieDB.count = +prompt('Сколько фильмов вы уже посмотрели?', '35');
        
        while (personalMovieDB.count == '' || personalMovieDB.count == null || isNaN(personalMovieDB.count)) {
        personalMovieDB.count = +prompt('Сколько фильмов вы уже посмотрели?', '35');
        }
    },

    rememberMyFilms: function() {
        for (let i=0; i<2; i++) {
            let a = prompt('Один из последних просмотренных фильмов?', 'Четыре комнаты'),
                b = prompt('Как оцените его?', 'Огонь!');

            if (a != null && b != null && a != "" && b != "" && a.length <50 && b.length < 50) {
                personalMovieDB.movies[a] = b;
                console.log('done');
            } else {
                console.log('error');
                i--;
            }
        } 
    },

    writeYourGenres: function() {
        for (let i=1; i<=3; i++) {
            let genre = prompt(`Ваш любимый жанр под номером ${i}`, 'Драма');

            if(genre == '' || genre == null) {
                console.log('Некорректные данные');
                i--;
            } else {
                personalMovieDB.genres[i-1] = genre;
            }
        }

        personalMovieDB.genres.forEach((item, i) => {
            console.log(`Любимый жанр ${i+1} - это ${item}`);
        });
    },

    detectPersonalLevel: function() {
        if(personalMovieDB.count < 10) {
            alert('Просмотрено довольно мало фильмов');
        } else if(10 <= personalMovieDB.count > 30) {
            alert('Вы классичсеский зритель');
        } else if (personalMovieDB.count >= 30) {
            alert('Вы киноман');
        } else {
            alert('Error');
        }
    },

    showMyDB: function(hidden) {
        if (!hidden) {
            console.log(personalMovieDB);
        }
    },

    toggleVisibleMyDB: function() {
        if(personalMovieDB.privat) {
            personalMovieDB.privat = false;
        } else {
            personalMovieDB.privat = true;
        }
    }
};

personalMovieDB.start();
personalMovieDB.rememberMyFilms();
personalMovieDB.writeYourGenres();
personalMovieDB.detectPersonalLevel();
personalMovieDB.showMyDB();
personalMovieDB.toggleVisibleMyDB();