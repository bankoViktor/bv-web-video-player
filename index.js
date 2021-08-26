/*
 * Видео проигрыватель HTML5.
 * 
 * Версия:      0.3
 * Автор:       Banko Viktor (bankviktor14@gmail.com)
 * Дата:        24.08.2021
 *
 * 
 * Требования:
 * 
 * - поддержка WebComponents
 *
 *
 *
 * Горячие клавишы:
 *   [H] или [Стрелка влево] - Перейти на 5 сек раньше
 *   [J] - Уменьшить скорость воспроизведения
 *   [K] - Старт/стоп/нормальноая скорость
 *   [L] - Увеличить скорость воспроизведения
 *   [;] или [Стрелка вправо] - Перейти на 5 сек позже
 *   [I] - Открыть мини проигрователь
 *   [F] - Во весь экран
 *   [M] - Отключение/включение звука
 *   [0]-[9] или [NumPad 0]-[NumPad 9] - Перейти на % видео
 *   [Стрелка вверх] - Плавное увеличение громкости звука
 *   [Стрелка вниз] - Плавное уменьшение громкости звука
 *
 * 
 * 
 * TODOs:
 * 
 * TODO кнопка "С начала" при завершении видео
 * TODO пропадание контролов при воспроизведении и не двжении мыши
 * TODO всплывающая подсказка мутирования 0.5
 * TODO всплывающая подсказка далее/назад 5сек, плей/стоп
 * TODO название видео в левом верхнем углу прлеера
 * TODO спинер при ожидании загрузки
 * 
 * 
 */

class HTMLBvVideoPlayer extends HTMLElement {

