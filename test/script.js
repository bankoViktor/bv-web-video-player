// script.js

/** @type {HTMLBvVideoPlayer} */
const player = document.querySelector(BV_VIDEO_PLAYER_TAG_NAME);
/** @type {EpisodeInfo[]} */
const episodes = [];
/** @type {number} */
const duration = 596.474195;


/**
 * Имитация запроса списка эпизодов у сервера.
 * @async
 * @param {number=} delayMs
 * @returns {Promise<EpisodeInfo[]>}
 */
 const fetchEpisodesAsync = function(delayMs = 2000) {
    return new Promise(resolve => {
        setTimeout(() => {
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

});

document.querySelector('#removeEpisodes').addEventListener('click', () => {
    player.removeEpisodes();
    episodes.length = 0;
});

document.querySelector('#addEpisode').addEventListener('click', () => {
    /** @type {EpisodeInfo} */
    const episode = {
        // @ts-ignore
        title: document.querySelector('#episodeTitle')?.value,
        // @ts-ignore
        duration: (document.querySelector('#episodeDuration').value / 100) * player._videoEl.duration,
    };

    episodes.push(episode);

    player.episodes = episodes;
});

document.querySelector('#removeEpisodeList').addEventListener('click', () => {
    [...player.querySelectorAll(BV_EPISODE_LIST_TAG_NAME)].forEach(node => node.remove());
});

document.querySelector('#addEmptyEpisodeList').addEventListener('click', () => {
    player.appendChild(new HTMLBvEpisodeList());
});

document.querySelector('#addEpisodeListWithEpisodes').addEventListener('click', () => {
    const episodeList = new HTMLBvEpisodeList();
    episodeList.appendEpisodes([
        {
            title: 'Приветствие',
            duration: duration * 0.1,
        },
        {
            title: 'Часть #1',
            duration: duration * 0.7,
        },
        {
            title: 'Часть #2',
            duration: duration * 0.2,
        },
    ]);
    player.appendChild(episodeList);
});

document.querySelector('#fetchEpisodes').addEventListener('click', async () => {
    /** @type {EpisodeInfo[]} */
    const episodeInfos = await fetchEpisodesAsync(2000);
    player.episodes = episodeInfos;
});
