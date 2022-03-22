// HTMLBvEpisode.js

const BV_EPISODE_DURATION_ATTRIBUTE_NAME = 'duration';
const BV_EPISODE_TITLE_ATTRIBUTE_NAME = 'title';
const BV_EPISODE_ADD_EVENT_NAME = 'episode-add';
const BV_EPISODE_REMOVE_EVENT_NAME = 'episode-remove';
const BV_EPISODE_CHANGED_EVENT_NAME = 'episode-changed';


class HTMLBvEpisode extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('Episode', loggerOptions.episode );

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

        /**
         * Родительский элемент-коллекция.
         * @type {HTMLBvEpisodeList}
         */
        this._episodeList = null;


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
                const duration = parseInt(newValue);
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
        this._logger.log(`connected: duration = ${dur2str(this._duration)}, title = '${this._title}'`);

        if (this.parentElement === null || this.parentElement.nodeName !== BV_EPISODE_LIST_TAG_NAME.toUpperCase()) {
            this._logger.error(`Тег '${BV_EPISODE_TAG_NAME}' должен находиться внутри элемента '${BV_EPISODE_LIST_TAG_NAME}'.`);
        } else {
            // @ts-ignore
            this._episodeList = this.parentElement;

            this._notifyParent(BV_EPISODE_ADD_EVENT_NAME);
        }
    }

    /**
     * Компонент удаляется из DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        this._notifyParent(BV_EPISODE_REMOVE_EVENT_NAME);
        this._logger.log('disconnected');
    }

    /**
     * Уведомляет родительский элемент.
     * @param {string} eventName
     * @returns {void}
     */
    _notifyParent(eventName) {
        if (this._episodeList === null) {
            return;
        }

        /** @type {Event} */
        const event = new CustomEvent(eventName, {
            detail: this,
            cancelable: false,
            composed: true,
            bubbles: true,
        })

        this._episodeList.dispatchEvent(event);
    }

}

window.customElements.define(BV_EPISODE_TAG_NAME, HTMLBvEpisode);