    constructor() {
        super();

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
        * Значение текущего качества.
        * @type {string}
        */
        this._currentQuality = null;
        
        /**
         * Использование горячих клавиш.
         * @type {boolean}
         */
        this._hotkey = true;

        // ----------------------------------------------------------
        
        document.addEventListener('keyup', e => {
            if (!this._hotkey) {
                return;
            }
            
            switch (e.keyCode) {
                
                case KeyEvent.DOM_VK_F:
                    this._fullscrButton.click();
                    break;
                    
                case KeyEvent.DOM_VK_K:
                    if (this._video.paused) {
                        this._playButton.click();
                    } else if (this._video.playbackRate != 1) {
                        this._video.playbackRate = 1;
                        this._setPlaySpeed(this._video, this._playSpeedDef);
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
                    this._video.currentTime = Math.max(this._video.currentTime - 1/25, 0);
                    break;                
                
                case KeyEvent.DOM_VK_RIGHT:
                    this._video.currentTime = Math.min(this._video.currentTime + this._moveTimeStep, this._video.duration);
                    break;
                    
                case KeyEvent.DOM_VK_SEMICOLON:
                    if (!this._video.paused) {
                        this._playButton.click();
                    }
                    this._video.currentTime = Math.min(this._video.currentTime + 1/25, this._video.duration);
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
                    break;
                    
                case KeyEvent.DOM_VK_DOWN:
                    this._video.volume = Math.max(Math.floor(this._video.volume * 100) / 100 - this._volumeStep, 0);
                    if (this._video.muted) {
                        this._video.muted = false;
                    }
                    break;
                    
                case KeyEvent.DOM_VK_0:
                case KeyEvent.DOM_VK_1:
                case KeyEvent.DOM_VK_2:
                case KeyEvent.DOM_VK_3:
                case KeyEvent.DOM_VK_4:
                case KeyEvent.DOM_VK_5:
                case KeyEvent.DOM_VK_6:
                case KeyEvent.DOM_VK_7:
                case KeyEvent.DOM_VK_8:
                case KeyEvent.DOM_VK_9:
                case KeyEvent.DOM_VK_NUMPAD0:
                case KeyEvent.DOM_VK_NUMPAD1:
                case KeyEvent.DOM_VK_NUMPAD2:
                case KeyEvent.DOM_VK_NUMPAD3:
                case KeyEvent.DOM_VK_NUMPAD4:
                case KeyEvent.DOM_VK_NUMPAD5:
                case KeyEvent.DOM_VK_NUMPAD6:
                case KeyEvent.DOM_VK_NUMPAD7:
                case KeyEvent.DOM_VK_NUMPAD8:
                case KeyEvent.DOM_VK_NUMPAD9:
                    const base = e.keyCode < 96 ? 48 : 96;
                    const m = (e.keyCode - base) / 10;
                    this._video.currentTime = this._video.duration * m;
                    break;
            }                
            
        });

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
        this.addEventListener('addquality', e => {
            /**
             * @type {HTMLBvQuality} 
             */
            const qualityElement = e.detail;

            // Создание пунктов меню
            const menuItem = this._createMenuItem(qualityElement.innerHTML, qualityElement.value);
            this._menuItemList.appendChild(menuItem);

            // Первый по-умолчанию
            if (this._currentQuality === null) {
                menuItem.click();
            }
        });

        // DOM
        this.append(`Технология WebComponents не поддерживается вашим браузером. Обновите браузер.`);

        const shadow = this.attachShadow({ mode: 'open' });

        const style = this._createStyle();

        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');

        /**
         * Всплывающее меню настроек.
         * @type {HTMLDivElement} 
         */
        this._settingMenu = this._createSettingsMenu();

        const panelBotton = this._createBottomPanel();

        const gradientBotton = document.createElement('div');
        gradientBotton.classList.add('gradient-bottom');

        /**
         * Элемент Video.
         * @type {HTMLVideoElement} 
         */
        this._video = document.createElement('video');
        this._video.innerHTML = `Тег video не поддерживается вашим браузером. Обновите браузер.`;
        this._video.addEventListener('timeupdate', e => {
            /**
             * @type {HTMLVideoElement} 
             */
            const sender = e.currentTarget;
            this._timeCurrent.innerText = HTMLBvVideoPlayer._dur2str(sender.currentTime);
            const position = sender.currentTime / sender.duration;
            this._progressPos.style.width = position * 100 + "%";
            this._timeDuration.innerText = HTMLBvVideoPlayer._dur2str(sender.duration);
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
            if (this._settingMenu.style.opacity !== '1') {
              this._playButton.click();
            }
        });
        // 1. loadstart
        // 2. durationchange
        this._video.addEventListener('durationchange', e => {
            /**
             * @type {HTMLVideoElement}
             */
            const sender = e.currentTarget;
            this._timeDuration.innerHTML = HTMLBvVideoPlayer._dur2str(sender.duration);
        });
        // 3. loadedmetadata 
        // 4. loadeddata 
        // 5. progress
        this._video.addEventListener('progress', e => {
            /**
             * @type {HTMLVideoElement}
             */
            const sender = e.currentTarget;
            const buff = sender.buffered;
            this._buffersSegsList.innerHTML = '';
            for (let i = 0; i < buff.length; i++) {
                const start = buff.start(i);
                const end = buff.end(i);
                const x = start / sender.duration;
                const w = end / sender.duration - x;

                const li = document.createElement('li');
                li.style.left = x * 100 + '%';
                li.style.width = w * 100 + '%';

                this._buffersSegsList.appendChild(li);
            }
        });
        // 6. canplay
        // 7. canplaythrough 

        // Добавляем в DOM
        wrapper.appendChild(this._settingMenu);
        wrapper.appendChild(panelBotton);
        wrapper.appendChild(gradientBotton);
        wrapper.appendChild(this._video);

        shadow.appendChild(style);
        shadow.appendChild(wrapper);

        // Init buttons state
        this._updatePlayButtonState();
        this._updateVolumeButtonState();
        this._updateSpeedControls();
        this._updatePipButtonState();
        this._updateFullScreenButtonState();
    }

    static get observedAttributes() {
        return ['src'];
    }

    get source() { return this._src; }
    set source(v) { this.setAttribute('src', v); }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        switch (name) {

            case 'src':
                this._src = newValue;
                this._video.src = newValue;
                break;

        }
    }

