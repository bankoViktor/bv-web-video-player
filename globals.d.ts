
/**
 * Информация об эпизоде видео.
 */
interface EpisodeInfo {
    /**
     * Название эпизода.
     */
    title: string,
    /**
     * Длительность эпизода.
     */
    duration: number,
}

/**
 * Качество видео.
 */
interface QualityItem {
    /**
     * Значение URL параметра качества видео.
     */
    value: string,
    /**
     * Название качества видео.
     */
    title: string,
}

/**
 * Эпизод видео.
 */
interface EpisodeItem {
    /**
     * Длительность эпизода.
     */
    duration: number,
    /**
     * Название эпизода.
     */
    title: string,
}

/**
 * Ссылки на элементы эпизода видео.
 */
interface EpisodeSubItems {
    /**
     * Элемент увеличения зоны интерактивности для курсора.
     */
    paddingEl: HTMLDivElement,
    /**
     * Элемент список прогресс-баров эпизода.
     */
    listEl: HTMLUListElement,
    /**
     * Прогресс-бар поиска под курсором.
     */
    hoverEl: HTMLDivElement,
    /**
     * Прогресс-бар загрузки (буфера).
     */
    loadEl: HTMLDivElement,
    /**
     * Прогресс-бар проигрывания.
     */
    playEl: HTMLDivElement,
}

/**
 * Параметры события изменения эпизода видео.
 */
interface ChangedEventOptions {
    /**
     * Операция.
     */
    action: 'added'|'modified'|'removed',
    /**
     * Элемент.
     */
    element: HTMLElement,
}

interface HTMLDivElement {
    currentPreview: number;
    currentPreviewImage: number;
}

interface Window {
    /**
     * Координата X. ??
     */
    pageX: number;
    /**
     * Координата Y. ??
     */
    pageY: number;
}