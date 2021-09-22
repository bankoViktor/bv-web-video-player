/*
 * HTML5 video wrapper.
 * 
 * Version:      0.4.3
 * Author:       Banko Viktor (bankviktor14@gmail.com)
 * Date:         01.09.2021
 *
 * Requirement: WebComponents support.
 * 
 * Hotkeys:
 *   [H] or [Left]                      Go 5 sec earlier.
 *   [J]                                Decrease playback speed.
 *   [K],[Space]                        Start/stop/normal speed playback.
 *   [L]                                Increase playback speed.
 *   [;] or [Right]                     Go 5 sec late.
 *   [I]                                Picture in picture mode.
 *   [F]                                Full screen mode.
 *   [M]                                Mute.
 *   [0]-[9] or [NumPad 0]-[NumPad 9]   Перейти на % видео
 *   [Up]                               Volume increase with 5 step.
 *   [Down]                             Volume decrease with 5 step.
 *
 */





/**
 * @typedef  {object} ChangedEventOptions
 * @property {'added'|'modified'|'removed'} action
 * @property {HTMLBvQuality} element
 * 
 * 
 * @typedef  {object} EpisodeData
 * @property {string} title
 * @property {number} duration
 * 
 * @typedef  {object} QualityItem
 * @property {string} value
 * @property {string} title
 * 
 * 
 * @typedef  {object} EpisodeItem
 * @property {number} duration
 * @property {string} title
 */

const isDebug = true;



class BvLogger {
    /**
     * @param {string} name Название логгера.
     * @param {boolean} isPrint Выводит сообщения в консоль. По-умолчанию: TRUE.
     */
    constructor(name, isPrint = true) {

        /**
         * Название логгера.
         * @type {string} 
         */
        this.name = name;


        if (isPrint) {
            const format = [this.name, '::'];
            this.log = console.log.bind(window.console, ...format);
            //this.debug = console.log.bind(window.console, ...format);
            //this.warm = console.warm.bind(window.console, format);
            this.error = console.error.bind(window.console, ...format);
        } else {
            this.log = this.error = function () { };
        }
    }
}



class EpisodeCollection {

    /**
     * @param {HTMLUListElement} container
     */
    constructor(container) {
        /**
         * Контейнер с эпизодами
         * @type {HTMLUListElement}
         */
        this._container = container;
    }

    clear() {
        this._container.textContent = '';
    }

    /**
     * Добавляет новый эпизод.
     * @param {EpisodeData=} episodeData
     * @param {number} totalDuration
     */
    append(episodeData, totalDuration) {
        const title = typeof episodeData === 'undefined' || episodeData.title === null
            ? '' : episodeData.title;
        const width = typeof episodeData === 'undefined' || isNaN(totalDuration)
            ? 1 : episodeData.duration / totalDuration;

        const item = document.createElement('li');
        if (title.length > 0) {
            item.setAttribute('data-title', title);
        }
        item.style.width = width * 100 + '%';

        const list = document.createElement('ul');
        list.classList.add('progress-list');
        item.appendChild(list);

        const load = document.createElement('li');
        load.classList.add('progress-load');
        //load.style.width = '25%';
        list.appendChild(load);

        const hover = document.createElement('li');
        hover.classList.add('progress-hover');
        //hover.style.width = '50%';
        list.appendChild(hover);

        const play = document.createElement('li');
        play.classList.add('progress-play');
        //play.style.width = '12.5%';
        list.appendChild(play);

        const padding = document.createElement('div');
        padding.classList.add('progress-padding');
        item.appendChild(padding);

        this._container.appendChild(item);
    }

    /**
     * Добавляет новый эпизод.
     * @param {Array<EpisodeData>} episodesData
     * @param {number} totalDuration
     */
    appendRange(episodesData, totalDuration) {
        for (let i = 0; i < episodesData.length; i++) {
            const episodeData = episodesData[i];

            this.append(episodeData, totalDuration);
        }
    }

}



