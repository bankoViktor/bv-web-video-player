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

[Demo JSFiddle][demo-url]


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
https://cdn.jsdelivr.net/gh/bankoViktor/bv-web-video-player@0.4.3/dist/bv-web-video-player.js
```
или минимизированная версия
```js
https://cdn.jsdelivr.net/gh/bankoViktor/bv-web-video-player@0.4.3/dist/bv-web-video-player.min.js
```

используйте следующий пример
```html
<bv-video-player src="/video/123">
    <bv-quality value="720">720p HD</bv-quality>
    <bv-quality value="480">480p</bv-quality>
</bv-video-player>
```

где:
- тег `bv-video-player`:

| Атрибут | Тип | По-умолчнаю | Обязательно | Описание |
| - | - | - | - | - |
| `scr` | `string`  | `null` | `true` | адрес конечной точки, запрос будет выглядеть `{src}?{param}={value}` |
| `param` | `string` | `q` | `true` | название параметра в запросе |
| `speed-controls` | `boolean` | `false` | `false`  | отображает элементы управления скоростью воспроизведения |
| `hotkey` | `boolean` | `false` | `false` | обработка нажатия горячих клавиш |
| content | - | - | `true` | должен быть хотя бы один элемент `bv-quality` |

- тег `bv-quality`:

| Атрибут | Тип | По-умолчнаю | Обязательно | Описание |
| - | - | - | - | - |
| `value` | `string` | `null` | `true` | значение, добавляемое в качестве значения параметра `q` |
| content | - | - | `true` | отображается в названии пункта меню выбора качества видео |
 
 
 
<!-- RELEASE NOTES -->
## Список изменений

#### Release х.х.х
- Обновлена процедура инициализации компонента.
- Исправлено отображение горячих клавиш в всплывающих подсказках.
- Добавлен спиннер загрузки медиаданных.

#### 2021.09.01 - Release 0.4.3
- Исравлено ложное срабатывание горичих клавиш.
- Добавлен атрибут `hotkey` вкл/выкл обработки горячих клавиш.
- Скрытие элементов управления при бездействии во время воспроизведения.
- Замена стандартного поведения клавиш Up/Down/Left/Right/Space на управление воспроизведением.
- Добавлен атрибут `param` для звменты названия параметра в запросе.
- Исправлено NaN отображение времени.

#### 2021.08.26 - Release 0.4.2
- Изменена структура проекта.

#### 2021.08.26 - Release 0.4.1
- Поддержка горячих клавиш.
- Возможность скрыть контроль скорости воспроизведения (атрибут `speed-controls`).
- Исправлен артефакт элемента тайм-кода, плавающего за курсором.

#### 2021.08.24 - Release 0.4
- Управление воспроизведением
- Управление скоростью воспроизведения.
- Режим "Картинка в картинке".
- Полноэкранный режим.
- Регулировка громкости звука видео.
 
 
 
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
[demo-url]: https://jsfiddle.net/winston349/o4qf6tkb/2
