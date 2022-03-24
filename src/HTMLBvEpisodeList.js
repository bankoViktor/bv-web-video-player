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
