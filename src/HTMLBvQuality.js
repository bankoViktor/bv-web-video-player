// HTMLBvQuality.js

const BV_QUALITY_VALUE_ATTRIBUTE_NAME = 'value';

class HTMLBvQuality extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('Quality', loggerOptions.quality);

        /**
         * Значение, которое будет добавляться к URI запроса как параметр.
         * @type {string} 
         */
        this._value = null;

        this._logger.log('constructor');
    }

    static get observedAttributes() {
        return [
            BV_QUALITY_VALUE_ATTRIBUTE_NAME,
        ];
    }

    get value() { return this._value; }
    set value(v) { this.setAttribute(BV_QUALITY_VALUE_ATTRIBUTE_NAME, v); }

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

            case BV_QUALITY_VALUE_ATTRIBUTE_NAME:
                if (newValue.toString().length === 0) {
                    this._logger.error('NULL not valid value.');
                } else {
                    this._value = newValue;
                }
                break;

        }
    }

    /**
     * Компонент добавляется в DOM.
     * @returns {void}
     */
    connectedCallback() {
        this._logger.log(`connected: value = ${this._value}`);
    }

    /**
     * Компонент удаляется из DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        this._logger.log(`disconnected: value = ${this._value}`);
    }

};

window.customElements.define(BV_QUALITY_TAG_NAME, HTMLBvQuality);