class HTMLBvVideoPlayer extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('VideoPlayer', isDebug);

        //#region Properties

        /**
         * Адресс источника видео, при запросе добавляется '?q={_currentQuality}'
         * @type {string} 
         */
        this._src = null;

        /**
         * Индекc скорости по-умолчанию.
         * @type {number}
         */
        this._playSpeedDef = 3;

        /**
         * Индекc текущей скорости.
         * @type {number}
         */
        this._playSpeedCur = this._playSpeedDef;

        /**
         * Массив скоростей воспроизведения.
         * @type {Array<number>}
         */
        this._playSpeeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 4.0, 8.0];

        /**
         * Шаг перемотки.
         * @type {number}
         */
        this._moveTimeStep = 5;

        /**
         * Шаг изменения громкости.
         * @type {number}
         */
        this._volumeStep = 0.1;

        /**
         * Флаг свидетельствующий о нажатии кнопки мыши при перемещении ползунка громкости.
         * @type {boolean} 
         */
        this._volumePressed = false;

        /**
         * Наименование параметра запроса.
         * @type {string}
         */
        this._param = 'q';

        /**
         * Текущее значение параметра запроса.
         * @type {string}
         */
        this._curParValue = null;

        /**
         * Использование горячих клавиш.
         * @type {boolean}
         */
        this._hotkey = false;

        /**
         * Показывать клавиши управления скоростью воспроизведения.
         * @type {boolean}
         */
        this._speedControls = false;

        /**
         * Количество секунд до скрытия элементов управления.
         * @type {number}
         */
        this._fadeCtrlSec = 4;

        /**
         * Таймер скрытия элементов управления при воспроизведении, в секундах.
         * @type {number} 
         */
        this._moveTimerCount = this._fadeCtrlSec;

        /**
         * Флаг инициализации компонента.
         * @type {boolean} 
         */
        this._isInitialized = false;

        //#endregion Properties

        //#region Window Events Handlers

        window.addEventListener('keyup', e => {

            if (!this._hotkey || e.target !== document.body) {
                return;
            }

            switch (e.keyCode) {

                case KeyEvent.DOM_VK_F:
                    this._fullscrButton.click();
                    break;

                case KeyEvent.DOM_VK_SPACE:
                case KeyEvent.DOM_VK_K:
                    if (this._video.paused) {
                        this._playButton.click();
                    } else if (this._video.playbackRate != 1) {
                        this._video.playbackRate = 1;
                        this._setSpeed(this._video, this._playSpeedDef);
                    } else {
                        this._playButton.click();
                    }
                    break;

                case KeyEvent.DOM_VK_LEFT:
                    this._video.currentTime = Math.max(this._video.currentTime - this._moveTimeStep, 0);
                    break;

                case KeyEvent.DOM_VK_H:
                    if (!this._video.paused) {
                        this._playButton.click();
                    }
                    this._video.currentTime = Math.max(this._video.currentTime - 1 / 25, 0);
                    break;

                case KeyEvent.DOM_VK_RIGHT:
                    this._video.currentTime = Math.min(this._video.currentTime + this._moveTimeStep, this._video.duration);
                    break;

                case KeyEvent.DOM_VK_SEMICOLON:
                    if (!this._video.paused) {
                        this._playButton.click();
                    }
                    this._video.currentTime = Math.min(this._video.currentTime + 1 / 25, this._video.duration);
                    break;

                case KeyEvent.DOM_VK_I:
                    this._pipButton.click();
                    break;

                case KeyEvent.DOM_VK_J:
                    this._slowerButton.click();
                    break;

                case KeyEvent.DOM_VK_L:
                    this._fasterButton.click();
                    break;

                case KeyEvent.DOM_VK_M:
                    this._volumeButton.click();
                    if (this._video.volume == 0) {
                        this._video.muted = false;
                        this._video.volume = 1;
                    }
                    break;

                case KeyEvent.DOM_VK_UP:
                    this._video.volume = Math.min(Math.floor(this._video.volume * 100) / 100 + this._volumeStep, 1);
                    if (this._video.muted) {
                        this._video.muted = false;
                    }
                    e.preventDefault();
                    break;

                case KeyEvent.DOM_VK_DOWN:
                    this._video.volume = Math.max(Math.floor(this._video.volume * 100) / 100 - this._volumeStep, 0);
                    if (this._video.muted) {
                        this._video.muted = false;
                    }
                    e.preventDefault();
                    break;

            }

            // Go to % positoon
            if (e.keyCode >= KeyEvent.DOM_VK_0 && e.keyCode <= KeyEvent.DOM_VK_9 || e.keyCode >= KeyEvent.DOM_VK_NUMPAD0 && e.keyCode <= KeyEvent.DOM_VK_NUMPAD9) {
                const base = e.keyCode < 96 ? 48 : 96;
                const m = (e.keyCode - base) / 10;
                this._video.currentTime = this._video.duration * m;
            }

        });
        window.addEventListener('keydown', e => {
            if (e.target === document.body && (
                e.keyCode === KeyEvent.DOM_VK_SPACE ||
                e.keyCode === KeyEvent.DOM_VK_UP ||
                e.keyCode === KeyEvent.DOM_VK_DOWN ||
                e.keyCode === KeyEvent.DOM_VK_LEFT ||
                e.keyCode === KeyEvent.DOM_VK_RIGHT)) {
                e.preventDefault();
            }
        });

        //#endregion Window Events Handlers

        //#region This Events Handlers

        this.addEventListener('fullscreenchange', () => {
            this._updateFullScreenButtonState();
        });
        this.addEventListener('dblclick', e => {
            if (e.path[0] === this._video) {
                this._fullscrButton.click();
            }
        });
        this.addEventListener('click', e => {
            let isClosing = true;
            for (let i = 0; i < e.path.length; i++) {
                if (e.path[i] === this._settingsButton) {
                    isClosing = false;
                    break;
                }
            }
            if (isClosing) {
                this._showMenu(false);
            }
        });
        this.addEventListener('mousemove', () => {
            this._moveTimerCount = this._fadeCtrlSec;
            // Отображение
            this._panelBotton.classList.remove('hided');
            this._gradientBotton.classList.remove('hided');
            // Отображение курсора в полноэкранном режиме
            if (document.fullscreenElement) {
                this.style.cursor = '';
            }
        });

        // Quality
        this.addEventListener('qualitylist-changed', e => {
            this._logger.log('QualityList changed');

            /**
             * @type {ChangedEventOptions} 
             */
            const options = e.detail;
            switch (options.action) {

                case 'added':
                    const menuItem = this.createMenuItem(options.element.value, options.element.innerHTML);
                    this._menuItemList.appendChild(menuItem);
                    // Первый по-умолчанию
                    if (this._curParValue === null) {
                        menuItem.click();
                    }
                    break;

                case 'removed':

                    break;

                case 'modified':

                    break;

            }
        });

        // Episode
        //this.addEventListener('episodelist-add', e => {
        //    this._logger.log('EpisodeList add');

        //    /**
        //     * Коллекция эпизодов.
        //     * @type {HTMLBvEpisodeList} 
        //     */
        //    this._episodeList = e.detail;
        //});
        //this.addEventListener('episodelist-remove', e => {
        //    logger.log('VideoPlayer :: EpisodeList remove');

        //    this._episodeList = null;
        //});
        //this.addEventListener('episode-add', e => {
        //    logger.log('VideoPlayer :: episode add');

        //    /**
        //     * Коллекция вариация качества.
        //     * @type {HTMLBvEpisode} 
        //     */
        //    const episode = e.detail;
        //});
        //this.addEventListener('episode-remove', e => {
        //    logger.log('VideoPlayer :: episode remove');

        //    /**
        //     * Коллекция вариация качества.
        //     * @type {HTMLBvEpisode} 
        //     */
        //    const episode = e.detail;
        //});

        //#endregion This Events

        this._logger.log('constructor');
    }

    static get observedAttributes() {
        return ['src', 'param', 'speed-controls', 'hotkey'];
    }

    get source() { return this._src; }
    set source(v) { this.setAttribute('src', v); }

    get param() { return this._param; }
    set param(v) { this.setAttribute('param', v); }

    get speedControls() { return this._speedControls; }
    set speedControls(v) { this.setAttribute('speed-controls', v); }

    get hotkey() { return this._hotkey; }
    set hotkey(v) { this.setAttribute('hotkey', v); }

    /**
     * Компоненту добавляют, удаляют или изменяют атрибут.
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        if (newValue === null) {
            newValue = 'false';
        }

        switch (name) {

            case 'src':
                this._src = newValue;
                break;

            case 'param':
                this._param = newValue;
                break;

            case 'speed-controls':
                this._speedControls = newValue.toLowerCase() !== 'false';
                if (this._isInitialized) {
                    this._updateSpeedControls();
                }
                break;

            case 'hotkey':
                this._hotkey = newValue.toLowerCase() !== 'false';
                if (this._isInitialized) {
                    this._updateControls();
                }
                break;
        }
    }

    /**
     * Компонент добавляется в DOM.
     */
    connectedCallback() {
        if (!this._isInitialized) {
            this._initialization();
        }
        this._updateControls();

        this._logger.log('connected');
    }

    /**
     * Компонент удаляется из DOM.
     */
    disconnectedCallback() {
        clearInterval(this._moveTimerId);
        this._moveTimerId = 0;

        this._logger.log('disconnected');
    }

    /**
     * Показывает спиннер загрузки.
     */
    _spinnerShow() { this._spinnerWrapper.style.visibility = 'visible'; }

    /**
     * Скрывает спиннер загрузки. 
     */
    _spinnerHide() { this._spinnerWrapper.style.visibility = 'collapse'; }

    /**
     * Скрыть/показать меню.
     * @param {boolean}
     */
    _showMenu(isShow = true) {
        this._popupMenu.style.visibility = isShow ? 'visible' : 'collapse';
        this._popupMenu.style.opacity = isShow ? '1' : '0';
    }

    /**
     * Возвращает название горячей клавиши.
     * @type {HTMLElement} element
     */
    _hotkeyPrint(element) {
        if (!this._hotkey) {
            return '';
        }

        let key;

        switch (element) {

            case this._fasterButton:
                key = 'L';
                break;

            case this._playButton:
                key = 'K';
                break;

            case this._slowerButton:
                key = 'J';
                break;

            case this._volumeButton:
                key = 'M';
                break;

            case this._pipButton:
                key = 'I';
                break;

            case this._fullscrButton:
                key = 'F';
                break;
        }

        return ` (${key})`;
    }

    /**
     * Преобразовывает длительность в формате 'HH:MM:SS' в число.
     * @param {string} str
     * @returns {number}
     */
    static _str2dur(str) {
        let parts = str.split(":", 3).reverse();
        let result = 0;
        let m = [1, 60, 3600];
        for (let i = 0; i < parts.length; i++) {
            result += parseInt(parts[i]) * m[i];
        }
        return result;
    }

    /**
     * Преобразовывает длительность в строку формата 'HH:MM:SS'.
     * @param {number} duration
     * @returns {string}
     */
    static _dur2str(duration) {
        let m = Math.trunc(duration / 60);
        let h = Math.trunc(m / 60);
        let s = Math.trunc(duration - (h * 60 + m) * 60);
        let result = m + ":" + (s < 10 ? "0" + s : s);
        if (m >= 60) {
            result = h + ":" + result;
        }
        return result;
    }

    /**
     * Устанавливает скорость воспроизведения из набора по индексу.
     * @param {HTMLVideoElement} video Элемент проигрывателя.
     * @param {number} speedIndex Индекс скорости воспроизведния из набора.
     */
    _setSpeed(video, speedIndex) {
        this._playSpeedCur = speedIndex;
        video.playbackRate = this._playSpeeds[speedIndex];
    }

    /**
     * Устанавливает громкость.
     * @param {Event} e события
     */
    _setVolume(e) {
        let x = e.offsetX;

        if (e.target === this._volumeSliderThumb) {
            x = e.target.offsetLeft + e.offsetX + 6;
        }

        const width = e.currentTarget.clientWidth - 1;
        let val = x / width;

        if (val < 0) {
            val = 0;
        } else if (val > 1) {
            val = 1;
        }

        this._video.volume = val;
        this._volumeSliderFill.style.width = `${val * 100}%`;

        if (this._video.muted) {
            this._video.muted = false;
        }
    }

    //#region Update Functions

    /**
     * Обновление состояния элементов управления. 
     */
    _updateControls() {
        this._updatePlayButtonState();
        this._updateVolumeButtonState();
        this._updateSpeedControls();
        this._updatePipButtonState();
        this._updateFullScreenButtonState();
    }

    /**
     * Обновляет индикатор времени. 
     */
    _updateTime() {
        const cur = this._video.currentTime;
        const dur = this._video.duration;

        if (isNaN(cur) || isNaN(dur)) {
            this._timeIndicator.style.visibility = 'collapse';
        } else {
            this._timeIndicator.style.visibility = 'visible';
            const curStr = HTMLBvVideoPlayer._dur2str(cur);
            const durStr = HTMLBvVideoPlayer._dur2str(dur);
            this._timeIndicator.textContent = `${curStr} / ${durStr}`;
        }
    }

    /**
     * Обновить состояние пунктов меню. 
     */
    _updateMenu() {
        /**
         * @type {Array<HTMLDivElement>} 
         */
        const items = Array.from(this._menuItemList.children);
        items.forEach((element, _i, _ar) => {
            const isSelected = this._curParValue === element.getAttribute('data-value');
            element.querySelector('.menu-item-icon').style.visibility = isSelected ? 'visible' : 'hidden';
        });
    }

    /**
     * Устанавливает состояние кнопки воспроизведение/стоп.
     */
    _updatePlayButtonState() {
        this._playButton.title = (this._video.paused ? 'Смотреть' : 'Пауза') + this._hotkeyPrint(this._playButton);
        this._playButton.innerHTML = this._video.paused
            ? `<svg viewBox='0 0 36 36'><path d='m12 26 6.5-4v-8l-6.5-4zm6.5-4 6.5-4-6.5-4z'/></svg>`
            : `<svg viewBox='0 0 36 36'><path d='m12 26h4v-16h-4zm9 0h4v-16h-4z'/></svg>`;
    }

    /**
     * Устанавливает состояние кнопки громкости.
     */
    _updateVolumeButtonState() {
        const vol = this._video.volume;
        this._volumeButton.title = (this._video.muted || vol === 0 ? 'Включение звука' : 'Отключение звука') + this._hotkeyPrint(this._volumeButton);
        this._volumeButton.innerHTML = this._video.muted || vol === 0
            ? '<svg viewBox="0 0 36 36"><path d="M21.48 17.98a4.5 4.5 0 0 0-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51a8.796 8.796 0 0 0 1.03-4.15c0-4.28-2.99-7.86-7-8.76v2.05c2.89.86 5 3.54 5 6.71zm-14.73-9-1.27 1.26 4.72 4.73H7.98v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81l2.04 2.05 1.27-1.27-9-9-7.72-7.72zm7.72.99-2.09 2.08 2.09 2.09V9.98z"/></svg>'
            : (vol < 0.5
                ? '<svg viewBox="0 0 36 36"><path d="M8 21h4l5 5V10l-5 5H8v6Zm11-7v8c1.48-.68 2.5-2.23 2.5-4 0-1.74-1.02-3.26-2.5-4Z"/></svg>'
                : '<svg viewBox="0 0 36 36"><path d="M8 21h4l5 5V10l-5 5H8v6Zm11-7v8c1.48-.68 2.5-2.23 2.5-4 0-1.74-1.02-3.26-2.5-4Zm0-2.71c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77v2.06Z"/></svg>');
        this._volumeSliderFill.style.width = this._video.volume * 100 + '%';
    }

    /**
     * Устанавливает состояние кнопки картинтка-в-картинке.
     * @param {boolean} isActive
     */
    _updatePipButtonState(isActive = false) {
        this._pipButton.title = (isActive ? 'Закрыть мини проигрыватель' : 'Открыть мини проигрыватель') + this._hotkeyPrint(this._pipButton);
        this._pipButton.innerHTML = isActive
            ? `<svg viewBox='0 0 36 36'><path d='M11 13v10h14V13zm18 12V10.98C29 9.88 28.1 9 27 9H9c-1.1 0-2 .88-2 1.98V25c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H9V10.97h18v14.05z'/></svg>`
            : `<svg viewBox="0 0 36 36"><path d="M25 17h-8v6h8v-6zm4 8V10.98C29 9.88 28.1 9 27 9H9c-1.1 0-2 .88-2 1.98V25c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H9V10.97h18v14.05z"/></svg>`;
    }

    /**
     * Устанавливает состояние кнопок управления скоростью воспроизведения.
     */
    _updateSpeedControls() {
        // Slower
        this._slowerButton.hidden = !this._speedControls;
        this._slowerButton.disabled = this._playSpeedCur <= 0;
        this._slowerButton.title = `Уменьшить скорость воспроизведения` + this._hotkeyPrint(this._slowerButton);
        // Faster
        this._fasterButton.hidden = !this._speedControls;
        this._fasterButton.disabled = this._playSpeedCur >= this._playSpeeds.length - 1;
        this._fasterButton.title = `Увеличить скорость воспроизведения` + this._hotkeyPrint(this._fasterButton);
        // Speed Indicator
        this._speedIndicatorContent.hidden = !this._speedControls;
        this._speedIndicatorButton.disabled = this._playSpeedCur == this._playSpeedDef;
        this._speedIndicatorContent.title = this._playSpeedCur == this._playSpeedDef
            ? 'Текущая скорость воспроизведения'
            : 'К нормальной скорости воспроизведения' + this._hotkeyPrint(this._playButton);
        this._speedIndicatorContent.innerText = "x" + this._video.playbackRate;
    }

    /**
     * Устанавливает состояние кнопки полноэкранного режима.
     */
    _updateFullScreenButtonState() {
        this._fullscrButton.title = (document.fullscreen ? 'Выход из полноэкранного режима' : 'Во весь экран') + this._hotkeyPrint(this._fullscrButton);
        this._fullscrButton.innerHTML = document.fullscreen
            ? '<svg viewBox="0 0 36 36"><path d="M14 14h-4v2h6v-6h-2v4zM22 14v-4h-2v6h6v-2h-4zM20 26h2v-4h4v-2h-6v6zM10 22h4v4h2v-6h-6v2z"/></svg>'
            : '<svg viewBox="0 0 36 36"><path d="M10 16h2v-4h4v-2h-6v6zM20 10v2h4v4h2v-6h-6zM24 24h-4v2h6v-6h-2v4zM12 20h-2v6h6v-2h-4v-4z"/></svg>';
    }

    //#endregion Update Functions

    //#region Create Functions

    /**
     * Инициализация компонента.
     */
    _initialization() {
        this._moveTimerId = setInterval(() => {
            if (this._video.paused) {
                return;
            }

            if (this._moveTimerCount > 0) {
                this._moveTimerCount -= 1;
            } else {
                if (this._moveTimerCount != null) {
                    this._moveTimerCount = null;
                    // Скрываем
                    this._panelBotton.classList.add('hided');
                    this._gradientBotton.classList.add('hided');
                    // Скрытие курсора в полноэкранном режиме
                    if (document.fullscreenElement) {
                        this.style.cursor = 'none';
                    }
                }
            }
        }, 1000);

        // DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Style 
        const style = document.createElement('style');
        style.textContent = '@import "styles.css" all;';
        shadow.appendChild(style);

        /**
         * Корневой элемент.
         */
        const root = document.createElement('div');
        root.classList.add('root');

        //#region Create Popup Menu

        /**
         * Всплывающее меню настроек.
         * @type {HTMLDivElement} 
         */
        this._popupMenu = document.createElement('div');
        this._popupMenu.classList.add('menu');
        root.appendChild(this._popupMenu);

        /**
        * Список пунктов всплывающего меню.
        * @type {HTMLUListElement} 
        */
        this._menuItemList = document.createElement('ul');
        this._popupMenu.appendChild(this._menuItemList);

        //#endregion Create Popup Menu

        //#region Create Bottom Panel

        /**
         * @type {HTMLDivElement}
         */
        this._panelBotton = document.createElement('div');
        this._panelBotton.classList.add('panel-bottom', 'fade');
        root.appendChild(this._panelBotton);

        const panelWrapper = document.createElement('div');
        panelWrapper.classList.add('panel-wrapper');
        this._panelBotton.appendChild(panelWrapper);

        //#region --- Create Preview, Episode name & Time

        /**
         * Контейнер всплывающего контейнера с превью и временем.
         * @type {HTMLDivElement}
         */
        this._hoverContainer = document.createElement('div');
        this._hoverContainer.classList.add('hover-container');
        this._hoverContainer.style.marginLeft = '50px';
        this._hoverContainer.style.marginRight = 'auto';
        panelWrapper.appendChild(this._hoverContainer);

        /**
         * Миниатюра.
         * @type {HTMLDivElement}
         */
        this._hoverPreview = document.createElement('div');
        this._hoverPreview.classList.add('progress-hover-preview');
        this._hoverPreview.style.background = 'url(https://picsum.photos/id/37/158/90)';
        this._hoverContainer.appendChild(this._hoverPreview);

        /**
         * Название эпизода.
         * @type {HTMLDivElement}
         */
        this._hoverCaption = document.createElement('div');
        this._hoverCaption.classList.add('progress-hover-caption');
        //this._hoverCaption.textContent = 'Название эпизода';
        this._hoverContainer.appendChild(this._hoverCaption);

        /**
         * Время.
         * @type {HTMLDivElement}
         */
        this._hoverTime = document.createElement('div');
        this._hoverTime.classList.add('progress-hover-time');
        //this._hoverTime.textContent = '1:12:42';
        this._hoverContainer.appendChild(this._hoverTime);

        //#endregion --- Create Preview, Episode name & Time

        //#region --- Create Progress Bar

        /**
         * Прогресс бар. Содержит список эпизодов и ползунок.
         * @type {HTMLDivElement}
         */
        this._progressBar = document.createElement('div');
        this._progressBar.classList.add('progress-bar');
        this._progressBar.addEventListener('mousemove', e => {
            const currentHoverEpisode = getCurrentHoverEpisode(e);
            if (currentHoverEpisode !== null) {
                let isBefore = true;
                for (let i = 0; i < this._episodesContainer.children.length; i++) {
                    /**
                     * @type {HTMLLIElement}
                     */
                    const episode = this._episodesContainer.children[i];
                    const subItems = getEpisodeSubItems(episode);
                    if (episode === currentHoverEpisode) {
                        isBefore = false;
                        // Scale Episode
                        subItems.list.classList.add('episode-hover-active');
                        // Hover
                        subItems.hover.style.width = e.offsetX + 'px';
                    } else {
                        if (isBefore) {
                            // Hover
                            subItems.hover.style.width = '100%';
                        } else {
                            // Hover
                            subItems.hover.style.width = '0';
                        }
                        // Scale Episode
                        subItems.list.classList.remove('episode-hover-active');
                        subItems.list.classList.add('episode-hover');
                    }
                }

                // Hover Container Preview, Time & Episode Name
                this._hoverContainer.style.opacity = 1;
                const offsetX = e.clientX - e.currentTarget.getBoundingClientRect().left;
                let absOffsetX = Math.max(0, offsetX - this._hoverContainer.clientWidth / 2);
                absOffsetX = Math.min(absOffsetX, e.currentTarget.clientWidth - this._hoverContainer.clientWidth);
                this._hoverContainer.style.marginLeft = absOffsetX + 'px';
                // Episode name
                const captionMargin = 90; // px
                if (offsetX <= this._hoverContainer.clientWidth / 2 + captionMargin / 2) {
                    // left
                    this._hoverCaption.style.marginLeft = '0px';
                    this._hoverCaption.style.marginRight = - captionMargin + 'px';
                } else if (offsetX >= e.currentTarget.clientWidth - this._hoverContainer.clientWidth + captionMargin / 2) {
                    // right
                    this._hoverCaption.style.marginLeft = - captionMargin + 'px';
                    this._hoverCaption.style.marginRight = '0px';
                } else {
                    // center
                    this._hoverCaption.style.marginLeft = - captionMargin / 2 +'px';
                    this._hoverCaption.style.marginRight = - captionMargin / 2 +'px';
                }
                this._hoverCaption.textContent = currentHoverEpisode.getAttribute('data-title') ?? '';
                // Hover Time
                const pos = offsetX / e.currentTarget.clientWidth;
                const time = this._video.duration * pos;
                this._hoverTime.textContent = HTMLBvVideoPlayer._dur2str(time);
            }
        });
        this._progressBar.addEventListener('mouseleave', e => {
            for (let i = 0; i < this._episodesContainer.children.length; i++) {
                /**
                 * @type{HTMLLIElement}
                 */
                const episode = this._episodesContainer.children[i];
                const subItems = getEpisodeSubItems(episode);
                // Hover
                subItems.hover.style.width = '0';
                // Scale Episode
                subItems.list.classList.remove('episode-hover-active', 'episode-hover');
            }

            // Hover Container Preview, Time & Episode Name
            this._hoverContainer.style.opacity = 0;
        });
        panelWrapper.appendChild(this._progressBar);

        /**
         * Список эпизодов.
         * @type {HTMLUListElement}
         */
        this._episodesContainer = document.createElement('ul');
        this._episodesContainer.classList.add('episodes-container');
        this._progressBar.appendChild(this._episodesContainer);

        /**
         * Красная точка на прогресс-баре.
         * @type {HTMLDivElement}
         */
        this._progressScrubber = document.createElement('div');
        this._progressScrubber.classList.add('progress-scrubber');
        this._progressBar.appendChild(this._progressScrubber);

        // ---------------------

        /**
         * @param {Event} e
         * @returns {HTMLLIElement} 
         */
        function getCurrentHoverEpisode(e) {
            for (let i = 0; i < e.path.length; i++) {
                const element = e.path[i];
                if (element.tagName === 'UL' &&
                    element.classList.contains('episodes-container') &&
                    i - 1 >= 0) {
                    return e.path[i - 1];
                }
            }
            return null;
        }

        /**
         * @typedef  {object} EpisodeSubItems
         * @property {HTMLUListElement} list
         * @property {HTMLDivElement} hover
         * @property {HTMLDivElement} load
         * @property {HTMLDivElement} play
         */

        /**
         * @param {HTMLLIElement} episode
         * @returns {EpisodeSubItems}  
         */
        function getEpisodeSubItems(episode) {
            return {
                list: episode.querySelector('.progress-list'),
                hover: episode.querySelector('.progress-hover'),
                load: episode.querySelector('.progress-load'),
                play: episode.querySelector('.progress-play'),
            }
        }

        //#endregion --- Create Progress Bar

        //#region --- Create Controls

        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('controls-container');
        panelWrapper.appendChild(controlsContainer);

        //#region ---|--- Create Left Controls Panel

        const leftPanel = document.createElement('div');
        leftPanel.classList.add('left-panel');
        controlsContainer.appendChild(leftPanel);

        /**
         * Кнопка воспроизведения/остановка.
         * @type {HTMLButtonElement}
         */
        this._playButton = document.createElement('button');
        this._playButton.disabled = true;
        this._playButton.addEventListener('click', e => {
            if (this._video.paused) {
                this._video.play();
            } else {
                this._video.pause();
            }
        });
        leftPanel.appendChild(this._playButton);

        //#region ---|---|--- Create Volume Control

        const volumeContainer = document.createElement('div');
        volumeContainer.classList.add('volume-container');
        leftPanel.appendChild(volumeContainer);

        /**
         * Кнопка выключения/включения звука.
         * @type {HTMLButtonElement}
         */
        this._volumeButton = document.createElement('button');
        this._volumeButton.addEventListener('click', () => {
            this._video.muted = !this._video.muted;

            if (this._video.volume === 0) {
                this._video.muted = false;
                this._video.volume = 1;
            }
        });
        volumeContainer.appendChild(this._volumeButton);

        const volumeSlider = document.createElement('div');
        volumeSlider.classList.add('volume-slider');
        volumeSlider.title = 'Громкость';
        volumeSlider.addEventListener('mousedown', () => {
            this._volumePressed = true;
        });
        volumeSlider.addEventListener('mouseup', () => {
            this._volumePressed = false;
        });
        volumeSlider.addEventListener('mouseleave', () => {
            this._volumePressed = false;
        });
        volumeContainer.appendChild(volumeSlider);

        const volumeSliderWrapper = document.createElement('div');
        volumeSliderWrapper.classList.add('volume-slider-wrapper');
        volumeSliderWrapper.addEventListener('mousemove', e => {
            if (this._volumePressed) {
                this._setVolume(e);
            }
        });
        volumeSliderWrapper.addEventListener('mousedown', e => {
            this._setVolume(e);
        });
        volumeSlider.appendChild(volumeSliderWrapper);

        const volumeSliderTrack = document.createElement('div');
        volumeSliderTrack.classList.add('volume-slider-track');
        volumeSliderWrapper.appendChild(volumeSliderTrack);

        /**
         * Полоса заполнения, отображает уровень громкости. 
         * @type {HTMLDivElement}
         */
        this._volumeSliderFill = document.createElement('div');
        this._volumeSliderFill.classList.add('volume-slider-fill');
        volumeSliderTrack.appendChild(this._volumeSliderFill);

        /**
         * Движок контрола уровеня громкости.
         * @type { HTMLDivElement }
         */
        this._volumeSliderThumb = document.createElement('div');
        this._volumeSliderThumb.classList.add('volume-slider-thumb');
        this._volumeSliderFill.appendChild(this._volumeSliderThumb);

        /**
         * Индекатор времени.
         * @type {HTMLSpanElement}
         */
        this._timeIndicator = document.createElement('div');
        this._timeIndicator.classList.add('time-indicator');
        this._timeIndicator.style.visibility = 'collapse';
        leftPanel.appendChild(this._timeIndicator);

        //#endregion ---|---|--- Create Volume Control

        //#endregion ---|--- Create Left Controls Panel

        //#region ---|--- Create Right Controls Panel

        const rightPanel = document.createElement('div');
        rightPanel.classList.add('right-panel');
        controlsContainer.appendChild(rightPanel);

        /**
         * Кнопка уменьшения скорость воспроизведения.
         * @type {HTMLButtonElement}
         */
        this._slowerButton = document.createElement('button');
        this._slowerButton.innerHTML = `<svg viewBox="0 0 36 36"><g transform-origin="50%" transform="scale(0.9)"><path d="M 28.5,26 15.5,18 28.5,10 z M 18.5,26 5.5,18 18.5,10 z"></path></g></svg>`;
        this._slowerButton.addEventListener('click', e => {
            if (!e.target.disabled) {
                this._setSpeed(this._video, this._playSpeedCur - 1);
            }
        });
        rightPanel.appendChild(this._slowerButton);

        /**
         * Кнопка-индикатор скорости воспроизведения.
         * @type {HTMLButtonElement}
         */
        this._speedIndicatorButton = document.createElement('button');
        this._speedIndicatorButton.classList.add('ctl-speed-indicator');
        this._speedIndicatorButton.addEventListener('click', e => {
            this._setSpeed(this._video, this._playSpeedDef);
        });
        rightPanel.appendChild(this._speedIndicatorButton);

        /**
         * Контейнер индикатора скорости воспроизведения.
         * @type {HTMLDivElement}
         */
        this._speedIndicatorContent = document.createElement('div');
        this._speedIndicatorContent.classList.add('ctl-speed-indicator-content');
        this._speedIndicatorButton.appendChild(this._speedIndicatorContent);

        /**
         * Кнопка увелечения скорость воспроизведения. 
         * @type {HTMLButtonElement}
         */
        this._fasterButton = document.createElement('button');
        this._fasterButton.innerHTML = `<svg viewBox="0 0 36 36"><g transform-origin="50%" transform="scale(0.9)"><path d="M 7.5,26 20.5,18 7.5,10 z M 17.5,26 30.5,18 17.5,10 z"></path></g></svg>`
        this._fasterButton.addEventListener('click', e => {
            if (!e.target.disabled) {
                this._setSpeed(this._video, this._playSpeedCur + 1);
            }
        });
        rightPanel.appendChild(this._fasterButton);

        /**
         * Кнопка настроек.
         * @type {HTMLButtonElement}
         */
        this._settingsButton = document.createElement('button');
        this._settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172"><g transform-origin="50%" transform="scale(0.65)"><path d="M69.28711,14.33333l-3.52734,18.08464c-5.8821,2.22427 -11.32102,5.33176 -16.097,9.25228l-17.37077,-5.99089l-16.71289,28.97461l13.89941,12.07975c-0.49282,3.02401 -0.81185,6.10305 -0.81185,9.26628c0,3.16323 0.31903,6.24227 0.81185,9.26628l-13.89941,12.07975l16.71289,28.9746l17.37077,-5.99088c4.77599,3.92052 10.2149,7.02801 16.097,9.25227l3.52734,18.08464h33.42578l3.52735,-18.08464c5.88211,-2.22427 11.32102,-5.33176 16.097,-9.25227l17.37077,5.99088l16.71289,-28.9746l-13.89941,-12.07975c0.49282,-3.02401 0.81185,-6.10305 0.81185,-9.26628c0,-3.16323 -0.31902,-6.24227 -0.81185,-9.26628l13.89941,-12.07975l-16.71289,-28.97461l-17.37077,5.99089c-4.77598,-3.92052 -10.21489,-7.02801 -16.097,-9.25228l-3.52735,-18.08464zM86,57.33333c15.83117,0 28.66667,12.8355 28.66667,28.66667c0,15.83117 -12.8355,28.66667 -28.66667,28.66667c-15.83117,0 -28.66667,-12.8355 -28.66667,-28.66667c0,-15.83117 12.8355,-28.66667 28.66667,-28.66667z"></path></g></svg>`;
        this._settingsButton.title = 'Настройки';
        this._settingsButton.addEventListener('click', () => {
            // Показать/скрыть
            const isShow = this._popupMenu.style.opacity !== '1';
            this._showMenu(isShow);
        });
        rightPanel.appendChild(this._settingsButton);

        /**
         * Кнопка включения/выключения режима картинка-в-картинке.
         * @type {HTMLButtonElement}
         */
        this._pipButton = document.createElement('button');
        this._pipButton.addEventListener('click', () => {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                this._video.requestPictureInPicture();
            }
        });
        rightPanel.appendChild(this._pipButton);

        /**
         * Кнопка включения/выключения полноэкранного режима.
         * @type {HTMLButtonElement}
         */
        this._fullscrButton = document.createElement('button');
        this._fullscrButton.addEventListener('click', () => {
            if (document.fullscreen) {
                document.exitFullscreen();
            } else {
                this.requestFullscreen();
            }
        });
        rightPanel.appendChild(this._fullscrButton);

        //#endregion ---|--- Create Right Controls Panel

        //#endregion --- Create Controls

        //#endregion Create Bottom Panel

        //#region Create Bottom Gradient

        /**
         * @type {HTMLDivElement}
         */
        this._gradientBotton = document.createElement('div');
        this._gradientBotton.classList.add('gradient-bottom', 'fade');
        root.appendChild(this._gradientBotton);

        //#endregion Create Bottom Gradient

        //#region Create Video

        /**
         * Элемент Video.
         * @type {HTMLVideoElement} 
         */
        this._video = document.createElement('video');
        this._video.textContent = `Тег video не поддерживается вашим браузером. Обновите браузер.`;
        this._video.addEventListener('timeupdate', e => {
            this._updateTime();

            const percent = this._video.currentTime / this._video.duration;

            let leftPc = 0;
            for (let i = 0; i < this._episodesContainer.children.length; i++) {
                /**
                 * @type {HTMLLIElement}
                 */
                const episode = this._episodesContainer.children[i];
                const subItems = getEpisodeSubItems(episode);

                const pcPerEpisode = episode.clientWidth / this._progressBar.clientWidth;

                if (percent < leftPc) {
                    subItems.play.style.width = '0';
                } else if (percent < leftPc + pcPerEpisode) {
                    const episodePc = (percent - leftPc) / pcPerEpisode;
                    subItems.play.style.width = episodePc * 100 + '%';
                } else {
                    subItems.play.style.width = '100%';
                }

                leftPc += pcPerEpisode;
            }
        });
        this._video.addEventListener('play', () => {
            this._updatePlayButtonState();
        });
        this._video.addEventListener('pause', () => {
            this._updatePlayButtonState();
        });
        this._video.addEventListener('volumechange', e => {
            this._updateVolumeButtonState();
            /**
            * @type {HTMLVideoElement}
            */
            const sender = e.currentTarget;
            this._volumeSliderFill.style.width = sender.volume * 100 + '%';
        });
        this._video.addEventListener('ratechange', () => {
            this._updateSpeedControls();
        });
        this._video.addEventListener('enterpictureinpicture', () => {
            this._updatePipButtonState(true);
        });
        this._video.addEventListener('leavepictureinpicture', () => {
            this._updatePipButtonState(false);
        });
        this._video.addEventListener('click', () => {
            if (this._popupMenu.style.opacity !== '1') {
                this._playButton.click();
            }
        });
        this._video.addEventListener('loadstart', e => { // 1. loadstart
            //this._logger.log('load start');
            this._spinnerShow();
        });
        this._video.addEventListener('durationchange', () => { // 2. durationchange
            //this._logger.log('duration change');
            this._updateTime();
        });
        this._video.addEventListener('loadedmetadata', e => { // 3. loadedmetadata 
            //this._logger.log('loaded meta data');
        });
        this._video.addEventListener('loadeddata', e => { // 4. loadeddata 
            //this._logger.log('loaded data');
            this._playButton.disabled = false;
        });
        this._video.addEventListener('progress', e => { // 5. progress
            /**
             * @type {HTMLVideoElement}
             */
            const sender = e.currentTarget;
            // const buff = sender.buffered;
            // this._buffersSegsList.innerHTML = '';
            // for (let i = 0; i < buff.length; i++) {
            //     const start = buff.start(i);
            //     const end = buff.end(i);
            //     const x = start / sender.duration;
            //     const w = end / sender.duration - x;

            //     const li = document.createElement('li');
            //     li.style.left = x * 100 + '%';
            //     li.style.width = w * 100 + '%';

            //     this._buffersSegsList.appendChild(li);
            // }

            // Спиннер при загрузке видео
            if (sender.readyState === sender.HAVE_CURRENT_DATA) {
                this._spinnerShow();
            } else if (sender.readyState === sender.HAVE_FUTURE_DATA) {
                this._spinnerHide();
            }

            //let networkState;
            //switch (sender.networkState) {
            //    case 0:
            //        networkState = 'NETWORK_EMPTY';
            //        break;
            //    case 1:
            //        networkState = 'NETWORK_IDLE';
            //        break;
            //    case 2:
            //        networkState = 'NETWORK_LOADING';
            //        break;
            //    case 3:
            //        networkState = 'NETWORK_NO_SOURCE';
            //        break;
            //}

            //let readyState;
            //switch (sender.readyState) {
            //    case 0:
            //        readyState = 'HAVE_NOTHING';
            //        break;
            //    case 1:
            //        readyState = 'HAVE_METADATA';
            //        break;
            //    case 2:
            //        readyState = 'HAVE_CURRENT_DATA';
            //        break;
            //    case 3:
            //        readyState = 'HAVE_FUTURE_DATA';
            //        break;
            //    case 4:
            //        readyState = 'HAVE_ENOUGH_DATA';
            //        break;
            //}

            //this._logger.log('progress: network ${networkState} / ready ${readyState}`);
        });
        this._video.addEventListener('canplay', e => { // 6. canplay
            //this._logger.log('can play');
            this._spinnerHide();

            // Append Episode
            const collection = new EpisodeCollection(this._episodesContainer);
            collection.clear();
            collection.appendRange([
                {
                    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit vivamus sit amet',
                    duration: 0.3 * this._video.duration,
                },
                {
                    title: 'Suspendisse tincidunt laoreet ex consectetur adipiscing elit',
                    duration: 0.7 * this._video.duration,
                }
            ], this._video.duration);
        });
        this._video.addEventListener('canplaythrough', e => { // 7. canplaythrough 
            //this._logger.log('can play through');
        });
        this._video.addEventListener('error', e => {
            /**
             * @type {HTMLVideoElement}
             */
            const sender = e.currentTarget;

            this._spinnerHide();

            const block = document.createElement('div');
            block.textContent = 'Источник видео не найден';
            block.style.position = 'absolute';
            block.style.left = '50%';
            block.style.top = '50%';
            block.style.transform = 'translateX(-50%) translateY(-50%)';
            block.style.border = '2px solid red';
            block.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            block.style.color = 'white';
            block.style.fontSize = '2rem';
            block.style.padding = '20px';
            root.appendChild(block);

            let err;
            switch (sender.error.code) {
                case 1:
                    err = 'MEDIA_ERR_ABORTED';
                    break;
                case 2:
                    err = 'MEDIA_ERR_NETWORK';
                    break;
                case 3:
                    err = 'MEDIA_ERR_DECODE';
                    break;
                case 4:
                    err = 'MEDIA_ERR_SRC_NOT_SUPPORTED';
                    break;
            }

            this._logger.error(`${sender.error.code} ${err} - ${sender.error.message}`);
        });
        root.appendChild(this._video);

        //#endregion Create Video

        //#region Create Load Spinner

        const svgNS = 'http://www.w3.org/2000/svg';

        /**
         * Спинер загрузки.
         * @type {SVGSVGElement}
         */
        this._spinnerWrapper = document.createElementNS(svgNS, 'svg');
        this._spinnerWrapper.setAttribute('viewBox', '0 0 50 50');
        this._spinnerWrapper.classList.add('spinner');

        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', 25);
        circle.setAttribute('cy', 25);
        circle.setAttribute('r', 20);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke-width', 5);
        this._spinnerWrapper.appendChild(circle);

        root.appendChild(this._spinnerWrapper);

        this._spinnerHide();

        //#endregion Create Load Spinner

        // Add to DOM
        shadow.appendChild(root);

        this._isInitialized = true;
    }

    /**
     * Создает пункт меню.
     * @param {string} value
     * @param {string} html
     * @returns {HTMLLIElement}
     */
    createMenuItem(value, html) {
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('menu-item-icon');
        iconDiv.style.visibility = 'hidden';
        iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172"><path d="M145.43294,37.93294l-80.93294,80.93295l-30.76628,-30.76628l-10.13411,10.13411l40.90039,40.90039l91.06706,-91.06705z"></path></svg>`;

        const textDiv = document.createElement('div');
        textDiv.classList.add('menu-item-body');
        textDiv.innerHTML = html;

        const li = document.createElement('li');
        li.setAttribute('data-value', value);
        li.addEventListener('click', e => {
            this._showMenu(false);

            /**
             * @type {HTMLLIElement} 
             */
            const sender = e.currentTarget;

            /**
             * @type {string}
             */
            const value = sender.getAttribute('data-value');

            if (this._curParValue === value) {
                return;
            }

            this._curParValue = value;

            this._updateMenu();

            // устанавливаем новое качество
            const curTime = this._video.currentTime;
            const isPaused = this._video.paused;
            this._video.src = `${this._src}?${this._param}=${this._curParValue}`;
            this._video.currentTime = curTime;
            if (!isPaused) {
                this._video.play();
            }
        });

        li.appendChild(iconDiv);
        li.appendChild(textDiv);
        return li;
    }

    //#endregion Create Functions

};
window.customElements.define('bv-video-player', HTMLBvVideoPlayer);



