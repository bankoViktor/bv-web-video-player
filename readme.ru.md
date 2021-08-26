<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

*Прочитать это на других языках: [English](README.md), [Русский](README.ru.md).*

<!-- ABOUT THE PROJECT -->
# HTML5 Web Video Player

[![Product Name Screen Shot][product-screenshot]]

Это обертка тега video HTML5.



<!-- GETTING STARTED -->
## Для начала


### Установка

Клонировать репозиторий
```sh
git clone https://github.com/bankoViktor/bv_web_video_player.git
```

<!-- USAGE EXAMPLES -->
## Использование

Подключите js файл в html документе
```js
 <script src="~/lib/bv-video-player/index.js"></script>
```
или можно воспользоваться сервисом [jsDelivr][jsdelivr]
```js
https://cdn.jsdelivr.net/gh/bankoViktor/bv-web-video-player@0.4/index.js
```
или минимизированная версия
```js
https://cdn.jsdelivr.net/gh/bankoViktor/bv-web-video-player@0.4/index.min.js
```


используйте следующий пример
```html
<bv-video-player src="https://host.com/video/{id}">
    <bv-quality value="720">720p HD</bv-quality>
    <bv-quality value="480">480p</bv-quality>
</bv-video-player>
```

где:
- `bv-video-player` - тег проигрывателя,
    - атрибут `src` - адрес конечной точки, сформированный URI запроса: `{src}?q={value}`;
    - атрибут `speed-controls` - отображает элементы управления скоростью воспроизведения;
    - содержимое - должен быть хотя бы один элемент `bv-quality`;
- `bv-quality` - тег качества видео:
    - атрибут `value` - значение, добавляемое в качестве значения параметра `q`;
    - содержимое - отображается в названии пункта меню выбора качества видео.


<!-- CONTRIBUTING -->
## Сотрудничество

Вклады - вот что делает сообщество открытого исходного кода таким замечательным местом, где можно учиться, вдохновлять и творить. Мы благодарим вас за **любой вклад **.

1. Разветвить проект
2. Создайте свою Feature ветку от мастера (`git checkout -b feature/AmazingFeature`)
3. Закомитте свои изменения (`git commit -m 'Add some AmazingFeature'`)
4. Протолкните ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull-запрос



<!-- LICENSE -->
## Лицензия

Распространяется по лицензии MIT.



<!-- CONTACT -->
## Контакты

Banko Viktor - [bankoViktor](https://github.com/bankoViktor) - bankviktor14@gmail.com



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/bankoViktor/bv_web_video_player.svg?style=for-the-badge
[contributors-url]: https://github.com/bankoViktor/bv_web_video_player/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bankoViktor/bv_web_video_player.svg?style=for-the-badge
[forks-url]: https://github.com/bankoViktor/bv_web_video_player/network/members
[stars-shield]: https://img.shields.io/github/stars/bankoViktor/bv_web_video_player.svg?style=for-the-badge
[stars-url]: https://github.com/bankoViktor/bv_web_video_player/stargazers
[issues-shield]: https://img.shields.io/github/issues/bankoViktor/bv_web_video_player.svg?style=for-the-badge
[issues-url]: https://github.com/bankoViktor/bv_web_video_player/issues
[license-shield]: https://img.shields.io/github/license/bankoViktor/bv_web_video_player.svg?style=for-the-badge
[license-url]: https://github.com/bankoViktor/bv_web_video_player/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/bankoViktor
[product-screenshot]: screenshot.png
[jsdelivr]: https://www.jsdelivr.com/
