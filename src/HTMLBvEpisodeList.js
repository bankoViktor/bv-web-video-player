// HTMLBvEpisodeList.js

const BV_EPISODE_LIST_CHANGED_EVENT_NAME = 'episodelist.changed';


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
            /** @type {HTMLBvEpisode} */
            // @ts-ignore
            const newEpisode = e.detail;

            this._logger.log(`Add episode: ${newEpisode.title}`);

            // Notify Parent

            /** @type {EpisodeChangedEventOptions} */
            const options = {
                action: 'added',
                episodeEl: newEpisode,
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
            /** @type {HTMLBvEpisode} */
            // @ts-ignore
            const removeEpisode = e.detail;

            this._logger.log(`Remove episode: ${removeEpisode.title}`);

            // Notify Parent

            /** @type {EpisodeChangedEventOptions} */
            const options = {
                action: 'removed',
                episodeEl: removeEpisode,
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
     * Возвращает элемент эписода по его индексу без учёта элементов других типов.
     * @param {number} index
     * @returns {HTMLBvEpisode}
     */
    getEpisode(index) {
        for (let i = 0, j = 0; i < this.children.length; i++) {
            /** @type {boolean} */
            const isEpisodeElement = this.children[i].tagName === BV_EPISODE_TAG_NAME.toUpperCase();
            if (isEpisodeElement && j == index) {
                if (j == index) {
                    // @ts-ignore
                    return this.children[i];
                } else {
                    j++;
                }
            }
        }
        return null;
    }

    /**
     * Удаляет эпизод по его имени.
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
     * Добавляет новый эпизод.
     * @param {EpisodeInfo} episodeInfo
     * @returns {void}
     */
    appendEpisode(episodeInfo) {
        /** @type {HTMLBvEpisode} */
        const episodeEl = new HTMLBvEpisode(episodeInfo);
        this.appendChild(episodeEl);
    }

}

window.customElements.define(BV_EPISODE_LIST_TAG_NAME, HTMLBvEpisodeList);
