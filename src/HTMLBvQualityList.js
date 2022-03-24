// HTMLBvQualityList.js

const BV_QUALITY_LIST_CHANGED_EVENT_NAME = 'qualitylist.changed';


class HTMLBvQualityList extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('QualityList', loggerOptions.qualityList);


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
