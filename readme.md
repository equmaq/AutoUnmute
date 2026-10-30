# Universal Video Auto-Unmute

A userscript that automatically unmutes HTML5 videos and raises their volume to a configurable minimum on selected websites.

## Installation

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), or another compatible manager.
2. Open the scripts [GreasyFork page](https://greasyfork.org/en/scripts/568163-universal-video-auto-unmute) and click the install button.
3. Confirm the installation in your userscript manager.

The script matches all websites, but it is disabled by default on every site.

## Usage

Open the userscript manager menu while visiting a website. The script provides three commands:

- **Enable auto-unmute on this site** enables the script for the current hostname.
- **Disable auto-unmute on this site** disables it for the current hostname.
- **Set minimum volume** opens a prompt where you can enter a value from `0` to `100`.

The minimum volume defaults to `100%` and is a global setting. It applies to every enabled site. The script only raises a video's volume when it is below the selected level; it does not lower videos that are already louder. Note that this will affect all videos on the page, not just muted ones.

After changing a setting, the page reloads so the new setting is applied immediately.

## Simple explanation

When enabled for a site, the script watches for videos on that page. It immediately unmutes each video and/or raises its volume to at least the configured minimum. It also checks videos when they start playing and periodically, because some websites mute or replace video elements after the page has loaded.

Sites are stored separately by hostname, so enabling the script on one site does not enable it everywhere. The volume preference is shared across all enabled sites.

## Technical details

- The script runs at `document-idle` and uses the userscript manager's `GM_getValue` and `GM_setValue` APIs for persistent settings.
- Enabled hostnames are stored in the `enabledSites` setting.
- The global minimum volume is stored as `volumePercent`, with a default of `100`.
- The configured percentage is converted to the HTMLMediaElement volume range with `volumePercent / 100`.
- Each video is processed once using a `data-auto-unmuted` marker.
- `video.muted` is set to `false` when necessary.
- A `volumechange` listener, a `play` listener, and a one-second interval keep the video at or above the configured minimum.
- A `MutationObserver` detects videos added later by single-page applications or dynamic page content.
- The script requires these userscript manager permissions:
	- `GM_getValue`
	- `GM_setValue`
	- `GM_registerMenuCommand`

## Support

- [Report an issue](https://github.com/equmaq/AutoUnmute/issues)

## AI Usage

- AI powered itellisense/completions used (Github Copilot)
- Readme generated with ChatGPT because i couldn't be bothered.

## License

See [LICENSE](https://github.com/equmaq/AutoUnmute/blob/main/LICENSE) for details.
