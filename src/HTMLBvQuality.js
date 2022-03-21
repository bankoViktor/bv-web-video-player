// HTMLBvQuality.js

const BV_QUALITY_VALUE_ATTRIBUTE_NAME = 'value';
const BV_QUALITY_INVALID_ATTRIBUTE_NAME = 'invalid';
const BV_QUALITY_ADD_EVENT_NAME = 'quality-add';
const BV_QUALITY_REMOVE_EVENT_NAME = 'quality-remove';
const BV_QUALITY_CHANGED_EVENT_NAME = 'quality-changed';


class HTMLBvQuality extends HTMLElement {

    constructor() {
        super();

        /**
         * Логгер класса.
         * @type {BvLogger} 
         */
        this._logger = new BvLogger('Quality', false);

        /**
         * Коллекция-владелец.
         * @type {HTMLBvQualityList} 
         */
        this._qualityList = null;

        /**
         * Значение, которое будет добавляться к URI запроса как параметр.
         * @type {string} 
         */
        this._value = null;

        /**
         * Элемент не валиден и не используется.
         * @type {boolean} 
         */
        this._invalid = false;


        this._logger.log('constructor');
    }

    static get observedAttributes() {
        return [
            BV_QUALITY_VALUE_ATTRIBUTE_NAME,
            BV_QUALITY_INVALID_ATTRIBUTE_NAME,
        ];
    }

    get value() { return this._value; }
    set value(v) { this.setAttribute(BV_QUALITY_VALUE_ATTRIBUTE_NAME, v); }

    get invalid() { return this._invalid; }
    set invalid(v) { this.setAttribute(BV_QUALITY_INVALID_ATTRIBUTE_NAME, v.toString()); }

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
                this._notifyParent(BV_QUALITY_CHANGED_EVENT_NAME);
                break;

            case BV_QUALITY_INVALID_ATTRIBUTE_NAME:
                this._invalid = newValue.toLowerCase() !== 'false';
                if (this._invalid === false) {
                    this._notifyParent(BV_QUALITY_ADD_EVENT_NAME);
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

        if (this.parentElement === null || this.parentElement.nodeName !== BV_QUALITY_TAG_NAME.toUpperCase()) {
            this._logger.error(`Тег '${BV_QUALITY_TAG_NAME}' должен находиться внутри элемента '${BV_QUALITY_LIST_TAG_NAME}'.`);
        } else {
            // @ts-ignore
            this._qualityList = this.parentElement;

            this._notifyParent(BV_QUALITY_ADD_EVENT_NAME);
        }
    }

    /**
     * Компонент удаляется из DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        this._logger.log(`disconnected: value = ${this._value}`);

        this._notifyParent(BV_QUALITY_REMOVE_EVENT_NAME);
    }

    /**
     * Уведоляет родительский компонент.
     * @param {string} eventName
     * @returns {void}
     */
    _notifyParent(eventName) {
        if (this._qualityList === null) {
            return;
        }

        /** @type {Event} */
        const event = new CustomEvent(eventName, {
            detail: this,
            cancelable: false,
            composed: true,
            bubbles: true,
        })

        this._qualityList.dispatchEvent(event);
    }

};

window.customElements.define(BV_QUALITY_TAG_NAME, HTMLBvQuality);
