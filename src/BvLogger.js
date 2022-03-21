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

        const fmtTimestamp = {
            toString: () => new Date().toUTCString(),
        }

        const format = '%s :: [%s] %s ::';

        this.log = console.log.bind(window.console, format, ...[fmtTimestamp, 'LOG', this.name]);
        this.error = console.error.bind(window.console, format, ...[fmtTimestamp, 'ERR', this.name]);
        this.debug = console.debug.bind(window.console, format, ...[fmtTimestamp, 'DBG', this.name]);
        this.trace = console.trace.bind(window.console, format, ...[fmtTimestamp, 'TRC', this.name]);
        this.warn = console.warn.bind(window.console, format, ...[fmtTimestamp, 'WRN', this.name]);
        this.info = console.info.bind(window.console, format, ...[fmtTimestamp, 'INF', this.name]);
    }

}
