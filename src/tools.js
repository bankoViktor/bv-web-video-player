// Tools.js

/**
 * Преобразовывает длительность в формате 'HH:MM:SS' в число.
 * @param {string} str
 * @returns {number}
 */
 function str2dur(str) {
    /** @type {string[]} */
    const parts = str.split(":", 3).reverse();
    /** @type {number[]} */
    const m = [1, 60, 3600];
    /** @type {number} */
    let result = 0;
    for (let i = 0; i < parts.length; i++) {
        result += parseInt(parts[i]) * m[i];
    }
    return result;
}

/**
 * Преобразовывает длительность в строку формата 'HH:MM:SS'.
 * @param {number} duration
 * @returns {string}
 */
function dur2str(duration) {
    /** @type {number} */
    const m = Math.trunc(duration / 60);
    /** @type {number} */
    const h = Math.trunc(m / 60);
    /** @type {number} */
    const s = Math.trunc(duration - (h * 60 + m) * 60);
    /** @type {string} */
    let result = m + ":" + (s < 10 ? "0" + s : s);
    if (m >= 60) {
        result = h + ":" + result;
    }
    return result;
}
