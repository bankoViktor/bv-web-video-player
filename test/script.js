// script.js

/** @type {HTMLBvVideoPlayer} */
const player = document.querySelector(BV_VIDEO_PLAYER_TAG_NAME);
/** @type {EpisodeInfo[]} */
const episodes = [];

document.querySelector('#episodeClear').addEventListener('click', e => {
    //player.appendEpisodes();
    episodes.length = 0;
});

document.querySelector('#episodeAdd').addEventListener('click', e => {
    /** @type {EpisodeInfo} */
    const episode = {
        title: document.querySelector('#episodeTitle')?.value,
        duration: (document.querySelector('#episodeDuration').value / 100) * player._videoEl.duration,
    };

    episodes.push(episode);

    player.appendEpisodes(episodes);
});
