// HTMLBvVideoPlayer.js

const BV_VIDEO_PLAYER_SOURCE_ATTRIBUTE_NAME = 'src';
const BV_VIDEO_PLAYER_PARAM_ATTRIBUTE_NAME = 'param';
const BV_VIDEO_PLAYER_SPEED_CONTROL_ATTRIBUTE_NAME = 'speed-control';
const BV_VIDEO_PLAYER_HOTKEY_ATTRIBUTE_NAME = 'hotkey';

const BV_VIDEO_PLAYER_PROGRESS_BAR_CLASS_NAME = 'progress-bar';
const BV_VIDEO_PLAYER_PROGRESS_SCRUBBER_CLASS_NAME = 'progress-scrubber';
const BV_VIDEO_PLAYER_PROGRESS_SCRUBBER_EPISODE_CLASS_NAME = 'progress-scrubber-episode';
const BV_VIDEO_PLAYER_PROGRESS_HOVER_CLASS_NAME = 'progress-hover';
const BV_VIDEO_PLAYER_EPISODE_CONTAINER_CLASS_NAME = 'episode-container';
const BV_VIDEO_PLAYER_EPISODE_PADDING_CLASS_NAME = 'episode-padding';
const BV_VIDEO_PLAYER_EPISODE_LIST_CLASS_NAME = 'episode-list';
const BV_VIDEO_PLAYER_EPISODE_HOVER_CLASS_NAME = 'episode-hover';
const BV_VIDEO_PLAYER_EPISODE_LOAD_CLASS_NAME = 'episode-load';
const BV_VIDEO_PLAYER_EPISODE_PLAY_CLASS_NAME = 'episode-play';
const BV_VIDEO_PLAYER_EPISODE_HOVER_CURRENT_CLASS_NAME = 'episode-hover-current';
const BV_VIDEO_PLAYER_EPISODE_WRAPPER_CLASS_NAME = 'episode-wrapper';
const BV_VIDEO_PLAYER_MENU_ITEM_ICON_CLASS_NAME = 'menu-item-icon';
const BV_VIDEO_PLAYER_MENU_ITEM_BODY_CLASS_NAME = 'menu-item-body';
const BV_VIDEO_PLAYER_TIME_INDICATOR_CLASS_NAME = 'time-indicator';
const BV_VIDEO_PLAYER_PANEL_WRAPPER_CLASS_NAME = 'panel-wrapper';
const BV_VIDEO_PLAYER_PANEL_BOTTOM_CLASS_NAME = 'panel-bottom';
const BV_VIDEO_PLAYER_PANEL_BOTTOM_LEFT_CLASS_NAME = 'panel-bottom-left';
const BV_VIDEO_PLAYER_PANEL_BOTTOM_RIGHT_CLASS_NAME = 'panel-bottom-right';
const BV_VIDEO_PLAYER_CTL_SPEED_INDICATOR_CLASS_NAME = 'ctl-speed-indicator';
const BV_VIDEO_PLAYER_CTL_SPEED_INDICATOR_CONTENT_CLASS_NAME = 'ctl-speed-indicator-content';
const BV_VIDEO_PLAYER_CONTROLS_CONTAINER_CLASS_NAME = 'controls-container';