class HTMLBvQualityList extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('QualityList', false);


        //#region This Events Handlers

        this.addEventListener('quality-add', e => {
            this._logger.log('quality add');

            /**
             * @type {HTMLBvQuality} 
             */
            const newQuality = e.detail;

            // Check same value
            for (let i = 0; i < this.children.length; i++) {
                /**
                 * @type {HTMLBvQuality} 
                 */
                const quality = this.children[i];
                if (quality !== newQuality && quality.value === newQuality.value) {
                    newQuality.invalid = true;
                }
            }

            // Notify Parent

            /**
             * @type {ChangedEventOptions} 
             */
            const options = {
                action: 'added',
                element: newQuality,
            };
            const event = new CustomEvent('qualitylist-changed', {
                detail: options,
                cancelable: false,
                composed: true,
                bubbles: false,
            });
            this.parentElement.dispatchEvent(event);
        });
        this.addEventListener('quality-remove', e => {
            this._logger.log('quality remove');

            /**
             * @type {HTMLBvQuality} 
             */
            const removeQuality = e.detail;

            // Notify Parent

            /**
             * @type {ChangedEventOptions} 
             */
            const options = {
                action: 'removed',
                element: removeQuality,
            };
            const event = new CustomEvent('qualitylist-changed', {
                detail: options,
                cancelable: false,
                composed: true,
                bubbles: false,
            });
            this.parentElement.dispatchEvent(event);
        });
        this.addEventListener('quality-changed', e => {
            this._logger.log('quality changed');

            /**
             * @type {HTMLBvQuality} 
             */
            const changedQuality = e.detail;

            /**
             * @type {ChangedEventOptions} 
             */
            const options = {
                action: 'modified',
                element: changedQuality,
            };
            const event = new CustomEvent('qualitylist-changed', {
                detail: options,
                cancelable: false,
                composed: true,
                bubbles: false,
            });
            this.parentElement.dispatchEvent(event);
        });

        //#endregion This Events Handlers

        this._logger.log('constructor');
    }

    /**
    * Компонент добавляется в DOM.
    */
    connectedCallback() {
        this._logger.log('connected');
    }

    /**
     * Компонент удаляется из DOM.
     */
    disconnectedCallback() {
        this._logger.log('disconnected');
    }

}
window.customElements.define('bv-quality-list', HTMLBvQualityList);



