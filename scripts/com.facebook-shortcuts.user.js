// ==UserScript==
// @name         Facebook custom shortcuts
// @namespace    https://github.com/bokchan
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @author       Andreas Bok Andersen
// @description  Facebook custom shortcuts
// @date         29.08.2018
// @version      0.0.1
// @match        https://*.facebook.com/*
// @downloadURL  https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/com.facebook-shortcuts.user.js
// @homepageURL  https://github.com/bokchan/tampermonkey-scripts
// @supportUrl   https://github.com/bokchan/tampermonkey-scripts/wiki
// @updateURL    https://openuserjs.org/meta/bok_chan/com.facebook-shortcuts.meta.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js
// ==/UserScript==

/**
 * Goto messages
 */
key('shift+m', function() {
    window.location.href = 'https://www.facebook.com/messages/t';
});
