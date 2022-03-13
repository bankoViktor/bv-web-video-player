
/**
 * Информация об эпизоде видео.
 */
type EpisodeInfo = {
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
type QualityItem = {
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
type EpisodeItem = {
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
type EpisodeSubItems = {
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
type ChangedEventOptions = {
    /**
     * Операция.
     */
    action: 'added'|'modified'|'removed',
    /**
     * Элемент.
     */
     element: HTMLElement,
}