class HTMLBvQuality extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('Quality', false);

        /**
         * Коллекция-владелец.
         * @type {HTMLBvQualityList} 
         */
        this._qualityList = null;

        /**
         * Значение, которое будет добавляться к URI запроса как параметр.
         * @type {string} 
         */
        this._value = null;

        /**
         * Элемени не валидный и не используется.
         * @type {boolean} 
         */
        this._invalid = false;


        this._logger.log('constructor');
    }

    static get observedAttributes() {
        return ['value', 'invalid'];
    }

    get value() { return this._value; }
    set value(v) { this.setAttribute('value', v); }

    get invalid() { return this._invalid; }
    set invalid(v) { this.setAttribute('invalid', v); }

    /**
     * Компоненту добавляют, удаляют или изменяют атрибут.
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {

        if (oldValue === newValue)
            return;

        if (newValue === null) {
            newValue = 'false';
        }

        switch (name) {

            case 'value':
                if (newValue.toString().length === 0) {
                    this._logger.error('NULL not valid value.');
                } else {
                    this._value = newValue;
                }
                this._notifyParent('quality-changed');
                break;

            case 'invalid':
                this._invalid = newValue.toLowerCase() !== 'false';
                if (this._invalid === false) {
                    this._notifyParent('quality-add');
                }
                break;
        }
    }

    /**
     * Компонент добавляется в DOM.
     */
    connectedCallback() {
        this._logger.log(`connected: value = ${this._value}`);

        if (this.parentElement === null || this.parentElement.nodeName !== 'BV-QUALITY-LIST') {
            this._logger.error(`Тег 'bv-quality' должен находиться внутри элемента 'bv-quality-list'.`);
        } else {
            this._qualityList = this.parentElement;

            this._notifyParent('quality-add');
        }
    }

    /**
     * Компонент удаляется из DOM.
     */
    disconnectedCallback() {
        this._logger.log(`disconnected: value = ${this._value}`);

        this._notifyParent('quality-remove');
    }

    /**
     * Уведоляет родительский компонент.
     * @param {string} eventName
     */
    _notifyParent(eventName) {
        if (this._qualityList !== null) {
            const event = new CustomEvent(eventName, {
                detail: this,
                cancelable: false,
                composed: true,
                bubbles: true,
            })

            this._qualityList.dispatchEvent(event);
        }
    }

};
window.customElements.define('bv-quality', HTMLBvQuality);



