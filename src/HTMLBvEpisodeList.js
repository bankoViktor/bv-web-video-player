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
        /**
         * Проверяет является ли указанный элемент элементом {@link HTMLBvEpisode}.
         * @param {Element} element
         * @returns {boolean}
         */
        const isEpisodeElement = element => {
            return element.nodeName === BV_EPISODE_TAG_NAME.toUpperCase();
        }

        /** @type {EpisodeInfo[]} */
        const episodes = [];

        for (let i = 0; i < this.children.length; i++) {
            /** @type {Element} */
            const child = this.children[i];

            if (isEpisodeElement(child)) {
                /** @type {HTMLBvEpisode} */
                // @ts-ignore
                const episodeEl = child;

                /** @type {EpisodeInfo} */
                const info = {
                    title: episodeEl.title,
                    duration: episodeEl.duration,
                }
                episodes.push(info);
            }
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

    /**
     * Добавляет новый эпизод.
     * @param {EpisodeInfo[]} episodeInfos
     * @returns {void}
     */
    appendEpisodes(episodeInfos) {
        episodeInfos.forEach(episodeInfo => this.appendEpisode(episodeInfo));
    }

}

window.customElements.define(BV_EPISODE_LIST_TAG_NAME, HTMLBvEpisodeList);