    /**
     * Элемент стилей.
     * @returns {HTMLStyleElement} 
     */
    _createStyle() {
        const style = document.createElement('style');
        style.textContent = `

/* VIDEO PLAYER */

.wrapper {
    --button-size: 40px;
    --volume-width: 70px;
    --volume-thumb: 12px;
    --controls-color: rgba(255, 255, 255, 0.9);
    --progress-color: rgba(255, 255, 255, 0.2);
    --progress-buffered-color: rgba(255, 255, 255, 0.3);
    --progress-cursor-color: rgba(255, 255, 255, 0.4);
    --progress-time-color: red;

    height: 100%;
    width: 100%;
    background-color: black;
    position: relative;
    user-select: none;
    min-width: 500px;
    min-height: 100px;
    font-family: Arial;
}

    .wrapper video {
        height: 100%;
        width: 100%;
    }

.panel-top,
.panel-bottom {
    position: absolute;
    width: 100%;
    z-index: 30000;
}

.panel-top {
    top: 0;
}

.panel-bottom {
    bottom: 0;
}

.panel-wrapper {
    margin: 0 10px;
}

/* GRADIENT */

.gradient-bottom,
.gradient-bottom {
    position: absolute;
    left: 0;
    width: 100%;
    height: 194px;
}

.gradient-top {
    top: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%);
}

.gradient-bottom {
    bottom: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 90%);
}

/* PROGRESS BAR  */

.progress-container {
    height: 8px;
    /* высота прогрес-бара при наведенной мыши (активная) */
    margin-bottom: 4px;
    /* вертикальный отступ между прогрес-баром и панелью контроллов */
}

.progress-track {
    position: relative;
    background-color: var(--progress-color);
    height: 50%;
    transform: translateY(+50%);
}

    .progress-track:hover {
        height: 100%;
        transform: translateY(0);
        cursor: pointer;
    }

.progress-pos,
.progress-cursor {
    position: absolute;
    height: 100%;
    width: 0%;
}

.progress-pos {
    background-color: var(--progress-time-color);
    /*transition: width 0.3s linear;*/
}

.progress-cursor {
    background-color: var(--progress-cursor-color);
}

/* SEGMENTS */

.segments {
    position: absolute;
    height: 100%;
    width: 100%;
}

    .segments ul {
        list-style-type: none;
    }

        .segments ul li {
            position: absolute;
            top: 0;
            height: 100%;
            user-select: none;
        }

/* BUFFER SEGMENTS */

.buffers ul li {
    background-color: var(--progress-buffered-color);
}

/* CONTROLS */

.ctl {
    font-size: 0;
    display: inline-block;
    height: 100%;
}

.ctl-left {
    float: left;
}

.ctl-right {
    float: right;
}

/* BUTTON */

.controls-container button {
    height: var(--button-size);
    width: var(--button-size);
    background-color: transparent;
    border: 0px solid transparent;
    cursor: pointer;
    padding: 0;
    outline: none;
    vertical-align: middle;
}

    .controls-container button path {
        fill: var(--controls-color);
    }

    .controls-container button:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .controls-container button:active {
        background-color: rgba(255, 255, 255, 0.2);
        border-color: white;
    }

    .controls-container button:focus {
        /* border-color: red; */
    }

    .controls-container button:active:focus {
        border-color: transparent;
    }

    .controls-container button:disabled path {
        fill: rgba(255, 255, 255, 0.3);
    }

    .controls-container button:disabled:hover {
        background-color: transparent;
    }

    .controls-container button:disabled:active {
        border-color: transparent;
    }

/* VOLUME CONTROLS */

.volume-container {
    display: inline-block;
    width: var(--button-size);
    height: var(--button-size);
    transition: width 0.4s;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
}

    .volume-container:hover {
        width: calc(var(--button-size) + var(--volume-width));
        transition: width 0.4s;
    }

.volume-slider {
    display: inline-block;
    width: var(--volume-width);
    vertical-align: middle;
    cursor: pointer;
    position: relative;
    height: 100%;
}

.volume-slider-wrapper {
    position: relative;
    height: 100%;
    margin: 0 calc(var(--volume-thumb));
}

.volume-slider-track {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    height: 3px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
}

.volume-slider-fill {
    background-color: var(--controls-color);
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}

.volume-slider-thumb {
    position: absolute;
    top: 50%;
    transform: translateY(-50%) translateX(50%);
    right: 0;
    background-color: var(--controls-color);
    height: var(--volume-thumb);
    width: var(--volume-thumb);
    border-radius: calc(var(--volume-thumb) / 2);
    cursor: pointer;
}

/* SPEED INDICATORS */

.ctl-speed-indicator {
    width: 60px !important;
}

.ctl-speed-indicator-content {
    font-size: 18px;
    font-weight: bolder;
    border-radius: 4px;
    padding: 3px 0;
    color: var(--controls-color);
}

/* TIME INDICATORS */

.time-indicator {
    margin-left: 10px;
    font-size: 1.1rem;
    font-weight: 400;
    display: inline-block;
    vertical-align: middle;
    color: var(--controls-color);
}

/* POPUP MENU */

.menu {
    position: absolute;
    right: 10px;
    bottom: 60px;
    width: 250px;
    background-color: rgba(28,28,28,0.9);
    color: rgb(238, 238, 238);
    border-radius: 2px;
    z-index: 3001;
    visibility: collapse;
    opacity: 0;
    transition: .3s opacity, .3s visibility;
    text-shadow: 0 0 2px rgb(0, 0, 0, 0.5);
}

    .menu ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .menu li {
        display: block;
        cursor: pointer;
        font-size: 1rem;
        padding: 10px 5px;
    }

        .menu li:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

.menu-item-icon {
    float: left;
    padding: 0 10px;
}

    .menu-item-icon svg {
        fill: rgb(238, 238, 238);
        width: 16px;
    }

.menu-item-body {
    height: 100%;
}

.hide {
    visibility: hidden;
}

/* CURSOR TIME CODE */

.timecode-container {
    margin-bottom: 8px;
}

.timecode {
    margin-left: 0; /* в px */
    width: 55px;
    background-color: rgba(0, 0, 0, 0.3);
    font-size: 1rem;
    text-align: center;
    padding: 2px 5px;
    position: relative;
    color: var(--controls-color);
    border-radius: 2px;
}
`;
        return style;
    }

