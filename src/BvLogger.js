// BvLogger.js

class BvLogger {
    /**
     * @param {string} name Название логгера.
     * @param {boolean} isPrint Выводит сообщения в консоль. По-умолчанию: TRUE.
     */
    constructor(name, isPrint = true) {

        /**
         * Название логгера.
         * @type {string} 
         */
        this.name = name;


        if (isPrint) {
            const format = [this.name, '::'];
            this.log = console.log.bind(window.console, ...format);
            //this.debug = console.log.bind(window.console, ...format);
            //this.warm = console.warm.bind(window.console, format);
            this.error = console.error.bind(window.console, ...format);
        } else {
            this.log = this.error = function () { };
        }
    }
}
