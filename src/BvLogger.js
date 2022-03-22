// BvLogger.js

class BvLogger {

    /**
     * Название логгера.
     * @type {string}
     */
    name;

    /**
     * @param {string} name Название логгера.
     * @param {boolean=} enabled Выводит сообщения в консоль. По-умолчанию: TRUE.
     */
    constructor(name, enabled = true) {
        this.name = name;

        const fmtTimestamp = {
            toString: () => new Date().toUTCString(),
        }

        /** @type {string} */
        const format = '%s :: [%s] %s ::';
        const dummy = function(){}

        this.log = enabled
            ? console.log.bind(window.console, format, ...[fmtTimestamp, 'LOG', this.name])
            : dummy;

        this.error = enabled
            ? console.error.bind(window.console, format, ...[fmtTimestamp, 'ERR', this.name])
            : dummy;

        this.debug = enabled
            ? console.debug.bind(window.console, format, ...[fmtTimestamp, 'DBG', this.name])
            : dummy;

        this.trace = enabled
            ? console.trace.bind(window.console, format, ...[fmtTimestamp, 'TRC', this.name])
            : dummy;

        this.warn = enabled
            ? console.warn.bind(window.console, format, ...[fmtTimestamp, 'WRN', this.name])
            : dummy;

        this.info = enabled
            ? console.info.bind(window.console, format, ...[fmtTimestamp, 'INF', this.name])
            : dummy;
    }

}
