// ==UserScript==
// @name         Universal Video Auto-Unmute
// @version      2.0
// @description  Automatically unmutes videos on enabled sites
// @namespace    https://github.com/equmaq/AutoUnmute
// @supportURL   https://github.com/equmaq/AutoUnmute/issues
// @downloadURL  https://raw.githubusercontent.com/equmaq/AutoUnmute/main/script.js
// @updateURL    https://raw.githubusercontent.com/equmaq/AutoUnmute/main/script.js
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const hostname = location.hostname;

    let enabledSites = GM_getValue("enabledSites", []);
    let volumePercent = GM_getValue("volumePercent", 100);

    if (!Number.isFinite(volumePercent) || volumePercent < 0 || volumePercent > 100) {
        volumePercent = 100;
    }

    function saveSites() {
        GM_setValue("enabledSites", enabledSites);
    }

    function isEnabled() {
        return enabledSites.includes(hostname);
    }

    function setVolumeLevel() {
        const input = prompt(
            "Set the minimum video volume (0-100):",
            String(volumePercent)
        );

        if (input === null) return;

        const value = Number(input);
        if (input.trim() === "" || !Number.isFinite(value) || value < 0 || value > 100) {
            alert("Please enter a number between 0 and 100.");
            return;
        }

        volumePercent = value;
        GM_setValue("volumePercent", volumePercent);
        alert(`Minimum video volume set to ${volumePercent}%.`);
        location.reload();
    }

    GM_registerMenuCommand(
        `${isEnabled() ? "Disable" : "Enable"} auto-unmute on this site`,
        () => {
            if (isEnabled()) {
                enabledSites = enabledSites.filter(site => site !== hostname);
                saveSites();
                alert(`Auto-unmute disabled on ${hostname}`);
            } else {
                enabledSites.push(hostname);
                saveSites();
                alert(`Auto-unmute enabled on ${hostname}`);
            }

            location.reload();
        }
    );

    GM_registerMenuCommand(
        `Set minimum volume (currently ${volumePercent}%)`,
        setVolumeLevel
    );

    // Disabled by default
    if (!isEnabled()) {
        console.log(`[Auto-Unmute] Disabled on ${hostname}`);
        return;
    }

    console.log(`[Auto-Unmute] Active on ${hostname}`);

    function unmuteVideo(video) {
        if (video.dataset.autoUnmuted) return;
        video.dataset.autoUnmuted = "true";

        function forceUnmute() {
            if (video.muted) {
                video.muted = false;
            }

            const targetVolume = volumePercent / 100;
            if (video.volume < targetVolume) {
                video.volume = targetVolume;
            }
        }

        // Unmute immediately
        forceUnmute();

        // Keep it unmuted
        video.addEventListener('volumechange', forceUnmute);

        // Some sites re-mute after playback starts
        video.addEventListener('play', forceUnmute);

        // Some sites re-render video elements
        const interval = setInterval(() => {
            if (!document.contains(video)) {
                clearInterval(interval);
                return;
            }

            forceUnmute();
        }, 1000);
    }

    function processNode(node) {
        if (node.tagName === 'VIDEO') {
            unmuteVideo(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.querySelectorAll('video').forEach(unmuteVideo);
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                processNode(node);
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Existing videos
    document.querySelectorAll('video').forEach(unmuteVideo);

})();