class HTMLBvEpisodeList extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('EpisodeList', false);


        this._logger.log('constructor');
    }

    static get observedAttributes() {
        return [];
    }

    /**
     * Компонент добавляется в DOM.
     */
    connectedCallback() {
        const collection = this._getParent();
        if (collection !== null) {
            const event = new CustomEvent('addepisodelist', {
                detail: this,
            })
            collection.dispatchEvent(event);
        }

        this._logger.log('connected');
    }

    /**
     * Компонент удаляется из DOM.
     */
    disconnectedCallback() {
        const collection = this._getParent();
        if (collection !== null) {
            const event = new CustomEvent('removeepisodelist', {
                detail: this,
            })
            collection.dispatchEvent(event);
        }

        this._logger.log('disconnected');
    }

    /**
     * Ищет родителя-владельца.
     * @returns {HTMLBvVideoPlayer}
     */
    _getParent() {
        /**
        * @type {HTMLBvVideoPlayer} 
        */
        const player = this.parentElement;
        if (player === null || player.nodeName !== 'BV-VIDEO-PLAYER') {
            this._logger.error(`Тег 'bv-episode-list' должен находиться внутри элемента 'bv-video-player'.`);
            return null;
        }
        return player;
    }

}
window.customElements.define('bv-episode-list', HTMLBvEpisodeList);



