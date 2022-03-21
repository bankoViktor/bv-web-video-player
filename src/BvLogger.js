// BvLogger.js

class BvLogger {

    /**
     * Название логгера.
     * @type {string}
     */
    name;

    /**
     * Состояние логгера.
     * @type {boolean}
     */
    enabled;

    /**
     * @param {string} name Название логгера.
     * @param {boolean=} enabled Выводит сообщения в консоль. По-умолчанию: TRUE.
     */
    constructor(name, enabled = true) {
       this.name = name;
       this.enabled = enabled;
    }

    /**
     * @param {string} message
     * @returns {void}
     */
    log(message) {
        if (this.enabled) {
            /** @type {string} */
            const msg = `${new Date().toUTCString()} :: ${this.name} :: ${message}`;
            console.log(msg);
        }
    }

    /**
     * @param {string} message
     * @returns {void}
     */
    error(message) {
        if (this.enabled) {
            /** @type {string} */
            const msg = `${new Date().toUTCString()} :: ${this.name} :: ${message}`;
            console.error(msg);
        }
    }
}
