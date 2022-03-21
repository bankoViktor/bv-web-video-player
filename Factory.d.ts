// Factory.d.ts


type ElementGetterCallback<K> = (node: K) => void;

/** События элементов. */
interface FactoryEvents {
    onclick?: ((ev: MouseEvent) => any) | null;
    onmousedown?: ((ev: MouseEvent) => any) | null;
    onmouseup?: ((ev: MouseEvent) => any) | null;
    onmousemove?: ((ev: MouseEvent) => any) | null;
    onmouseleave?: ((ev: MouseEvent) => any) | null;
    ontimeupdate?: ((ev: Event) => any) | null;
    onplay?: ((ev: Event) => any) | null;
    onpause?: ((ev: Event) => any) | null;
    onvolumechange?: ((ev: Event) => any) | null;
    onratechange?: ((ev: Event) => any) | null;
    onenterpictureinpicture?: ((ev: Event) => any) | null;
    onleavepictureinpicture?: ((ev: Event) => any) | null;
    onloadstart?: ((ev: Event) => any) | null;
    ondurationchange?: ((ev: Event) => any) | null;
    onloadedmetadata?: ((ev: Event) => any) | null;
    onloadeddata?: ((ev: Event) => any) | null;
    onprogress?: ((ev: Event) => any) | null;
    oncanplay?: ((ev: Evevnt) => any) | null;
    oncanplaythrough?: ((ev: Evevnt) => any) | null;
    onerror?: ((ev: Evevnt) => any) | null;
}

/** Параметры элемента {@link Node}. */
interface FactoryOptions_Node extends FactoryEvents {
    textContent?: string | null;
    id?: string;
    scrollLeft?: number;
    scrollTop?: number;
}

/** Параметры элемента {@link ParentNode}. */
interface FactoryOptions_ParentNode extends FactoryOptions_Node {
    children?: (string | HTMLElement)[];
}

/** Параметры элемента {@link Element}. */
interface FactoryOptions_Element extends FactoryOptions_ParentNode {
    class?: string;
}

/** Параметры элемента {@link HTMLElement}. */
interface FactoryOptions_HTMLElement extends FactoryOptions_Element {
    accessKey?: string;
    autocapitalize?: string;
    dir?: string;
    draggable?: boolean;
    hidden?: boolean;
    innerText?: string;
    lang?: string;
    outerText?: string;
    spellcheck?: boolean;
    title?: string;
    translate?: boolean;
    /** Added. */
    innerHTML?: string;
    /** Added. */
    style?: string;
}

/** Параметры элемента {@link HTMLAnchorElement}. */
interface FactoryOptions_HTMLAnchorElement extends FactoryOptions_HTMLElement {
    download?: string;
    hreflang?: string;
    ping?: string;
    referrerPolicy?: string;
    rel?: string;
    target?: string;
    text?: string;
}

/** Параметры элемента {@link HTMLButtonElement}. */
interface FactoryOptions_HTMLButtonElement extends FactoryOptions_HTMLElement {
    disabled?: boolean;
    formAction?: string;
    formEnctype?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string;
}

/** Параметры элемента {@link HTMLFormElement}. */
interface FactoryOptions_HTMLFormElement extends FactoryOptions_HTMLElement {
    acceptCharset?: string;
    action?: string;
    autocomplete?: string;
    encoding?: string;
    enctype?: string;
    method?: string;
    name?: string;
    noValidate?: boolean;
    target?: string;
}

/** Параметры элемента {@link HTMLImageElement}. */
interface FactoryOptions_HTMLImageElement extends FactoryOptions_HTMLElement {
    alt?: string;
    crossOrigin?: string | null;
    decoding?: "async" | "sync" | "auto";
    height?: number;
    isMap?: boolean;
    loading?: "eager" | "lazy";
    referrerPolicy?: string;
    sizes?: string;
    src?: string;
    srcset?: string;
    useMap?: string;
    width?: number;
}