class HTMLBvEpisode extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('Episode', false);

        /**
         * Длительность эпизода.
         * @type {number} 
         */
        this._duration = null;

        /**
         * Название эпизода.
         * @type {string} 
         */
        this._title = null;


        this._logger.log('constructor');
    }

    static get observedAttributes() {
        return ['duration', 'title'];
    }

    get duration() { return this._duration; }
    set duration(v) { this.setAttribute('duration', v); }

    get title() { return this._title; }
    set title(v) { this.setAttribute('title', v); }

    /**
     * Компоненту добавляют, удаляют или изменяют атрибут.
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {

        if (oldValue === newValue)
            return;

        switch (name) {

            case 'duration':
                const val = parseInt(newValue);
                if (!isNaN(val) || val < 0) {
                    this._duration = newValue;
                } else {
                    this._logger.error(`Invalid value 'duration' property.`);
                }
                break;

            case 'title':
                this._title = newValue;
                break;

        }
    }

    /**
     * Компонент добавляется в DOM.
     */
    connectedCallback() {
        const collection = this._getParent();
        if (collection !== null) {
            const event = new CustomEvent('addepisode', {
                detail: this,
            })
            collection.dispatchEvent(event);
        }

        this._logger.log('connected');
    }

    /**
     * Компонент удаляется из DOM.
     */
    disconnectedCallback() {
        const collection = this._getParent();
        if (collection !== null) {
            const event = new CustomEvent('removeepisode', {
                detail: this,
            })
            collection.dispatchEvent(event);
        }

        this._logger.log('disconnected');
    }

    /**
     * Ищет родителя-владельца.
     * @returns {HTMLBvEpisodeList}
     */
    _getParent() {
        /**
        * @type {HTMLBvEpisodeList}
        */
        const episodeList = this.parentElement;
        if (episodeList === null || episodeList.nodeName !== 'BV-EPISODE-LIST') {
            this._logger.error(`Тег 'bv-episode' должен находиться внутри элемента 'bv-episode-list'.`);
            return null;
        }
        return episodeList;
    }

}
window.customElements.define('bv-episode', HTMLBvEpisode);