class HTMLBvVideoPlayer extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('VideoPlayer', loggerOptions.player);

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
         * Шаг показа миниатюр, в секундах.
         * @type {number} 
         */
        this._previewStep = 10;

        /**
         * Количество столбцов миниатюр.
         * @type {number} 
         */
        this._previewsPerImageColumn = 5;

        /**
         * Количество строк миниатюр.
         * @type {number} 
         */
        this._previewsPerImageRow = 5;

        /**
         * Формат изображений миниатюр. Место под номер изображения - '{0}'.
         * @type {string} 
         */
        this._previewsHref = 'example-previews/preview_{0}.png';

        /**
         * Флаг положения главной кнопки мыши в нажатом состоянии..
         * @type {boolean}
         */
        this._isMouseDown = false;

        /**
         * Флаг необходимости возобновления воспроизведения (при переходе к другому премени).
         * @type {boolean} 
         */
        this._keepPlay = false;

        /**
         * Флаг инициализации компонента.
         * @type {boolean} 
         */
        this._isInitialized = false;

        /**
         * @type {NodeJS.Timer}
         */
        this._moveTimer = null;

        //#endregion Properties

        //#region Elements

        /**
         * Элемент нижней панели.
         * @type {HTMLDivElement}
         */
        this._panelBottonEl = null;

        /**
         * Всплывающее меню настроек.
         * @type {HTMLDivElement} 
         */
        this._popupMenuEl = null;

        /**
         * Контейнер всплывающего контейнера с превью и временем.
         * @type {HTMLDivElement}
         */
        this._seekContainerEl = null;

        /**
         * Миниатюра.
         * @type {HTMLDivElement}
         */
        this._hoverPreviewEl = null;;

        /**
         * Название эпизода.
         * @type {HTMLDivElement}
         */
        this._hoverCaptionEl = null;

        /**
         * Время.
         * @type {HTMLDivElement}
         */
        this._hoverTimeEl = null;

        /**
         * Прогресс бар. Содержит список эпизодов и ползунок.
         * @type {HTMLDivElement}
         */
        this._progressBarEl = null;

        /**
         * Список эпизодов.
         * @type {HTMLUListElement}
         */
        this._episodesContainerEl = null;

        /**
         * Красная точка на прогресс-баре.
         * @type {HTMLDivElement}
         */
        this._progressScrubberEl = null;

        /**
         * Кнопка воспроизведения/остановка.
         * @type {HTMLButtonElement}
         */
        this._playButtonEl = null;

        /**
         * Кнопка выключения/включения звука.
         * @type {HTMLButtonElement}
         */
        this._volumeButtonEl = null;

        /**
         * Полоса заполнения, отображает уровень громкости. 
         * @type {HTMLDivElement}
         */
        this._volumeSliderFillEl = null;

        /**
         * Движок контрола уровеня громкости.
         * @type { HTMLDivElement }
         */
        this._volumeSliderThumb = null;

        /**
         * Индекатор времени.
         * @type {HTMLSpanElement}
         */
        this._timeIndicator = null;

        /**
         * Кнопка уменьшения скорость воспроизведения.
         * @type {HTMLButtonElement}
         */
        this._slowerButtonEl = null;

        /**
         * Кнопка-индикатор скорости воспроизведения.
         * @type {HTMLButtonElement}
         */
        this._speedIndicatorButtonEl = null;

        /**
         * Контейнер индикатора скорости воспроизведения.
         * @type {HTMLDivElement}
         */
        this._speedIndicatorContentEl = null;

        /**
         * Кнопка увелечения скорость воспроизведения. 
         * @type {HTMLButtonElement}
         */
        this._fasterButtonEl = null;

        /**
         * Кнопка настроек.
         * @type {HTMLButtonElement}
         */
        this._settingsButtonEl = null;

        /**
         * Кнопка включения/выключения режима картинка-в-картинке.
         * @type {HTMLButtonElement}
         */
        this._pipButtonEl = null;

        /**
         * Кнопка включения/выключения полноэкранного режима.
         * @type {HTMLButtonElement}
         */
        this._fullscrButtonEl = null;

        /**
         * Bottom Gradient
         * @type {HTMLDivElement}
         */
        this._gradientBottonEl = null;

        /**
         * Элемент Video.
         * @type {HTMLVideoElement} 
         */
        this._videoEl = null;

        /**
         * Спинер загрузки.
         * @type {SVGSVGElement}
         */
        this._spinnerWrapperEl = null;

        //#endregion Elements

        //#region Window Events Handlers

        window.addEventListener('keyup', e => {

            if (!this._hotkey || e.target !== document.body) {
                return;
            }

            /**
             * Перейти на % видео.
             * @param {number} percent
             * @returns {void}
             */
            const gotoPercentVideo = percent => {
                this._videoEl.currentTime = this._videoEl.duration * (percent / 100);
            }

            switch (e.code) {

                case 'KeyF':
                    this._fullscrButtonEl.click();
                    break;

                case 'Space':
                case 'KeyK':
                    if (this._videoEl.paused) {
                        this._playButtonEl.click();
                    } else if (this._videoEl.playbackRate != 1) {
                        this._videoEl.playbackRate = 1;
                        this._setSpeed(this._videoEl, this._playSpeedDef);
                    } else {
                        this._playButtonEl.click();
                    }
                    break;

                case 'ArrowLeft':
                    this._videoEl.currentTime = Math.max(this._videoEl.currentTime - this._moveTimeStep, 0);
                    break;

                case 'KeyH':
                    if (!this._videoEl.paused) {
                        this._playButtonEl.click();
                    }
                    this._videoEl.currentTime = Math.max(this._videoEl.currentTime - 1 / 25, 0);
                    break;

                case 'ArrowRight':
                    this._videoEl.currentTime = Math.min(this._videoEl.currentTime + this._moveTimeStep, this._videoEl.duration);
                    break;

                case 'Semicolon':
                    if (!this._videoEl.paused) {
                        this._playButtonEl.click();
                    }
                    this._videoEl.currentTime = Math.min(this._videoEl.currentTime + 1 / 25, this._videoEl.duration);
                    break;

                case 'KeyI':
                    this._pipButtonEl.click();
                    break;

                case 'KeyJ':
                    this._slowerButtonEl.click();
                    break;

                case 'KeyL':
                    this._fasterButtonEl.click();
                    break;

                case 'KeyM':
                    this._volumeButtonEl.click();
                    if (this._videoEl.volume == 0) {
                        this._videoEl.muted = false;
                        this._videoEl.volume = 1;
                    }
                    break;

                case 'ArrowUp':
                    this._videoEl.volume = Math.min(Math.floor(this._videoEl.volume * 100) / 100 + this._volumeStep, 1);
                    if (this._videoEl.muted) {
                        this._videoEl.muted = false;
                    }
                    e.preventDefault();
                    break;

                case 'ArrowDown':
                    this._videoEl.volume = Math.max(Math.floor(this._videoEl.volume * 100) / 100 - this._volumeStep, 0);
                    if (this._videoEl.muted) {
                        this._videoEl.muted = false;
                    }
                    e.preventDefault();
                    break;

                case 'Digit0':
                case 'Numpad0':
                    gotoPercentVideo(0);
                    break;

                case 'Digit1':
                case 'Numpad1':
                    gotoPercentVideo(10);
                    break;

                case 'Digit2':
                case 'Numpad2':
                    gotoPercentVideo(20);
                    break;

                case 'Digit3':
                case 'Numpad3':
                    gotoPercentVideo(30);
                    break;

                case 'Digit4':
                case 'Numpad4':
                    gotoPercentVideo(40);
                    break;

                case 'Digit5':
                case 'Numpad5':
                    gotoPercentVideo(50);
                    break;

                case 'Digit6':
                case 'Numpad6':
                    gotoPercentVideo(60);
                    break;

                case 'Digit7':
                case 'Numpad7':
                    gotoPercentVideo(70);
                    break;

                case 'Digit8':
                case 'Numpad8':
                    gotoPercentVideo(80);
                    break;

                case 'Digit9':
                case 'Numpad9':
                    gotoPercentVideo(80);
                    break;
            }
        });
        window.addEventListener('keydown', e => {
            if (e.target === document.body && (
                e.code === 'Space' ||
                e.code === 'ArrowUp' ||
                e.code === 'ArrowDown' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowRight')) {
                e.preventDefault();
            }
        });
        window.addEventListener('mouseup', e => {
            if (this._isMouseDown && e.button === 0) {
                this._isMouseDown = false;

                this._updateScrubber();

                /** @type {number} */
                const time = this._getTimeByPageX(e.pageX);
                this._videoEl.currentTime = time;

                if (this._keepPlay) {
                    this._videoEl.play();
                }
            }
        });
        window.addEventListener('mousemove', async e => {
            window.pageX = e.pageX;
            window.pageY = e.pageY;

            const updateScaling = () => {
                /** @type {HTMLLIElement} */
                const currentHoverEpisode = this._getCurrentHoverEpisode(e.pageX);
                // Progress Hover
                this._progressBarEl.classList.add(BV_VIDEO_PLAYER_PROGRESS_HOVER_CLASS_NAME);
                // Set Scale
                for (let i = 0; i < this._episodesContainerEl.children.length; i++) {
                    /** @type {HTMLLIElement} */
                    // @ts-ignore
                    const episode = this._episodesContainerEl.children[i];
                    if (episode === currentHoverEpisode && this._episodesContainerEl.children.length > 1) {
                        episode.classList.add(BV_VIDEO_PLAYER_EPISODE_HOVER_CURRENT_CLASS_NAME);
                    } else {
                        episode.classList.remove(BV_VIDEO_PLAYER_EPISODE_HOVER_CURRENT_CLASS_NAME);
                    }
                }

                // Scrubber
                this._updateScrubber();
            }

            /** @type {number} */
            const hoverTime = this._getTimeByPageX(e.pageX);
            if (hoverTime != null) {
                if (this._isMouseDown) {
                    this._setProgressPlayPosition(hoverTime);
                    //this._setProgressSeekPosition(hoverTime, e.pageX);
                    this._setProgressSubItemsPosition('hover', hoverTime);
                    // Scale
                    updateScaling();
                } else {
                    // @ts-ignore
                    if (e.path.includes(this._progressBarEl)) {
                        //this._setProgressSeekPosition(hoverTime, e.pageX);
                        this._setProgressSubItemsPosition('hover', hoverTime);
                        // Scale
                        updateScaling();
                    } else {
                        // Reset Progress Hover
                        this._progressBarEl.classList.remove(BV_VIDEO_PLAYER_PROGRESS_HOVER_CLASS_NAME);
                        // Reset Episode
                        for (let i = 0; i < this._episodesContainerEl.children.length; i++) {
                            /** @type {HTMLLIElement} */
                            // @ts-ignore
                            const episode = this._episodesContainerEl.children[i];
                            episode.classList.remove(BV_VIDEO_PLAYER_EPISODE_HOVER_CURRENT_CLASS_NAME);
                            // Hover
                            /** @type {EpisodeSubItems} */
                            const subItems = HTMLBvVideoPlayer._getEpisodeSubItems(episode);
                            subItems.hover.style.width = '0';
                        }
                        // Seek
                        //if (this._seekContainerEl !== null) {
                        //    this._seekContainerEl.style.opacity = '0';
                        //}
                        // Scrubber
                        this._progressScrubberEl.classList.remove(BV_VIDEO_PLAYER_PROGRESS_SCRUBBER_EPISODE_CLASS_NAME);
                    }
                }
            }
        });

        //#endregion Window Events Handlers

        //#region This Events Handlers

        this.addEventListener('fullscreenchange', () => {
            this._updateFullScreenButtonState();
        });
        this.addEventListener('dblclick', e => {
            // @ts-ignore
            if (e.path[0] === this._videoEl) {
                this._fullscrButtonEl.click();
            }
        });
        this.addEventListener('click', e => {
            /** @type {boolean} */
            let isClosing = true;
            // @ts-ignore
            for (let i = 0; i < e.path.length; i++) {
                // @ts-ignore
                if (e.path[i] === this._settingsButtonEl) {
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
            this._panelBottonEl.classList.remove('hided');
            if (this._gradientBottonEl !== null) {
                this._gradientBottonEl.classList.remove('hided');
            }
            // Отображение курсора в полноэкранном режиме
            if (document.fullscreenElement) {
                this.style.cursor = '';
            }
        });
        this.addEventListener('--qualitylist-changed', e => {
            this._logger.log('QualityList changed');

            /** @type {QualityChangedEventOptions} */
            // @ts-ignore
            const options = e.detail;
            switch (options.action) {

                case 'added':
                    ///** @type {HTMLLIElement} */
                    //const menuItem = this.createMenuItem(options.element.value, options.element.innerHTML);
                    //this._menuItemList.appendChild(menuItem);
                    //// Первый по-умолчанию
                    //if (this._curParValue === null) {
                    //    menuItem.click();
                    //}
                    break;

                case 'removed':

                    break;

                case 'modified':

                    break;

            }
        });
        this.addEventListener(BV_EPISODE_LIST_CHANGED_EVENT_NAME, e => {
            /** @type {EpisodeChangedEventOptions} */
            // @ts-ignore
            const options = e.detail;

            switch (options.action) {
                case 'added':
                    this._innerAppendEpisode({
                        title: options.episodeEl.title,
                        duration: options.episodeEl.duration,
                    });
                    break;

                case 'removed':
                    const el = this._innerRemoveEpisodes();
                    break;
                
                default:
                    this._logger.error(`Unknown Action of Changed event.`);
                    break;
            }
        });

        //#endregion This Events

        this._logger.log('constructor');
    }

    static get observedAttributes() {
        return [
            BV_VIDEO_PLAYER_SOURCE_ATTRIBUTE_NAME,
            BV_VIDEO_PLAYER_PARAM_ATTRIBUTE_NAME,
            BV_VIDEO_PLAYER_SPEED_CONTROL_ATTRIBUTE_NAME,
            BV_VIDEO_PLAYER_HOTKEY_ATTRIBUTE_NAME,
        ];
    }

    get source() { return this._src; }
    set source(v) { this.setAttribute(BV_VIDEO_PLAYER_SOURCE_ATTRIBUTE_NAME, v); }

    get param() { return this._param; }
    set param(v) { this.setAttribute(BV_VIDEO_PLAYER_PARAM_ATTRIBUTE_NAME, v); }

    get speedControls() { return this._speedControls; }
    set speedControls(v) { this.setAttribute(BV_VIDEO_PLAYER_SPEED_CONTROL_ATTRIBUTE_NAME, v.toString()); }

    get hotkey() { return this._hotkey; }
    set hotkey(v) { this.setAttribute(BV_VIDEO_PLAYER_HOTKEY_ATTRIBUTE_NAME, v.toString()); }

    get duration() {
        /** @type {number} */
        const dur = this._videoEl.duration;
        return isNaN(dur) ? null : dur;
    }

    /** @type {HTMLBvEpisodeList} */
    get episodeListElement() { return this.querySelector(BV_EPISODE_LIST_TAG_NAME); }

    /**
     * Компоненту добавляют, удаляют или изменяют атрибут.
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     * @returns {void}
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        if (newValue === null) {
            newValue = 'false';
        }

        switch (name) {

            case BV_VIDEO_PLAYER_SOURCE_ATTRIBUTE_NAME:
                this._src = newValue;
                break;

            case BV_VIDEO_PLAYER_PARAM_ATTRIBUTE_NAME:
                this._param = newValue;
                break;

            case BV_VIDEO_PLAYER_SPEED_CONTROL_ATTRIBUTE_NAME:
                this._speedControls = newValue.toLowerCase() !== 'false';
                if (this._isInitialized) {
                    this._updateSpeedControls();
                }
                break;

            case BV_VIDEO_PLAYER_HOTKEY_ATTRIBUTE_NAME:
                this._hotkey = newValue.toLowerCase() !== 'false';
                if (this._isInitialized) {
                    this._updateControls();
                }
                break;
        }
    }

    /**
     * Компонент добавляется в DOM.
     * @returns {void}
     */
    connectedCallback() {
        if (!this._isInitialized) {
            this._initialization();
        }
        this._updateControls();

        this._logger.log(`connected`);
    }

    /** 
     * Компонент удаляется из DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        clearInterval(this._moveTimer);
        this._moveTimer = null;

        this._logger.log('disconnected');
    }

    /**
     * Обновляет состояние точки позиции воспроизведения на тайм-лайне.
     * @returns {void}
     */
    _updateScrubber() {
        /**
         * Проверяет попадание точки в прямоугольник по оси X.
         * @param {DOMRect} rect Прямоугольная область.
         * @param {DOMPoint} point Точка.
         * @returns {boolean}
         */
        const isPointInRectByX = function (rect, point) {
            return point.x >= rect.left && point.x < rect.right;
        }

        if (this._episodesContainerEl.children.length > 1) {
            if (typeof window.pageX !== 'undefined'
                && window.pageX !== null
                && window.pageX >= 0) {
                /** @type {HTMLLIElement} */
                const episode = this._getCurrentHoverEpisode(window.pageX);
                /** @type {DOMRect} */
                const episodeBounding = episode.querySelector(`.${BV_VIDEO_PLAYER_EPISODE_PADDING_CLASS_NAME}`).getBoundingClientRect();
                /** @type {DOMRect} */
                const scrubberBounding = this._progressScrubberEl.getBoundingClientRect();
                /** @type {DOMPoint} */
                const point = new DOMPoint(scrubberBounding.left + scrubberBounding.width / 2, window.pageY);
                if (isPointInRectByX(episodeBounding, point)) {
                    this._progressScrubberEl.classList.add(BV_VIDEO_PLAYER_PROGRESS_SCRUBBER_EPISODE_CLASS_NAME);
                } else {
                    this._progressScrubberEl.classList.remove(BV_VIDEO_PLAYER_PROGRESS_SCRUBBER_EPISODE_CLASS_NAME);
                }
            }
        } else {
            this._progressScrubberEl.classList.remove(BV_VIDEO_PLAYER_PROGRESS_SCRUBBER_EPISODE_CLASS_NAME);
        }
    }

    /** 
     * Показывает спиннер загрузки.
     * @returns {void}
     */
    _spinnerShow() {
        this._spinnerWrapperEl.style.visibility = 'visible';
    }

    /** 
     * Скрывает спиннер загрузки.
     * @returns {void}
     */
    _spinnerHide() {
        this._spinnerWrapperEl.style.visibility = 'collapse';
    }

    /**
     * Скрыть/показать меню.
     * @param {boolean} isShow
     * @returns {void}
     */
    _showMenu(isShow = true) {
        return;
        this._popupMenuEl.style.visibility = isShow ? 'visible' : 'collapse';
        this._popupMenuEl.style.opacity = isShow ? '1' : '0';
    }

    /**
     * Возвращает название горячей клавиши.
     * @param {HTMLElement} element
     * @returns {string}
     */
    _hotkeyPrint(element) {
        if (!this._hotkey) {
            return '';
        }

        let key;

        switch (element) {

            case this._fasterButtonEl:
                key = 'L';
                break;

            case this._playButtonEl:
                key = 'K';
                break;

            case this._slowerButtonEl:
                key = 'J';
                break;

            case this._volumeButtonEl:
                key = 'M';
                break;

            case this._pipButtonEl:
                key = 'I';
                break;

            case this._fullscrButtonEl:
                key = 'F';
                break;
        }

        return ` (${key})`;
    }

    /**
     * Устанавливает скорость воспроизведения из набора по индексу.
     * @param {HTMLVideoElement} video Элемент проигрывателя.
     * @param {number} speedIndex Индекс скорости воспроизведния из набора.
     * @returns {void}
     */
    _setSpeed(video, speedIndex) {
        this._playSpeedCur = speedIndex;
        video.playbackRate = this._playSpeeds[speedIndex];
    }

    /**
     * Устанавливает громкость.
     * @param {Event} e
     * @returns {void}
     */
    _setVolume(e) {
        /** @type {number} */
        // @ts-ignore
        let x = e.offsetX;

        if (e.target === this._volumeSliderThumb) {
            // @ts-ignore
            x = e.target.offsetLeft + e.offsetX + 6;
        }

        /** @type {number} */
        // @ts-ignore
        const width = e.currentTarget.clientWidth - 1;
        /** @type {number} */
        let val = x / width;

        if (val < 0) {
            val = 0;
        } else if (val > 1) {
            val = 1;
        }

        this._videoEl.volume = val;
        this._volumeSliderFillEl.style.width = `${val * 100}%`;

        if (this._videoEl.muted) {
            this._videoEl.muted = false;
        }
    }

    //#region Update Functions

    /**
     * Обновление состояния элементов управления.
     * @returns {void}
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
     * @returns {void}
     */
    _updateTime() {
        /** @type {number} */
        const cur = this._videoEl.currentTime;
        /** @type {number} */
        const dur = this._videoEl.duration;

        if (isNaN(cur) || isNaN(dur)) {
            this._timeIndicator.style.visibility = 'collapse';
        } else {
            this._timeIndicator.style.visibility = 'visible';
            /** @type {string} */
            const curStr = dur2str(cur);
            /** @type {string} */
            const durStr = dur2str(dur);
            this._timeIndicator.textContent = `${curStr} / ${durStr}`;
        }
    }

    /**
     * Обновить состояние пунктов меню.
     * @returns {void}
     */
    _updateMenu() {
        /** @type {HTMLDivElement[]} */
        // @ts-ignore
        const items = Array.from(this._menuItemList.children);
        items.forEach((element) => {
            /** @type {boolean} */
            const isSelected = this._curParValue === element.getAttribute('data-value');
            // @ts-ignore
            element.querySelector(`.${BV_VIDEO_PLAYER_MENU_ITEM_ICON_CLASS_NAME}`).style.visibility = isSelected ? 'visible' : 'hidden';
        });
    }

    /**
     * Устанавливает состояние кнопки воспроизведение/стоп.
     * @returns {void}
     */
    _updatePlayButtonState() {
        this._playButtonEl.title = (this._videoEl.paused ? 'Смотреть' : 'Пауза') + this._hotkeyPrint(this._playButtonEl);
        this._playButtonEl.innerHTML = this._videoEl.paused
            ? `<svg viewBox='0 0 36 36'><path d='m12 26 6.5-4v-8l-6.5-4zm6.5-4 6.5-4-6.5-4z'/></svg>`
            : `<svg viewBox='0 0 36 36'><path d='m12 26h4v-16h-4zm9 0h4v-16h-4z'/></svg>`;
    }

    /**
     * Устанавливает состояние кнопки громкости.
     * @returns {void}
     */
    _updateVolumeButtonState() {
        const vol = this._videoEl.volume;
        this._volumeButtonEl.title = (this._videoEl.muted || vol === 0 ? 'Включение звука' : 'Отключение звука') + this._hotkeyPrint(this._volumeButtonEl);
        this._volumeButtonEl.innerHTML = this._videoEl.muted || vol === 0
            ? '<svg viewBox="0 0 36 36"><path d="M21.48 17.98a4.5 4.5 0 0 0-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51a8.796 8.796 0 0 0 1.03-4.15c0-4.28-2.99-7.86-7-8.76v2.05c2.89.86 5 3.54 5 6.71zm-14.73-9-1.27 1.26 4.72 4.73H7.98v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81l2.04 2.05 1.27-1.27-9-9-7.72-7.72zm7.72.99-2.09 2.08 2.09 2.09V9.98z"/></svg>'
            : (vol < 0.5
                ? '<svg viewBox="0 0 36 36"><path d="M8 21h4l5 5V10l-5 5H8v6Zm11-7v8c1.48-.68 2.5-2.23 2.5-4 0-1.74-1.02-3.26-2.5-4Z"/></svg>'
                : '<svg viewBox="0 0 36 36"><path d="M8 21h4l5 5V10l-5 5H8v6Zm11-7v8c1.48-.68 2.5-2.23 2.5-4 0-1.74-1.02-3.26-2.5-4Zm0-2.71c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77v2.06Z"/></svg>');
        this._volumeSliderFillEl.style.width = this._videoEl.volume * 100 + '%';
    }

    /**
     * Устанавливает состояние кнопки картинтка-в-картинке.
     * @param {boolean} isActive
     * @returns {void}
     */
    _updatePipButtonState(isActive = false) {
        this._pipButtonEl.title = (isActive ? 'Закрыть мини проигрыватель' : 'Открыть мини проигрыватель') + this._hotkeyPrint(this._pipButtonEl);
        this._pipButtonEl.innerHTML = isActive
            ? `<svg viewBox='0 0 36 36'><path d='M11 13v10h14V13zm18 12V10.98C29 9.88 28.1 9 27 9H9c-1.1 0-2 .88-2 1.98V25c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H9V10.97h18v14.05z'/></svg>`
            : `<svg viewBox="0 0 36 36"><path d="M25 17h-8v6h8v-6zm4 8V10.98C29 9.88 28.1 9 27 9H9c-1.1 0-2 .88-2 1.98V25c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H9V10.97h18v14.05z"/></svg>`;
    }

    /**
     * Устанавливает состояние кнопок управления скоростью воспроизведения.
     * @returns {void}
     */
    _updateSpeedControls() {
        // Slower
        this._slowerButtonEl.hidden = !this._speedControls;
        this._slowerButtonEl.disabled = this._playSpeedCur <= 0;
        this._slowerButtonEl.title = `Уменьшить скорость воспроизведения` + this._hotkeyPrint(this._slowerButtonEl);
        // Faster
        this._fasterButtonEl.hidden = !this._speedControls;
        this._fasterButtonEl.disabled = this._playSpeedCur >= this._playSpeeds.length - 1;
        this._fasterButtonEl.title = `Увеличить скорость воспроизведения` + this._hotkeyPrint(this._fasterButtonEl);
        // Speed Indicator
        this._speedIndicatorContentEl.hidden = !this._speedControls;
        this._speedIndicatorButtonEl.disabled = this._playSpeedCur == this._playSpeedDef;
        this._speedIndicatorContentEl.title = this._playSpeedCur == this._playSpeedDef
            ? 'Текущая скорость воспроизведения'
            : 'К нормальной скорости воспроизведения' + this._hotkeyPrint(this._playButtonEl);
        this._speedIndicatorContentEl.innerText = "x" + this._videoEl.playbackRate;
    }

    /**
     * Устанавливает состояние кнопки полноэкранного режима.
     * @returns {void}
     */
    _updateFullScreenButtonState() {
        this._fullscrButtonEl.title = (document.fullscreenEnabled ? 'Выход из полноэкранного режима' : 'Во весь экран') + this._hotkeyPrint(this._fullscrButtonEl);
        this._fullscrButtonEl.innerHTML = document.fullscreenEnabled
            ? '<svg viewBox="0 0 36 36"><path d="M14 14h-4v2h6v-6h-2v4zM22 14v-4h-2v6h6v-2h-4zM20 26h2v-4h4v-2h-6v6zM10 22h4v4h2v-6h-6v2z"/></svg>'
            : '<svg viewBox="0 0 36 36"><path d="M10 16h2v-4h4v-2h-6v6zM20 10v2h4v4h2v-6h-6zM24 24h-4v2h6v-6h-2v4zM12 20h-2v6h6v-2h-4v-4z"/></svg>';
    }

    //#endregion Update Functions

    /**
     * @param {number} pageX
     * @returns {number?}
     */
    _getTimeByPageX(pageX) {
        if (this._progressBarEl === null) {
            return null;
        }

        /** @type {DOMRect} */
        const bounding = this._progressBarEl.getBoundingClientRect();
        if (pageX >= bounding.left && pageX < bounding.right) {
            /** @type {number} */
            const percent = (pageX - bounding.left) / bounding.width;
            return percent * this._videoEl.duration;
        }
        return null;
    }

    /**
     * @param {'play'|'hover'} subItem
     * @param {number} time
     * @returns {void}
     */
    _setProgressSubItemsPosition(subItem, time) {
        /** @type {DOMRect} */
        const progressBounding = this._progressBarEl.getBoundingClientRect();
        /** @type {number} */
        const progressLeft = progressBounding.left + time / this._videoEl.duration * progressBounding.width;

        for (let i = 0; i < this._episodesContainerEl.children.length; i++) {
            /** @type {HTMLLIElement} */
            // @ts-ignore
            const episode = this._episodesContainerEl.children[i];

            /** @type {HTMLDivElement} */
            const episodeSubItem = HTMLBvVideoPlayer._getEpisodeSubItems(episode)[subItem];

            /** @type {DOMRect} */
            const episodeBounding = episode.getBoundingClientRect();
            /** @type {number} */
            const paddingLeft = i > 0 ? episode.querySelector('div > ul').getBoundingClientRect().left - episodeBounding.left : 0;

            /** @type {number} */
            const episodeLeft = episodeBounding.left + paddingLeft;
            /** @type {number} */
            const episodeWidth = episodeBounding.width - paddingLeft;

            if (progressLeft < episodeLeft) {
                episodeSubItem.style.width = '0';
            } else if (progressLeft >= episodeLeft && progressLeft < episodeLeft + episodeWidth) {
                /** @type {number} */
                const percent = (progressLeft - episodeLeft) / episodeWidth;
                episodeSubItem.style.width = percent * 100 + '%';
            } else {
                episodeSubItem.style.width = '100%';
            }
        }
    }

    /**
     * @param {number} time
     * @returns {void}
     */
    _setProgressPlayPosition(time) {
        this._setProgressSubItemsPosition('play', time);

        // Scrubber
        this._progressScrubberEl.style.left = time / this._videoEl.duration * 100 + '%';
    }

    /**
     * @param {number} time
     * @param {number} pageX
     * @returns {void}
     */
    _setProgressSeekPosition(time, pageX) {
        // Seek Container

        /** @type {number} */
        let marginLeft = pageX - this._progressBarEl.getBoundingClientRect().left;
        marginLeft = Math.max(0, marginLeft - this._seekContainerEl.clientWidth / 2);
        marginLeft = Math.min(marginLeft, this._progressBarEl.clientWidth - this._seekContainerEl.clientWidth);
        this._seekContainerEl.style.marginLeft = marginLeft + 'px';
        this._seekContainerEl.style.opacity = '1';

        // Seek Preview

        /** @type {number} */
        const previewNumber = Math.floor(time / this._previewStep);
        if (this._hoverPreviewEl.currentPreview !== previewNumber) {
            this._hoverPreviewEl.currentPreview = previewNumber;

            /** @type {number} */
            const previewPerImage = this._previewsPerImageColumn * this._previewsPerImageRow;
            /** @type {number} */
            const imageNumber = Math.floor(previewNumber / previewPerImage);

            /**
             * Номер первого изображения.
             * @type {number}
             */
            const imageNumberBase = 1;

            if (this._hoverPreviewEl.currentPreviewImage !== imageNumber) {
                this._hoverPreviewEl.currentPreviewImage = imageNumber;

                // Change image with previews
                /** @type {string} */
                const imageUrl = this._previewsHref.replace('{0}', (imageNumberBase + imageNumber).toString());
                this._hoverPreviewEl.style.backgroundImage = `url("${imageUrl}")`;

                // Hide if preview failed load
                /** @type {HTMLImageElement} */
                const checkImg = document.createElement('img');
                checkImg.addEventListener('load', e => {
                    this._hoverPreviewEl.style.visibility = 'visible';
                });
                checkImg.addEventListener('error', e => {
                    this._hoverPreviewEl.style.visibility = 'collapse';
                });
                checkImg.src = imageUrl;
            }

            /** @type {number} */
            const lastPreviewNumber = previewNumber - imageNumber * previewPerImage;
            /** @type {number} */
            const row = Math.floor(lastPreviewNumber / this._previewsPerImageRow);
            /** @type {number} */
            const column = lastPreviewNumber - row * this._previewsPerImageColumn;

            this._hoverPreviewEl.style.backgroundPositionX = `calc(var(--preview-width) * -${column})`;
            this._hoverPreviewEl.style.backgroundPositionY = `calc(var(--preview-height) * -${row})`;
        }

        // Seek Episode name
        if (this._hoverCaptionEl.style.marginLeft !== '0px' || this._hoverCaptionEl.style.marginRight !== '0px') {
            this._hoverCaptionEl.style.marginLeft = '0';
            this._hoverCaptionEl.style.marginRight = '0';
        }

        /** @type {HTMLLIElement} */
        const currentHoverEpisode = this._getCurrentHoverEpisode(pageX);
        if (currentHoverEpisode !== null) {
            this._hoverCaptionEl.textContent = currentHoverEpisode.getAttribute('data-title') ?? '';
            /** @type {number} */
            const marginToggle = (this._hoverCaptionEl.clientWidth - this._hoverPreviewEl.offsetWidth) / 2;
            if (marginLeft <= marginToggle) {
                // left
                this._hoverCaptionEl.style.marginLeft = '0';
                /** @type {number} */
                const margin = this._hoverCaptionEl.clientWidth > this._hoverPreviewEl.offsetWidth ? - this._hoverCaptionEl.clientWidth / 2 : 0;
                this._hoverCaptionEl.style.marginRight = margin + 'px';
            } else if (marginLeft >= this._progressBarEl.clientWidth - this._hoverPreviewEl.offsetWidth - marginToggle) {
                // rigth
                /** @type {number} */
                const margin = this._hoverCaptionEl.clientWidth > this._hoverPreviewEl.offsetWidth ? this._hoverPreviewEl.offsetWidth - this._hoverCaptionEl.clientWidth : 0;
                this._hoverCaptionEl.style.marginLeft = margin + 'px';
                this._hoverCaptionEl.style.marginRight = '0';
            } else {
                // center
                if (this._hoverCaptionEl.clientWidth > this._hoverPreviewEl.offsetWidth) {
                    this._hoverCaptionEl.style.marginLeft = - marginToggle + 'px';
                    this._hoverCaptionEl.style.marginRight = - marginToggle + 'px';
                }
            }
        }

        // Seek Time
        this._hoverTimeEl.textContent = dur2str(time);
    }

    /**
     * @param {number} pageX
     * @returns {HTMLLIElement}
     */
    _getCurrentHoverEpisode(pageX) {
        for (let i = 0; i < this._episodesContainerEl.children.length; i++) {
            /** @type {HTMLLIElement} */
            // @ts-ignore
            const episode = this._episodesContainerEl.children[i];
            /** @type {DOMRect} */
            const bounding = episode.getBoundingClientRect();
            /** @type {number} */
            let left = bounding.left;
            if (i > 0) {
                /** @type {HTMLLIElement} */
                // @ts-ignore
                const previousEpisode = this._episodesContainerEl.children[i - 1];
                left = previousEpisode.getBoundingClientRect().right;
            }

            if (pageX >= left && pageX < bounding.right) {
                return episode;
            }
        }
        return null;
    }

    /**
     * @param {HTMLLIElement} episode
     * @returns {EpisodeSubItems}
     */
    static _getEpisodeSubItems(episode) {
        return {
            padding: episode.querySelector(`.${BV_VIDEO_PLAYER_EPISODE_PADDING_CLASS_NAME}`),
            list: episode.querySelector(`.${BV_VIDEO_PLAYER_EPISODE_LIST_CLASS_NAME}`),
            hover: episode.querySelector(`.${BV_VIDEO_PLAYER_EPISODE_HOVER_CLASS_NAME}`),
            load: episode.querySelector(`.${BV_VIDEO_PLAYER_EPISODE_LOAD_CLASS_NAME}`),
            play: episode.querySelector(`.${BV_VIDEO_PLAYER_EPISODE_PLAY_CLASS_NAME}`),
        }
    }

    //#region Create Functions

    /**
     * Инициализация компонента.
     * @returns {void}
     */
    _initialization() {
        this._moveTimer = setInterval(() => {
            if (this._videoEl.paused) {
                return;
            }

            if (this._moveTimerCount > 0) {
                this._moveTimerCount -= 1;
            } else {
                if (this._moveTimerCount != null) {
                    this._moveTimerCount = null;
                    // Скрываем
                    this._panelBottonEl.classList.add('hided');
                    this._gradientBottonEl.classList.add('hided');
                    // Скрытие курсора в полноэкранном режиме
                    if (document.fullscreenElement) {
                        this.style.cursor = 'none';
                    }
                }
            }
        }, 1000);

        // DOM
        const shadow = this.attachShadow({ mode: 'open' });

        /**
         * Create Style for Import CSS
         * @param {string} path
         * @returns {HTMLElement}
         */
        const CRT_ImportStylesheet = path => CRT('style', {
            textContent: `@import "${path}";`,
        });

        /**
         * Create Root
         * @returns {DocumentFragment}
         */
        const CRT_Root = () => {
            /**
             * Create Bottom Panel
             * @returns {HTMLElement}
             */
            const CRT_BottomPanel = () => {
                /**
                 * Create Bottom Panel Wrapper
                 * @returns {HTMLElement}
                 */
                const CRT_PanelWrapper = () => {
                    /**
                     * Create Seek Container
                     * @returns {HTMLElement}
                     */
                    const CRT_SeekContainer = () => {
                        /**
                         * Create Hover Preview
                         * @returns {HTMLElement}
                         */
                        const CRT_HoverPreview = () => CRT('div', {
                            class: 'progress-hover-preview',
                        }, hoverPreviewEl => this._hoverPreviewEl = hoverPreviewEl);
                        /**
                         * Create Hover Caption
                         * @returns {HTMLElement}
                         */
                        const CRT_HoverCaption = () => CRT('div', {
                            class: 'progress-hover-caption',
                        }, hoverCaptionEl => this._hoverCaptionEl = hoverCaptionEl);
                        /**
                         * Create Hover Time
                         * @returns {HTMLElement}
                         */
                        const CRT_HoverTime = () => CRT('div', {
                            class: 'progress-hover-time',
                        }, hoverTimeEl => this._hoverTimeEl = hoverTimeEl);
                        return CRT('div', {
                            class: 'seek-container',
                            style: 'margin-left:50px;margin-right:auto;',
                            children: [
                                CRT_HoverPreview(),
                                CRT_HoverCaption(),
                                CRT_HoverTime(),
                            ],
                        });
                    }
                    /**
                     * Create Progress Bar
                     * @returns {HTMLElement}
                     */
                    const CRT_ProgressBar = () => {
                        /**
                         * Create Episode Container
                         * @returns {HTMLElement}
                         */
                        const CRT_EpisodeContainer = () => {
                            return CRT('ul', {
                                class: BV_VIDEO_PLAYER_EPISODE_CONTAINER_CLASS_NAME,
                            }, episodesContainerEl => this._episodesContainerEl = episodesContainerEl);
                        }
                        /**
                         * Create Progress Scrubber
                         * @returns {HTMLElement}
                         */
                        const CRT_ProgressScrubber = () => {
                            return CRT('div', {
                                class: BV_VIDEO_PLAYER_PROGRESS_SCRUBBER_CLASS_NAME,
                            }, progressScrubberEl => this._progressScrubberEl = progressScrubberEl);
                        }
                        return CRT('div', {
                            class: BV_VIDEO_PLAYER_PROGRESS_BAR_CLASS_NAME,
                            onmousedown: async e => {
                                if (e.button === 0) {
                                    this._isMouseDown = true;

                                    if (this._isMouseDown && !this._videoEl.paused) {
                                        this._keepPlay = true;
                                        this._videoEl.pause();
                                    }

                                    const hoverTime = this._getTimeByPageX(e.pageX);
                                    if (hoverTime != null) {
                                        this._setProgressPlayPosition(hoverTime);
                                    }

                                    this._updateScrubber();
                                }
                            },
                            children: [
                                CRT_EpisodeContainer(),
                                CRT_ProgressScrubber(),
                            ],
                        }, progressBarEl => this._progressBarEl = progressBarEl);
                    }
                    /**
                     * Create Bottom Controls Container
                     * @returns {HTMLElement}
                     */
                    const CRT_ControlsContainer = () => {
                        /**
                         * Create Left Controls Panel
                         * @returns {HTMLElement}
                         */
                        const CRT_LetfControlsPanel = () => {
                            /**
                             * Create Play Button
                             * @returns {HTMLElement}
                             */
                            const CRT_PlayButton = () => CRT('button', {
                                disabled: true,
                                onclick: async e => {
                                    if (this._videoEl.paused) {
                                        await this._videoEl.play();
                                    } else {
                                        this._videoEl.pause();
                                        this._keepPlay = false;
                                    }
                                }
                            }, playButtonEl => this._playButtonEl = playButtonEl);
                            /**
                             * Create Volume Control
                             * @returns {HTMLElement}
                             */
                            const CRT_VolumeControl = () => {
                                /**
                                 * Create Volume Button
                                 * @returns {HTMLButtonElement}
                                 */
                                const CRT_VolumeButton = () => CRT('button', {
                                    onclick: () => {
                                        this._videoEl.muted = !this._videoEl.muted;

                                        if (this._videoEl.volume === 0) {
                                            this._videoEl.muted = false;
                                            this._videoEl.volume = 1;
                                        }
                                    },
                                }, volumeButtonEl => this._volumeButtonEl = volumeButtonEl);
                                /**
                                 * Create Volume Slider
                                 * @returns {HTMLDivElement}
                                 */
                                const CRT_VolumeSlider = () => {
                                    /**
                                     * Create Volume Slider Wrapper
                                     * @returns {HTMLDivElement}
                                     */
                                    const CRT_VolumeSliderWrapper = () => {
                                        /**
                                         * Create Volume Slider Track
                                         * @returns {HTMLDivElement}
                                         */
                                        const CRT_VolumeSliderTrack = () => {
                                            /**
                                             * Create Volume Slider Fill
                                             * @returns {HTMLDivElement}
                                             */
                                            const CRT_VolumeSliderFill = () => {
                                                /**
                                                 * Create Volume Slider Thumb
                                                 * @returns {HTMLDivElement}
                                                 */
                                                const CRT_VolumeSliderThumb = () => {
                                                    return CRT('div', {
                                                        class: 'volume-slider-thumb',
                                                    }, volumeSliderThumbEl => this._volumeSliderThumb = volumeSliderThumbEl);
                                                }
                                                return CRT('div', {
                                                    class: 'volume-slider-fill',
                                                    children: [
                                                        CRT_VolumeSliderThumb(),
                                                    ],
                                                }, volumeSliderFillEl => this._volumeSliderFillEl = volumeSliderFillEl);
                                            }
                                            return CRT('div', {
                                                class: 'volume-slider-track',
                                                children: [
                                                    CRT_VolumeSliderFill(),
                                                ],
                                            });
                                        }
                                        return CRT('div', {
                                            class: 'volume-slider-wrapper',
                                            onmousemove: e => {
                                                if (this._volumePressed) {
                                                    this._setVolume(e);
                                                }
                                            },
                                            children: [
                                                CRT_VolumeSliderTrack(),
                                            ],
                                            onmousedown: e => this._setVolume(e),
                                        });
                                    }
                                    return CRT('div', {
                                        class: 'volume-slider',
                                        title: 'Громкость',
                                        onmousedown: () => this._volumePressed = true,
                                        onmouseup: () => this._volumePressed = false,
                                        onmouseleave: () => this._volumePressed = false,
                                        children: [
                                            CRT_VolumeSliderWrapper(),
                                        ],
                                    });
                                }
                                return CRT('div', {
                                    class: 'volume-container',
                                    children: [
                                        CRT_VolumeButton(),
                                        CRT_VolumeSlider(),
                                    ],
                                });
                            }
                            /**
                             * Create Time Indicator
                             * @returns {HTMLDivElement}
                             */
                            const CRT_TimeIndicator = () => CRT('div', {
                                class: BV_VIDEO_PLAYER_TIME_INDICATOR_CLASS_NAME,
                                style: 'visibility:collapse;',
                            }, timeIndicatorEl => this._timeIndicator = timeIndicatorEl);
                            return CRT('div', {
                                class: BV_VIDEO_PLAYER_PANEL_BOTTOM_LEFT_CLASS_NAME,
                                children: [
                                    CRT_PlayButton(),
                                    CRT_VolumeControl(),
                                    CRT_TimeIndicator(),
                                ],
                            });
                        }
                        /**
                         * Create Left Controls Panel
                         * @returns {HTMLDivElement}
                         */
                        const CRT_RightControlsPanel = () => {
                            /**
                             * Create Slower Speed Button
                             * @returns {HTMLButtonElement}
                             */
                            const CRT_SlowerButton = () => CRT('button', {
                                innerHTML: `<svg viewBox="0 0 36 36"><g transform-origin="50%" transform="scale(0.9)"><path d="M 28.5,26 15.5,18 28.5,10 z M 18.5,26 5.5,18 18.5,10 z"></path></g></svg>`,
                                onclick: e => {
                                    /** @type {HTMLButtonElement} */
                                    // @ts-ignore
                                    const sender = e.currentTarget;
                                    if (!sender.disabled) {
                                        this._setSpeed(this._videoEl, this._playSpeedCur - 1);
                                    }
                                },
                            }, slowerButtonEl => this._slowerButtonEl = slowerButtonEl);
                            /**
                             * Create Speed Indicator Button
                             * @returns {HTMLButtonElement}
                             */
                            const CRT_SpeedIndicatorButton = () => {
                                /**
                                 * Create Speed Indicator Content
                                 * @returns {HTMLDivElement}
                                 */
                                const CRT_SpeedIndicatorContent = () => CRT('div', {
                                    class: BV_VIDEO_PLAYER_CTL_SPEED_INDICATOR_CONTENT_CLASS_NAME,
                                }, speedIndicatorContentEl => this._speedIndicatorContentEl = speedIndicatorContentEl);
                                return CRT('button', {
                                    class: BV_VIDEO_PLAYER_CTL_SPEED_INDICATOR_CLASS_NAME,
                                    onclick: () => this._setSpeed(this._videoEl, this._playSpeedDef),
                                    children: [
                                        CRT_SpeedIndicatorContent(),
                                    ],
                                }, speedIndicatorButtonEl => this._speedIndicatorButtonEl = speedIndicatorButtonEl);
                            }
                            /**
                             * Create Faster Speed Button
                             * @returns {HTMLButtonElement}
                             */
                            const CRT_FasterButton = () => CRT('button', {
                                innerHTML: `<svg viewBox="0 0 36 36"><g transform-origin="50%" transform="scale(0.9)"><path d="M 7.5,26 20.5,18 7.5,10 z M 17.5,26 30.5,18 17.5,10 z"></path></g></svg>`,
                                onclick: e => {
                                    /** @type {HTMLButtonElement} */
                                    // @ts-ignore
                                    const sender = e.currentTarget;
                                    if (!sender.disabled) {
                                        this._setSpeed(this._videoEl, this._playSpeedCur + 1);
                                    }
                                },
                            }, fasterButtonEl => this._fasterButtonEl = fasterButtonEl);
                            /**
                             * Create Settings Button
                             * @returns {HTMLButtonElement}
                             */
                            const CRT_SettingsButton = () => CRT('button', {
                                innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172"><g transform-origin="50%" transform="scale(0.65)"><path d="M69.28711,14.33333l-3.52734,18.08464c-5.8821,2.22427 -11.32102,5.33176 -16.097,9.25228l-17.37077,-5.99089l-16.71289,28.97461l13.89941,12.07975c-0.49282,3.02401 -0.81185,6.10305 -0.81185,9.26628c0,3.16323 0.31903,6.24227 0.81185,9.26628l-13.89941,12.07975l16.71289,28.9746l17.37077,-5.99088c4.77599,3.92052 10.2149,7.02801 16.097,9.25227l3.52734,18.08464h33.42578l3.52735,-18.08464c5.88211,-2.22427 11.32102,-5.33176 16.097,-9.25227l17.37077,5.99088l16.71289,-28.9746l-13.89941,-12.07975c0.49282,-3.02401 0.81185,-6.10305 0.81185,-9.26628c0,-3.16323 -0.31902,-6.24227 -0.81185,-9.26628l13.89941,-12.07975l-16.71289,-28.97461l-17.37077,5.99089c-4.77598,-3.92052 -10.21489,-7.02801 -16.097,-9.25228l-3.52735,-18.08464zM86,57.33333c15.83117,0 28.66667,12.8355 28.66667,28.66667c0,15.83117 -12.8355,28.66667 -28.66667,28.66667c-15.83117,0 -28.66667,-12.8355 -28.66667,-28.66667c0,-15.83117 12.8355,-28.66667 28.66667,-28.66667z"></path></g></svg>`,
                                title: 'Настройки',
                                onclick: () => {
                                    // Показать/скрыть
                                    const isShow = this._popupMenuEl.style.opacity !== '1';
                                    this._showMenu(isShow);
                                },
                            }, settingsButtonEl => this._settingsButtonEl = settingsButtonEl);
                            /**
                             * Create Picture-In-Picture Button
                             * @returns {HTMLButtonElement}
                             */
                            const CRT_PipButton = () => CRT('button', {
                                onclick: () => {
                                    if (document.pictureInPictureElement) {
                                        document.exitPictureInPicture();
                                    } else {
                                        this._videoEl.requestPictureInPicture();
                                    }
                                },
                            }, pipButtonEl => this._pipButtonEl = pipButtonEl);
                            /**
                             * Create Fullscreen Button
                             * @returns {HTMLButtonElement}
                             */
                            const CRT_FullscrButton = () => CRT('button', {
                                onclick: () => {
                                    if (document.fullscreenEnabled) {
                                        document.exitFullscreen();
                                    } else {
                                        this.requestFullscreen();
                                    }
                                },
                            }, fullscrButtonEl => this._fullscrButtonEl = fullscrButtonEl);
                            return CRT('div', {
                                class: BV_VIDEO_PLAYER_PANEL_BOTTOM_RIGHT_CLASS_NAME,
                                children: [
                                    CRT_SlowerButton(),
                                    CRT_SpeedIndicatorButton(),
                                    CRT_FasterButton(),
                                    CRT_SettingsButton(),
                                    CRT_PipButton(),
                                    CRT_FullscrButton(),
                                ],
                            });
                        }
                        return CRT('div', {
                            class: BV_VIDEO_PLAYER_CONTROLS_CONTAINER_CLASS_NAME,
                            children: [
                                CRT_LetfControlsPanel(),
                                CRT_RightControlsPanel(),
                            ],
                        });
                    }
                    return CRT('div', {
                        class: BV_VIDEO_PLAYER_PANEL_WRAPPER_CLASS_NAME,
                        children: [
                            //CRT_SeekContainer(),
                            CRT_ProgressBar(),
                            CRT_ControlsContainer(),
                        ],
                    });
                }
                return CRT('div', {
                    class: `${BV_VIDEO_PLAYER_PANEL_BOTTOM_CLASS_NAME} fade`,
                    children: [
                        CRT_PanelWrapper(),
                    ],
                }, panelBottonEl => this._panelBottonEl = panelBottonEl);
            }
            /**
             * Create Bottom Gradient
             * @returns {HTMLDivElement}
             */
            const CRT_BottomGradient = () => CRT('div', {
                class: 'gradient-bottom fade',
            }, gradientBottonEl => this._gradientBottonEl = gradientBottonEl);
            /**
             * Create Video
             * @returns {HTMLVideoElement}
             */
            const CRT_Video = () => CRT('video', {
                src: this._src,
                textContent: 'Тег video не поддерживается вашим браузером. Обновите браузер.',
                ontimeupdate: () => {
                    this._updateTime();

                    if (!this._isMouseDown) {
                        this._setProgressPlayPosition(this._videoEl.currentTime);
                        this._updateScrubber();
                    }
                },
                onplay: () => this._updatePlayButtonState(),
                onpause: () => this._updatePlayButtonState(),
                onvolumechange: e => {
                    this._updateVolumeButtonState();
                    /** @type {HTMLVideoElement} */
                    // @ts-ignore
                    const sender = e.currentTarget;
                    this._volumeSliderFillEl.style.width = sender.volume * 100 + '%';
                },
                onratechange: () => this._updateSpeedControls(),
                onenterpictureinpicture: () => this._updatePipButtonState(true),
                onleavepictureinpicture: () => this._updatePipButtonState(false),
                onclick: () => {
                    if (this._popupMenuEl.style.opacity !== '1') {
                        this._playButtonEl.click();
                    }
                },
                // 1. loadstart
                onloadstart: () => {
                    this._logger.log('load start');
                    this._spinnerShow();
                },
                // 2. durationchange
                ondurationchange: () => {
                    //this._logger.log('duration change');
                    this._updateTime();
                },
                // 3. loadedmetadata 
                onloadedmetadata: () => {
                    this._logger.log('loaded metadata');
                },
                // 4. loadeddata
                onloadeddata: () => {
                    this._logger.log('loaded data');
                    this._playButtonEl.disabled = false;
                },
                // 5. progress
                onprogress: e => {
                    this._updateScrubber();

                    /** @type {HTMLVideoElement} */
                    // @ts-ignore
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

                    switch (sender.networkState) {

                        case sender.NETWORK_LOADING:
                            this._spinnerShow();
                            break;

                        case sender.NETWORK_IDLE:
                            //this._spinnerHide();
                            break;
                    }

                    let networkState;
                    switch (sender.networkState) {
                        case 0:
                            networkState = 'NETWORK_EMPTY';
                            break;
                        case 1:
                            networkState = 'NETWORK_IDLE';
                            break;
                        case 2:
                            networkState = 'NETWORK_LOADING';
                            break;
                        case 3:
                            networkState = 'NETWORK_NO_SOURCE';
                            break;
                    }

                    let readyState;
                    switch (sender.readyState) {
                        case 0:
                            readyState = 'HAVE_NOTHING';
                            break;
                        case 1:
                            readyState = 'HAVE_METADATA';
                            break;
                        case 2:
                            readyState = 'HAVE_CURRENT_DATA';
                            break;
                        case 3:
                            readyState = 'HAVE_FUTURE_DATA';
                            break;
                        case 4:
                            readyState = 'HAVE_ENOUGH_DATA';
                            break;
                    }

                    this._logger.log(`progress: network ${networkState} / ready ${readyState}`);
                },
                // 6. canplay
                oncanplay: () => {
                    //this._logger.log('can play');
                    this._spinnerHide();
                },
                // 7. canplaythrough
                oncanplaythrough: () => {
                    //this._logger.log('can play through');
                },
                onerror: e => {
                    /** @type {HTMLVideoElement} */
                    // @ts-ignore
                    const sender = e.currentTarget;

                    this._spinnerHide();

                    /** @type {HTMLDivElement} */
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
                    this.appendChild(block);

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
                },
            }, videoEl => this._videoEl = videoEl);
            /**
             * Create Spinner
             * @returns {HTMLElement}
             */
            const CRT_SpinnerWrapper = () => {
                /** @type {string} */
                const svgNS = 'http://www.w3.org/2000/svg';

                // SVG

                /** @type {SVGSVGElement} */
                // @ts-ignore
                const spinnerWrapperEl = document.createElementNS(svgNS, 'svg');
                spinnerWrapperEl.setAttribute('viewBox', '0 0 50 50');
                spinnerWrapperEl.classList.add('spinner');

                // Circle

                /** @type {SVGCircleElement} */
                // @ts-ignore
                const circle = document.createElementNS(svgNS, 'circle');
                circle.setAttribute('cx', '25');
                circle.setAttribute('cy', '25');
                circle.setAttribute('r', '20');
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke-width', '5');
                spinnerWrapperEl.appendChild(circle);

                // Save Reference
                this._spinnerWrapperEl = spinnerWrapperEl;

                // @ts-ignore
                return spinnerWrapperEl;
            }
            return CRT('fragment', {
                children: [
                    CRT_ImportStylesheet('../src/styles.css'),
                    CRT_BottomPanel(),
                    //CRT_BottomGradient(),
                    CRT_Video(),
                    CRT_SpinnerWrapper(),
                ],
            });
        }

        shadow.appendChild(CRT_Root());

        const CRT_PopupMenu = () => {
            /**
             * Create Popup Menu Items List
             * @returns {HTMLUListElement}
             */
            const CRT_MenuList = () => CRT('ul');
            return CRT('div', {
                class: 'menu',
                children: [
                    CRT_MenuList(),
                ],
            }, popupMenuEl => this._popupMenuEl = popupMenuEl);
        }

        // Add Single Default Episode
        this.appendEpisode();

        this._isInitialized = true;
    }

    /**
     * Создает пункт меню.
     * @param {string} value
     * @param {string} html
     * @returns {HTMLLIElement}
     */
    createMenuItem(value, html) {
        /**
         * Create Menu Item Icon
         * @returns {HTMLDivElement}
         */
        const CRT_Icon = () => CRT('div', {
            class: BV_VIDEO_PLAYER_MENU_ITEM_ICON_CLASS_NAME,
            style: 'visibility:hidden;',
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172"><path d="M145.43294,37.93294l-80.93294,80.93295l-30.76628,-30.76628l-10.13411,10.13411l40.90039,40.90039l91.06706,-91.06705z"></path></svg>`,
        });

        /**
         * Create Menu Item Text
         * @returns {HTMLDivElement}
         */
        const CRT_Text = () => CRT('div', {
            class: BV_VIDEO_PLAYER_MENU_ITEM_BODY_CLASS_NAME,
            innerHTML: html,
        });

        return CRT('li', {
            //'data-value': value,
            onclick: e => {
                this._showMenu(false);

                /** @type {HTMLLIElement} */
                // @ts-ignore
                const sender = e.currentTarget;

                /** @type {string} */
                const value = sender.getAttribute('data-value');

                if (this._curParValue === value) {
                    return;
                }

                this._curParValue = value;

                this._updateMenu();

                // устанавливаем новое качество
                /** @type {number} */
                const curTime = this._videoEl.currentTime;
                /** @type {boolean} */
                const isPaused = this._videoEl.paused;
                this._videoEl.src = `${this._src}?${this._param}=${this._curParValue}`;
                this._videoEl.currentTime = curTime;
                if (!isPaused) {
                    this._videoEl.play();
                }
            },
            children: [
                CRT_Icon(),
                CRT_Text(),
            ],
        });
    }

    //#endregion Create Functions

    /**
     * Добавляет новый эпизод.
     * @param {EpisodeInfo=} episodeInfo
     * @returns {void}
     */
    appendEpisode(episodeInfo) {
        /** @type {boolean} */
        const hasData = typeof episodeInfo !== 'undefined'
            && episodeInfo !== null;

        if (hasData) {
            // Append Episode to EpisodeList
            if (this.episodeListElement === null) {
                this.appendChild(new HTMLBvEpisodeList());
            }
            this.episodeListElement.appendEpisode(episodeInfo);
        } else {
            // Append Default Episode
            this._innerAppendEpisode();
        }
    }

    /**
     * Создает и добавляет новый эпизод в прогресс-бар.
     * @param {EpisodeInfo=} episodeInfo
     * @returns {HTMLLIElement}
     */
    _innerAppendEpisode(episodeInfo) {

        /** @type {boolean} */
        const hasData = typeof episodeInfo !== 'undefined'
            && episodeInfo !== null;

        // Remove Default Episode

        if (hasData) {
            const defItem = this._episodesContainerEl.querySelector('[data-default]');
            if (defItem !== null) {
                defItem.remove();
            }
        }

        // Create New Episode

        /** @type {HTMLLIElement} */
        const item = CRT('li');

        // Title

        /** @type {boolean} */
        const hasTitle = hasData
            && typeof episodeInfo.title === 'string'
            && episodeInfo.title !== null
            && episodeInfo.title.length > 0;

        if (hasTitle) {
            item.setAttribute('data-title', episodeInfo.title);
        }

        // Duration

        /** @type {boolean} */
        const hasDuration = hasData
            && typeof episodeInfo.duration === 'number'
            && episodeInfo.duration !== null
            && episodeInfo.duration >= 0;

        /** @type {number} */
        let percentWidth = 1;
        if (hasDuration && this.duration !== null) {
            percentWidth = episodeInfo.duration / this.duration;
        }
        item.style.width = percentWidth * 100 + '%';

        // Default

        if (!hasData) {
            item.setAttribute('data-default', '');
        }

        /**
         * Create Episode List Sub Items
         * @returns {HTMLUListElement}
         */
        const CRT_EpisodeSubItemList = () => CRT('ul', {
            class: BV_VIDEO_PLAYER_EPISODE_LIST_CLASS_NAME,
            children: [
                CRT('li', {
                    class: BV_VIDEO_PLAYER_EPISODE_LOAD_CLASS_NAME,
                }),
                CRT('li', {
                    class: BV_VIDEO_PLAYER_EPISODE_HOVER_CLASS_NAME,
                }),
                CRT('li', {
                    class: BV_VIDEO_PLAYER_EPISODE_PLAY_CLASS_NAME,
                }),
            ],
        });

        /**
         * Create Episode Padding
         * @returns {HTMLDivElement}
         */
        const CRT_EpisodePadding = () => CRT('div', {
            class: BV_VIDEO_PLAYER_EPISODE_PADDING_CLASS_NAME,
        });

        item.appendChild(CRT('div', {
            class: BV_VIDEO_PLAYER_EPISODE_WRAPPER_CLASS_NAME,
            children: [
                CRT_EpisodeSubItemList(),
                CRT_EpisodePadding(),
            ],
        }));

        this._episodesContainerEl.appendChild(item);

        return item;
    }

    /**
     * Удаляет все эпизоды.
     * @returns {void}
     */
    _innerRemoveEpisodes() {
        // Episode List Element
        if (this.episodeListElement !== null) {
            this.episodeListElement.remove();
        }

        // Episode List
        this._episodesContainerEl.innerHTML = '';
    }

    /**
     * Удаляет все эпизоды и добавляет эпизод по-умолчанию.
     * @returns {void}
     */
    removeEpisodes() {
        this._innerRemoveEpisodes();
        // Add Default Episode
        this.appendEpisode();
    }

    /**
     * Устанавливает список эпизодов.
     * @param {EpisodeInfo[]} episodeInfos
     * @returns {void}
     */
    setEpisodes(episodeInfos) {
        /** @type {boolean} */
        const hasEpisodeInfos = typeof episodeInfos !== 'undefined'
            && episodeInfos !== null
            && episodeInfos.length > 0;

        if (hasEpisodeInfos) {
            // Remove
            this._innerRemoveEpisodes();
            // Append
            episodeInfos.forEach(episodeInfo => this.appendEpisode(episodeInfo));
        }

        // Restore State
        // TODO востановить состояние play и hover элементов эпизода
    }

    /**
     * Кофигурирует плеер.
     * @param {BvPlayerOptions} options
     */
    configure(options) {
        this.source = options.source;
        this.param = options.paramName;
    }

};

window.customElements.define(BV_VIDEO_PLAYER_TAG_NAME, HTMLBvVideoPlayer);
