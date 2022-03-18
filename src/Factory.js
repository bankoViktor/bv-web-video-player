// Factory.js

/**
 * Создает HTML-элемент согласно указанным параметрам.
 * @template {keyof HTMLElementFactoryTagNameMap} K
 * @param {K} tagName
 * @param {FactoryOptionsMap[K]=} options
 * @param {ElementGetterCallback<HTMLElementFactoryTagNameMap[K]>=} getter
 * @returns {HTMLElementFactoryTagNameMap[K]}
 */
function CRT(tagName, options, getter) {

    if (typeof tagName !== 'string' || tagName === null) {
        console.error('Invalid Tag Name for Element Factory');
        return;
    }

    /**
     * @param {HTMLElement | DocumentFragment} parent
     * @param {(string | Node)[]} children
     * @returns {void}
     */
    const appendChildren = function(parent, children) {
        if (Array.isArray(children)) {
            children.forEach(child => {
                parent.append(child);
            });
        } else {
            parent.append(children);
        }
    }

    /**
     * @param {HTMLElement} parent
     * @param {FactoryOptionsMap[K]=} options
     * @returns {void}
     */
    const setProperteis = function(parent, options) {
        for (const opt in options) {

            /** @type {string} */
            const params = opt;

            /** @type {any} */
            const value = options[params];
            if (value === null) {
                continue;
            }

            switch (params) {
                case 'class':
                    /** @type {string[]} */
                    const classes = value.split(' ');
                    parent.classList.add(...classes);
                    break;

                case 'children':
                    appendChildren(parent, value);
                    break;

                default:
                    parent[params] = value;
                    break;
            }
        }
    }

    /** @type {boolean} */
    const isFragment = tagName === 'fragment';

    /** @type {boolean} */
    const hasOptions = typeof options !== 'undefined'
        && options !== null;

    /** @type {boolean} */
    const hasChildren = hasOptions
        && typeof options['children'] !== 'undefined'
        && options['children'] !== null;

    /** @type {boolean} */
    const hasGetter = typeof getter === 'function' && getter !== null;

    /** @type {HTMLElementFactoryTagNameMap[K]} */
    let node = null;

    if (isFragment) {
        // create fragment
        // @ts-ignore
        node = document.createDocumentFragment();
        if (hasChildren) {
            appendChildren(node, options['children']);
        }
    } else {
        // create element
        // @ts-ignore
        node = document.createElement(tagName);
        if (hasOptions) {
            setProperteis(node, options);
        }
    }

    if (hasGetter) {
        getter(node);
    }

    return node;
}

/**
 * Добавляет {@link HTMLStyleElement} с текстом импортом указанного CSS-файла.
 * @param {string} importUrl 
 * @returns {HTMLStyleElement}
 */
const CRT_IncludeStyle = importUrl => CRT('style', {
    textContent: `@import "${importUrl}";`,
});
