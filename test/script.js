// script.js

/** @type {HTMLBvVideoPlayer} */
const player = document.querySelector(BV_VIDEO_PLAYER_TAG_NAME);
/** @type {EpisodeInfo[]} */
const episodes = [];

document.querySelector('#episodeClear').addEventListener('click', e => {
    player.removeEpisodes();
    episodes.length = 0;
});

document.querySelector('#episodeAdd').addEventListener('click', () => {
    /** @type {EpisodeInfo} */
    const episode = {
        // @ts-ignore
        title: document.querySelector('#episodeTitle')?.value,
        // @ts-ignore
        duration: (document.querySelector('#episodeDuration').value / 100) * player._videoEl.duration,
    };

    episodes.push(episode);

    player.setEpisodes(episodes);
});

/**
 * Имитация запроса списка эпизодов у сервера.
 * @async
 * @param {number=} delayMs
 * @returns {Promise<EpisodeInfo[]>}
 */
const fetchEpisodesAsync = function(delayMs = 2000) {
    return new Promise(resolve => {
        setTimeout(() => {
            /** @type {number} */
            const duration = 596.474195;
            /** @type {EpisodeInfo[]} */
            const episodes = [
                {
                    title: 'Вступление',
                    duration: duration * 0.01,
                },
                {
                    title: 'Приветствие',
                    duration: duration * 0.04,
                },
                {
                    title: 'Часть #1',
                    duration: duration * 0.12,
                },
                {
                    title: 'Часть #2',
                    duration: duration * 0.13,
                },
                {
                    title: 'Реклама',
                    duration: duration * 0.02,
                },
                {
                    title: 'Часть #3',
                    duration: duration * 0.14,
                },
                {
                    title: 'Часть #4',
                    duration: duration * 0.12,
                },
                {
                    title: 'Реклама',
                    duration: duration * 0.018,
                },
                {
                    title: 'Часть #5',
                    duration: duration * 0.14,
                },
                {
                    title: 'Часть #6',
                    duration: duration * 0.16,
                },
                {
                    title: 'Заключение',
                    duration: duration * 0.07,
                },
                {
                    title: 'Рекомендации',
                    duration: duration * 0.032,
                },
            ];
            resolve(episodes);
        }, delayMs);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    /** @type {EpisodeInfo[]} */
    const episodeInfos = await fetchEpisodesAsync(4000);
    player.setEpisodes(episodeInfos);
});