/** Параметры элемента {@link HTMLInputElement}. */
interface FactoryOptions_HTMLInputElement extends FactoryOptions_HTMLElement {
    accept?: string;
    alt?: string;
    autocomplete?: string;
    capture?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    defaultValue?: string;
    dirName?: string;
    disabled?: boolean;
    files?: FileList | null;
    formAction?: string;
    formEnctype?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    height?: number;
    indeterminate?: boolean;
    max?: string;
    maxLength?: number;
    min?: string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    selectionDirection?: "forward" | "backward" | "none" | null;
    selectionEnd?: number | null;
    selectionStart?: number | null;
    size?: number;
    src?: string;
    step?: string;
    type?: 'text' | 'button' | 'checkbox' | 'color' | 'date' | 'datetime' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'time' | 'url' | 'week';
    value?: string;
    valueAsDate?: Date | null;
    valueAsNumber?: number;
    webkitdirectory?: boolean;
    width?: number;
}

/** Параметры элемента {@link HTMLLabelElement}. */
interface FactoryOptions_HTMLLabelElement extends FactoryOptions_HTMLElement {
    htmlFor?: string;
}

/** Параметры элемента {@link HTMLStyleElement}. */
interface FactoryOptions_HTMLStyleElement extends FactoryOptions_HTMLElement {
    media?: string;
}

/** Параметры элемента {@link HTMLTableElement}. */
interface FactoryOptions_HTMLTableElement extends FactoryOptions_HTMLElement {
    caption?: HTMLTableCaptionElement | null;
    tFoot?: HTMLTableSectionElement | null;
    tHead?: HTMLTableSectionElement | null;
}

/** Параметры элемента {@link HTMLLIElement}. */
interface FactoryOptions_HTMLLIElement extends FactoryOptions_Element {
    value?: number;
}

/** Параметры элемента {@link HTMLMediaElement}. */
interface FactoryOptions_HTMLMediaElement extends FactoryOptions_HTMLElement {
     autoplay?: boolean;
     controls?: boolean;
     crossOrigin?: string | null;
     currentTime?: number;
     defaultMuted?: boolean;
     defaultPlaybackRate?: number;
     disableRemotePlayback?: boolean;
     loop?: boolean;
     muted?: boolean;
     onencrypted?: ((this: HTMLMediaElement, ev: MediaEncryptedEvent) => any) | null;
     onwaitingforkey?: ((this: HTMLMediaElement, ev: Event) => any) | null;
     playbackRate?: number;
     preload?: "none" | "metadata" | "auto" | "";
     src?: string;
     srcObject?: MediaProvider | null;
     volume?: number;
}

/** Параметры элемента {@link HTMLVideoElement}. */
interface FactoryOptions_HTMLVideoElement extends FactoryOptions_HTMLMediaElement {
    disablePictureInPicture?: boolean;
    height?: number;
    onenterpictureinpicture?: ((this: HTMLVideoElement, ev: Event) => any) | null;
    onleavepictureinpicture?: ((this: HTMLVideoElement, ev: Event) => any) | null;
    playsInline?: boolean;
    poster?: string;
    width?: number;
}

/** Карта сопоставления тегов элементов с их типом. */
interface HTMLElementFactoryTagNameMap extends HTMLElementTagNameMap {
    "fragment": DocumentFragment;
}

