// HTMLBvQualityList.js

const BV_QUALITY_LIST_CHANGED_EVENT_NAME = 'qualitylist-changed';


class HTMLBvQualityList extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('QualityList', false);


        //#region This Events Handlers

        this.addEventListener(BV_QUALITY_ADD_EVENT_NAME, e => {
            this._logger.log('quality add');

            /** @type {HTMLBvQuality} */
            // @ts-ignore
            const newQuality = e.detail;

            // Check same value
            for (let i = 0; i < this.children.length; i++) {
                /** @type {HTMLBvQuality} */
                const quality = this.getQuality(i);
                if (quality !== newQuality && quality.value === newQuality.value) {
                    newQuality.invalid = true;
                }
            }

            // Notify Parent

            /** @type {ChangedEventOptions} */
            const options = {
                action: 'added',
                element: newQuality,
            };

            /** @type {CustomEvent} */
            const event = new CustomEvent('qualitylist-changed', {
                detail: options,
                cancelable: false,
                composed: true,
                bubbles: false,
            });
            this.parentElement.dispatchEvent(event);
        });
        this.addEventListener(BV_QUALITY_REMOVE_EVENT_NAME, e => {
            this._logger.log('quality remove');

            /** @type {HTMLBvQuality} */
            // @ts-ignore
            const removeQuality = e.detail;

            // Notify Parent

            /** @type {ChangedEventOptions} */
            const options = {
                action: 'removed',
                element: removeQuality,
            };

            /** @type {CustomEvent} */
            const event = new CustomEvent(BV_QUALITY_LIST_CHANGED_EVENT_NAME, {
                detail: options,
                cancelable: false,
                composed: true,
                bubbles: false,
            });
            this.parentElement.dispatchEvent(event);
        });
        this.addEventListener(BV_QUALITY_CHANGED_EVENT_NAME, e => {
            this._logger.log('quality changed');

            /** @type {HTMLBvQuality} */
            // @ts-ignore
            const changedQuality = e.detail;

            /** @type {ChangedEventOptions} */
            const options = {
                action: 'modified',
                element: changedQuality,
            };

            /** @type {CustomEvent} */
            const event = new CustomEvent(BV_QUALITY_LIST_CHANGED_EVENT_NAME, {
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
     * @param {number} index
     * @returns {HTMLBvQuality}
     */
    getQuality(index) {
        // @ts-ignore
        return this.children[index];
    }

}

window.customElements.define(BV_QUALITY_LIST_TAG_NAME, HTMLBvQualityList);
