// HTMLBvEpisodeList.js

const BV_EPISODE_LIST_CHANGED_EVENT_NAME = 'episodelist-changed';


class HTMLBvEpisodeList extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('EpisodeList', loggerOptions.episodeList);

        //#region Events 

        this.addEventListener(BV_EPISODE_ADD_EVENT_NAME, e => {
            this._logger.log('episode add');

            /** @type {HTMLBvEpisode} */
            // @ts-ignore
            const newEpisode = e.detail;

            // Notify Parent

            /** @type {ChangedEventOptions} */
            const options = {
                action: 'added',
                element: newEpisode,
            };

            /** @type {CustomEvent} */
            const event = new CustomEvent(BV_EPISODE_LIST_CHANGED_EVENT_NAME, {
                detail: options,
                cancelable: false,
                composed: true,
                bubbles: false,
            });
            this.parentElement.dispatchEvent(event);
        });
        this.addEventListener(BV_EPISODE_REMOVE_EVENT_NAME, e => {
            this._logger.log('episode remove');

            /** @type {HTMLBvQuality} */
            // @ts-ignore
            const removeEpisode = e.detail;

            // Notify Parent

            /** @type {ChangedEventOptions} */
            const options = {
                action: 'removed',
                element: removeEpisode,
            };

            /** @type {CustomEvent} */
            const event = new CustomEvent(BV_EPISODE_LIST_CHANGED_EVENT_NAME, {
                detail: options,
                cancelable: false,
                composed: true,
                bubbles: false,
            });
            this.parentElement.dispatchEvent(event);
        });
        this.addEventListener(BV_EPISODE_CHANGED_EVENT_NAME, e => {
            this._logger.log('episode changed');

            /** @type {HTMLBvQuality} */
            // @ts-ignore
            const changedEpisode = e.detail;

            /** @type {ChangedEventOptions} */
            const options = {
                action: 'modified',
                element: changedEpisode,
            };

            /** @type {CustomEvent} */
            const event = new CustomEvent(BV_EPISODE_LIST_CHANGED_EVENT_NAME, {
                detail: options,
                cancelable: false,
                composed: true,
                bubbles: false,
            });
            this.parentElement.dispatchEvent(event);
        });

        //#endregion Events

        this._logger.log('constructor');
    }

    static get observedAttributes() {
        return [];
    }

    get episodes() {
        /** @type {EpisodeInfo[]} */
        const episodes = [];
        for (let i = 0; i < this.children.length; i++) {
            /** @type {HTMLBvEpisode} */
            const episode = this.getEpisode(i);
            /** @type {EpisodeInfo} */
            const info = {
                title: episode.title,
                duration: episode.duration,
            }
            episodes.push(info);
        }
        return episodes;
    }

    /**
     * Компонент добавляется в DOM.
     * @returns {void}
     */
    connectedCallback() {
        this._logger.log('connected');

        if (this.parentElement === null || this.parentElement.tagName !== BV_VIDEO_PLAYER_TAG_NAME.toUpperCase()) {
            this._logger.error(`Тег '${BV_EPISODE_LIST_TAG_NAME}' должен находиться внутри элемента '${BV_VIDEO_PLAYER_TAG_NAME}'.`);
        }
    }

    /**
     * Компонент удаляется из DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        this._logger.log('disconnected');
    }

    /**
     * @param {number} index
     * @returns {HTMLBvEpisode}
     */
    getEpisode(index) {
        // @ts-ignore
        return this.children[index];
    }

    /**
     * Удалить эпизод по его имени.
     * @param {string} title
     * @returns {void}
     */
    removeEpisode(title) {
        for (let i = 0; i < this.children.length; i++) {
            /** @type {HTMLBvEpisode} */
            const episode = this.getEpisode(i);
            if (title === episode.title) {
                episode.remove();
                break;
            }
        }
    }

    /**
     * Добавить эпизод.
     * @param {EpisodeInfo} episodeInfo
     * @returns {void}
     */
    appendEpisode(episodeInfo) {
        // TODO appendEpisode
    }

}

window.customElements.define(BV_EPISODE_LIST_TAG_NAME, HTMLBvEpisodeList);
