// HTMLBvEpisode.js

const BV_EPISODE_DURATION_ATTRIBUTE_NAME = 'duration';
const BV_EPISODE_TITLE_ATTRIBUTE_NAME = 'title';


class HTMLBvEpisode extends HTMLElement {

    /**
     * Конструктор
     * @param {EpisodeInfo=} episodeInfo 
     */
    constructor(episodeInfo) {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('Episode', loggerOptions.episode);

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

        if (typeof episodeInfo !== 'undefined' && episodeInfo !== null) {
            this.title = episodeInfo.title;
            this.duration = episodeInfo.duration;
        }

        this._logger.log('constructor');
    }

    static get observedAttributes() {
        return [
            BV_EPISODE_DURATION_ATTRIBUTE_NAME,
            BV_EPISODE_TITLE_ATTRIBUTE_NAME,
        ];
    }

    get duration() { return this._duration; }
    set duration(v) { this.setAttribute(BV_EPISODE_DURATION_ATTRIBUTE_NAME, v.toString()); }

    get title() { return this._title; }
    set title(v) { this.setAttribute(BV_EPISODE_TITLE_ATTRIBUTE_NAME, v); }

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

        switch (name) {

            case BV_EPISODE_DURATION_ATTRIBUTE_NAME:
                /** @type {number} */
                const duration = parseFloat(newValue);
                if (!isNaN(duration) || duration < 0) {
                    this._duration = duration;
                } else {
                    this._logger.error(`Invalid value '${BV_EPISODE_DURATION_ATTRIBUTE_NAME}' property.`);
                }
                break;

            case BV_EPISODE_TITLE_ATTRIBUTE_NAME:
                this._title = newValue;
                break;

        }
    }

    /**
     * Компонент добавляется в DOM.
     * @returns {void}
     */
    connectedCallback() {
        this._logger.log(`connected: title = '${this._title}'`);
    }

    /**
     * Компонент удаляется из DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        this._logger.log('disconnected');
    }

}

window.customElements.define(BV_EPISODE_TAG_NAME, HTMLBvEpisode);
