[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

*Read this in other languages: [English](README.md), [Русский](README.ru.md).*

<!-- ABOUT THE PROJECT -->
# HTML5 Web Video Player

![Product Name Screen Shot][product-screenshot]

It is a wrapper around the HTML5 video tag.

[Demo JSFiddle][demo-url]


<!-- GETTING STARTED -->
## Getting Started


### Installation

Clone the repo
```sh
git clone https://github.com/bankoViktor/bv-web-video-player.git
```



<!-- USAGE EXAMPLES -->
## Usage

Include js file in html document
```js
<script src="~/lib/bv-web-video-player/dist/bv-web-video-player.js"></script>
```
or you can use the service [![jsDelivr][jsdelivr-badge]][jsdelivr-url]
```js
https://cdn.jsdelivr.net/gh/bankoViktor/bv-web-video-player@0.4.3/dist/bv-web-video-player.js
```
or minified version
```js
https://cdn.jsdelivr.net/gh/bankoViktor/bv-web-video-player@0.4.3/dist/bv-web-video-player.min.js
```

use the following example:
```html
<bv-video-player src="/video/123">
    <bv-quality value="720">720p HD</bv-quality>
    <bv-quality value="480">480p</bv-quality>
</bv-video-player>
```
where:
- tag `bv-video-player`:

| Attribute | Type | Default | Required | Description |
| - | - | - | - | - |
| `scr` | `string`  | `null` | `true` | the endpoint address, the request will be kind like `{src}?{param}={value}` |
| `param` | `string` | `q` | `true` | parameter name in the request |
| `speed-controls` | `boolean` | `false` | `false`  | displays playback speed controls |
| `hotkey` | `boolean` | `false` | `false` | hotkey handling |
| content | - | - | `true` | there must be at least one `bv-quality` element |

- tag `bv-quality`:

| Attribute | Type | Default | Required | Description |
| - | - | - | - | - |
| `value` | `string` | `null` | `true` | the value to add as the parameter value `q` |
| content | - | - | `true` | displayed in the title of the menu item for selecting the video quality |



<!-- RELEASE NOTES -->
## Release notes

#### 2021.09.01 - Release 0.4.3
- Fixed false triggering of hot keys.
- Added attribute `hotkey` on/off hotkey handling.
- Hide controls when idle during playback.
- Replacement of the standard behavior of the Up/Down/Left/Right/Space keys for playback control.
- Added the `param` attribute for the name of the parameter in the request.
- Fixed NaN time display.

#### 2021.08.26 - Release 0.4.2
- Changed project structure.

#### 2021.08.26 - Release 0.4.1
- Hotkey support.
- Ability to hide playback speed controls (attribute `speed-controls`).
- Fixed artifact of timecode item floating behind cursor.

#### 2021.08.24 - Release 0.4
- Playback control
- Playback speed control.
- Picture-in-picture mode.
- Full screen mode.
- Video volume control.



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
 
 
 
<!-- LICENSE -->
## License

Distributed under the MIT License.



<!-- CONTACT -->
## Contact

Banko Viktor - [bankoViktor][github-profile] - bankviktor14@gmail.com



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[contributors-url]: https://github.com/bankoViktor/bv-web-video-player/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[forks-url]: https://github.com/bankoViktor/bv-web-video-player/network/members
[stars-shield]: https://img.shields.io/github/stars/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[stars-url]: https://github.com/bankoViktor/bv-web-video-player/stargazers
[issues-shield]: https://img.shields.io/github/issues/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[issues-url]: https://github.com/bankoViktor/bv-web-video-player/issues
[license-shield]: https://img.shields.io/github/license/bankoViktor/bv-web-video-player.svg?style=for-the-badge
[license-url]: https://github.com/bankoViktor/bv-web-video-player/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[product-screenshot]: screenshot.png
[github-profile]: https://github.com/bankoViktor
[jsdelivr-url]: https://www.jsdelivr.com
[jsdelivr-badge]: https://data.jsdelivr.com/v1/package/gh/bankoViktor/bv-web-video-player/badge
[demo-url]: https://jsfiddle.net/winston349/o4qf6tkb/2