// Keys
if (typeof KeyEvent == "undefined") {
    var KeyEvent = {
        //DOM_VK_CANCEL: 3,
        //DOM_VK_HELP: 6,
        //DOM_VK_BACK_SPACE: 8,
        //DOM_VK_TAB: 9,
        //DOM_VK_CLEAR: 12,
        //DOM_VK_RETURN: 13,
        //DOM_VK_ENTER: 14,
        //DOM_VK_SHIFT: 16,
        //DOM_VK_CONTROL: 17,
        //DOM_VK_ALT: 18,
        //DOM_VK_PAUSE: 19,
        //DOM_VK_CAPS_LOCK: 20,
        //DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        //DOM_VK_PAGE_UP: 33,
        //DOM_VK_PAGE_DOWN: 34,
        //DOM_VK_END: 35,
        //DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        //DOM_VK_PRINTSCREEN: 44,
        //DOM_VK_INSERT: 45,
        //DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        //DOM_VK_1: 49,
        //DOM_VK_2: 50,
        //DOM_VK_3: 51,
        //DOM_VK_4: 52,
        //DOM_VK_5: 53,
        //DOM_VK_6: 54,
        //DOM_VK_7: 55,
        //DOM_VK_8: 56,
        DOM_VK_9: 57,
        //DOM_VK_EQUALS: 61,
        //DOM_VK_A: 65,
        //DOM_VK_B: 66,
        //DOM_VK_C: 67,
        //DOM_VK_D: 68,
        //DOM_VK_E: 69,
        DOM_VK_F: 70,
        //DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        //DOM_VK_N: 78,
        //DOM_VK_O: 79,
        //DOM_VK_P: 80,
        //DOM_VK_Q: 81,
        //DOM_VK_R: 82,
        //DOM_VK_S: 83,
        //DOM_VK_T: 84,
        //DOM_VK_U: 85,
        //DOM_VK_V: 86,
        //DOM_VK_W: 87,
        //DOM_VK_X: 88,
        //DOM_VK_Y: 89,
        //DOM_VK_Z: 90,
        //DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        //DOM_VK_NUMPAD1: 97,
        //DOM_VK_NUMPAD2: 98,
        //DOM_VK_NUMPAD3: 99,
        //DOM_VK_NUMPAD4: 100,
        //DOM_VK_NUMPAD5: 101,
        //DOM_VK_NUMPAD6: 102,
        //DOM_VK_NUMPAD7: 103,
        //DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        //DOM_VK_MULTIPLY: 106,
        //DOM_VK_ADD: 107,
        //DOM_VK_SEPARATOR: 108,
        //DOM_VK_SUBTRACT: 109,
        //DOM_VK_DECIMAL: 110,
        //DOM_VK_DIVIDE: 111,
        //DOM_VK_F1: 112,
        //DOM_VK_F2: 113,
        //DOM_VK_F3: 114,
        //DOM_VK_F4: 115,
        //DOM_VK_F5: 116,
        //DOM_VK_F6: 117,
        //DOM_VK_F7: 118,
        //DOM_VK_F8: 119,
        //DOM_VK_F9: 120,
        //DOM_VK_F10: 121,
        //DOM_VK_F11: 122,
        //DOM_VK_F12: 123,
        //DOM_VK_F13: 124,
        //DOM_VK_F14: 125,
        //DOM_VK_F15: 126,
        //DOM_VK_F16: 127,
        //DOM_VK_F17: 128,
        //DOM_VK_F18: 129,
        //DOM_VK_F19: 130,
        //DOM_VK_F20: 131,
        //DOM_VK_F21: 132,
        //DOM_VK_F22: 133,
        //DOM_VK_F23: 134,
        //DOM_VK_F24: 135,
        //DOM_VK_NUM_LOCK: 144,
        //DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_SEMICOLON: 186,
        //DOM_VK_COMMA: 188,
        //DOM_VK_PERIOD: 190,
        //DOM_VK_SLASH: 191,
        //DOM_VK_BACK_QUOTE: 192,
        //DOM_VK_OPEN_BRACKET: 219,
        //DOM_VK_BACK_SLASH: 220,
        //DOM_VK_CLOSE_BRACKET: 221,
        //DOM_VK_QUOTE: 222,
        //DOM_VK_META: 224
    };
}