    /**
     * Создает всплывающее меню настроек.
     * @returns {HTMLDivElement}
     */
    _createSettingsMenu() {
        /**
         * Список пунктов меню.
         * @type {HTMLUListElement} 
         */
        this._menuItemList = document.createElement('ul');

        const menu = document.createElement('div');
        menu.classList.add('menu');
        menu.appendChild(this._menuItemList);

        return menu;
    }

    /**
     * Создает пункт меню.
     * @param {string} text
     * @param {string} value
     * @returns {HTMLLIElement}
     */
    _createMenuItem(html, value) {
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

            if (this._currentQuality === value) {
                return;
            }

            this._currentQuality = value;

            this._updateMenu();

            // устанавливаем новое качество
            const curTime = this._video.currentTime;
            const isPaused = this._video.paused;
            this._video.src = `${this._src}?q=${this._currentQuality}`;
            this._video.currentTime = curTime;
            if (!isPaused) {
                this._video.play();
            }
        });

        li.appendChild(iconDiv);
        li.appendChild(textDiv);
        return li;
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
            const isSelected = this._currentQuality === element.getAttribute('data-value');
            element.querySelector('.menu-item-icon').style.visibility = isSelected ? 'visible' : 'hidden';
        });
    }

    /**
     * Скрыть/показать меню.
     * @param {boolean}
     */
    _showMenu(isShow = true) {
        this._settingMenu.style.visibility = isShow ? 'visible' : 'collapse';
        this._settingMenu.style.opacity = isShow ? '1' : '0';
    }

    /**
     * Создает нижнюю панель управления.
     * @returns {HTMLDivElement}
     */
    _createBottomPanel() {
        const bottomPanel = document.createElement('div');
        bottomPanel.classList.add('panel-bottom');

        const bottomPanelWrapper = document.createElement('div');
        bottomPanelWrapper.classList.add('panel-wrapper');

        const timeCodeContainer = this._createTimeCodeContainer();
        const progressBarContainer = this._createProgressContainer();
        const controlsContainer = this._createControlsContainer();

        bottomPanelWrapper.appendChild(timeCodeContainer);
        bottomPanelWrapper.appendChild(progressBarContainer);
        bottomPanelWrapper.appendChild(controlsContainer);

        bottomPanel.appendChild(bottomPanelWrapper);
        return bottomPanel;
    }

    /**
     * Создает элемент плавающий за курсором с тайм кодом на прогрес баре.
     * @returns {HTMLDivElement}
     */
    _createTimeCodeContainer() {
        const timeCodeContainer = document.createElement('div');
        timeCodeContainer.classList.add('timecode-container');

        /**
         * Тайм код при движении мыши по прогресс бару.
         * @type {HTMLDivElement} 
         */
        this._timeCode = document.createElement('div');
        this._timeCode.classList.add('timecode');
        this._timeCode.hidden = true;

        timeCodeContainer.appendChild(this._timeCode);
        return timeCodeContainer;
    }

    /**
     * Создает прогрес бар.
     * @returns {HTMLDivElement}
     */
    _createProgressContainer() {
        const progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');

        const progressTrack = document.createElement('div');
        progressTrack.classList.add('progress-track');
        progressTrack.addEventListener('mousemove', e => {
            const x = e.target.offsetLeft + e.offsetX;
            const width = e.currentTarget.clientWidth;
            const newPosRatio = x / width;

            this._progressCursor.style.width = newPosRatio * 100 + "%";
            this._timeCode.removeAttribute('hidden');

            const timeCodeWidth = this._timeCode.clientWidth;
            let timeCodePos = x - timeCodeWidth / 2;
            if (x < timeCodeWidth / 2) {
                timeCodePos = 0;
            } else if (x > width - timeCodeWidth / 2) {
                timeCodePos = width - timeCodeWidth;
            }

            this._timeCode.style.marginLeft = timeCodePos + 'px';

            const pos = this._video.duration * newPosRatio;
            this._timeCode.innerText = HTMLBvVideoPlayer._dur2str(pos);
        });
        progressTrack.addEventListener('mouseleave', () => {
            this._progressCursor.style.width = "0%";
            this._timeCode.setAttribute('hidden', '');
        });
        progressTrack.addEventListener('click', e => {
            const x = e.target.offsetLeft + e.offsetX;
            const width = e.currentTarget.clientWidth;
            this._video.currentTime = this._video.duration * (x / width);
        });

        /**
         * Список сегментов буферизации.
         * @type {HTMLUListElement}
         */
        this._buffersSegsList = document.createElement('ul');

        const bufferSegs = document.createElement('div');
        bufferSegs.classList.add('segments', 'buffers');
        bufferSegs.appendChild(this._buffersSegsList);

        // Cursor

        /**
         * Полоса заполняющая прогресс бар при перемещении мыши по нем. 
         * @type {HTMLDivElement}
         */
        this._progressCursor = document.createElement('div');
        this._progressCursor.classList.add('progress-cursor');

        /**
         * Элемент-заполнитель прогресс бара.
         * @type {HTMLDivElement}
         */
        this._progressPos = document.createElement('div');
        this._progressPos.classList.add('progress-pos');

        progressTrack.appendChild(bufferSegs);
        progressTrack.appendChild(this._progressCursor);
        progressTrack.appendChild(this._progressPos);

        progressContainer.appendChild(progressTrack);
        return progressContainer;
    }

    /**
     * Создает контролы упавления.
     * @returns {HTMLDivElement}
     */
    _createControlsContainer() {
        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('controls-container');

        const leftPanel = this._createControlsLeftSide();
        const rightPanel = this._createControlsRightSide();

        controlsContainer.appendChild(leftPanel);
        controlsContainer.appendChild(rightPanel);

        return controlsContainer;
    }

    /**
     * Создает контролы управления левой стороны.
     * @returns {HTMLDivElement}
     */
    _createControlsLeftSide() {
        const panel = document.createElement('div');
        panel.classList.add('ctl', 'ctl-left');

        /**
         * Кнопка воспроизведения/остановка.
         * @type {HTMLButtonElement}
         */
        this._playButton = document.createElement('button');
        this._playButton.addEventListener('click', e => {
            if (this._video.paused) {
                this._video.play();
            } else {
                this._video.pause();
            }
        });

        // volume 
        const volume = this._createVolumeControl();

        /**
         * Текущее время.
         * @type {HTMLSpanElement} 
         */
        this._timeCurrent = document.createElement('span');
        this._timeCurrent.textContent = HTMLBvVideoPlayer._dur2str(0);
        this._timeCurrent.classList.add('time-current');

        /**
         * Длительность.
         * @type {HTMLSpanElement}
         */
        this._timeDuration = document.createElement('span');
        this._timeDuration.textContent = HTMLBvVideoPlayer._dur2str(0);
        this._timeDuration.classList.add('time-duration');

        const timeIndicator = document.createElement('div');
        timeIndicator.classList.add('time-indicator');
        timeIndicator.append(this._timeCurrent, ' / ', this._timeDuration);

        panel.appendChild(this._playButton);
        panel.appendChild(volume);
        panel.appendChild(timeIndicator);

        return panel;
    }

    /**
     * Создает контрол управления громкостью.
     * @returns {HTMLDivElement}
     */
    _createVolumeControl() {
        const container = document.createElement('div');
        container.classList.add('volume-container');

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

        /**
         * Движок контрола уровеня громкости.
         * @type {HTMLDivElement}
         */
        this._volumeSliderThumb = document.createElement('div');
        this._volumeSliderThumb.classList.add('volume-slider-thumb');

        /**
         * Полоса заполнения, отображает уровень громкости. 
         * @type {HTMLDivElement}
         */
        this._volumeSliderFill = document.createElement('div');
        this._volumeSliderFill.classList.add('volume-slider-fill');
        this._volumeSliderFill.appendChild(this._volumeSliderThumb);

        const volumeSliderTrack = document.createElement('div');
        volumeSliderTrack.classList.add('volume-slider-track');
        volumeSliderTrack.appendChild(this._volumeSliderFill);

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
        volumeSliderWrapper.appendChild(volumeSliderTrack);

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
        volumeSlider.appendChild(volumeSliderWrapper);

        container.appendChild(this._volumeButton);
        container.appendChild(volumeSlider);
        return container;
    }

    /**
     * Создает контролы упавления правой стороны.
     * @returns {HTMLDivElement}
     */
    _createControlsRightSide() {
        const panel = document.createElement('div');
        panel.classList.add('ctl', 'ctl-right');

        /**
         * Кнопка уменьшения скорость воспроизведения.
         * @type {HTMLButtonElement}
         */
        this._slowerButton = document.createElement('button');
        this._slowerButton.innerHTML = `<svg viewBox="0 0 36 36"><g transform-origin="50%" transform="scale(0.9)"><path d="M 28.5,26 15.5,18 28.5,10 z M 18.5,26 5.5,18 18.5,10 z"></path></g></svg>`;
        this._slowerButton.title = `Уменьшить скорость воспроизведения` + this._hotkeyPrint(this._slowerButton);
        this._slowerButton.addEventListener('click', e => {
            if (!e.target.disabled) {
                this._setPlaySpeed(this._video, this._playSpeedCur - 1);
            }
        })

        /**
         * Контейнер индикатора скорости воспроизведения.
         * @type {HTMLDivElement}
         */
        this._speedIndicatorContent = document.createElement('div');
        this._speedIndicatorContent.classList.add('ctl-speed-indicator-content');

        /**
         * Кнопка-индикатор скорости воспроизведения.
         * @type {HTMLButtonElement}
         */
        this._speedIndicatorButton = document.createElement('button');
        this._speedIndicatorButton.classList.add('ctl-speed-indicator');
        this._speedIndicatorButton.addEventListener('click', e => {
            this._setPlaySpeed(this._video, this._playSpeedDef);
        });
        this._speedIndicatorButton.appendChild(this._speedIndicatorContent);

        /**
         * Кнопка увелечения скорость воспроизведения. 
         * @type {HTMLButtonElement}
         */
        this._fasterButton = document.createElement('button');
        this._fasterButton.innerHTML = `<svg viewBox="0 0 36 36"><g transform-origin="50%" transform="scale(0.9)"><path d="M 7.5,26 20.5,18 7.5,10 z M 17.5,26 30.5,18 17.5,10 z"></path></g></svg>`;
        this._fasterButton.title = `Увеличить скорость воспроизведения` + this._hotkeyPrint(this._fasterButton);
        this._fasterButton.addEventListener('click', e => {
            if (!e.target.disabled) {
                this._setPlaySpeed(this._video, this._playSpeedCur + 1);
            }
        })

        /**
         * Кнопка настроек.
         * @type {HTMLButtonElement}
         */
        this._settingsButton = document.createElement('button');
        this._settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172"><g transform-origin="50%" transform="scale(0.65)"><path d="M69.28711,14.33333l-3.52734,18.08464c-5.8821,2.22427 -11.32102,5.33176 -16.097,9.25228l-17.37077,-5.99089l-16.71289,28.97461l13.89941,12.07975c-0.49282,3.02401 -0.81185,6.10305 -0.81185,9.26628c0,3.16323 0.31903,6.24227 0.81185,9.26628l-13.89941,12.07975l16.71289,28.9746l17.37077,-5.99088c4.77599,3.92052 10.2149,7.02801 16.097,9.25227l3.52734,18.08464h33.42578l3.52735,-18.08464c5.88211,-2.22427 11.32102,-5.33176 16.097,-9.25227l17.37077,5.99088l16.71289,-28.9746l-13.89941,-12.07975c0.49282,-3.02401 0.81185,-6.10305 0.81185,-9.26628c0,-3.16323 -0.31902,-6.24227 -0.81185,-9.26628l13.89941,-12.07975l-16.71289,-28.97461l-17.37077,5.99089c-4.77598,-3.92052 -10.21489,-7.02801 -16.097,-9.25228l-3.52735,-18.08464zM86,57.33333c15.83117,0 28.66667,12.8355 28.66667,28.66667c0,15.83117 -12.8355,28.66667 -28.66667,28.66667c-15.83117,0 -28.66667,-12.8355 -28.66667,-28.66667c0,-15.83117 12.8355,-28.66667 28.66667,-28.66667z"></path></g></svg>`;
        this._settingsButton.title = 'Настройки';
        this._settingsButton.addEventListener('click', () => {
            // Показать/скрыть
            const isShow = this._settingMenu.style.opacity !== '1';
            this._showMenu(isShow);
        })

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
        })

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
        })

        panel.appendChild(this._slowerButton);
        panel.appendChild(this._speedIndicatorButton);
        panel.appendChild(this._fasterButton);
        panel.appendChild(this._settingsButton);
        panel.appendChild(this._pipButton);
        panel.appendChild(this._fullscrButton);

        return panel;
    }
    
    /**
     * Горячая клавиша.
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
     * Устанавливает состояние кнопки воспроизведение/стоп.
     */
    _updatePlayButtonState() {
        if (this._video.paused) {
            HTMLBvVideoPlayer._changeButtonState(this._playButton,
                'Смотреть' + this._hotkeyPrint(this._playButton),
                `<svg viewBox='0 0 36 36'><path d='M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z'/></svg>`
            );
        } else {
            HTMLBvVideoPlayer._changeButtonState(this._playButton,
                'Пауза' + this._hotkeyPrint(this._playButton),
                `<svg viewBox='0 0 36 36'><path d='M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z'/></svg>`
            );
        }
    }

    /**
     * Устанавливает состояние кнопки громкости.
     */
    _updateVolumeButtonState() {
        if (this._video.muted || this._video.volume === 0) {
            HTMLBvVideoPlayer._changeButtonState(this._volumeButton,
                'Включение звука' + this._hotkeyPrint(this._volumeButton),
                `<svg viewBox='0 0 36 36'><path d='m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z'/></svg>`
            );
        } else if (this._video.volume < 0.5) {
            HTMLBvVideoPlayer._changeButtonState(this._volumeButton,
                'Отключение звука' + this._hotkeyPrint(this._volumeButton),
                `<svg viewBox='0 0 36 36'><path d='M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z'></path></svg >`
            );
        } else {
            HTMLBvVideoPlayer._changeButtonState(this._volumeButton,
                'Отключение звука' + this._hotkeyPrint(this._volumeButton),
                `<svg viewBox='0 0 36 36'><path d='M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z'/></svg>`
            );
        }

        this._volumeSliderFill.style.width = this._video.volume * 100 + '%';
    }

    /**
     * Устанавливает состояние кнопки картинтка-в-картинке.
     * @param {boolean} isActive
     */
    _updatePipButtonState(isActive = false) {
        if (isActive) {
            HTMLBvVideoPlayer._changeButtonState(this._pipButton,
                'Закрыть мини проигрыватель' + this._hotkeyPrint(this._pipButton),
                `<svg viewBox='0 0 36 36'><path d='M11,13 V23 H25 V13 z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 z'/></svg>`
            );
        } else {
            HTMLBvVideoPlayer._changeButtonState(this._pipButton,
                'Открыть мини проигрыватель' + this._hotkeyPrint(this._pipButton),
                `<svg viewBox='0 0 36 36'><path d='M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 z'/></svg>`
            );
        }
    }

    /**
     * Устанавливает состояние кнопок управления скоростью воспроизведения.
     */
    _updateSpeedControls() {
        this._slowerButton.disabled = this._playSpeedCur <= 0;
        this._fasterButton.disabled = this._playSpeedCur >= this._playSpeeds.length - 1;
        this._speedIndicatorButton.disabled = this._playSpeedCur == this._playSpeedDef;
        this._speedIndicatorContent.title = this._playSpeedCur == this._playSpeedDef
            ? 'Текущая скорость воспроизведения'
            : 'К нормальной скорости воспроизведения' + this._hotkeyPrint(this._playButton),
        this._speedIndicatorContent.innerText = "x" + this._video.playbackRate;
    }

    /**
     * Устанавливает состояние кнопки полноэкранного режима.
     */
    _updateFullScreenButtonState() {
        if (document.fullscreen) {
            HTMLBvVideoPlayer._changeButtonState(this._fullscrButton,
                'Выход из полноэкранного режима' + this._hotkeyPrint(this._fullscrButton),
                `<svg viewBox='0 0 36 36'><path d='m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z'/><path d='m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z'/><path d='m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z'/><path d='m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z'/></svg>`
            );
        } else {
            HTMLBvVideoPlayer._changeButtonState(this._fullscrButton,
                'Во весь экран' + this._hotkeyPrint(this._fullscrButton),
                `<svg viewBox='0 0 36 36'><path d='m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z'/><path d='m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z'/><path d='m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z'/><path d='M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z'/></svg>`
            );
        }
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
     * Меняет состояние кнопки.
     * @param {HTMLButtonElement} element Элемент контролла.
     * @param {string} title Новый текст всплывающей подсказки.
     * @param {string} innerHTML Новое содержимое (SVG иконка).
     */
    static _changeButtonState(element, title, innerHTML) {
        element.title = title;
        element.innerHTML = innerHTML;
    }

    /**
     * Устанавливает скорость воспроизведения из набора по индексу.
     * @param {HTMLVideoElement} video Элемент проигрывателя.
     * @param {number} speedIndex Индекс скорости воспроизведния из набора.
     */
    _setPlaySpeed(video, speedIndex) {
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

}




class HTMLBvQuality extends HTMLElement {

    constructor() {
        super();

        /**
         * Значение, которое будет добавляться к URI запроса как параметр.
         * @type {string} 
         */
        this._value = null;
    }

    static get observedAttributes() {
        return ['value'];
    }

    get value() { return this._value; }
    set value(v) { this.setAttribute('value', v); }

    attributeChangedCallback(name, oldValue, newValue) {

        if (oldValue === newValue)
            return;

        switch (name) {

            case 'value':
                
                this._value = newValue;
                break;

        }
    }

    connectedCallback() {
        /**
         * @type {HTMLBvVideoPlayer} 
         */
        const bvVideoPlayer = this.parentElement;
        if (bvVideoPlayer === null || bvVideoPlayer.nodeName !== 'BV-VIDEO-PLAYER') {
            console.error(`Тег 'bv-quality' должен находиться внутри элумента 'bv-video-player'.`);
            return;
        }

        // Event
        const event = new CustomEvent('addquality', {
            detail: this,
        })
        bvVideoPlayer.dispatchEvent(event);
    }

}




window.customElements.define('bv-video-player', HTMLBvVideoPlayer);
window.customElements.define('bv-quality', HTMLBvQuality);




// Keys
if (typeof KeyEvent == "undefined") {
    var KeyEvent = {
        DOM_VK_CANCEL: 3,
        DOM_VK_HELP: 6,
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_TAB: 9,
        DOM_VK_CLEAR: 12,
        DOM_VK_RETURN: 13,
        DOM_VK_ENTER: 14,
        DOM_VK_SHIFT: 16,
        DOM_VK_CONTROL: 17,
        DOM_VK_ALT: 18,
        DOM_VK_PAUSE: 19,
        DOM_VK_CAPS_LOCK: 20,
        DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        DOM_VK_PAGE_UP: 33,
        DOM_VK_PAGE_DOWN: 34,
        DOM_VK_END: 35,
        DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_PRINTSCREEN: 44,
        DOM_VK_INSERT: 45,
        DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        DOM_VK_1: 49,
        DOM_VK_2: 50,
        DOM_VK_3: 51,
        DOM_VK_4: 52,
        DOM_VK_5: 53,
        DOM_VK_6: 54,
        DOM_VK_7: 55,
        DOM_VK_8: 56,
        DOM_VK_9: 57,
        DOM_VK_EQUALS: 61,
        DOM_VK_A: 65,
        DOM_VK_B: 66,
        DOM_VK_C: 67,
        DOM_VK_D: 68,
        DOM_VK_E: 69,
        DOM_VK_F: 70,
        DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        DOM_VK_N: 78,
        DOM_VK_O: 79,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_T: 84,
        DOM_VK_U: 85,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_X: 88,
        DOM_VK_Y: 89,
        DOM_VK_Z: 90,
        DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_MULTIPLY: 106,
        DOM_VK_ADD: 107,
        DOM_VK_SEPARATOR: 108,
        DOM_VK_SUBTRACT: 109,
        DOM_VK_DECIMAL: 110,
        DOM_VK_DIVIDE: 111,
        DOM_VK_F1: 112,
        DOM_VK_F2: 113,
        DOM_VK_F3: 114,
        DOM_VK_F4: 115,
        DOM_VK_F5: 116,
        DOM_VK_F6: 117,
        DOM_VK_F7: 118,
        DOM_VK_F8: 119,
        DOM_VK_F9: 120,
        DOM_VK_F10: 121,
        DOM_VK_F11: 122,
        DOM_VK_F12: 123,
        DOM_VK_F13: 124,
        DOM_VK_F14: 125,
        DOM_VK_F15: 126,
        DOM_VK_F16: 127,
        DOM_VK_F17: 128,
        DOM_VK_F18: 129,
        DOM_VK_F19: 130,
        DOM_VK_F20: 131,
        DOM_VK_F21: 132,
        DOM_VK_F22: 133,
        DOM_VK_F23: 134,
        DOM_VK_F24: 135,
        DOM_VK_NUM_LOCK: 144,
        DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_SEMICOLON: 186,
        DOM_VK_COMMA: 188,
        DOM_VK_PERIOD: 190,
        DOM_VK_SLASH: 191,
        DOM_VK_BACK_QUOTE: 192,
        DOM_VK_OPEN_BRACKET: 219,
        DOM_VK_BACK_SLASH: 220,
        DOM_VK_CLOSE_BRACKET: 221,
        DOM_VK_QUOTE: 222,
        DOM_VK_META: 224
    };
}
