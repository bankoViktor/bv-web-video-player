// HTMLBvEpisodeList.js


class HTMLBvEpisodeList extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('EpisodeList', loggerOptions.episodeList);


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