/** Карта сопоставления тега элемента с его типом параметров. */
interface FactoryOptionsMap {
    "fragment": FactoryOptions_ParentNode;
    "a": FactoryOptions_HTMLAnchorElement;
    //"abbr": HTMLElement;
    //"address": HTMLElement;
    //"area": HTMLAreaElement;
    //"article": HTMLElement;
    //"aside": HTMLElement;
    //"audio": HTMLAudioElement;
    //"b": HTMLElement;
    //"base": HTMLBaseElement;
    //"bdi": HTMLElement;
    //"bdo": HTMLElement;
    //"blockquote": HTMLQuoteElement;
    //"body": HTMLBodyElement;
    //"br": HTMLBRElement;
    "button": FactoryOptions_HTMLButtonElement;
    //"canvas": HTMLCanvasElement;
    //"caption": HTMLTableCaptionElement;
    //"cite": HTMLElement;
    //"code": HTMLElement;
    //"col": HTMLTableColElement;
    //"colgroup": HTMLTableColElement;
    //"data": HTMLDataElement;
    //"datalist": HTMLDataListElement;
    //"dd": HTMLElement;
    //"del": HTMLModElement;
    //"details": HTMLDetailsElement;
    //"dfn": HTMLElement;
    //"dialog": HTMLDialogElement;
    //"dir": HTMLDirectoryElement;
    "div": FactoryOptions_HTMLElement;
    //"dl": HTMLDListElement;
    //"dt": HTMLElement;
    //"em": HTMLElement;
    //"embed": HTMLEmbedElement;
    //"fieldset": HTMLFieldSetElement;
    //"figcaption": HTMLElement;
    //"figure": HTMLElement;
    //"font": HTMLFontElement;
    "footer": FactoryOptions_HTMLElement;
    "form": FactoryOptions_HTMLFormElement;
    //"frame": HTMLFrameElement;
    //"frameset": HTMLFrameSetElement;
    //"h1": HTMLHeadingElement;
    //"h2": HTMLHeadingElement;
    //"h3": HTMLHeadingElement;
    //"h4": HTMLHeadingElement;
    //"h5": HTMLHeadingElement;
    //"h6": HTMLHeadingElement;
    //"head": HTMLHeadElement;
    "header": FactoryOptions_HTMLElement;
    //"hgroup": HTMLElement;
    //"hr": HTMLHRElement;
    //"html": HTMLHtmlElement;
    //"i": HTMLElement;
    //"iframe": HTMLIFrameElement;
    "img": FactoryOptions_HTMLImageElement;
    "input": FactoryOptions_HTMLInputElement;
    //"input": HTMLInputElement;
    //"ins": HTMLModElement;
    //"kbd": HTMLElement;
    "label": FactoryOptions_HTMLLabelElement;
    //"legend": HTMLLegendElement;
    "li": FactoryOptions_HTMLLIElement;
    //"link": HTMLLinkElement;
    //"main": HTMLElement;
    //"map": HTMLMapElement;
    //"mark": HTMLElement;
    //"marquee": HTMLMarqueeElement;
    //"menu": HTMLMenuElement;
    //"meta": HTMLMetaElement;
    //"meter": HTMLMeterElement;
    "nav": FactoryOptions_HTMLElement;
    //"noscript": HTMLElement;
    //"object": HTMLObjectElement;
    //"ol": HTMLOListElement;
    //"optgroup": HTMLOptGroupElement;
    //"option": HTMLOptionElement;
    //"output": HTMLOutputElement;
    //"p": HTMLParagraphElement;
    //"param": HTMLParamElement;
    //"picture": HTMLPictureElement;
    //"pre": HTMLPreElement;
    //"progress": HTMLProgressElement;
    //"q": HTMLQuoteElement;
    //"rp": HTMLElement;
    //"rt": HTMLElement;
    //"ruby": HTMLElement;
    //"s": HTMLElement;
    //"samp": HTMLElement;
    //"script": HTMLScriptElement;
    //"section": HTMLElement;
    //"select": HTMLSelectElement;
    //"slot": HTMLSlotElement;
    //"small": HTMLElement;
    //"source": HTMLSourceElement;
    "span": FactoryOptions_HTMLElement;
    //"strong": HTMLElement;
    "style": FactoryOptions_HTMLStyleElement;
    //"sub": HTMLElement;
    //"summary": HTMLElement;
    //"sup": HTMLElement;
    "table": FactoryOptions_HTMLTableElement;
    //"tbody": HTMLTableSectionElement;
    //"td": HTMLTableCellElement;
    //"template": HTMLTemplateElement;
    //"textarea": HTMLTextAreaElement;
    //"tfoot": HTMLTableSectionElement;
    //"th": HTMLTableCellElement;
    //"thead": HTMLTableSectionElement;
    //"time": HTMLTimeElement;
    //"title": HTMLTitleElement;
    //"tr": HTMLTableRowElement;
    //"track": HTMLTrackElement;
    //"u": HTMLElement;
    "ul": FactoryOptions_HTMLElement;
    //"var": HTMLElement;
    "video": FactoryOptions_HTMLVideoElement;
    //"wbr": HTMLElement;
}
