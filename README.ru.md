[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

*Прочитать это на других языках: [English](README.md), [Русский](README.ru.md).*

<!-- ABOUT THE PROJECT -->
# HTML5 Web Video Player

![Product Name Screen Shot][product-screenshot]

Это обертка тега video HTML5.


<!-- GETTING STARTED -->
## Для начала


### Установка

Клонировать репозиторий
```sh
git clone https://github.com/bankoViktor/bv-web-video-player.git
```


<!-- USAGE EXAMPLES -->
## Использование

Подключите js файл в html документе
```js
 <script src="~/lib/bv-web-video-player/dist/bv-web-video-player.js"></script>
```
или можно воспользоваться сервисом [![jsDelivr][jsdelivr-badge]][jsdelivr-url]
```js
https://cdn.jsdelivr.net/gh/bankoViktor/bv-web-video-player@0.4.1/dest/bv-web-video-player.js
```
или минимизированная версия
```js
https://cdn.jsdelivr.net/gh/bankoViktor/bv-web-video-player@0.4.1/dest/bv-web-video-player.min.js
```
где:
- `bv-video-player` - тег проигрывателя,
    - атрибут `src` - адрес конечной точки, сформированный URI запроса: `{src}?q={value}`;
    - атрибут `speed-controls` - отображает элементы управления скоростью воспроизведения;
    - содержимое - должен быть хотя бы один элемент `bv-quality`;
- `bv-quality` - тег качества видео:
    - атрибут `value` - значение, добавляемое в качестве значения параметра `q`;
    - содержимое - отображается в названии пункта меню выбора качества видео.

пример:
```html
<bv-video-player src="/videos/123" speed-controls>
	<bv-quality value="1080">1080p Full HD</bv-quality>
	<bv-quality value="720">720p HD</bv-quality>
	<bv-quality value="480">480p</bv-quality>
</bv-video-player>
```
пример URI отправляемого запроса: `/videos/123?q=1080`


<!-- RELEASE NOTES -->
## Описание релизов

#### 2021.08.26 - Release 0.4.1
- Поддержка горячих клавиш.
- Возможность скрытия элементов управления скоростью воспроизведения (атрибут `speed-controls`).
- Исправлен артефакт плавающего за курсором элемента с таймкодом.

#### 2021.08.24 - Release 0.4
- Управление воспроизведением
- Управление скоростью воспроизведения.
- Режим картинка в картинке.
- Полноэкранный режим.
- Управление громкостью видео.


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

Banko Viktor - bankoViktor][github-profile] - bankviktor14@gmail.com


<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[contributors-url]: https://github.com/bankoViktor/bv-web-video-player/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[forks-url]: https://github.com/bankoViktor/bv-web-video-player/network/members
[stars-shield]: https://img.shields.io/github/stars/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[stars-url]: https://github.com/bankoViktor/bv-web-video-player/stargazers
[issues-shield]: https://img.shields.io/github/issues/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[issues-url]: https://github.com/bankoViktor/bv-web-video-player/issues
[license-shield]: https://img.shields.io/github/license/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[license-url]: https://github.com/bankoViktor/bv-web-video-player/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[product-screenshot]: screenshot.png
[github-profile]: https://github.com/bankoViktor
[jsdelivr-url]: https://www.jsdelivr.com
[jsdelivr-badge]: https://data.jsdelivr.com/v1/package/gh/bankoViktor/bv-web-video-player/badge
